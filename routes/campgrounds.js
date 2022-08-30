const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isOwner, validateCampground } = require('../middleware');
const { index, renderNewForm, createNewCampground, showCampground, renderEditForm, updateCampground, deleteCampground } = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary/index')
const upload = multer({ storage })
router.route('/')
    .get(catchAsync(index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(createNewCampground))

router.get('/new', isLoggedIn, renderNewForm)

router.route('/:id')
    .get(catchAsync(showCampground))
    .put(isLoggedIn, isOwner, upload.array('image'), validateCampground, catchAsync(updateCampground))
    .delete(isLoggedIn, isOwner, catchAsync(deleteCampground))

router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(renderEditForm))

module.exports = router;