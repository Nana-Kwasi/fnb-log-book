import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import "../wel.css"

const BeenHereBefore = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [visitData, setVisitData] = useState({});
  const [visitHistory, setVisitHistory] = useState([]);
  const [error, setError] = useState('');
  const [currentVisitId, setCurrentVisitId] = useState(null);
  const [timeOut, setTimeOut] = useState('');

  const db = getFirestore(app);

  const handleLogin = async () => {
    if (!phoneNumber.match(/^\d+$/)) {
      setError('Please enter a valid phone number.');
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

      if (!querySnapshot.empty) {
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
      }
    } catch (err) {
      setError('Error fetching user information. Please try again.');
    }
    setLoading(false);
  };

  const handleCheckIn = async () => {
    setError('');
    setLoading(true);

    try {
      const newVisit = {
        name: visitData.name || userInfo.name || '',
        telephone: visitData.telephone || userInfo.telephone || '',
        company: visitData.company || '',
        department: visitData.department || '',
        purpose: visitData.purpose || '',
        reason: visitData.reason || '',
        date: new Date().toLocaleDateString(),
        timeIn: new Date().toLocaleTimeString(),
        timeOut: '',
      };

      await addDoc(collection(db, 'VisitorEntries'), newVisit);
      setError('Check-in successful!');
      
      // Show success message and navigate after a short delay
      setTimeout(() => {
        // Reset form state
        setPhoneNumber('');
        setUserInfo(null);
        setVisitData({});
        // Navigate to welcome screen
        navigate('/');
      }, 2000);
      
    } catch (err) {
      setError('Error saving the new visit entry. Please try again.');
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVisitData((prevData) => ({ ...prevData, [name]: value }));
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

      {userInfo && (
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
                  <td>{visit.date}</td>
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
    </div>
  );
};

export default BeenHereBefore;