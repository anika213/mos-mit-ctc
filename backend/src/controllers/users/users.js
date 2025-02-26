const passport = require("../../utils/passportConfig.js");
const hashPassword = require("../../utils/bcryptHash.js");

const User = require("../../models/user.js");
const Report = require('../../models/report.js');
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

// Create a user report
exports.createReport = async (req, res) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
  }

  const { reportee, reason } = req.body;

  try {
      const report = new Report({
          reporter: req.user._id,
          reportee,
          reason,
      });

      await report.save();
      
      return res.status(201).json({ message: 'Report submitted successfully!' });

  } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Error submitting report' });
  }
};


