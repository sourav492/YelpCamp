const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
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

}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.userLogin = async (req, res) => {
    const redirectUrl = req.session.returnToAfterLogin || '/campgrounds';
    //above line might not work in latest version(v0.6.0 ig) so add keepSessionInfo:true in the authenticate method !imp else install v0.5.0 and then remeber to change the logout() code as well
    req.flash('success', 'Welcome Back!');
    delete req.session.returnToAfterLogin;
    res.redirect(redirectUrl);
}

module.exports.userLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash('success', 'Successfully Logged out!')
        res.redirect('/campgrounds')
    });

}