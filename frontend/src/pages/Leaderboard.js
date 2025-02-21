import React, { useState, useEffect } from "react";
import styles from "./Leaderboard.module.css";
import Navbar from "./Navbar.js";
import hmc from "../assets/hmc.png";
import jameel from "../assets/jameel.jpg";
import mit from "../assets/mit.png";
import mos from "../assets/mos.jpg";
import { LeaderboardNavbar } from "../components/ChallengesNavbar.js";

const Leaderboard = () => {
  const [selectedLeaderboard, setSelectedLeaderboard] = useState("Overall");
  const [selectedLevel, setSelectedLevel] = useState("Easy");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (selectedLeaderboard === "Overall") {
      fetch(process.env.REACT_APP_API_URL + "/users/leaderboard")
        .then((response) => response.json())
        .then((data) => setUsers(data))
        .catch((error) => console.error("Error fetching leaderboard:", error));
    } else {
      const full_leaderboard = `${selectedLeaderboard}-${selectedLevel}`;
      fetch(
        `process.env.REACT_APP_API_URL/users/leaderboard/${full_leaderboard}`
      )
        .then((response) => response.json())
        .then((data) => setUsers(data))
        .catch((error) => console.error("Error fetching leaderboard:", error));
    }
  }, [selectedLeaderboard, selectedLevel]);

  return (
    <div className={styles.mainContainer}>
      <Navbar />
      <div className={styles.content}>
        <h1 className={styles.heading}>Leaderboard</h1>
        <p className={styles.subheading}>
          View the top participants in our challenge
        </p>
        <div className={styles.levelSelector}>
          <LeaderboardNavbar
            selectedLeaderboard={selectedLeaderboard}
            onLeaderboardSelect={setSelectedLeaderboard}
          />

          {selectedLeaderboard !== "Overall" && (
            <>
              <br></br>
              <label>Select Level:</label>
              <select
                value={selectedLevel}
                onChange={(event) => {
                  setSelectedLevel(event.target.value);
                }}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
              </select>
            </>
          )}
        </div>
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
                    <td>{player.username || "Unknown"}</td>
                    <td>{player.score !== undefined ? player.score : "N/A"}</td>
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
