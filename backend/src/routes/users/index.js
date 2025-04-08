// User-specific routes such as registration and login
const express = require ("express"); 
const controller = require ("../../controllers/users/users"); 
const userChallenges = require("./challenges");
const router = express.Router (); 
const userValidationSchema = require ("../../validators/userValidation"); 
const reportValidationSchema = require('../../validators/reportValidation');


// Registration route
router.post('/register', userValidationSchema, controller.registerUser);

// Login route (using Passport for authentication)
router.post('/login', controller.loginUser);

// Logout route
router.post('/logout', controller.logoutUser);

// // Protected dashboard route for testing
router.get('/status', controller.status);


// Change username or password
router.put('/change-username', userValidationSchema, controller.changeUsername);
router.put('/change-password', userValidationSchema, controller.changePassword);

// Report user
router.post('/report', reportValidationSchema, controller.createReport);

// Delete user
router.delete('/delete-user', controller.deleteUser);

router.use('/challenges', userChallenges);

module.exports = router; 