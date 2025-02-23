import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Leaderboard from './pages/Leaderboard'
import Register from './pages/Register';
import Challenge from './pages/Challenge';
import AddChallenges from './pages/AddChallenges';
// import Easy from './pages/challenges/Wireless/Easy';
// import Medium from './pages/challenges/Wireless/Medium';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/leaderboard" element={<Leaderboard />}/>
        <Route path="/register" element={<Register />} />
        <Route path='/newchallenge' element={<AddChallenges/>}/>
        <Route path="/challenge/:challengeName/:stage" element={<Challenge />}>
         
          {/* <Route path='rna' element={<RNAChallenge/>}/>
          <Route path='wirelesseasy' element={<Easy/>}/>
          <Route path='wirelessmedium' element={<Medium/>}/> */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
