const express = require('express');
const router = express.Router({ mergeParams: true });//mergeParams lets this (/campgrounds/:id/reviews) :id param to be merged to this file
const { reviewSchema } = require('../schemas.js')//Used to validate information
const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')

const Campground = require('../models/campground')
const Review = require('../models/review')

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',')
        throw new ExpressError(msg, 400)
    } else next();
}

router.post('/', validateReview, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!')
    res.redirect(`/campgrounds/${campground.id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;