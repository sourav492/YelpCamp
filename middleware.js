const Campground = require('./models/campground')
const Review = require('./models/review')
const { campgroundSchema, reviewSchema } = require('./schemas.js')//Used to validate information
const ExpressError = require('./utils/ExpressError')

module.exports.isLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.returnToAfterLogin = req.originalUrl;//after login we have to redirect to the page they were previously on
        req.flash('err', 'You must be signed in')
        return res.redirect('/login')
    }
    next();
}
//Campground MiddleWare
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',')
        throw new ExpressError(msg, 400)
    } else next();
}
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user.id)) {
        req.flash('error', 'Not Authorised to do that')
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

//Reviews MiddleWare
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',')
        throw new ExpressError(msg, 400)
    } else next();
}
module.exports.isReviewOwner = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user.id)) {
        req.flash('error', 'Not Authorised to do that')
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}