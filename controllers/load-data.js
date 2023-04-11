const express = require("express");
const router = express.Router();
const rentals = require("../models/rentals-db");
//const userModel = require("../models/userModel");
const rentalModel = require("../models/rentalModel");
//const mongoose = require("mongoose");
//const bcrypt = require("bcryptjs");

router.get("/rentals", (req, res) => {
    // protect the route, so only the data clerk can access it
    if (req.session.isClerk) {
        const message = {};

        rentalModel.count().then((count) => {
            if (count === 0) {
                // load the data
                rentalModel.insertMany(rentals.getAllRentals())
                    .then(() => {
                        res.render("load-data/rentals", {
                            message: "Successfully loaded data! Added rentals to the database"
                        });
                    })
                    .catch((err) => {
                        res.send("Could not insert documents into the database: " + err);
                    });
            } else {
                res.render("load-data/rentals", {
                    message: "Data already loaded. Rentals already in the database"
                });
            }
        }).catch((err) => {
            res.send("Error checking rental count: " + err);
        });
    } else {
        // someone else is signed in, so they can't access the data
        res.status(401).send("You are not authorized to access this page");
    }
});
/*===========================================================================================*/
module.exports = router;