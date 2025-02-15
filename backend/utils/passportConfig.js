const passport = require("passport"); // Authentication handling
const LocalStrategy = require("passport-local").Strategy; // Local hosting of passwords with Passport
const CustomStrategy = require("passport-custom").Strategy; // Custom strategy for anonymous users
const bcrypt = require("bcryptjs"); // Encryption of passwords with salting
const User = require("../models/user.js");

// Set up Passport local strategy for authentication
// Do we require username, email, or password to sign in? Or any of the above?
// We probably want a strategies folder if we plan to add oauth in addition to local.
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username, anonymous: { $ne: true } }).select("username password");
      if (!user)
        return done(null, false, {
          message: "Username or password is incorrect",
        });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return done(null, false, {
          message: "Username or password is incorrect",
        });
      // No error; User object from database
      return done(null, user);
    } catch (err) {
      done(err, false);
    }
  })
);

async function createAnonymousUser(req, done) {
  try {
    const anonUser = new User({
      anonymous: true,
      username: `Guest_${Date.now()}`,
      score: 0,
      challenges: {},
    });
    await anonUser.save();
    // Store anonymous user id in session
    req.session.anonymousUserId = anonUser._id;
    return done(null, anonUser);
  } catch (err) {
    return done(err);
  }
}

passport.use('anonymous',
  new CustomStrategy(function (req, done) {
    if (req.session.anonymousUserId) {
      User.findById(req.session.anonymousUserId, (err, user) => {
        if (err) return done(err);
        if (user) return done(null, user);
        return createAnonymousUser(req, done);
      });
    } else {
      return createAnonymousUser(req, done);
    }
  })
);

// Stores the authenticated user in the session. Not the entire object since that has privacy concerns.
passport.serializeUser((user, done) => {
  console.log(`Serializing: ${user}`);
  done(null, user.id);
});

// Uses the session id to attach the corresponding user object to req.user
passport.deserializeUser(async (id, done) => {
  // Search for user in database.
  try {
    console.log(`Deserializing user with id: ${id}`);
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");
    console.log(`Deserialized user: ${user}`);
    done(null, user); // Reattach the full user object to req.user
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
