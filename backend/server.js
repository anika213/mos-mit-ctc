require("dotenv").config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const routes = require ("./routes"); 
const passport = require('./utils/passportConfig');
const mongoose = require("mongoose");

const { PORT=8080, SESSION_SECRET} = process.env; 

const app = express();

mongoose.connect("mongodb://mos-mit-ctc:local_dev@db:27017")
    .then(() => console.log("Connected to database."))
    .catch((err) => console.log(`Error: ${err}`));

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:3000', // Our frontend
    credentials: true, // cookies yum
}

app.use(cors(corsOptions)); 

app.use(
    session({
      resave: false,
      secret: SESSION_SECRET,
      saveUninitialized: false,
      cookie: { 
        httpOnly: true, 
        secure: false, // HTTP requests using Postman
        maxAge: 60000 *60 }
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(routes); 

app.listen(PORT, () => 
{
    console.log(`REST API listening on port ${PORT}`);
});

console.log(require('crypto').randomBytes(64).toString('hex'))