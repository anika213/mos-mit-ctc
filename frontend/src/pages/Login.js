
import './Landing.module.css';
import styles from './Login.module.css';
import dna from '../assets/dna.jpg';
import Navbar from './Navbar.js'

// TODO: whne the screen size is smaller, the side image shld be above the form, rn its below..
// TODO: impelement all the functionality.
function Login() {
  return (
    <div className={styles.mainContainer}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.container}>
          <p className={styles.heading}>Login</p>
          <p className={styles.subheading}>Please login to access your challenge progress, save your work, and rank on our leaderboard.</p>
          <form className={styles.form}>
            <input className={styles.input} type="text" id="username" name="username" placeholder='Username' />
            <input className={styles.input} type="password" id="password" name="password" placeholder='Password' />
            <button className={styles.button} type="submit">Login</button>
          </form>
          <button className={styles.guestButton}>Continue as Guest</button>
        </div>
        <div className={styles.sideImageContainer}>
          <img src={dna} alt="Side" className={styles.sideImage} />
        </div>
      </div>
    </div>
  );
}

export default Login;
