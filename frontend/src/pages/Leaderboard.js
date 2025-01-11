//import React, { useState, useEffect } from 'react';
import styles from './Leaderboard.module.css';
import Navbar from './Navbar.js';
import hmc from '../assets/hmc.png';
import jameel from '../assets/jameel.jpg';
import mit from '../assets/mit.png';
import mos from '../assets/mos.jpg';

  const Leaderboard = () => {
    // const [users, setUsers] = useState([]);
  
    // useEffect(() => {
    //   fetch('http://localhost:3001/api/leaderboard')
    //     .then((response) => response.json())
    //     .then((data) => setUsers(data))
    //     .catch((error) => console.error('Error fetching leaderboard:', error));
    // }, []);
    const users = [
        { id: 1, name: 'Player 1', score: 150 },
        { id: 2, name: 'Player 2', score: 140 },
        { id: 3, name: 'Player 3', score: 130 },
        { id: 4, name: 'Player 4', score: 120 },
        { id: 5, name: 'Player 5', score: 110 },
        { id: 6, name: 'Player 6', score: 100 },
        { id: 7, name: 'Player 7', score: 90 },
        { id: 8, name: 'Player 8', score: 80 },
        { id: 9, name: 'Player 9', score: 70 },
        { id: 10, name: 'Player 10', score: 60 },
        { id: 11, name: 'Player 11', score: 50 },
        { id: 12, name: 'Player 12', score: 40 },
        { id: 13, name: 'Player 13', score: 30 },
        { id: 14, name: 'Player 14', score: 20 },
        { id: 15, name: 'Player 15', score: 10 },
    ];

    return (
      <div className={styles.mainContainer}>
        <Navbar />
        <div className={styles.content}>
          <h1 className={styles.heading}>Leaderboard</h1>
          <p className={styles.subheading}>
            View the top participants in our challenge
          </p>
          <div className={styles.tableContainer}>
            <table>
            <thead>
                <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Score</th>
                </tr>
            </thead>
            <tbody>
                {users.length > 0 ? (
                users.map((player, index) => (
                    <tr key={player.id || index}>
                    <td>{index + 1}</td>
                    <td>{player.name || 'Unknown'}</td>
                    <td>{player.score !== undefined ? player.score : 'N/A'}</td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan="3">No data available</td>
                </tr>
                )}
            </tbody>
            </table>
          </div>
          <div className={styles.imageContainer}>
            <img src={mos} alt="MOS" className={styles.logos} />
            <img src={mit} alt="MIT" className={styles.logos} />
            <img src={jameel} alt="Jameel" className={styles.logos} />
            <img src={hmc} alt="HMC" className={styles.logos} />
          </div>
        </div>
      </div>
    );
  };
  
  export default Leaderboard;