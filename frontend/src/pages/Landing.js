import React from 'react';
import styles from './Landing.module.css';
import buttonStyles from './Buttons.module.css'
import Navbar from './Navbar.js';
import hmc from '../assets/hmc.png';
import jameel from '../assets/jameel.jpg';
import mit from '../assets/mit.png';
import mos from '../assets/mos.jpg';
import dna from '../assets/dna.jpg';
import { useNavigate } from 'react-router-dom';

// TODO: fix the button sizing, kinda weird when changing screen size rn
// TODO: add the challenges at the bottom as drop down (FAQ style)
function Landing() {
  const navigate = useNavigate();

  return (
    <div className={styles.mainContainer}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.container}>
          <p className={styles.subheading}>An interactive exhibit</p>
          <p className={styles.heading}>Exploring Clinical AI</p>
          <br></br>
          <button className={`${styles.button} ${buttonStyles.redButton}`} onClick={() => navigate("/laboratory?firstVisit")}>Get Started</button>
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
    </div>

        
  );
}

export default Landing;