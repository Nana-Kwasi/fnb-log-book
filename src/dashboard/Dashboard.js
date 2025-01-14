import React from 'react';
import "../dashboard.css"
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h1>Welcome to Dispatch Dashboard</h1>

      {/* First Row: Calendar and Time */}
      <div className="row">
        <div className="calendar-time">
          <h2 style={{color:'white'}}>Today's Date</h2>
          <p>{new Date().toLocaleDateString()}</p>
          <h2  style={{color:'white'}}>Current Time</h2>
          <p>{new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Second Row: Buttons */}
      <div className="buttons-row">
        <div
          className="round-button"
          onClick={() => navigate('/Dispatch')}
        >
          <i className="fas fa-pencil-alt"></i>
          <p>Record Dispatch</p>
        </div>

        <div
          className="round-button"
          onClick={() => navigate('/DispatchReport')}
        >
          <i className="fas fa-file-alt"></i>
          <p>Report</p>
        </div>

        <div
          className="round-button"
          onClick={() => navigate('/dispatch-history')}
        >
          <i className="fas fa-history"></i>
          <p>Dispatch History</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
