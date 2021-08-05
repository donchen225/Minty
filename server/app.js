const express = require('express');
// var passport = require("passport");
const path = require('path');
const cors = require('cors');

// Connect to MongoDB 
require('../database/db/mongoose');

const app = express();
const publicPath = path.join(__dirname, '..', 'public');

app.use(cors());

// For parsing incoming requests with JSON payloads 
app.use(express.json());

// For parsing application/xwww-
app.use(express.urlencoded({ extended: false }));

// Serve the static files from the React app
app.use(express.static(publicPath));

// app.use(passport.initialize());

// require("../configs/passport");

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Run all route handlers
app.use(require('../database/routers/auth'));
app.use(require('../database/routers/password'));
app.use(require('../database/routers/user'));
app.use(require('../database/routers/transaction'));
app.use(require('../database/routers/plaid'));
app.use(require('../database/routers/account'));
app.use(require('../database/middlewares/errors'));

// Handles any requests that don't match the ones above
app.get('*', (req, res) => { 
    res.sendFile(path.join(publicPath, 'index.html'));
});

module.exports = app;
