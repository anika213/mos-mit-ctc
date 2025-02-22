require("dotenv").config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const routes = require ("./routes"); 
const passport = require('./utils/passportConfig');
const mongoose = require("mongoose");
const MongoStore = require('connect-mongo'); // Persisting sessions


const { BACKEND_PORT, FRONTEND_ADDRESS, SESSION_SECRET, PRODUCTION_STR, DB_URL } = process.env;
const PRODUCTION = PRODUCTION_STR === 'true';
console.log(FRONTEND_ADDRESS)
console.log(process.env)

const app = express();

mongoose.connect(DB_URL)
    .then(() => console.log("Connected to database."))
    .catch((err) => console.log(`Error: ${err}`));

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.use(cors({
    origin: FRONTEND_ADDRESS,
    credentials: true, // cookies yum
})); 

app.use(
    session({
      resave: false,
      secret: SESSION_SECRET,
      saveUninitialized: false,
      cookie: { 
        httpOnly: true, 
        secure: PRODUCTION, // True in production, false in dev
        sameSite: PRODUCTION ? 'none' : 'Lax', // This allows the cookie to be sent with cross-origin requests. None in production, lax in dev.
        maxAge: 60000 *60 },
        store: MongoStore.create({
            client: mongoose.connection.getClient()
        })
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(routes); 

app.listen(BACKEND_PORT, () => {
    console.log(`REST API listening on port ${BACKEND_PORT}`);
});

// console.log(require('crypto').randomBytes(64).toString('hex'))