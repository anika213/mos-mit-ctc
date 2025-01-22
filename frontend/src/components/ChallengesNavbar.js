import React from "react";
import styles from "./ChallengesNavbar.module.css";

function ChallengeNavbar({ selectedChallenge, onChallengeSelect }) {
  const challengeData = {
    RNA: "RNA Splicing",
    Molecules: "Molecular Docking",
    Wireless: "Wireless Detection",
  };

  return (
    <div className={styles.navbar}>
      {Object.entries(challengeData).map(([key, fullName]) => (
        <button
          key={key}
          className={`${styles.navButton} ${
            selectedChallenge === key ? styles.active : ""
          }`}
          onClick={() => onChallengeSelect(key)}
        >
          {fullName}
        </button>
      ))}
    </div>
  );
}

export default ChallengeNavbar;
