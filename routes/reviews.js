const express = require('express');
const router = express.Router({ mergeParams: true });//mergeParams lets this (/campgrounds/:id/reviews) :id param to be merged to this file
const catchAsync = require('../utils/catchAsync')

const Campground = require('../models/campground')
const Review = require('../models/review')
const { validateReview, isLoggedIn, isReviewOwner } = require('../middleware');

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user.id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!')
    res.redirect(`/campgrounds/${campground.id}`);
}))

router.delete('/:reviewId', isLoggedIn, isReviewOwner, catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })//acts as remove 
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;