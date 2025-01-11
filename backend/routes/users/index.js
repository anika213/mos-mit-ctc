// User-specific routes such as registration and login
const express = require ("express"); 
const controller = require ("../../controllers/users"); 
const router = express.Router (); 

// Registration route
router.post('/register', controller.registerUser);

// Login route (using Passport for authentication)
router.post('/login', controller.loginUser);

// // Protected dashboard route for testing
router.get('/status', controller.status);

module.exports = router; 