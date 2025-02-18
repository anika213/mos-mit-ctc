const express = require ("express"); 

const userRoutes = require ("./users");
const challengeRoutes = require ("./challenges");
const adminRoutes = require ("./admin");

const router = express.Router (); 

router.use ("/users", userRoutes);
router.use ("/challenges", challengeRoutes);
router.use ("/admin", adminRoutes);

module.exports = router; 