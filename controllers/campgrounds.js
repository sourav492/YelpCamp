//Controller files contain the logic that helps in rendering views by using models(MVC architecture Usage)

const Campground = require('../models/campground')
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createNewCampground = async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError("Invalid Campground Data", 400)
    const campground = req.body.campground;
    const newCampground = new Campground(campground);
    newCampground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    newCampground.author = req.user.id;
    console.log(newCampground);
    await newCampground.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${newCampground.id}`)
}

module.exports.showCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
    if (!campground) {
        req.flash('error', "Cannot find that campground");
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground })
}

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', "Cannot find that campground");
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground })
}


module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;
    console.log(req.body)
    const updatedCamp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    updatedCamp.images.push(...imgs)
    await updatedCamp.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await updatedCamp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully Updated Campground')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds')
}