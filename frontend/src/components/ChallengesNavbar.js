// ChallengeNavbar.js
import React from "react";
import styles from "./ChallengesNavbar.module.css";

function ChallengeNavbar({ selectedChallenge, onChallengeSelect }) {
  const challenges = ["RNA", "Molecules", "Wireless"];
  
  return (
    <div className={styles.navbar}>
      {challenges.map((challenge) => (
        <button
          key={challenge}
          className={`${styles.navButton} ${
            selectedChallenge === challenge ? styles.active : ""
          }`}
          onClick={() => onChallengeSelect(challenge)}
        >
          {challenge}
        </button>
      ))}
    </div>
  );
}

export default ChallengeNavbar;
