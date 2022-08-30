const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review");
const ImageSchema = new Schema({
    url: String,
    filename: String
})
// Reference https://res.cloudinary.com/dgp27un81/image/upload/v1661869306/YelpCamp/ffp3jansebjqtag4j22f.jpg                       
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload/', '/upload/w_200/')
})
const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: Review // To check if it works rather it is correct or not

        }
    ]
})

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);