import React, { useState, useEffect } from 'react';
import styles from './Landing.module.css';
import Navbar from './Navbar.js';
import hmc from '../assets/hmc.png';
import jameel from '../assets/jameel.jpg';
import mit from '../assets/mit.png';
import mos from '../assets/mos.jpg';
import dna from '../assets/dna.jpg';
import { useNavigate } from 'react-router-dom';


const challenges = [
  { id: 1, title: "RNA Splicing", description: "Description for Challenge #1", link: "/challenge/rnasplicing" },
  { id: 2, title: "Molecular Docking", description: "Description for Challenge #2", link: "/challenge/moleculardocking" },
  { id: 3, title: "Wireless Detecting", description: "Description for Challenge #3", link: "/challenge/wirelessdetecting" },
];


// TODO: fix the button sizing, kinda weird when changing screen size rn
// TODO: add the challenges at the bottom as drop down (FAQ style)
function Landing() {
  const navigate = useNavigate();

  function goToChallenge() {
    navigate('/challenge');
  }
  const [activeChallenge, setActiveChallenge] = useState(null);

  const toggleChallenge = (id) => {
    setActiveChallenge(activeChallenge === id ? null : id);
  };

  return (
    <div className={styles.mainContainer}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.container}>
          <p className={styles.subheading}>An interactive exhibit</p>
          <p className={styles.heading}>Exploring Clinical AI</p>
          <br></br>
          <button className={styles.button} onClick={goToChallenge}>Let's start</button>
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
                <a href={challenge.link} className={styles.button} style={{ width: "10%"}}>
                  Try it out!
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Landing;