import styles from './Login.module.css';
import dna from '../assets/dna.jpg';
import Navbar from './Navbar.js'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// TODO: whne the screen size is smaller, the side image shld be above the form, rn its below..
// TODO: impelement all the functionality.
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
        credentials: 'include'
      });

      if (response.ok) {
        navigate('/landing');
      } else {
        const result = await response.json();
        setError(result.message || 'Login failed.');
      }
    } catch(err) {
      console.log(`Error logging in: ${err}`);
      setError('Some error');
    }
  }


  return (
    <div className={styles.mainContainer}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.container}>
          <p className={styles.heading}>Login</p>
          <p className={styles.subheading}>Please login to access your challenge progress, save your work, and rank on our leaderboard.</p>
          <form className={styles.form} onSubmit={handleLogin}>
            <input 
            className={styles.input} 
            type="text" 
            id="username" 
            name="username" 
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)} />

            <input 
            className={styles.input} 
            type="password" 
            id="password" 
            name="password" 
            placeholder='Password' 
            value={password}
            onChange={(e) => setPassword(e.target.value)} />

            <button className={styles.button} type="submit">Login</button>
          </form>

          {error && <p className={styles.subheading}>{error}</p>}

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
