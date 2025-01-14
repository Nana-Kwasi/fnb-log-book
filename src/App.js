import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Welcome from './Welcome/Welcome';
import BeenHereBefore from './Been-Here/BeenHereBefore';
import FirstTime from './First-Time/FirstTime';
import DispatchForm from './Dispatch/Dispatch';
import Dashboard from './dashboard/Dashboard';
import ReportScreen from './DispactReport/DispatchReport';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/first-time" element={<FirstTime />} />
        <Route path="/been-here-before" element={<BeenHereBefore />} />
        <Route path="/Dispatch" element={<DispatchForm />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/DispatchReport" element={<ReportScreen />} />


      </Routes>
    </Router>
  );
}

export default App;
