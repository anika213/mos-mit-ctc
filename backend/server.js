require("dotenv").config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const routes = require ("./routes"); 

const { PORT=8080, SESSION_SECRET} = process.env; 

const app = express();

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.use(cors()); 
app.timeout = 120000; // Set the timeout to 2 minutes

app.use(
    session({
      resave: false,
      secret: SESSION_SECRET,
      saveUninitialized: false,
      cookie: { httpOnly: true, secure: true }
    })
  );

app.use (routes); 

app.listen(PORT, () => 
{
    console.log(`REST API listening on port ${PORT}`);
});

console.log(require('crypto').randomBytes(64).toString('hex'))