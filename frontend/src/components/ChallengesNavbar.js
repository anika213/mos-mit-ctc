// ChallengeNavbar.js
import React from "react";
import styles from "./ChallengesNavbar.module.css";

function ChallengeNavbar({ selectedChallenge, onChallengeSelect }) {
  const challenges = ["RNA", "Molecules", "Wireless"];
  
  return (
    <NavBar
      list={challenges}
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
      {list.map((current) => (
        <button
          key={current}
          className={`${styles.navButton} ${
            selected === current ? styles.active : ""
          }`}
          onClick={() => onSelect(current)}
        >
          {current}
        </button>
      ))}
    </div>
  );
}

export default ChallengeNavbar;
