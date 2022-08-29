const User = require('../models/user');
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const passport = require('passport');


router.get('/register', (req, res) => {
    res.render('users/register');
})
router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome To YelpCamp')
            res.redirect('/campgrounds');
        });

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }

}))

router.get('/login', (req, res) => {
    res.render('users/login');
})
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), catchAsync(async (req, res) => {
    const redirectUrl = req.session.returnToAfterLogin || '/campgrounds';
    //above line might not work in latest version(v0.6.0 ig) so add keepSessionInfo:true in the authenticate method !imp else install v0.5.0 and then remeber to change the logout() code as well
    req.flash('success', 'Welcome Back!');
    delete req.session.returnToAfterLogin;
    res.redirect(redirectUrl);
}))

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash('success', 'Successfully Logged out!')
        res.redirect('/campgrounds')
    });

})
module.exports = router;