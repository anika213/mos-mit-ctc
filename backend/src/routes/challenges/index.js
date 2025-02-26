const express = require("express");
const controller = require("../../controllers/challenges/challenges");
const router = express.Router();

// Registration route
router.post("/add", controller.addChallenge);

module.exports = router;
