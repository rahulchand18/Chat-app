const express = require('express');
const passport = require('passport');
const { authenticateToken } = require('../../config/token');
const userController = require('./user.controller');
const router = express.Router();

router.post('/login', userController.userLogin);
router.post('/logout', userController.userLogout);
router.post('/createUser', userController.createUser);

module.exports = router;
