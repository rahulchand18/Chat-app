const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const passport = require('passport');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(require('express-session')({ secret: process.env.JWT_SECRET, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

module.exports = app;
