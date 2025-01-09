const passport = require('passport'); // Authentication handling
const LocalStrategy = require('passport-local').Strategy; // Local hosting of passwords with Passport
const bcrypt = require('bcryptjs'); // Encryption of passwords with salting
const User = require('../models/user.js')

// Set up Passport local strategy for authentication
// Do we require username, email, or password to sign in? Or any of the above?
// We probably want a strategies folder if we plan to add oauth in addition to local.
passport.use(new LocalStrategy((username, password, done) => {
    const user = users.find(u => u.username === username); // Check if user exists
    if (!user) return done(null, false, { message: 'Incorrect username' });
    
    bcrypt.compare(password, user.password, (err, isMatch) => {
        // If there is an error, pass it to the done callback
        if (err) return done(err); 
        // If passwords don't match, there is no error and the authentication is false
        if (!isMatch) return done(null, false, { message: 'Incorrect password' }); 
        // No error; User object from database
        return done(null, user); 
    })
}))

// Stores the authenticated user in the session. Not the entire object since that has privacy concerns.
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Uses the session id to attach the corresponding user object to req.user
passport.deserializeUser((id, done) => {
    // Search for user in database.
    console.log(users); // Testing purposes
    const user = users.find((u) => u.id === id);
    if (!user) return done(new Error("User not found"));
    done(null, user); // Reattach the full user object to req.user
});

module.exports = passport;