import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore';
import app from '../Config';
import "../dispatch.css"
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

  const db = getFirestore(app);

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
      const q = query(
        collection(db, 'VisitorEntries'),
        where('telephone', '==', logoutPhoneNumber)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const visits = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        const sortedVisits = visits.sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.timeIn}`);
          const dateB = new Date(`${b.date} ${b.timeIn}`);
          return dateB - dateA;
        });

        const latest = sortedVisits[0];
        
        if (latest.timeOut) {
          setError('Your latest visit already has a time out logged.');
        } else {
          setLatestVisit(latest);
        }
      } else {
        setError('No visits found for this phone number.');
      }
    } catch (err) {
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
      const visitRef = doc(db, 'VisitorEntries', latestVisit.id);
      await updateDoc(visitRef, { timeOut: selectedTimeOut });
      
      setError('Time out logged successfully!');
      setShowLogoutModal(false);
      setLatestVisit(null);
      setSelectedTimeOut('');
      setLogoutPhoneNumber('');
    } catch (err) {
      setError('Error logging time out. Please try again.');
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
            <div class="button-container">
              <button onClick={() => navigate('/first-time')} class="button first-time-btn">
                First Time?
              </button>
              <button onClick={() => navigate('/been-here-before')} class="button been-here-btn">
                Been Here Before?
              </button>
              <button onClick={() => setShowLogoutModal(true)} class="logout-button">
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

      <style>
        {`
          /* Modal Styles */
          .popup-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }

          .popup {
            background: white;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 90%;
          }

          .popup-title {
            font-size: 24px;
            font-weight: bold;
            background: linear-gradient(to right, #3498db, #2ecc71);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 15px;
          }
          .popup-message {
            font-size: 16px;
            line-height: 1.5;
            color: #C3A53E;
            margin-bottom: 20px;
          }

          .checkbox-container {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
          }

          .checkbox-label {
            margin-left: 10px;
            font-size: 14px;
            color: #7f8c8d;
          }

          .popup-button {
            background: linear-gradient(to right, #3498db, #2ecc71);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: all 0.3s ease;
          }
          /* General Reset and Box Model */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          /* Body Styles */
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
            
         .welcome-container {
    text-align: center;
    padding: 20px;
    border-radius: 12px;
    background-color: white;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
    width: calc(100% - 40px); /* Account for margin */
    max-width: 600px;
    margin: 0 auto; /* Center the container */
}
.logo-container {
    text-align: center;
    margin-bottom: 20px;
    width: 100%;
}
/* Media queries for smaller screens */
@media screen and (max-width: 480px) {
    .welcome-container {
        padding: 15px;
        width: calc(100% - 30px);
        margin: 0 15px;
        border-radius: 8px;
    }
    
    .logo-container {
        margin-bottom: 15px;
    }
}

/* For very small screens */
@media screen and (max-width: 320px) {
    .welcome-container {
        padding: 10px;
        width: calc(100% - 20px);
        margin: 0 10px;
    }
}

          .logo {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
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

          /* Header and Title */
          .welcome-header {
            margin: 20px 0;
          }

          .welcome-title {
            font-size: 28px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 15px;
          }

          .welcome-description {
            font-size: 16px;
            color: #7f8c8d;
            margin-bottom: 30px;
          }

        

          /* Responsive Design */
          @media (max-width: 768px) {
            .welcome-title {
              font-size: 24px;
            }

            .welcome-description {
              font-size: 14px;
            }

            .button {
              padding: 10px 25px;
              font-size: 14px;
              width: 150px;
            }
          }

          @media (max-width: 480px) {
            .welcome-container {
              padding: 15px;
            }

            .welcome-title {
              font-size: 20px;
            }

            .welcome-description {
              font-size: 12px;
            }

            .button {
              padding: 8px 20px;
              font-size: 12px;
              width: 120px;
            }

            .button-container {
              gap: 10px;
            }
          .popup-button:disabled {
            background: #bdc3c7;
            cursor: not-allowed;
          }

          .popup-button:not(:disabled):hover {
            opacity: 0.9;
          }

          /* General Reset and Box Model */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          .welcome-container {
            text-align: center;
            padding: 10px;
            border-radius: 12px;
            background-color: white;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
            width: 100%;
            max-width: 600px;
            margin: 0 20px;
          }

          .logo-container {
            text-align: center;
            margin-bottom: 20px;
          }

          .logo {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
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
             .logout-button {
            background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
            margin: 20px auto;
            display: block;
          }

          .logout-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
          }

          .logout-button:active {
            transform: translateY(1px);
          }

          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }

          .modal-content {
            background: white;
            padding: 30px;
            border-radius: 15px;
            width: 90%;
            max-width: 400px;
            text-align: center;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          }

          .modal-title {
            color: #2c3e50;
            font-size: 24px;
            margin-bottom: 20px;
          }

          .modal-input {
            width: 100%;
            padding: 12px;
            margin: 10px 0;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s ease;
          }

          .modal-input:focus {
            border-color: #ff6b6b;
            outline: none;
          }

          .modal-button {
            background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 10px 0;
            width: 100%;
          }

          .modal-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
          }

          .modal-close-button {
            background: #e0e0e0;
            color: #666;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 10px;
          }

          .modal-close-button:hover {
            background: #d0d0d0;
          }

          .modal-text {
            color: #666;
            margin: 15px 0;
            font-size: 16px;
          }

          .error-message {
            color: #ff6b6b;
            margin: 10px 0;
            font-size: 14px;
          }

          .spinner {
            width: 20px;
            height: 20px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #ff6b6b;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default Welcome;




// et do a simple react js project visitors log book. the form will take Name, Date, Reason to see, Department, Purpose, Telephone, Number, Company or Location, Time In, Time Out, Signature, Image. so these are the data we will take, in your mind, how best can we take this data and where will we save it and when same visitor comes, we dont need to take all the data again, visitor will just input it telephone to pull up it information then only date, reason to see, department, purpose, time in and time out form will be available for him to input the data again. no wait, the first screen will be home page where two nice designed button will be display, First time and Being here before? then when he click the First time then all forms will be display but when he click on the being here before then telephone form will be display to pull up the only date, reason to see, department, image, purpose, time in and time out form to display. make sure the first time forms will ask for permission to open camera to take picture to upload. do you understand?



// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../welcome.css'
// function Welcome() {
//   const navigate = useNavigate();
//   const [showPopup, setShowPopup] = useState(false);
//   const [isAgreed, setIsAgreed] = useState(false);
//   const [showUserTypeModal, setShowUserTypeModal] = useState(false);

//   useEffect(() => {
//     const agreementStatus = localStorage.getItem('hasAgreed');
//     if (!agreementStatus) {
//       setShowPopup(true);
//     } else {
//       setShowUserTypeModal(true);
//     }
//   }, []);

//   const handleAgree = () => {
//     setIsAgreed(true);
//     setShowPopup(false);
//     localStorage.setItem('hasAgreed', 'true');
//     setShowUserTypeModal(true);
//   };

//   const  handleDispatchClick = () => {
//     navigate('/Dashboard');
//   };

//   const handleVisitorClick = () => {
//     setShowUserTypeModal(false);
//   };

//  return (
//     <div className="welcome-container">
//       {showPopup && (
//         <div className="popup-container">
//           <div className="popup">
//             <h2 className="popup-title">Welcome!</h2>
//             <p className="popup-message">
//               At First National Bank, your data is being collected solely for the purpose of
//               recording and monitoring visitor entries to enhance security and operational efficiency.
//               By continuing, you agree to the terms of this data collection.
//             </p>
//             <div className="checkbox-container">
//               <input
//                 type="checkbox"
//                 id="agree"
//                 checked={isAgreed}
//                 onChange={(e) => setIsAgreed(e.target.checked)}
//               />
//               <label htmlFor="agree" className="checkbox-label">
//                 I agree to the data collection policy.
//               </label>
//             </div>
//             <button
//               className="popup-button"
//               onClick={handleAgree}
//               disabled={!isAgreed}
//             >
//               Proceed
//             </button>
//           </div>
//         </div>
//       )}

//       {showUserTypeModal && (
//         <div className="popup-container">
//           <div className="user-type-modal">
//             <h2 className="modal-title">Select User Type</h2>
//             <p className="modal-description">Please select your user type to continue</p>
//             <div className="user-type-buttons">
//               <div className="user-type-option">
//                 <button className="user-type-btn dispatch-btn" onClick={handleDispatchClick}>
//                   <span className="btn-icon">📝</span>
//                   <span className="btn-text">Dispatch</span>
//                 </button>
//                 <p className="option-description">
//                   Access the dispatch management system for handling deliveries and pickups
//                 </p>
//               </div>
//               <div className="user-type-option">
//                 <button className="user-type-btn visitor-btn" onClick={handleVisitorClick}>
//                   <span className="btn-icon">👥</span>
//                   <span className="btn-text">Visitor</span>
//                 </button>
//                 <p className="option-description">
//                   Continue to the visitor registration system
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {!showPopup && !showUserTypeModal && (
//         <>
//           <div className="logo-container">
//             <img src="/fnb back.png" alt="FNB Logo" className="logo" />
//             <h2 className="logo-text">FNB</h2>
//             <h2 className="logo-text">(First National Bank)</h2>
//           </div>

//           <div className="welcome-header">
//             <h1 className="welcome-title">Welcome to First National Bank Visitors Log Book</h1>
//             <p className="welcome-description">
//               Please select one of the options below to proceed:
//             </p>
//             <div className="button-container">
//               <button onClick={() => navigate('/first-time')} className="button first-time-btn">
//                 First Time?
//               </button>
//               <button onClick={() => navigate('/been-here-before')} className="button been-here-btn">
//                 Been Here Before?
//               </button>
//             </div>
//           </div>
//         </>
//       )}
//     {/* </div> */}
//   {/* );
// } */}

//       <style>
//         {`
//           /* Modal Styles */
//           .popup-container {
//             position: fixed;
//             top: 0;
//             left: 0;
//             width: 100%;
//             height: 100%;
//             background: rgba(0, 0, 0, 0.5);
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             z-index: 1000;
//           }

//           .popup {
//             background: white;
//             padding: 30px;
//             border-radius: 12px;
//             text-align: center;
//             box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
//             max-width: 500px;
//             width: 90%;
//           }

//           .popup-title {
//             font-size: 24px;
//             font-weight: bold;
//             background: linear-gradient(to right, #3498db, #2ecc71);
//             -webkit-background-clip: text;
//             -webkit-text-fill-color: transparent;
//             margin-bottom: 15px;
//           }

//           .popup-message {
//             font-size: 16px;
//             line-height: 1.5;
//             color: #C3A53E;
//             margin-bottom: 20px;
//           }

//           .checkbox-container {
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             margin-bottom: 20px;
//           }

//           .checkbox-label {
//             margin-left: 10px;
//             font-size: 14px;
//             color: #7f8c8d;
//           }

//           .popup-button {
//             background: linear-gradient(to right, #3498db, #2ecc71);
//             color: white;
//             border: none;
//             padding: 12px 30px;
//             border-radius: 5px;
//             cursor: pointer;
//             font-size: 16px;
//             font-weight: bold;
//             transition: all 0.3s ease;
//           }
//  /* General Reset and Box Model */
//           * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//           }

//           /* Body Styles */
//           body {
//             font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//             color: #333;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             height: 100vh;
//             margin: 0;
//           }
//             christmas-video {
//             width: 100%;
//             max-width: 400px;
//             margin-bottom: 15px;
//             border-radius: 8px;
//             box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
//           }

//           .welcome-container {
//             text-align: center;
//             padding: 10px;
//             border-radius: 12px;
//             background-color: white;
//             box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
//             width: 100%;
//             max-width: 600px;
//             margin: 0 20px;
//           }

//           .logo-container {
//             text-align: center;
//             margin-bottom: 20px;
//           }

//           .logo {
//             width: 100px;
//             height: 100px;
//             border-radius: 50%;
//             box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
//           }

//           .logo-text {
//             font-size: 24px;
//             font-weight: bold;
//             color: #2c3e50;
//             margin-top: 10px;
//             text-transform: uppercase;
//             letter-spacing: 1px;
//             background: linear-gradient(to right, #3498db, #2ecc71);
//             -webkit-background-clip: text;
//             color: transparent;
//           }

//           /* Header and Title */
//           .welcome-header {
//             margin: 20px 0;
//           }

//           .welcome-title {
//             font-size: 28px;
//             font-weight: 600;
//             color: #2c3e50;
//             margin-bottom: 15px;
//           }

//           .welcome-description {
//             font-size: 16px;
//             color: #7f8c8d;
//             margin-bottom: 30px;
//           }

//           /* Button Container */
//           .button-container {
//             display: flex;
//             justify-content: center;
//             gap: 20px;
//             flex-wrap: wrap;
//           }

//           /* Button Styles */
//           .button {
//             padding: 12px 30px;
//             font-size: 16px;
//             font-weight: 500;
//             border: none;
//             border-radius: 5px;
//             cursor: pointer;
//             transition: all 0.3s ease;
//             box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//             width: 200px;
//           }

//           .first-time-btn {
//             background-color: #2ecc71;
//             color: white;
//           }

//           .first-time-btn:hover {
//             background-color: #27ae60;
//           }

//           .been-here-btn {
//             background-color: #3498db;
//             color: white;
//           }

//           .been-here-btn:hover {
//             background-color: #2980b9;
//           }

//           /* Responsive Design */
//           @media (max-width: 768px) {
//             .welcome-title {
//               font-size: 24px;
//             }

//             .welcome-description {
//               font-size: 14px;
//             }

//             .button {
//               padding: 10px 25px;
//               font-size: 14px;
//               width: 150px;
//             }
//           }

//           @media (max-width: 480px) {
//             .welcome-container {
//               padding: 15px;
//             }

//             .welcome-title {
//               font-size: 20px;
//             }

//             .welcome-description {
//               font-size: 12px;
//             }

//             .button {
//               padding: 8px 20px;
//               font-size: 12px;
//               width: 120px;
//             }

//             .button-container {
//               gap: 10px;
//             }
//           .popup-button:disabled {
//             background: #bdc3c7;
//             cursor: not-allowed;
//           }

//           .popup-button:not(:disabled):hover {
//             opacity: 0.9;
//           }

//           /* General Reset and Box Model */
//           * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//           }

//           .welcome-container {
//             text-align: center;
//             padding: 10px;
//             border-radius: 12px;
//             background-color: white;
//             box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
//             width: 100%;
//             max-width: 600px;
//             margin: 0 20px;
//           }

//           .logo-container {
//             text-align: center;
//             margin-bottom: 20px;
//           }

//           .logo {
//             width: 100px;
//             height: 100px;
//             border-radius: 50%;
//             box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
//           }

//           .logo-text {
//             font-size: 24px;
//             font-weight: bold;
//             color: #2c3e50;
//             margin-top: 10px;
//             text-transform: uppercase;
//             letter-spacing: 1px;
//             background: linear-gradient(to right, #3498db, #2ecc71);
//             -webkit-background-clip: text;
//             color: transparent;
//           }
//         `}
//       </style>
//     </div>
//   );
// }

// export default Welcome;




// et do a simple react js project visitors log book. the form will take Name, Date, Reason to see, Department, Purpose, Telephone, Number, Company or Location, Time In, Time Out, Signature, Image. so these are the data we will take, in your mind, how best can we take this data and where will we save it and when same visitor comes, we dont need to take all the data again, visitor will just input it telephone to pull up it information then only date, reason to see, department, purpose, time in and time out form will be available for him to input the data again. no wait, the first screen will be home page where two nice designed button will be display, First time and Being here before? then when he click the First time then all forms will be display but when he click on the being here before then telephone form will be display to pull up the only date, reason to see, department, image, purpose, time in and time out form to display. make sure the first time forms will ask for permission to open camera to take picture to upload. do you understand?

