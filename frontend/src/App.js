import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Challenge from './pages/Challenge';
import RNAChallenge from './pages/challenges/RNAChallenge';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/challenge" element={<Challenge />}>
            <Route path='rna' element={<RNAChallenge/>}/>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
