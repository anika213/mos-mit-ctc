// User-specific routes such as registration and login
const express = require ("express"); 
const controller = require ("../../controllers/users/userChallenges"); 
const router = express.Router (); 

// Challenges route
router.get('/challenges', controller.challenges);

// Update challenges route
router.post('/challenges', controller.updateChallenges);

// start challenges route
router.post('/start', controller.startHardChallenge);

// Leaderboard route
router.get('/leaderboard', controller.leaderboard);

router.get('/leaderboard/:challenge', controller.challenge_leaderboard);

module.exports = router;