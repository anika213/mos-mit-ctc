const userModel = require("../models/user");

const bcrypt = require('bcryptjs'); // Encryption of passwords with salting
const passport = require('../utils/passportConfig');

const { users } = require("../data/mockDB.js"); // Temporary since we don't have mongoDB connected yet.

// Register user
exports.registerUser = async (req, res) => {
    const { username, password } = req.body;
    const existingUser = users.find(u => u.username === username);
    // We also need to check if email (or maybe even phone numbers) are already taken.
    // We also need to check if the inputted pw is valid (x letters, y special char, etc.)

    if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { id: users.length + 1, username, password: hashedPassword }; // Might want to use a differenct ID scheme but this works for now.
    users.push(user); // Save user

    res.status(201).json({ message: 'User registered successfully!' });
};

// Login user
exports.loginUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err); // If there's an error, pass it to the next middleware (error handler)
        if (!user) return res.status(401).json({ message: info.message }); // Failed login, send error message

        // Successfully authenticated, log the user in
        req.login(user, (err) => {
            if (err) return next(err); // If there's an error while logging in, pass it to the next middleware

            // Redirect to dashboard after successful login
            return res.redirect('/users/dashboard');
        });
    })(req, res, next); // Pass control to passport authenticate
};

// Dashboard
exports.dashboard = (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ message: `Welcome, ${req.user.username}! You've made it the dashboard.` });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};