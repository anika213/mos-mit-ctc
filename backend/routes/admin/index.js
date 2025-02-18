const express = require ("express"); 
const controller = require ("../../controllers/admin"); 
const router = express.Router (); 

// Admin page route
router.get("/admin", controller.admin);

// Admin routes
router.get('/users', adminController.getAllUsers);
router.get('/challenges', adminController.getAllChallenges);
router.delete('/users/:id', adminController.deleteUserById);
router.delete('/challenges/:id', adminController.deleteChallengeById);

module.exports = router; 