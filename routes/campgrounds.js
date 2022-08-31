const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isOwner, validateCampground } = require('../middleware');
const Campground = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary/index')
const upload = multer({ storage })


router.route('/')
    .get(catchAsync(Campground.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(Campground.createNewCampground))

router.get('/new', isLoggedIn, Campground.renderNewForm)

router.route('/:id')
    .get(catchAsync(Campground.showCampground))
    .put(isLoggedIn, isOwner, upload.array('image'), validateCampground, catchAsync(Campground.updateCampground))
    .delete(isLoggedIn, isOwner, catchAsync(Campground.deleteCampground))

router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(Campground.renderEditForm))

module.exports = router;