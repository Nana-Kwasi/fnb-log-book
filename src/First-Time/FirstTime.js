import React, { useState, useEffect } from 'react';
import { getFirestore, doc, setDoc } from "firebase/firestore";
import app from '../Config';
import { v4 as uuidv4 } from 'uuid';

function FirstTime() {
  const db = getFirestore(app);

  const [formData, setFormData] = useState({
    name: '',
    reason: '',
    department: '',
    purpose: '',
    telephone: '',
    company: '',
    timeOut: '',
    picture: null,
    id: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTimeoutForm, setShowTimeoutForm] = useState(false);

  useEffect(() => {
    // Retrieve the current screen state from localStorage
    const savedState = localStorage.getItem('showTimeoutForm');
    const savedFormData = localStorage.getItem('formData');

    if (savedState === 'true') {
      setShowTimeoutForm(true);
      setFormData(JSON.parse(savedFormData || '{}'));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePictureCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, picture: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.picture) {
      setError('Please take a picture before submitting.');
      return;
    }

    setIsLoading(true);
    const entryId = uuidv4();
    const now = new Date();
    const formattedDate = now.toLocaleDateString();
    const formattedTime = now.toLocaleTimeString();

    const submissionData = {
      ...formData,
      date: formattedDate,
      timeIn: formattedTime,
      id: entryId,
    };

    try {
      await setDoc(doc(db, "VisitorEntries", entryId), submissionData);
      alert('Form submitted successfully!');
      setFormData({ ...formData, id: entryId });
      setShowTimeoutForm(true);

      // Save state to localStorage
      localStorage.setItem('showTimeoutForm', 'true');
      localStorage.setItem('formData', JSON.stringify({ ...formData, id: entryId }));
    } catch (error) {
      console.error("Error submitting data to Firestore:", error);
    }

    setIsLoading(false);
  };

  const handleTimeoutSubmit = async () => {
    if (!formData.timeOut) {
      alert('Please enter the time out before submitting.');
      return;
    }

    setIsLoading(true);

    try {
      await setDoc(
        doc(db, "VisitorEntries", formData.id),
        { timeOut: formData.timeOut },
        { merge: true }
      );

      alert('Timeout recorded successfully! Thank you for visiting us.');
      setShowTimeoutForm(false);
      setFormData({
        name: '',
        reason: '',
        department: '',
        purpose: '',
        telephone: '',
        company: '',
        timeOut: '',
        picture: null,
        id: '',
      });

      // Reset localStorage
      localStorage.removeItem('showTimeoutForm');
      localStorage.removeItem('formData');
    } catch (error) {
      console.error("Error submitting timeout to Firestore:", error);
      alert('An error occurred while recording timeout.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0F384A' }}>
      <div style={styles.formContainer}>
        <div style={styles.logoContainer}>
          <img src="fnb back.png" alt="FNB Logo" style={styles.logo} />
          <h2 style={styles.logoText}>First National Bank</h2>
        </div>
        <header style={styles.formHeader}>
          <h1>Welcome Visitor</h1>
          <p>Please fill in the form below for your visit:</p>
        </header>

        {!showTimeoutForm && (
          <form onSubmit={handleSubmit} style={styles.form}>
            {renderInput('Name', 'name', 'text', formData, handleChange)}
            {renderInput('Reason to See', 'reason', 'text', formData, handleChange, false)}
            {renderInput('Department', 'department', 'text', formData, handleChange, false)}
            {renderInput('Purpose', 'purpose', 'text', formData, handleChange, false)}
            {renderInput('Telephone', 'telephone', 'tel', formData, handleChange)}
            {renderInput('Company', 'company', 'text', formData, handleChange)}

            <div style={styles.formGroup}>
              <label style={styles.label}>Take a Picture:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePictureCapture}
                capture="environment"
                style={styles.inputFile}
              />
            </div>
            {error && <div style={styles.error}>{error}</div>}
            <button type="submit" style={styles.submitButton} disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </form>
        )}

        {showTimeoutForm && (
          <div style={styles.timeoutForm}>
            <h2 style={{ color: 'red' }}>Please record your Time Out when you are leaving:</h2>
            {renderInput('Time Out', 'timeOut', 'time', formData, handleChange)}
            <button
              onClick={handleTimeoutSubmit}
              style={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit Time Out"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const renderInput = (label, name, type, formData, handleChange, required = true) => (
  <div style={styles.formGroup} key={name}>
    <label style={styles.label}>{label}:</label>
    <input
      type={type}
      name={name}
      value={formData[name]}
      onChange={handleChange}
      required={required}
      style={styles.input}
    />
  </div>
);

const styles = {
  formContainer: {
    maxWidth: '100%',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f0f4ff',
    borderRadius: '15px',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
    width: '90%',
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  logo: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#003366',
    marginTop: '10px',
  },
  formHeader: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#003366',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 'bold',
    color: '#046063',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #d3d3d3',
    fontSize: '16px',
    outline: 'none',
  },
  inputFile: {
    marginTop: '10px',
    fontSize: '16px',
    border: 'none',
  },
  submitButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '12px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    marginTop: '20px',
  },
  picturePreview: {
    marginTop: '20px',
    textAlign: 'center',
  },
  previewImage: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '15px',
    marginTop: '15px',
  },
  error: {
    color: 'red',
    marginBottom: '20px',
  },
  prompt: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#ffeeba',
    border: '1px solid #f5c6cb',
    borderRadius: '10px',
    textAlign: 'center',
  },
  promptButton: {
    margin: '5px',
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  goodbyeMessage: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#d4edda',
    border: '1px solid #c3e6cb',
    borderRadius: '10px',
    textAlign: 'center',
    color: '#155724',
    fontWeight: 'bold',
  },
};

export default FirstTime;

