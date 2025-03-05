const User = require("../../models/user.js");
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


