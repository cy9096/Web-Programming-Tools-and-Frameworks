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
    if (req.session.isClerk === true) {
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
    else {
        //someone else is signed in, so they can't access the data
        res.status(401).send("You are not authorized to access this page");
    }
});


router.get("/add", (req, res) => {
    //protect the route, so only the data clerk can access it
    if (req.session.isClerk === true) {
        //clerk id signed in, so load the data
        res.render("rentals/add");
    }
    else {
        //someone else is signed in, so they can't access the data
        res.status(401).send("You are not authorized to access this page");
    }
});

router.post("/add", (req, res) => {
    if (req.session.isClerk) {
        //clerk id signed in, so load the data
        let rental = { headline, numSleeps, numBedrooms, numBathrooms, pricePerNight, city, province, featuredRental } = req.body;
        const errors = {};
        console.log("rental =>", rental);
        const allowedExtensions = ["jpg", "jpeg", "gif", "png"];
        if (req.files?.rentalPic) {
            if (!allowedExtensions.includes(req.files.rentalPic.name.split(".").pop())) {
                errors.rentalPic = "Image must be a jpg, jpeg, gif, or png file";
                res.render("rentals/add", {
                    errors,
                    rental
                });
            }
        }

        console.log("req.files =>", req.files);

        const newRental = new rentalModel({
            headline: headline,
            numSleeps: numSleeps,
            numBedrooms: numBedrooms,
            numBathrooms: numBathrooms,
            pricePerNight: pricePerNight,
            city: city,
            imageUrl: "na",
            province: province,
            featuredRental: featuredRental === "on" ? true : false,
        });
        console.log("newRental =>", newRental);
        newRental.save()
            .then((rentalSaved) => {
                console.log("Rental saved to the database: " + rentalSaved.headline);
                let uniqueName = `rental_${rentalSaved._id}${path.parse(req.files.rentalPic.name).ext}`;
                console.log("uniqueName =>", uniqueName);
                req.files.rentalPic.mv(`assets/images/${uniqueName}`)
                    .then(() => {
                        rentalModel.updateOne({ _id: rentalSaved._id }, { imageUrl: uniqueName })
                            .then(() => {
                                res.redirect("/rentals/list");
                                console.log("Image saved to the assets/images folder");
                            })
                            .catch((err) => {
                                console.error("Error updating the rental with the image name: " + err);
                                res.redirect("/rentals/list");
                            });
                    })
                    .catch((err) => {
                        console.error("Error saving the image to the assets/images folder: " + err);
                        res.redirect("/rentals/list");
                    });
            }).catch((err) => {
                console.error("Error saving the rental to the database ***: " + err);
                res.render("rentals/add", {
                    errors,
                    rental,
                });
            });
    }
    else {
        //someone else is signed in, so they can't access the data
        res.status(401).send("You are not authorized to access this page");
    }
});

router.get("/edit/:id", (req, res) => {
    // Protect the route so only the data clerk can access it
    if (req.session.isClerk) {
        // Clerk is signed in, so load the data
        const _id = parseInt(req.params.id);
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
    } else {
        // Someone else is signed in, so they can't access the data
        res.status(401).send("You are not authorized to access this page");
    }
});

router.post("/edit/:id", (req, res) => {
    if (req.session.isClerk) {
        // Clerk is signed in, so load the data
        const _id = parseInt(req.params.id);
        rentalModel.updateOne(({ _id }, req.body))
            .then(() => {
                console.log("Rental updated");
                res.redirect("/rentals/list");
            })
            .catch((err) => {
                console.error("Error updating rental in the database: " + err);
                res.redirect("/");
            });
    } else {
        // Someone else is signed in, so they can't access the data
        res.status(401).send("You are not authorized to access this page");
    }
});



router.get("/remove/:id", (req, res) => {
    // Protect the route so only the data clerk can access it
    if (req.session.isClerk) {
        // Clerk is signed in, so load the data
        const _id = parseInt(req.params.id);
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
    } else {
        // Someone else is signed in, so they can't access the data
        res.status(401).send("You are not authorized to access this page");
    }
});

router.post("/remove/:id", (req, res) => {
    if (req.session.isClerk) {
        // Clerk is signed in, so load the data
        const _id = parseInt(req.params.id);
        rentalModel.deleteOne({ _id })
            .then(() => {
                console.log("Rental removed");
                res.redirect("/rentals/list");
            })
            .catch((err) => {
                console.error("Error removing rental from the database: " + err);
                res.redirect("/");
            });
    } else {
        // Someone else is signed in, so they can't access the data
        res.status(401).send("You are not authorized to access this page");
    }
});




module.exports = router;