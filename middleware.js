module.exports.isLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnToAfterLogin = req.originalUrl;//after login we have to redirect to the page they were previously on
        req.flash('err', 'You must be signed in')
        return res.redirect('/login')
    }
    next();
}