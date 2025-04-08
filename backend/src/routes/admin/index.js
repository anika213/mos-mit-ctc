const express = require ("express"); 
const controller = require ("../../controllers/admin//admin.js"); 
const router = express.Router (); 

// Admin page route
router.get("/admin", controller.admin);

// Admin routes
router.get('/users', controller.getAllUsers);
router.get('/challenges', controller.getAllChallenges);
router.get('/delete/users/:id', controller.deleteUserById);
router.get('/delete/challenges/:id', controller.deleteChallengeById);

module.exports = router; 