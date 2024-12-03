import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Welcome() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

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
            </div>
          </div>
        </>
      )}
    {/* </div> */}
  {/* );
} */}

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
            christmas-video {
            width: 100%;
            max-width: 400px;
            margin-bottom: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
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

          /* Button Container */
          .button-container {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
          }

          /* Button Styles */
          .button {
            padding: 12px 30px;
            font-size: 16px;
            font-weight: 500;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            width: 200px;
          }

          .first-time-btn {
            background-color: #2ecc71;
            color: white;
          }

          .first-time-btn:hover {
            background-color: #27ae60;
          }

          .been-here-btn {
            background-color: #3498db;
            color: white;
          }

          .been-here-btn:hover {
            background-color: #2980b9;
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
        `}
      </style>
    </div>
  );
}

export default Welcome;




// et do a simple react js project visitors log book. the form will take Name, Date, Reason to see, Department, Purpose, Telephone, Number, Company or Location, Time In, Time Out, Signature, Image. so these are the data we will take, in your mind, how best can we take this data and where will we save it and when same visitor comes, we dont need to take all the data again, visitor will just input it telephone to pull up it information then only date, reason to see, department, purpose, time in and time out form will be available for him to input the data again. no wait, the first screen will be home page where two nice designed button will be display, First time and Being here before? then when he click the First time then all forms will be display but when he click on the being here before then telephone form will be display to pull up the only date, reason to see, department, image, purpose, time in and time out form to display. make sure the first time forms will ask for permission to open camera to take picture to upload. do you understand?