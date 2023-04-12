const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const rentals = require("../models/rentals-db");

const rentalSchema = new mongoose.Schema({
    headline: { type: String, required: true },
    numSleeps: { type: Number, required: true },
    numBedrooms: { type: Number, required: true },
    numBathrooms: { type: Number, required: true },
    pricePerNight: { type: Number, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    imageUrl: { type: String, required: true },
    featuredRental: { type: Boolean, required: true }
});

const rentalModel = mongoose.model("rentals", rentalSchema);

module.exports = rentalModel;