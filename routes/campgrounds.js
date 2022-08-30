const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const { isLoggedIn, isOwner, validateCampground } = require('../middleware');
const { index, renderNewForm, createNewCampground, showCampground, renderEditForm, updateCampground, deleteCampground } = require('../controllers/campgrounds');

router.route('/')
    .get(catchAsync(index))
    .post(isLoggedIn, validateCampground, catchAsync(createNewCampground))

router.get('/new', isLoggedIn, renderNewForm)

router.route('/:id')
    .get(catchAsync(showCampground))
    .put(isLoggedIn, isOwner, validateCampground, catchAsync(updateCampground))
    .delete(isLoggedIn, isOwner, catchAsync(deleteCampground))

router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(renderEditForm))

module.exports = router;