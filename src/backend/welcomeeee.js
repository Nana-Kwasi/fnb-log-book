import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../dispatch.css";


function Welcome() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutPhoneNumber, setLogoutPhoneNumber] = useState('');
  const [selectedTimeOut, setSelectedTimeOut] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [latestVisit, setLatestVisit] = useState(null);

  useEffect(() => {
    // Check if the user has already agreed to the terms
    const agreementStatus = localStorage.getItem('hasAgreed');
    if (!agreementStatus) {
      setShowPopup(true);
    }
  }, []);

  const handleAgree = () => {
    setIsAgreed(true);
    setShowPopup(false);
    localStorage.setItem('hasAgreed', 'true'); // Store the agreement status in localStorage
  };

  const handleLogoutVerification = async () => {
    if (!logoutPhoneNumber.match(/^\d+$/)) {
      setError('Please enter a valid phone number.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5001/visitors/by-phone?telephone=${logoutPhoneNumber}`);
      const data = await response.json();

      if (data.length === 0) {
        setError('No visits found for this phone number.');
      } else {
        // Sort visits to find the most recent one
        const sortedVisits = data.sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.timein}`);
          const dateB = new Date(`${b.date} ${b.timein}`);
          return dateB - dateA;
        });

        const latest = sortedVisits[0];
        
        // Check if the latest visit already has a timeout
        if (latest.timeout) {
          setError('Your latest visit already has a time out logged.');
        } else {
          setLatestVisit(latest);
        }
      }
    } catch (err) {
      console.error("Error fetching visit information:", err);
      setError('Error fetching visit information. Please try again.');
    }
    setLoading(false);
  };

  const handleLogoutSubmit = async () => {
    if (!selectedTimeOut || !latestVisit) {
      setError('Please select a time out.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5001/visitors/${latestVisit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeOut: selectedTimeOut,
        }),
      });

      if (!response.ok) {
        throw new Error('Error logging time out. Please try again.');
      }

      setError('Time out logged successfully!');
      setShowLogoutModal(false);
      setLatestVisit(null);
      setSelectedTimeOut('');
      setLogoutPhoneNumber('');
    } catch (err) {
      console.error("Error logging time out:", err);
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="welcome-container">
      {showPopup && (
        <div className="popup-container">
          <div className="popup">
            <h2 className="popup-title">Welcome!</h2>
            <p className="popup-message">
              At First National Bank, your data is being collected solely for the purpose of
              recording and monitoring visitor entries to enhance security and operational efficiency.
              By continuing, you agree to the terms of this data collection.
            </p>
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="agree"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
              />
              <label htmlFor="agree" className="checkbox-label">
                I agree to the data collection policy.
              </label>
            </div>
            <button
              className="popup-button"
              onClick={handleAgree}
              disabled={!isAgreed}
            >
              Proceed
            </button>
          </div>
        </div>
      )}
      {!showPopup && (
        <>
          <div className="logo-container">
            <img src="/fnb back.png" alt="FNB Logo" className="logo" />
            <h2 className="logo-text">FNB</h2>
            <h2 className="logo-text">(First National Bank)</h2>
          </div>

          <div className="welcome-header">
            <h1 className="welcome-title">Welcome to First National Bank Visitors Log Book</h1>
            <p className="welcome-description">
              Please select one of the options below to proceed:
            </p>
            <div className="button-container">
              <button onClick={() => navigate('/first-time')} className="button first-time-btn">
                First Time?
              </button>
              <button onClick={() => navigate('/been-here-before')} className="button been-here-btn">
                Been Here Before?
              </button>
              <button onClick={() => setShowLogoutModal(true)} className="logout-button">
                Log Out
              </button>
            </div>
          </div>
        </>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="popup-container">
          <div className="popup">
            <h2 className="popup-title">Visitor Logout</h2>
            
            {!latestVisit ? (
              <>
                <input
                  type="text"
                  placeholder="Enter your phone number"
                  value={logoutPhoneNumber}
                  onChange={(e) => setLogoutPhoneNumber(e.target.value)}
                  className="modal-input"
                />
                <button
                  onClick={handleLogoutVerification}
                  className="popup-button"
                  disabled={loading}
                >
                  {loading ? <div className="spinner"></div> : 'Verify'}
                </button>
              </>
            ) : (
              <>
                <p className="popup-message">Select your time out:</p>
                <input
                  type="time"
                  value={selectedTimeOut}
                  onChange={(e) => setSelectedTimeOut(e.target.value)}
                  className="modal-input"
                />
                <button
                  onClick={handleLogoutSubmit}
                  className="popup-button"
                  disabled={loading}
                >
                  {loading ? <div className="spinner"></div> : 'Submit Time Out'}
                </button>
              </>
            )}
            
            {error && <p className="error-message">{error}</p>}
            
            <button
              onClick={() => {
                setShowLogoutModal(false);
                setError('');
                setLatestVisit(null);
                setSelectedTimeOut('');
                setLogoutPhoneNumber('');
              }}
              className="modal-close-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Welcome;