const mongoose = require('mongoose');
const cities = require('./cities')
const Campground = require('../models/campground')
const { places, descriptors } = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"))
db.once("open", () => {
    console.log("Database connected")
})

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 90) + 10;
        const camp = new Campground({
            author: '630cd866852b51758f86206c',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dgp27un81/image/upload/v1661863547/YelpCamp/xfr5g2blp3ksohxicpmm.jpg',
                    filename: 'YelpCamp/xfr5g2blp3ksohxicpmm',
                }
            ],
            description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non rerum dignissimos voluptate deserunt nihil nesciunt. Ex, animi temporibus nostrum molestias, tempore nihil earum quaerat, vero numquam sint dolor? Laudantium, commodi?",
            price
        })
        await camp.save()
    }
}
seedDB().then(() => {
    mongoose.connection.close()
});