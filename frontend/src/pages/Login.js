import styles from './Login.module.css';
import buttonStyles from './Buttons.module.css'
import dna from '../assets/dna.jpg';
import Navbar from './Navbar.js'
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.js';
import { InputAdornment, IconButton, Input } from '@mui/material';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// TODO: whne the screen size is smaller, the side image shld be above the form, rn its below..
// TODO: impelement all the functionality.
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); 
  const location = useLocation();
  const challengeProgress = location.state?.challengeProgress || null;


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(process.env.REACT_APP_API_URL + '/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          challengeProgress
        }),
        credentials: 'include'
      });

      if (response.ok) {
        const userData = await response.json(); // Get user data from response
        login(userData); // Update the auth context with the logged in user
        navigate('/');
      } else {
        const result = await response.json();
        setError(result.message || 'Login failed.');
      }
    } catch(err) {
      console.log(`Error logging in: ${err}`);
      setError('Some error');
    }
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className={styles.mainContainer}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.container}>
          <p className={styles.heading}>Login</p>
          <p className={styles.subheading}>Please login to access your challenge progress, save your work, and rank on our leaderboard.</p>
          <form className={styles.form} onSubmit={handleLogin}>
            <Input 
            className={styles.input} 
            type="text" 
            id="username" 
            name="username" 
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
            disableUnderline={true} 
            autoComplete="username"/>

            <Input
              className={styles.input}
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disableUnderline={true}
              autoComplete="current-password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </IconButton>
                </InputAdornment>
              }
            />

            <button  type="submit" className={`${styles.button} ${buttonStyles.redButton}`}>Login</button>
          </form>

          {error && <p className={styles.subheading}>{error}</p>}

          <Link to="/register" className={styles.registerButton}>Register</Link>

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
