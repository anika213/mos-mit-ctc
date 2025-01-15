import './Landing.module.css';
import styles from './Register.module.css';
import dna from '../assets/dna.jpg';
import Navbar from './Navbar.js'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// TODO: whne the screen size is smaller, the side image shld be above the form, rn its below..
// TODO: impelement all the functionality.
function Register() {
    // const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegistration = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
        setError('Passwords do not match.');
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/users/register', {
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
            navigate('/login');
        } else {
            const result = await response.json();

            // Validation errors from express-validator
            if (result.errors) {
                const errorMessages = result.errors.map((error) => error.msg).join('\n');
                setError(errorMessages); // Display all validation errors
            } else {
                setError(result.message || 'Registration failed.');
            }
        }
    } catch(err) {
        console.log(`Error registering: ${err}`);
        setError('Some error occured during registration.');
    }
    }

    return (
    <div className={styles.mainContainer}>
        <Navbar />
        <div className={styles.content}>
        <div className={styles.container}>
            <p className={styles.heading}>Register</p>
            <p className={styles.subheading}>Please register to store your challenge progress and view your rank on our leaderboard.</p>
            <form className={styles.form} onSubmit={handleRegistration}>
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

            <input 
            className={styles.input} 
            type="password" 
            id="passwordConfirmation" 
            name="passwordConfirmation" 
            placeholder='Confirm password' 
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)} />

            <button className={styles.button} type="submit">Register</button>
            </form>

            <button className={styles.guestButton}>Continue as Guest</button>

            {error && <p className={styles.subheading}>{error}</p>}
        </div>
        <div className={styles.sideImageContainer}>
            <img src={dna} alt="Side" className={styles.sideImage} />
        </div>
        </div>
    </div>
    );
}

export default Register;
