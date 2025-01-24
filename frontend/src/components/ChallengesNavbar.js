import React from "react";
import styles from "./ChallengesNavbar.module.css";

function ChallengeNavbar({ selectedChallenge, onChallengeSelect }) {
  const challengeData = {
    RNA: "RNA Splicing",
    Molecules: "Molecular Docking",
    Wireless: "Wireless Detection",
  };

  return (
    <NavBar
      list={challengeData}
      selected={selectedChallenge}
      onSelect={onChallengeSelect}
    />
  )
}

export function LeaderboardNavbar({ selectedLeaderboard, onLeaderboardSelect }) {
  const challenges = ["Overall", "RNA", "Molecules", "Wireless"];
  
  return (
    <NavBar
      list={challenges}
      selected={selectedLeaderboard}
      onSelect={onLeaderboardSelect}
    />
  )
}

function NavBar({ list, selected, onSelect }) {
  return (
    <div className={styles.navbar}>
      {Object.entries(list).map(([key, fullName]) => (
        <button
          key={key}
          className={`${styles.navButton} ${
            selected === key ? styles.active : ""
          }`}
          onClick={() => onSelect(key)}
        >
          {fullName}
        </button>
      ))}
    </div>
  );
}

export default ChallengeNavbar;
