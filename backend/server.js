require("dotenv").config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const routes = require ("./routes"); 
const passport = require('./utils/passportConfig');

const { PORT=8080, SESSION_SECRET} = process.env; 

const app = express();

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.use(cors()); 

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