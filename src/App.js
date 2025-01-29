import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Welcome from './Welcome/Welcome';
import BeenHereBefore from './Been-Here/BeenHereBefore';
import FirstTime from './First-Time/FirstTime';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/first-time" element={<FirstTime />} />
        <Route path="/been-here-before" element={<BeenHereBefore />} />
        

      </Routes>
    </Router>
  );
}

export default App;
