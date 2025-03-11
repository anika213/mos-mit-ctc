import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Leaderboard from './pages/Leaderboard'
import Register from './pages/Register';
import Challenge from './pages/Challenge';
import AddChallenges from './pages/AddChallenges';
import Laboratory from './pages/Laboratory';
import Admin from './pages/Admin';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/leaderboard" element={<Leaderboard />}/>
        <Route path="/register" element={<Register />} />
        <Route path='/newchallenge' element={<AddChallenges/>}/>
        <Route path='/laboratory' element={<Laboratory/>}/>
        <Route path="/challenge/:challengeName/:stage" element={<Challenge />}>
        </Route>
        <Route path='/admin' element={<Admin />}></Route>
      </Routes>
    </div>
  );
}

export default App;
