import pandas as pd
import torch
from transformers import (
    RobertaTokenizer, RobertaForQuestionAnswering,
    Trainer, TrainingArguments, EarlyStoppingCallback
)
from sentence_transformers import SentenceTransformer, util
from torch.utils.data import Dataset
from sklearn.model_selection import train_test_split

class QADataset(Dataset):
    def __init__(self, data, tokenizer, max_length=512):
        self.data = data
        self.tokenizer = tokenizer
        self.max_length = max_length

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        item = self.data[idx]
        question = item['question']
        answer = item['answer']
        
        # Combine question and answer for context
        context = f"Question: {question}\nAnswer: {answer}"
        
        # Tokenize with proper handling of answer spans
        encoding = self.tokenizer(
            question,
            context,
            max_length=self.max_length,
            padding='max_length',
            truncation=True,
            return_tensors='pt',
            return_offsets_mapping=True
        )
        
        # Find the answer span in the tokenized text
        answer_start = context.lower().find(answer.lower())
        answer_end = answer_start + len(answer)
        
        # Convert character positions to token positions
        offsets = encoding['offset_mapping'].squeeze()
        start_positions = end_positions = 0
        
        for idx, (start, end) in enumerate(offsets):
            if start <= answer_start and end >= answer_start:
                start_positions = idx
            if start <= answer_end and end >= answer_end:
                end_positions = idx
                break
        
        return {
            'input_ids': encoding['input_ids'].squeeze(),
            'attention_mask': encoding['attention_mask'].squeeze(),
            'start_positions': torch.tensor(start_positions),
            'end_positions': torch.tensor(end_positions)
        }

def generate_paraphrases(question, model, num_paraphrases=2):
    """Generate diverse paraphrases using sentence transformers."""
    sentences = [question]
    embeddings = model.encode(sentences, convert_to_tensor=True)
    
    # Generate variations by adding small random noise to embeddings
    noise = torch.randn_like(embeddings) * 0.1
    noisy_embeddings = embeddings + noise
    
    paraphrases = []
    for _ in range(num_paraphrases):
        # Generate new question from noisy embedding
        noisy_question = util.semantic_search(noisy_embeddings, embeddings, top_k=1)[0][0]['corpus_id']
        if noisy_question != question:
            paraphrases.append(sentences[noisy_question])
    
    return paraphrases

def prepare_training_data(file_path, num_paraphrases=2):
    """Prepare and augment training data."""
    # Load data
    data = pd.read_csv(file_path, encoding='ISO-8859-1')
    qa_pairs = data[['Question', 'Answer']].dropna().to_dict('records')
    
    # Initialize paraphrase model
    paraphrase_model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
    
    # Augment data
    augmented_data = []
    for pair in qa_pairs:
        question = pair['Question']
        answer = pair['Answer']
        
        # Add original pair
        augmented_data.append({
            'question': question,
            'answer': answer
        })
        
        # Add paraphrased versions
        try:
            paraphrases = generate_paraphrases(question, paraphrase_model, num_paraphrases)
            for paraphrase in paraphrases:
                augmented_data.append({
                    'question': paraphrase,
                    'answer': answer
                })
        except Exception as e:
            print(f"Error generating paraphrases for: {question}, {str(e)}")
    
    return augmented_data

def train_model(train_dataset, val_dataset, model, tokenizer, output_dir="./qa_results"):
    """Train the model with improved parameters."""
    training_args = TrainingArguments(
        output_dir=output_dir,
        evaluation_strategy="steps",
        eval_steps=100,
        save_strategy="steps",
        save_steps=100,
        learning_rate=2e-5,
        per_device_train_batch_size=4,
        per_device_eval_batch_size=4,
        num_train_epochs=5,
        weight_decay=0.01,
        load_best_model_at_end=True,
        metric_for_best_model="eval_loss",
        gradient_accumulation_steps=4,
        warmup_steps=500,
        logging_steps=50
    )
    
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        callbacks=[EarlyStoppingCallback(early_stopping_patience=3)]
    )
    
    return trainer

def predict_answer(question, model, tokenizer, device, confidence_threshold=0.3):
    """Make a prediction with improved confidence handling."""
    model.eval()
    inputs = tokenizer(
        question,
        return_tensors="pt",
        max_length=512,
        padding=True,
        truncation=True
    ).to(device)
    
    with torch.no_grad():
        outputs = model(**inputs)
    
    start_scores = torch.softmax(outputs.start_logits, dim=1)
    end_scores = torch.softmax(outputs.end_logits, dim=1)
    
    max_start_score = torch.max(start_scores)
    max_end_score = torch.max(end_scores)
    confidence = (max_start_score + max_end_score) / 2
    
    if confidence < confidence_threshold:
        return "I'm unable to provide a confident answer. Please rephrase your question or provide more context."
    
    start_idx = torch.argmax(outputs.start_logits)
    end_idx = torch.argmax(outputs.end_logits)
    
    answer_tokens = inputs.input_ids[0][start_idx:end_idx + 1]
    answer = tokenizer.decode(answer_tokens, skip_special_tokens=True)
    
    return answer

# Main execution
if __name__ == "__main__":
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    # Load and prepare data
    file_path = 'path_to_your_csv'
    augmented_data = prepare_training_data(file_path)
    
    # Initialize model and tokenizer
    tokenizer = RobertaTokenizer.from_pretrained("roberta-base")
    model = RobertaForQuestionAnswering.from_pretrained("roberta-base").to(device)
    
    # Prepare datasets
    train_data, val_data = train_test_split(augmented_data, test_size=0.2, random_state=42)
    train_dataset = QADataset(train_data, tokenizer)
    val_dataset = QADataset(val_data, tokenizer)
    
    # Train model
    trainer = train_model(train_dataset, val_dataset, model, tokenizer)
    trainer.train()
    
    # Save model
    model.save_pretrained("./trained_model")
    tokenizer.save_pretrained("./trained_model") 