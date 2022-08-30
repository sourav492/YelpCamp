const express = require('express');
const router = express.Router({ mergeParams: true });//mergeParams lets this (/campgrounds/:id/reviews) :id param to be merged to this file
const catchAsync = require('../utils/catchAsync')

const { validateReview, isLoggedIn, isReviewOwner } = require('../middleware');
const { createReview, deleteReview } = require('../controllers/reviews');

router.post('/', isLoggedIn, validateReview, catchAsync(createReview));

router.delete('/:reviewId', isLoggedIn, isReviewOwner, catchAsync(deleteReview));

module.exports = router;