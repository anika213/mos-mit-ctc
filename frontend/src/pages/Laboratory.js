import React, { useState } from 'react';
import styles from './Laboratory.module.css';
import buttonStyles from './Buttons.module.css'
import Navbar from './Navbar.js';
import AchievementsModal from './Achievements.js'
import challengeData from '../utils/challengeData.js';
import ChallengePopup from "../components/ChallengePopup.js";
import LabBackground from '../assets/background/lab-background.png';
import ExpertComputer from '../assets/background/expert-computer.png';
import WirelessUnsolved from '../assets/background/wireless-computer-bad.png';
import WirelessSolved from '../assets/background/wireless-computer-good.png';
import RNAComplete from '../assets/background/RNA-bckground-complete.png';
import RNAIncomplete from '../assets/background/RNA-incomplete.png';
import Achievements from '../assets/background/achievements-bckground.png';
import MolecularComplete from '../assets/background/molecular-bckground-complete.png';
import MolecularIncomplete from '../assets/background/molecular-bckground-incomplete.png';

import { useNavigate } from 'react-router-dom';

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
  
  return (
  <>
    
    <div className={styles.mainContainer}>
      <Navbar />

      <div className={styles.imageContainer}>
        <img src={LabBackground} className={styles.mainImage} />

        <button onClick={() => toggleAchievements()} className={styles.achievements}>
          <img src={Achievements} />
        </button>

        <button className={styles.expertComputer} onClick={() => handleOpenPopup("Expert")}>
          <img src={ExpertComputer} />
        </button>

        <button onClick={() => handleOpenPopup("Wireless")} className={styles.wirelessComputer}>
          <img src={WirelessUnsolved} />
        </button>

        <button onClick={() => handleOpenPopup("Molecules")} className={styles.molecules}>
          <img src={MolecularIncomplete} />
        </button>

        <button onClick={() => handleOpenPopup("RNA")} className={styles.RNA}>
          <img src={RNAIncomplete} />
        </button>
      </div>
      <AchievementsModal isOpen={achievmentsIsOpen} onClose={() => toggleAchievements()} />

      {activeChallenge && (
        <ChallengePopup
          challengeKey={activeChallenge}
          onClose={handleClosePopup}
        />
      )}

    </div>

  </>  
  );
}

export default Laboratory;