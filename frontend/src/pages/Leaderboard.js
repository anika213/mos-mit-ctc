import React, { useState, useEffect } from 'react';
import styles from './Leaderboard.module.css';
import Navbar from './Navbar.js';
import hmc from '../assets/hmc.png';
import jameel from '../assets/jameel.jpg';
import mit from '../assets/mit.png';
import mos from '../assets/mos.jpg';

  const Leaderboard = () => {
    const [users, setUsers] = useState([]);
  
    useEffect(() => {
      fetch('http://localhost:8080/users/leaderboard')
        .then((response) => response.json())
        .then((data) => setUsers(data))
        .catch((error) => console.error('Error fetching leaderboard:', error));
    }, []);

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
                    <td>{player.username || 'Unknown'}</td>
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