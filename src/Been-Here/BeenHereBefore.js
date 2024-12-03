 import React, { useState } from 'react';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';
import app from '../Config';

const BeenHereBefore = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [visitData, setVisitData] = useState({});
  const [visitHistory, setVisitHistory] = useState([]);
  const [error, setError] = useState('');
  const [currentVisitId, setCurrentVisitId] = useState(null);
  const [timeOut, setTimeOut] = useState(''); // Time out value for manual input

  const db = getFirestore(app);

  const handleLogin = async () => {
 if (!phoneNumber.match(/^\+?\d{6,15}$/)) {
  setError('Please enter a valid phone number with 6 to 15 digits. Include the country code if applicable.');
  return;
}


  setError('');
  setLoading(true);

  try {
    const q = query(
      collection(db, 'VisitorEntries'),
      where('telephone', '==', phoneNumber)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      setError('Phone number not found. Please check your input or register as a new visitor.');
      setLoading(false);
      return;
    }

    const userDoc = querySnapshot.docs[0].data();
    const visits = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setUserInfo(userDoc);
    setVisitData({
      telephone: userDoc.telephone || '',
      company: userDoc.company || '',
      department: userDoc.department || '',
      purpose: userDoc.purpose || '',
      reason: userDoc.reason || '',
    });
    setVisitHistory(visits);
  } catch (err) {
    setError('Error fetching user information. Please try again.');
  }
  setLoading(false);
};


  const handleCheckIn = async () => {
    setError('');
    setLoading(true);
  
    try {
      const now = new Date();
      const newVisit = {
        name: visitData.name || userInfo.name || '',
        telephone: visitData.telephone || userInfo.telephone || '',
        company: visitData.company || '',
        department: visitData.department || '',
        purpose: visitData.purpose || '',
        reason: visitData.reason || '',
        date: now.toISOString().split('T')[0], // Standardized date in YYYY-MM-DD format
        timeIn: now.toTimeString().split(' ')[0], // Time in HH:MM:SS
        timeOut: '',
      };
  
      const docRef = await addDoc(collection(db, 'VisitorEntries'), newVisit);
  
      setVisitHistory([newVisit, ...visitHistory]);
      setCurrentVisitId(docRef.id);
      setError('Check-in successful!');
    } catch (err) {
      setError('Error saving the new visit entry. Please try again.');
    }
    setLoading(false);
  };
  

  const handleTimeOut = async () => {
    if (!timeOut) {
      setError('Please select a time-out.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const visitRef = doc(db, 'VisitorEntries', currentVisitId);

      // Update the Firestore document with Time Out
      await updateDoc(visitRef, { timeOut });

      // Update the UI
      setVisitHistory((prevHistory) =>
        prevHistory.map((visit) =>
          visit.id === currentVisitId ? { ...visit, timeOut } : visit
        )
      );

      setError('Time out logged successfully!');
      setCurrentVisitId(null);
    } catch (err) {
      setError('Error logging time out. Please try again.');
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVisitData((prevData) => ({ ...prevData, [name]: value }));
  };

  
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(date);
  };

  return (
    <div className="been-here-container">
      <div className="logo-container">
        <img src="/fnb back.png" alt="FNB Logo" className="logo" />
        <h2 className="logo-text">FNB (First National Bank)</h2>
      </div>

      <div className="form-container">
        <h1 className="form-title">Returning Visitor</h1>
        <p className="form-description">
          Please enter your phone number to verify your identity.
        </p>
        <input
          type="text"
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="phone-input"
        />
        {error && <p className="error-message">{error}</p>}
        <button
          onClick={handleLogin}
          className="login-button"
          disabled={loading}
        >
          {loading ? <div className="spinner"></div> : 'Verify'}
        </button>
      </div>

      {userInfo && currentVisitId === null && (
        <div className="card form-card">
          <h2>Welcome back, {userInfo.name}!</h2>
          <div className="form-container">
            {['telephone', 'company', 'department', 'purpose', 'reason'].map(
              (field) => (
                <div className="form-group" key={field}>
                  <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    type="text"
                    name={field}
                    value={visitData[field] || ''}
                    onChange={handleInputChange}
                    placeholder={`Enter ${field}`}
                    className="form-input"
                  />
                </div>
              )
            )}

            <button
              onClick={handleCheckIn}
              className="checkin-button"
              disabled={loading}
            >
              {loading ? <div className="spinner"></div> : 'Check In'}
            </button>
          </div>
        </div>
      )}

      {currentVisitId && (
        <div className="card form-card">
          <h2>Please Log Your Time Out</h2>
          <p className="warning">
            Remember to log your time out before leaving the premises.
          </p>
          <div className="form-group">
            <label className="checkin-button">Time Out</label>
            <input
              type="time"
              value={timeOut}
              onChange={(e) => setTimeOut(e.target.value)}
              className="form-input"
            />
          </div>
          <button
            onClick={handleTimeOut}
            className="checkin-button"
            disabled={loading}
          >
            {loading ? <div className="spinner"></div> : 'Submit Time Out'}
          </button>
        </div>
      )}

      {visitHistory.length > 0 && (
        <div className="card history-card">
          <h2>Visit History</h2>
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Company</th>
                <th>Department</th>
                <th>Purpose</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {visitHistory.map((visit, index) => (
                <tr key={index}>
                  <td>{formatDate(visit.date)}</td>
                  <td>{visit.timeIn}</td>
                  <td>{visit.timeOut || '---'}</td>
                  <td>{visit.company}</td>
                  <td>{visit.department}</td>
                  <td>{visit.purpose}</td>
                  <td>{visit.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

  <style>
  {`
    .been-here-container {
    text-align: center;
    padding: 20px;
    background: linear-gradient(135deg, #e8f0fe, #d9eaf7, #f2f6fa);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    border-radius: 16px;
    max-width: 800px;
    margin: 50px auto;
    overflow: hidden;
    border: 1px solid #e3e9ef;
}

    .logo-container {
      margin-bottom: 30px;
    }

    .logo {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
      margin-bottom: 15px;
    }

    .logo-text {
      font-size: 24px;
      font-weight: bold;
      color: #2c3e50;
      margin-top: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      background: linear-gradient(to right, #3498db, #2ecc71);
      -webkit-background-clip: text;
      color: transparent;
    }

    .form-container {
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      padding: 20px;
      margin-bottom: 30px;
    }

    .form-title {
      font-size: 28px;
      color: #34495e;
      margin-bottom: 10px;
      font-weight: bold;
    }

    .form-description {
      font-size: 16px;
      color: #7f8c8d;
      margin-bottom: 20px;
    }

    .phone-input, .form-input {
      width: 100%;
      padding: 12px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 8px;
      margin-bottom: 15px;
      transition: box-shadow 0.3s ease;
    }

    .phone-input:focus, .form-input:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 8px rgba(52, 152, 219, 0.4);
    }

    .form-group {
      margin-bottom: 15px;
      text-align: left;
    }

    label {
      font-size: 14px;
      color: #34495e;
      font-weight: bold;
      margin-bottom: 5px;
      display: block;
    }

    .error-message {
      color: #e74c3c;
      font-size: 14px;
      margin-bottom: 10px;
      font-weight: bold;
    }

    .login-button, .checkin-button {
      padding: 14px 40px;
      font-size: 16px;
      font-weight: bold;
      color: white;
      background: linear-gradient(to right, #3498db, #2ecc71);
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: transform 0.3s ease, background 0.3s ease;
    }

    .login-button:hover, .checkin-button:hover {
      background: linear-gradient(to right, #2ecc71, #3498db);
      transform: translateY(-3px);
    }

    .login-button:disabled, .checkin-button:disabled {
      background: #95a5a6;
      cursor: not-allowed;
      transform: none;
    }

    .card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
      margin: 20px 0;
      text-align: left;
    }

    .card h2 {
      color: #2c3e50;
      font-size: 20px;
      margin-bottom: 15px;
    }

    .history-card {
      overflow-x: auto;
    }

    .history-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
      text-align: left;
    }

    .history-table th, .history-table td {
      border: 1px solid #ddd;
      padding: 10px;
      font-size: 14px;
    }

    .history-table th {
      background: #3498db;
      color: white;
      text-transform: uppercase;
    }

    .warning {
      color: #e74c3c;
      font-weight: bold;
      font-size: 13px;
    }

    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-top: 4px solid #3498db;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      animation: spin 1s linear infinite;
      display: inline-block;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `}
</style>

    </div>
  );
};

export default BeenHereBefore;
