const express = require ("express"); 

const userRoutes = require ("./users");
const challengeRoutes = require ("./challenges");

const router = express.Router (); 

router.use ("/users", userRoutes);
router.use ("/challenges", challengeRoutes);

module.exports = router; 