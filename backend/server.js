require("dotenv").config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const routes = require ("./routes"); 
const passport = require('./utils/passportConfig');
const mongoose = require("mongoose");
const MongoStore = require('connect-mongo'); // Persisting sessions

const { PORT=8080, SESSION_SECRET = 'default-secret-key'} = process.env; 

const app = express();

mongoose.connect("mongodb://mos-mit-ctc:local_dev@db:27017")
    .then(() => console.log("Connected to database."))
    .catch((err) => console.log(`Error: ${err}`));

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000', // Our frontend
    credentials: true, // cookies yum
})); 

app.use(
    session({
      resave: false,
      secret: SESSION_SECRET,
      saveUninitialized: false,
      cookie: { 
        httpOnly: true, 
        secure: false, // True in production, false in dev
        sameSite: 'Lax', // This allows the cookie to be sent with cross-origin requests. None in production, lax in dev.
        maxAge: 60000 *60 },
        store: MongoStore.create({
            client: mongoose.connection.getClient()
        })
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(routes); 


app.listen(PORT, () => 
{
    console.log(`REST API listening on port ${PORT}`);
});

// console.log(require('crypto').randomBytes(64).toString('hex'))