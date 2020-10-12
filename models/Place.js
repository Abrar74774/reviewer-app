const mongoose = require('mongoose');
const geocoder = require('../utils/geocoder');

const PlaceSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Please add a name'],
    },
    location: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String
    },
    reviews: [{
        username: String,
        rating: Number,
        review: String,
        postedAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

PlaceSchema.pre('save', async function (next) {
    const loc = await geocoder.reverse({ lat: this.location.coordinates[0], lon: this.location.coordinates[0] });
    this.location.formattedAddress = loc[0].formattedAddress;
    console.log(`This is ${loc.formattedAddress}`);

    next();
})

module.exports = mongoose.model('Place', PlaceSchema);