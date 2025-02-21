const passport = require("../utils/passportConfig.js");
const hashPassword = require("../utils/bcryptHash.js");

const User = require("../models/user.js");
const { validationResult } = require("express-validator");

exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, ...rest } = req.body;
  const hashedPassword = hashPassword(password);
  const newUser = new User({
    username,
    password: hashedPassword,
    ...rest,
  });

  try {
    if (req.session.challenges) {
      newUser.challenges = req.session.challenges;
      newUser.score = Object.keys(req.session.challenges).length;

      delete req.session.challenges;
    }

    if (req.session.startTimes) {
      newUser.startTimes = req.session.startTimes;

      delete req.session.startTimes;
    }

    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully!", user: newUser });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Username is already taken." });
    }
    res.status(500).json({ message: "Error registering user" });
  }
};

// Login user
exports.loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err); // If there's an error, pass it to the next middleware (error handler)
    if (!user) return res.status(401).json({ message: info.message }); // Failed login, send error message

    // clear session stored challenges and start times
    if (req.session.challenges) {
      delete req.session.challenges;
    }
    if (req.session.startTimes) {
      delete req.session.startTimes;
    }

    // Successfully authenticated, log the user in
    req.login(user, (err) => {
      if (err) return next(err); // If there's an error while logging in, pass it to the next middleware

      // Send a success response to the frontend (rather than redirecting)
      return res.json({ message: "Login successful", user: req.user });
    });
  })(req, res, next); // Pass control to passport authenticate
};

// Logout user
exports.logoutUser = (req, res) => {
  if (req.isAuthenticated()) {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Error destroying session" });
        }
        res.status(200).json({ message: "Logout successful" });
      });
    });
  } else {
    return res.status(400).json({ message: "No user is logged in" });
  }
};

// Status
exports.status = (req, res) => {
  if (req.isAuthenticated()) {
    return res.json(req.user);
  } else {
    return res.status(401).json({ message: "Not authenticated" });
  }
};

// Change username
exports.changeUsername = async (req, res) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    return res.status(400).json({ errors: validationErrors.array() });
  }

  const { username } = req.body;

  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username;

    await user.save();

    return res.status(200).json({ message: "Username updated successfully" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    console.log(err); // Needs to be sent to frontend eventually
    return res.status(500).json({ message: "Error updating username" });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    return res.status(400).json({ errors: validationErrors.array() });
  }

  const { password } = req.body;

  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = hashPassword(password);

    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.log(err); // Needs to be sent to frontend eventually
    return res.status(500).json({ message: "Error updating password" });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error deleting session" });
      }
      req.logout(() => {
        return res
          .status(200)
          .json({ message: "User deleted and logged out successfully" });
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error deleting user" });
  }
};

// CHALLENGES STUFF

// Leaderboard
exports.leaderboard = async (req, res) => {
  try {
    const users = await User.find({})
      .sort({ score: -1 })
      .limit(100)
      .select("username score"); // Sort by score descending
    return res.json(users);
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    return res.status(500).send("Internal Server Error");
  }
};

exports.challenge_leaderboard = async (req, res) => {
  try {
    const { challenge } = req.params;
    if (!challenge_list.includes(challenge)) {
      return res.status(400).json({ message: "Invalid challenge" });
    }
    const users = await User.find({
      [`challenges.${challenge}`]: { $exists: true },
    })
      .sort({ [`challenges.${challenge}`]: 1 })
      .limit(100)
      .select(`username challenges`); // Sort by score descending

    const userJson = users.map((user) => ({
      username: user.username,
      score: user.challenges ? user.challenges.get(challenge) : null,
    }));
    return res.json(userJson);
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    return res.status(500).send("Internal Server Error");
  }
};

const challenge_list = [
  "RNA-Easy",
  "RNA-Medium",
  "RNA-Hard",
  "Molecules-Easy",
  "Molecules-Medium",
  "Molecules-Hard",
  "Wireless-Easy",
  "Wireless-Medium",
  "Wireless-Hard",
];

const hard_list = ["RNA-Hard", "Molecules-Hard", "Wireless-Hard"];

exports.challenges = (req, res, next) => {
  if (req.isAuthenticated()) {
    User.findById(req.user._id)
      .select("challenges")
      .then((user) => res.json(user.challenges))
      .catch((err) => {
        console.error("Error fetching challenges:", err);
        res.status(500).send("Internal Server Error");
      });
  } else {
    res.json(req.session.challenges || {});
  }
};

exports.updateChallenges = async (req, res, next) => {
  let { challenge, time } = req.body;
  if (!challenge_list.includes(challenge)) {
    return res.status(400).json({ message: "Invalid challenge" });
  }
  if (!time || isNaN(time) || time < 0) {
    return res.status(400).json({ message: "Invalid time" });
  }

  const updateChallengeDB = async (user) => {
    // require that if its a hard challenge to have the start time?
    if (user.startTimes.has(challenge)) {
      time = Math.floor(new Date() - user.startTimes.get(challenge));
      user.startTimes.delete(challenge);
    }
    if (!user.challenges.has(challenge)) {
      user.challenges.set(challenge, time);
      user.score += 1;
    } else {
      user.challenges.set(
        challenge,
        Math.min(user.challenges.get(challenge), time)
      );
    }
    await user.save();
    return res.json(user.challenges);
  };

  // store it in the user's session instead
  const updateChallengeSession = () => {
    if (!req.session.challenges) {
      req.session.challenges = {};
    }
    if (!req.session.challenges[challenge]) {
      req.session.challenges[challenge] = time;
    } else {
      req.session.challenges[challenge] = Math.min(
        req.session.challenges[challenge],
        time
      );
    }

    return res.json(req.session.challenges);
  };

  if (!req.isAuthenticated()) {
    return updateChallengeSession();
  } else {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return updateChallengeDB(user);
    } catch (err) {
      console.error("Error updating challenges:", err);
      return res.status(500).send("Internal Server Error");
    }
  }
};

exports.startHardChallenge = async (req, res, next) => {
  try {
    const { challenge } = req.body;
    const startChallengeDB = async (user) => {
      if (user.startTimes.has(challenge)) {
        return res.status(400).json({ message: "Challenge already started" });
      }

      if (!hard_list.includes(challenge)) {
        return res.status(400).json({ message: "Invalid challenge" });
      }

      user.startTimes.set(challenge, new Date());
      await user.save();

      return res
        .status(200)
        .json({ message: "Challenge started successfully" });
    };

    const startChallengeSession = () => {
      if (!req.session.startTimes) {
        req.session.startTimes = {};
      }
      if (req.session.startTimes[challenge]) {
        return res.status(400).json({ message: "Challenge already started" });
      }
      req.session.startTimes[challenge] = new Date();
      return res
        .status(200)
        .json({ message: "Challenge started successfully" });
    };

    if (!req.isAuthenticated()) {
      return startChallengeSession();
    } else {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return startChallengeDB(user);
    }
  } catch (err) {
    console.error("Error starting challenge:", err);
    return res.status(500).send("Internal Server Error");
  }
};
