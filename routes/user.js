const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const passport = require('passport');
const { renderRegister, renderLogin, register, userLogin, userLogout } = require('../controllers/users');

router.route('/register')
    .get(renderRegister)
    .post(catchAsync(register));

router.route('/login')
    .get(renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), catchAsync(userLogin));

router.get('/logout', userLogout);

module.exports = router;