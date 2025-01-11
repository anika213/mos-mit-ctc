
import { Outlet } from 'react-router-dom';
import styles from './Challenge.module.css';
import Navbar from './Navbar.js';
import Medium from './challenges/RNA/Medium.js'

function Challenge() {
  return (
    <div>
      <Navbar />
      <h1 className={styles.heading}>Challenge Name</h1>
      <p className={styles.paragraphBox}>Challenge Description</p>
      {/* <Outlet /> */}
      <Medium />
    </div>
  );
}

export default Challenge;
