import React, { useState, useEffect } from 'react';
import Navbar from './Navbar.js';
import styles from './Admin.module.css';

const ADMIN_PASSWORD = "SuperSecurePassword";

const Admin = () => {
    const [selectedView, setSelectedView] = useState('Users');
    const [users, setUsers] = useState([]);
    const [challenges, setChallenges] = useState([]);

    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("adminAuthenticated") === "true");

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchChallenges = async () => {
        try {
            const response = await fetch('/api/admin/challenges');
            const data = await response.json();
            setChallenges(data);
        } catch (error) {
            console.error('Error fetching challenges:', error);
        }
    };

    useEffect(() => {
        if (selectedView === 'Users') {
            fetchUsers();
        } else {
            fetchChallenges();
        }
    }, [selectedView]);

    const handleLogin = () => {
        if (password === ADMIN_PASSWORD) {
            localStorage.setItem("adminAuthenticated", "true");
            setIsAuthenticated(true);
        } else {
            alert("Incorrect password!");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("adminAuthenticated");
        setIsAuthenticated(false);
        setPassword("");
    };

    if (!isAuthenticated) {
        return (
            <div className={styles.loginContainer}>
                <h2>Admin Login</h2>
                <input
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Login</button>
            </div>
        );
    }
    
    window.addEventListener("load", handleLogout);
    

    const handleDelete = async (id, type) => {
        try {
            await fetch(`/api/admin/${type}/${id}`, { method: 'DELETE' });
            if (type === 'users') {
                setUsers(users.filter(user => user._id !== id));
            } else {
                setChallenges(challenges.filter(challenge => challenge._id !== id));
            }
        } catch (error) {
            console.error(`Error deleting ${type}:`, error);
        }
    };

    return (
        <div className={styles.mainContainer}>
            <Navbar />
            <div className={styles.content}>
                <h1>Admin Panel</h1>
                <label>View:</label>
                <select value={selectedView} onChange={(e) => setSelectedView(e.target.value)}>
                    <option value="Users">Users</option>
                    <option value="Suggested Challenges">Suggested Challenges</option>
                </select>

                <div className={styles.listContainer}>
                    {selectedView === 'Users' && (
                        <ul>
                            {users.map(user => (
                                <li key={user._id}>
                                    {user.username} - {user.email}
                                    <button onClick={() => handleDelete(user._id, 'users')}>Delete</button>
                                </li>
                            ))}
                        </ul>
                    )}
                    {selectedView === 'Suggested Challenges' && (
                        <ul>
                            {challenges.map(challenge => (
                                <li key={challenge._id}>
                                    {challenge.title}
                                    <button onClick={() => handleDelete(challenge._id, 'challenges')}>Delete</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin;
