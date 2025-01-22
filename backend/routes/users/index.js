// User-specific routes such as registration and login
const express = require ("express"); 
const controller = require ("../../controllers/users"); 
const router = express.Router (); 
const userValidationSchema = require ("../../validators/userValidation"); 

// Registration route
router.post('/register', userValidationSchema, controller.registerUser);

// Login route (using Passport for authentication)
router.post('/login', controller.loginUser);

// Logout route
router.post('/logout', controller.logoutUser);

// // Protected dashboard route for testing
router.get('/status', controller.status);

// Leaderboard route
router.get('/leaderboard', controller.leaderboard);

// Challenges route
router.get('/challenges', controller.challenges);

// Update challenges route
router.post('/challenges', controller.updateChallenges);

module.exports = router; 
