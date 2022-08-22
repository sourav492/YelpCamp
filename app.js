const express = require('express');
const app = express();
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Campground = require('./models/campground')
mongoose.connect('mongodb://localhost:27017/yelp-camp')
const path = require('path');
const campground = require('./models/campground');
const { urlencoded } = require('express');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"))
db.once("open", () => {
    console.log("Database connected")
})
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.listen(8080, () => {
    console.log('Connected On Port 8080');
})

app.get('/', (req, res) => {
    res.render('home');
})
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
})

app.post('/campgrounds', async (req, res) => {
    const campground = req.body.campground;
    const newCampground = await Campground.create(campground);
    res.redirect(`/campgrounds/${newCampground.id}`)
})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', { campground })
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground })
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const updatedCamp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${id}`)
})

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
})