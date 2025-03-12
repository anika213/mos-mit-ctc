import React, { useState } from 'react';
import styles from './Laboratory.module.css';
import buttonStyles from './Buttons.module.css'
import Navbar from './Navbar.js';
import AchievementsModal from './Achievements.js'
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

// const challenges = [
//     { id: 1, title: "RNA Splicing", description: "Description for Challenge #1", link: "/challenge/RNA" },
//     { id: 2, title: "Molecular Docking", description: "Description for Challenge #2", link: "/challenge/Molecules" },
//     { id: 3, title: "Wireless Detecting", description: "Description for Challenge #3", link: "/challenge/Wireless" },
// ];

// TODO: fix the button sizing, kinda weird when changing screen size rn
// TODO: add the challenges at the bottom as drop down (FAQ style)
function Landing() {
  const navigate = useNavigate();

  const [achievmentsIsOpen, setAchievementsIsOpen] = useState(false);
  const toggleAchievements = () => {
    setAchievementsIsOpen(!achievmentsIsOpen);
  };

  const handleChallengeClick = (link) => {
    navigate(link); 
  };
  const [activeChallenge, setActiveChallenge] = useState(null);

  const toggleChallenge = (id) => {
    setActiveChallenge(activeChallenge === id ? null : id);
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

        <button className={styles.expertComputer}>
          <img src={ExpertComputer} />
        </button>

        <button onClick={() => handleChallengeClick("/challenge/Wireless/StageOne")} className={styles.wirelessComputer}>
          <img src={WirelessUnsolved} />
        </button>

        <button onClick={() => handleChallengeClick("/challenge/Wireless/StageOne")} className={styles.wirelessComputer}>
          <img src={WirelessUnsolved} />
        </button>

        <button onClick={() => handleChallengeClick("/challenge/Molecules/StageOne")} className={styles.molecules}>
          <img src={MolecularIncomplete} />
        </button>

        <button onClick={() => handleChallengeClick("/challenge/RNA/StageOne")} className={styles.RNA}>
          <img src={RNAIncomplete} />
        </button>
      </div>
      <AchievementsModal isOpen={achievmentsIsOpen} onClose={() => toggleAchievements()} />

    </div>

  </>  
  );
}

export default Landing;