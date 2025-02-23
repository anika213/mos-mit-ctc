import React, { useState } from 'react';
import styles from './Landing.module.css';
import buttonStyles from './Buttons.module.css'
import Navbar from './Navbar.js';
import hmc from '../assets/hmc.png';
import jameel from '../assets/jameel.jpg';
import mit from '../assets/mit.png';
import mos from '../assets/mos.jpg';
import dna from '../assets/dna.jpg';
import AchievementsModal from './Achievements.js'
import { useNavigate } from 'react-router-dom';



const challenges = [
  { id: 1, title: "RNA Splicing", description: "Description for Challenge #1", link: "/challenge/RNA" },
  { id: 2, title: "Molecular Docking", description: "Description for Challenge #2", link: "/challenge/Molecules" },
  { id: 3, title: "Wireless Detecting", description: "Description for Challenge #3", link: "/challenge/Wireless" },
];


// TODO: fix the button sizing, kinda weird when changing screen size rn
// TODO: add the challenges at the bottom as drop down (FAQ style)
function Landing() {
  const navigate = useNavigate();

  const handleChallengeClick = (link) => {
    navigate(link); 
  };
  const [activeChallenge, setActiveChallenge] = useState(null);

  const toggleChallenge = (id) => {
    setActiveChallenge(activeChallenge === id ? null : id);
  };

  const [achievmentsIsOpen, setAchievementsIsOpen] = useState(false);
  const toggleAchievements = () => {
    setAchievementsIsOpen(!achievmentsIsOpen);
  };

  return (
    <div className={styles.mainContainer}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.container}>
          <p className={styles.subheading}>An interactive exhibit</p>
          <p className={styles.heading}>Exploring Clinical AI</p>
          <br></br>
          <button className={`${styles.button} ${buttonStyles.redButton}`} onClick={() => handleChallengeClick("/challenge/RNA")}>Get Started</button>
          <button className={`${styles.button} ${buttonStyles.redButton}`} onClick={() => toggleAchievements()}>Achievements</button>
          <br></br>
          <div className={styles.imageContainer}>
            <img src={mos} alt="MOS" className={styles.logos} />
            <img src={mit} alt="MIT" className={styles.logos} />
            <img src={jameel} alt="Jameel" className={styles.logos} />
            <img src={hmc} alt="HMC" className={styles.logos} />
          </div>
        </div>
        <div className={styles.sideImageContainer}>
          <img src={dna} alt="Side" className={styles.sideImage} />
        </div>
      </div>
      <div>
        <div className={styles.mobileImageContainer}>
          <img src={mos} alt="MOS" className={styles.logos} />
          <img src={mit} alt="MIT" className={styles.logos} />
          <img src={jameel} alt="Jameel" className={styles.logos} />
          <img src={hmc} alt="HMC" className={styles.logos} />
        </div>
      </div>
      <div className={styles.challengescontainer}>
        <h1 style={{ textAlign: "right" }}>Explore Challenges</h1>
        {challenges.map((challenge) => (
          <div key={challenge.id} style={{ marginBottom: "10px" }}>
            <div
              className={styles.closedchallenge}
              onClick={() => toggleChallenge(challenge.id)}
            >
              <span><h2>{challenge.title}</h2></span>
              <span>{activeChallenge === challenge.id ? "▲" : "▼"}</span>
            </div>
            {activeChallenge === challenge.id && (
              <div className={styles.openchallenge}>
                <p>{challenge.description}</p>
                <br/>
                <button onClick={() => handleChallengeClick(challenge.link)} className={`${styles.challengeButton} ${buttonStyles.redButton}`}>
                  Try it out!
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <AchievementsModal isOpen={achievmentsIsOpen} onClose={() => toggleAchievements()} />
    </div>

        
  );
}

export default Landing;