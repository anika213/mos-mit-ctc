import React, { useState } from 'react';
import styles from './Landing.module.css';
import buttonStyles from './Buttons.module.css'
import Navbar from './Navbar.js';
import AchievementsModal from './Achievements.js'
import challengeData from '../utils/challengeData.js';
import ChallengePopup from "../components/ChallengePopup.js";

// TODO: fix the button sizing, kinda weird when changing screen size rn
function Laboratory() {
  const [achievmentsIsOpen, setAchievementsIsOpen] = useState(false);
  const toggleAchievements = () => {
    setAchievementsIsOpen(!achievmentsIsOpen);
  };

  const [activeChallenge, setActiveChallenge] = useState(null);

  const handleOpenPopup = (challengeKey) => {
    setActiveChallenge(challengeKey);
  };

  const handleClosePopup = () => {
    setActiveChallenge(null);
  };

  const challengeKeys = Object.keys(challengeData); 
  
  return (
    <div className={styles.mainContainer}>
      <Navbar />

      <button 
        className={`${styles.button} ${buttonStyles.redButton}`} 
        onClick={() => toggleAchievements()}>
          Achievements
      </button>

      <div className={styles.challengescontainer}>
        <h1 style={{ textAlign: "right" }}>Explore Challenges</h1>
        {challengeKeys.map((key) => (
          <button
            key = {key}
            onClick = {() => handleOpenPopup(key)}
            className={`${styles.challengeButton} ${buttonStyles.redButton}`}>
              {challengeData[key].title}
          </button>
        ))}
      </div>

      {activeChallenge && (
        <ChallengePopup
          challengeKey={activeChallenge}
          onClose={handleClosePopup}
        />
      )}

      <AchievementsModal isOpen={achievmentsIsOpen} onClose={() => toggleAchievements()} />
    </div>

        
  );
}

export default Laboratory;