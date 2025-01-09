const passport = require('../utils/passportConfig');
const hashPassword = require('../utils/bcryptHash.js');

const User = require('../models/user.js');

// Register user
// Should probably run a schema validator before continuing the registration process
exports.registerUser = async (req, res) => {
    const { body } = req;
    body.password = hashPassword(body.password);
    const newUser = new User(body);

    try {
        const savedUser = await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'Error registering user' });
    }
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