const express = require("express");
const router = express.Router();
const rentals = require("../models/rentals-db");
const rentalModel = require("../models/rentalModel");
const path = require("path");


// setup another route to listen on /rentals
router.get("/", (req, res) => {
    rentalModel.find({}, null, { sort: { headline: 1 } })
        .then((data) => {
            let rentalData = data.map(value => value.toObject());
            // console.log("rentalData ####>>> ", rentalData);

            res.render("general/rentals", {
                title: "Rental Page",
                rentals: rentalData
            });
        }).catch(err => {
            console.error("Error retrieving rentals from the database: " + err);
            res.render("general/rentals", {
                errors,
            });
        });
});


router.get("/list", (req, res) => {
    //protect the route, so only the data clerk can access it
    if (req.session.user && req.session.isClerk === true) {
        //clerk is signed in, so load the data
        rentalModel.find({}, null, { sort: { headline: 1 } })
            .then((data) => {
                let rentalData = data.map(value => value.toObject());
                // console.log("rentalData ####>>> ", rentalData);

                res.render("rentals/list", {
                    title: "Rental List",
                    rentals: rentalData
                });
            }).catch(err => {
                console.error("Error retrieving rentals from the database: " + err);
                res.render("rentals/list", {
                    errors,
                    values: req.body,
                });
            });
    }
    else if (req.session.user === undefined) {
        res.redirect("/");
    }
    else {
        //someone else is signed in, so they can't access the data
        res.status(401).send("You are not authorized to access this page");
    }
});


router.get("/edit/:id", (req, res) => {
    // Protect the route so only the data clerk can access it
    if (req.session.user && req.session.isClerk === true){
        // Clerk is signed in, so load the data
        const _id = req.params.id;
        rentalModel.findOne({ _id })
            .then((rental) => {
                res.render("rentals/edit", {
                    rental: rental.toObject(),
                });
            })
            .catch((err) => {
                console.error("Error retrieving the rental from the database: " + err);
                res.redirect("/rentals/list");
            });
    }
    else if (req.session.user === undefined) {
        res.redirect("/");
    } else {
        // Someone else is signed in, so they can't access the data
        res.status(401).send("You are not authorized to access this page");
    }
});

router.post("/edit/:id", (req, res) => {
    if (req.session.isClerk === true) {
        // Clerk is signed in, so load the data
        const _id = req.params.id;
        rentalModel.updateOne({ _id }, req.body)
            .then(() => {
                console.log("Rental updated");
                res.redirect("/rentals/list");
            })
            .catch((err) => {
                console.error("Error updating rental in the database: " + err);
                res.redirect("/");
            });
    } else if (req.session.user === undefined) {
        res.redirect("/");
    } else {
        // Someone else is signed in, so they can't access the data
        res.status(401).send("You are not authorized to access this page");
    }
});



router.get("/remove/:id", (req, res) => {
    // Protect the route so only the data clerk can access it
    if (req.session.user && req.session.isClerk === true) {
        // Clerk is signed in, so load the data
        const _id = req.params.id;
        rentalModel.findOne({ _id })
            .then((rental) => {
                res.render("rentals/remove", {
                    rental: rental.toObject(),
                });
            })
            .catch((err) => {
                console.error("Error retrieving the rental from the database: " + err);
                res.redirect("/rentals/list");
            });
    } else if (req.session.user === undefined) {
        res.redirect("/");
    } else {
        // Someone else is signed in, so they can't access the data
        res.status(401).send("You are not authorized to access this page");
    }
});

router.post("/remove/:id", (req, res) => {
    if (req.session.user && req.session.isClerk === true) {
        // Clerk is signed in, so load the data
        const _id = req.params.id;
        rentalModel.deleteOne({ _id })
            .then(() => {
                console.log("Rental removed");
                res.redirect("/rentals/list");
            })
            .catch((err) => {
                console.error("Error removing rental from the database: " + err);
                res.redirect("/");
            });
    } else if (req.session.user === undefined) {
        res.redirect("/");
    } else {
        // Someone else is signed in, so they can't access the data
        res.status(401).send("You are not authorized to access this page");
    }
});



module.exports = router;