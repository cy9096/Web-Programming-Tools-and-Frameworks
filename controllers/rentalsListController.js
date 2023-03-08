const express = require("express");
const router = express.Router();
const rentals = require("../models/rentalList");

router.get("/rentals", (req, res) => {
    res.render("general/rentals", {
        rentalsData: rentals.getRentalsByCityAndProvince()
    });
});

router.get("/", (req, res) => {
    res.render("general/home", {
        rentalsData: rentals.getFeaturedRentals()
    })
});


module.exports = router;