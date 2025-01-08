import pandas as pd
import torch
from transformers import (
    RobertaTokenizer, RobertaForQuestionAnswering,
    Trainer, TrainingArguments, EarlyStoppingCallback
)
from sentence_transformers import SentenceTransformer, util
from torch.utils.data import Dataset
from sklearn.model_selection import train_test_split

# Load and prepare the dataset
file_path = 'C:/Users/Nana kwasi/Downloads/Lastss.csv'
try:
    data = pd.read_csv(file_path, encoding='ISO-8859-1', sep=',', on_bad_lines='skip')
    if 'Question' not in data.columns or 'Answer' not in data.columns:
        raise ValueError("CSV file must contain 'Question' and 'Answer' columns.")
    data = data.dropna(subset=['Question', 'Answer']).rename(columns={'Question': 'question', 'Answer': 'answer'})
    qa_data = [{"question": row["question"], "answer": row["answer"]} for _, row in data.iterrows()]
    print("Original data size:", len(qa_data))
except Exception as e:
    print(f"Error loading data: {e}")
    exit()

# Initialize the paraphrasing model
paraphrase_model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

def generate_paraphrases(question, num_paraphrases=2):
    """
    Generates paraphrases for a given question using a pre-trained model.
    """
    paraphrases = util.paraphrase_mining(paraphrase_model, [question])[1:]
    return [p[0] for p in paraphrases[:num_paraphrases]]

# Augment data with paraphrases
augmented_data = []
for item in qa_data:
    question = item["question"]
    answer = item["answer"]
    augmented_data.append(item)  # Original
    try:
        paraphrases = generate_paraphrases(question)
        for paraphrase in paraphrases:
            augmented_data.append({"question": paraphrase, "answer": answer})
    except Exception as e:
        print(f"Error generating paraphrases for: {question}, {e}")

print("Augmented data size:", len(augmented_data))

# Initialize tokenizer and model
tokenizer = RobertaTokenizer.from_pretrained("roberta-base")
model = RobertaForQuestionAnswering.from_pretrained("roberta-base")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# Custom Dataset
class QADataset(Dataset):
    def __init__(self, data, tokenizer):
        self.data = data
        self.tokenizer = tokenizer

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        item = self.data[idx]
        encoding = self.tokenizer(
            item['question'], item['answer'],
            truncation=True, padding='max_length',
            max_length=512, return_tensors='pt'
        )

        input_ids = encoding['input_ids'].squeeze().to(device)
        attention_mask = encoding['attention_mask'].squeeze().to(device)
        answer_tokens = self.tokenizer.encode(item['answer'], add_special_tokens=False)

        # Locate answer positions
        start_pos, end_pos = 0, 0
        for i in range(len(input_ids) - len(answer_tokens) + 1):
            if (input_ids[i:i + len(answer_tokens)] == torch.tensor(answer_tokens).to(device)).all():
                start_pos = i
                end_pos = i + len(answer_tokens) - 1
                break

        return {
            'input_ids': input_ids,
            'attention_mask': attention_mask,
            'start_positions': torch.tensor(start_pos).to(device),
            'end_positions': torch.tensor(end_pos).to(device)
        }

# Split dataset
train_data, val_data = train_test_split(augmented_data, test_size=0.2, random_state=42)
train_dataset = QADataset(train_data, tokenizer)
val_dataset = QADataset(val_data, tokenizer)

# Training arguments
training_args = TrainingArguments(
    output_dir="./qa_results",
    evaluation_strategy="epoch",
    save_strategy="no",  # Disable intermediate checkpoint saves
    logging_dir="./logs",
    learning_rate=3e-5,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=3,
    weight_decay=0.01,
    load_best_model_at_end=True,
    metric_for_best_model="eval_loss"
)

# Metric computation
def compute_metrics(eval_pred):
    start_logits, end_logits = eval_pred.predictions
    start_positions, end_positions = eval_pred.label_ids

    start_accuracy = (torch.argmax(torch.tensor(start_logits), dim=1).to(device) == torch.tensor(start_positions).to(
        device)).float().mean()
    end_accuracy = (torch.argmax(torch.tensor(end_logits), dim=1).to(device) == torch.tensor(end_positions).to(
        device)).float().mean()

    return {'start_accuracy': start_accuracy.item(), 'end_accuracy': end_accuracy.item()}

# Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    compute_metrics=compute_metrics,
    callbacks=[EarlyStoppingCallback(early_stopping_patience=2)]
)

# Training
print("Training started...")
trainer.train()
print("Training completed.")

# Evaluate
eval_results = trainer.evaluate()
print("Evaluation results:", eval_results)
with open("evaluation_results.txt", "w") as f:
    f.write(str(eval_results))

# Save model and tokenizer
save_path = "./trained_model"
model.save_pretrained(save_path)
tokenizer.save_pretrained(save_path)
print(f"Final model and tokenizer saved to {save_path}")

# Test prediction
def predict_with_fallback(model, tokenizer, question, context="", confidence_threshold=0.5):
    """
    Predicts the answer and provides a default response if confidence is too low.
    """
    model.eval()
    inputs = tokenizer(
        question, context, return_tensors="pt", max_length=512, truncation=True, padding="max_length"
    )
    inputs = {key: value.to(device) for key, value in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)

    start_logits = outputs.start_logits[0]
    end_logits = outputs.end_logits[0]
    start_probs = torch.softmax(start_logits, dim=0)
    end_probs = torch.softmax(end_logits, dim=0)

    start_idx = torch.argmax(start_probs)
    end_idx = torch.argmax(end_probs)
    confidence = (start_probs[start_idx] + end_probs[end_idx]) / 2

    if confidence < confidence_threshold:
        return "I'm unable to answer your question right now. Could you please rephrase or ask something related to compliance?"

    predicted_answer = tokenizer.decode(
        inputs["input_ids"][0][start_idx:end_idx + 1], skip_special_tokens=True
    )
    return predicted_answer

# Test cases
questions = [
    "Hello",
    "What is GDPR compliance?",
    "Explain GDPR compliance.",
    "What do you know about GDPR compliance?"
]

for question in questions:
    print(f"Question: {question}")
    response = predict_with_fallback(model, tokenizer, question)
    print(f"Response: {response}\n")