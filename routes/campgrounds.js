const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const { campgroundSchema } = require('../schemas.js')//Used to validate information


const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',')
        throw new ExpressError(msg, 400)
    } else next();
}

router.get('/', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}))


router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})


router.post('/', validateCampground, catchAsync(async (req, res, next) => {

    // if (!req.body.campground) throw new ExpressError("Invalid Campground Data", 400)
    const campground = req.body.campground;
    const newCampground = new Campground(campground);
    await newCampground.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${newCampground.id}`)
}))

router.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if (!campground) {
        req.flash('error', "Cannot find that campground");
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground })
}))

router.get('/:id/edit', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', "Cannot find that campground");
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground })
}))

router.put('/:id', validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updatedCamp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully Updated Campground')
    res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds')
}))


module.exports = router;