const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const { isLoggedIn, isOwner, validateCampground } = require('../middleware');



router.get('/', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}))


router.get('/new', isLoggedIn, (req, res) => {

    res.render('campgrounds/new')
})


router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {

    // if (!req.body.campground) throw new ExpressError("Invalid Campground Data", 400)
    const campground = req.body.campground;
    const newCampground = new Campground(campground);
    newCampground.author = req.user.id;
    await newCampground.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${newCampground.id}`)
}))

router.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
    if (!campground) {
        req.flash('error', "Cannot find that campground");
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground })
}))

router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', "Cannot find that campground");
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground })
}))

router.put('/:id', isLoggedIn, isOwner, validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updatedCamp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully Updated Campground')
    res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:id', isLoggedIn, isOwner, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds')
}))


module.exports = router;