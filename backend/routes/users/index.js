// User-specific routes such as registration and login
const express = require ("express"); 
const controller = require ("../../controllers/users"); 
const router = express.Router (); 
const userValidationSchema = require ("../../validators/userValidation"); 

// Registration route
router.post('/register', userValidationSchema, controller.registerUser);

// Login route (using Passport for authentication)
router.post('/login', controller.loginUser);

// // Protected dashboard route for testing
router.get('/status', controller.status);

// Leaderboard route
router.get('/leaderboard', controller.leaderboard);

module.exports = router; 