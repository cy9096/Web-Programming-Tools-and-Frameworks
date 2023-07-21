const express = require("express");
const router = express.Router();
const rentals = require("../models/rentals-db");
const userModel = require("../models/userModel");
const rentalModel = require("../models/rentalModel");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Cart = require("../models/cartModel");

// //find rental by id
// const findRentalById = (_id) => {
//     return rentals.find(rental => rental.id === _id);
// }


// setup a 'route' to listen on the default url path (http://localhost)
router.get("/", (req, res) => {
    rentalModel.find({ featuredRental: true })
        .then(data => {
            const featuredRentals = data.map(values => {
                let rental = values.toObject();
                rental.pricePerNight = parseFloat(rental.pricePerNight).toFixed(2);
                return rental;
            });
            res.render("general/home", {
                featuredRentals
            });
        })
        .catch(err => {
            res.send("Error loading featured rentals: " + err);
        });
});


// setup another route to listen on /log-in
router.get("/log-in", (req, res) => {
    res.render("general/log-in", {
        title: "Log in page"
    });
});


// setup another route to listen on /logout
router.get("/logout", (req, res) => {
    //clear the session from memory
    req.session.destroy();
    res.redirect("/log-in");

});



// setup another route to listen on /cart
router.get("/cart", (req, res) => {
    if (req.session.user && req.session.isClerk === true) {
        res.status(401).send("You are not authorized to view this page.");
    } else if (req.session.user && req.session.isClerk === false) {
        const addCart = rentals.findById(req.body._id);

        Cart.save(addCart);
        console.log(Cart.getCart());
    }
    else {
        res.render("general/log-in", {
            title: "You must log in to view this page."
        });
    }
});


router.post("/cart", (req, res) => {
    if (req.session.user && req.session.isClerk === true) {
        res.status(401).send("You are not authorized to view this page.");
    }
    else if (req.session.user === undefined) {
        res.render("general/log-in", {
            title: "You must log in to view this page."
        });
    }
    else {
        const rentalID = req.body._id;
        rentalModel.findOne({ _id: rentalID }).then(data => {
            let rental = data.toObject();
            rental.pricePerNight = parseFloat(rental.pricePerNight).toFixed(2);
            return rental;
        }).catch(err => {
            res.send("Error loading featured rentals: " + err);
        });

        let cart = req.session.cart = req.session.cart || [];

        let rentalCart = cart.findIndex(rental => rental.rentals._id === rentalID);
        if (rentalCart) {
            rentalCart.quantity++;
        }
        else {
            cart.push({
                rentals: rental,
                quantity: 1
            });
        }
        res.redirect("/cart");
    }
});



// setup another route to listen on /welcome
router.get("/welcome", (req, res) => {

    res.render("general/welcome", {
        title: "Welcome page",
    });
});

// setup another route to listen on /sig-up
router.get("/sign-up", (req, res) => {
    res.render("general/sign-up", {
        title: "Sign-up page"
    });
});

/*=================================== Validation for sign-up ===================================*/
router.post("/sign-up", (req, res) => {
    console.log(req.body);

    const { firstName, lastName, password } = req.body;
    let email = req.body.email;

    let passedValidation = true;
    let validationMessages = {};


    //first name validation
    if (typeof firstName !== "string" || firstName.trim().length == 0) {

        passedValidation = false;
        validationMessages.firstName = "Please enter your first name";
    }
    //last name validation
    if (typeof lastName !== "string" || lastName.trim().length == 0) {

        passedValidation = false;
        validationMessages.lastName = "Please enter your last name";
    }
    //email validation
    if (typeof email !== "string" || email.trim().length == 0 || email.search(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) < 0) {
        passedValidation = false;
        validationMessages.email = "Please enter a valid email address";
    }
    else if (email.search(/@/) < 0) {
        passedValidation = false;
        validationMessages.email = "Email must contain @ symbol";
    }

    //password validation
    if (typeof password !== "string" || password.trim().length == 0) {
        passedValidation = false;
        validationMessages.password = "Please enter your password";
    }
    else if (password.trim().length < 8 || password.trim().length > 12) {
        passedValidation = false;
        validationMessages.password = "Please enter a password between 8 to 12 characters.";
    }
    else if (password.search(/[a-z]/) < 0) {
        passedValidation = false;
        validationMessages.password = "Password must containing at least one lowercase letter";
    }
    else if (password.search(/[A-Z]/) < 0) {
        passedValidation = false;
        validationMessages.password = "Password must containing at least one uppercase letter";
    }
    else if (password.search(/[0-9]/) < 0) {
        passedValidation = false;
        validationMessages.password = "Password must containing at least one number";
    }
    else if (password.search(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/) < 0) {
        passedValidation = false;
        validationMessages.password = "Password must containing at least one symbol";
    }

    if (passedValidation == true) {
        userModel.findOne({ email: email }).then((user) => {
            if (!user) {
                const mg = {
                    to: email,
                    from: "luocying@hotmail.com",
                    subject: "Welcome to LaChinita",
                    html:
                        `Hello ${firstName} ${lastName} !<br>Your email address is: ${email} <br>Please confirm your password: ${password}<br><br>We are very happy to have you as our new member. <br><br>As a registered user, you will receive our latest promotions and exclusive offers. 
                We hope you enjoy exploring our products and services and find everything you are looking for.<br><br>However, we understand that our emails may not be for everyone. 
                If you would like to unsubscribe from our mailing list, please feel free to contact our customer service team and they will be happy to assist you.<br><br>
                Thanks again for joining us. We look forward to serving you and giving you the best possible experience.<br><br>
                Sincerely,<br>LaChinita Team<br>`};

                const newUser = new userModel({ firstName, lastName, email, password });
                newUser.save().then((userSaved) => {
                    console.log(`User ${userSaved.firstName}  has been added to the database.`);
                    const sgMail = require('@sendgrid/mail');
                    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
                    sgMail.send(mg)
                        .then(() => {
                            res.render("general/welcome", {
                                title: "Welcome Page"
                            });
                        })
                        .catch(err => {
                            console.log(err);

                            res.render("general/sign-up", {
                                title: "Sign Up Page",
                                validationMessages,
                                values: req.body
                            });
                        });
                }).catch(err => {
                    console.log(err);
                    res.render("general/sign-up", {
                        title: "Sign Up Page",
                        validationMessages,
                        values: req.body
                    });
                });
            }
            else {
                res.render("general/sign-up", {
                    title: "Sign Up Page",
                    validationMessages,
                    values: req.body
                });
            }
        });
    } else {
        validationMessages.email = "Email already exists, please use another email address";
        res.render("general/sign-up", {
            title: "Sign Up Page",
            validationMessages,
            values: req.body
        });
    }
});

/*=================================== Validation for Log-in ===================================*/
router.post("/log-in", (req, res) => {
    console.log(req.body);

    const { email, password, isClerk } = req.body;

    let passedValidation = true;
    let validationMessages = {};

    if (typeof email !== "string" || email.trim().length == 0 || email.search(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) < 0) {
        passedValidation = false;
        validationMessages.email = "Please enter a valid email address";
    }
    else if (email.search(/@/) < 0) {
        passedValidation = false;
        validationMessages.email = "Email must contain @ symbol";
    }

    //password validation
    if (typeof password !== "string" || password.trim().length == 0) {
        passedValidation = false;
        validationMessages.password = "Please enter your password";
    }
    else if (password.trim().length < 8 || password.trim().length > 12) {
        passedValidation = false;
        validationMessages.password = "Please enter a password between 8 to 12 characters.";
    }

    else if (password.search(/[a-z]/) < 0) {
        passedValidation = false;
        validationMessages.password = "Password must containing at least one lowercase letter";
    }
    else if (password.search(/[A-Z]/) < 0) {
        passedValidation = false;
        validationMessages.password = "Password must containing at least one uppercase letter";
    }
    else if (password.search(/[0-9]/) < 0) {
        passedValidation = false;
        validationMessages.password = "Password must containing at least one number";
    }
    else if (password.search(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/) < 0) {
        passedValidation = false;
        validationMessages.password = "Password must containing at least one symbol";
    }


    if (passedValidation) {
        let errors = [];

        //search MongoDB for a document with the same email
        userModel.findOne({
            email: req.body.email
        })
            .then(user => {
                if (user) {
                    //Found the user document
                    //Compare the password supplied by the user with the one in our document
                    bcrypt.compare(req.body.password, user.password)
                        .then(isMatch => {
                            //Done comparing the passwords
                            if (isMatch) {
                                //Passwords match

                                //Create a new session by storing the user document in the session
                                req.session.user = user;
                                req.session.isClerk = (req.body.isClerk === "data_entry_clerk");
                                if (req.session.isClerk === true) {
                                    res.redirect("/rentals/list");
                                }
                                else {
                                    res.redirect("/cart");
                                }
                            }
                            else {
                                //Passwords don't match
                                console.log("Passwords don't match");
                                errors.push("Sorry, your password does not match our database");

                                res.render("general/log-in", {
                                    errors
                                });
                            }
                        })

                }
                else {
                    console.log("User not found in the database");
                    errors.push("Email not found in the database");
                    res.status(401).send('You are not authorized to view this page.');

                    res.render("general/log-in", {
                        errors
                    });
                }
            })
            .catch(err => {
                //couldn't query the database
                console.log(`Error finding the user in the database....${err}`);
                errors.push("Opps, something went wrong. Please try again later.");

                res.render("general/log-in", {
                    errors
                });

            });
    }
    else {
        res.render("general/log-in", {
            title: "Log in Page",
            validationMessages,
            values: req.body
        });
    }
});

/*===========================================================================================*/
module.exports = router;