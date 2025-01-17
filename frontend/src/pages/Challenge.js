
import { Outlet } from 'react-router-dom';
import styles from './Challenge.module.css';
import Navbar from './Navbar.js';
import Medium from './challenges/RNA/Medium.js'
import Hard from './challenges/RNA/Hard.js'
import Easy from './challenges/RNA/Easy.js';
import { use } from 'react';
function Challenge() {
  return (
    <div>
      <Navbar />
      <h1 className={styles.heading}>Challenge Name</h1>
      <p className={styles.paragraphBox}>Challenge Description</p>
      {/* <Outlet /> */}
      <div className={styles.challengesContainer}>
                     

      </div>


    </div>
  );
}

export default Challenge;
