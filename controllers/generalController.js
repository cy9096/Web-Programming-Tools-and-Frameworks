const express = require("express");
const router = express.Router();
const rentals = require("../models/rentalList");


// setup a 'route' to listen on the default url path (http://localhost)
router.get("/", function (req, res) {
    res.render("general/home", {
        title: "Home page",
        // rentalsData: rentals.getFeaturedRentals()
    });
});

// setup another route to listen on /log-in
router.get("/log-in", function (req, res) {
    res.render("general/log-in", {
        title: "Log-in page"
    });
});

// setup another route to listen on /log-in
router.get("/welcome", function (req, res) {
    res.render("general/welcome", {
        title: "Welcome page"
    });
});

// setup another route to listen on /sig-up
router.get("/sign-up", function (req, res) {
    res.render("general/sign-up", {
        title: "Sign-up page"
    });
});
// setup another route to listen on /rentals
router.get("/rentals", function (req, res) {
    res.render("general/rentals", {
        title: "Rentals page",
        // rentalsData: rentals.getRentalsByCityAndProvince()
    });
});


/*=================================== Validation for sign-up ===================================*/

router.post("/sign-up", (req, res) => {
    console.log(req.body);

    const { firstName, lastName, email, password } = req.body;

    var passedValidation = true;
    var validationMessages = {};


    //first name validation
    if (typeof firstName !== "string" || firstName.trim().length == 0) {

        passedValidation = false;
        validationMessages.firstName = "You must specify a first name";
    }
    else if (typeof firstName !== "string" || firstName.trim().length < 2) {

        passedValidation = false;
        validationMessages.firstName = "The first name should be at least 2 characters long.";
    }

    //last name validation
    if (typeof lastName !== "string" || lastName.trim().length == 0) {

        passedValidation = false;
        validationMessages.lastName = "You must specify a first name";
    }
    else if (typeof lastName !== "string" || lastName.trim().length < 2) {

        passedValidation = false;
        validationMessages.lastName = "The last name should be at least 2 characters long.";
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

    if (passedValidation) {
        //submit the sign up form
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

        const mg = {
            to: email,
            from: "cluo21@myseneca.ca",
            subject: "Welcome to LaChinita",
            html:
                `Visitor's Full Name:  ${firstName} ${lastName} <br>
                Visitor's Email: ${email} <br>`
        };

        sgMail.send(mg)
            .then(() => {
                res.render("general/welcome");
            })
            .catch(err => {
                console.log(err);

                res.render("general/sign-up", {
                    title: "Sign Up Page",
                    validationMessages,
                    values: req.body
                });
            })
    }
    else {
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

    const { email, password } = req.body;

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

});

module.exports = router;