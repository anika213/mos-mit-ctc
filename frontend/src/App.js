import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Leaderboard from './pages/Leaderboard'
import Challenge from './pages/Challenge';
import RNAChallenge from './pages/challenges/RNAChallenge';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/leaderboard" element={<Leaderboard />}/>
        <Route path="/challenge" element={<Challenge />}>
          <Route path='rna' element={<RNAChallenge/>}/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
