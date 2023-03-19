const express = require("express");
const router = express.Router();
const rentals = require("../models/rentals-db");


// setup a 'route' to listen on the default url path (http://localhost)
router.get("/", function (req, res) {
    res.render("general/home", {
        title: "Home page",
        rentalsData: rentals.getFeaturedRentals()
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
    res.render("general/welcome");
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
        rentalsData: rentals.getRentalsByCityAndProvince()
    });
});


/*=================================== Validation for sign-up ===================================*/

router.post("/sign-up", (req, res) => {
    console.log(req.body);

    const { firstName, lastName, email, password } = req.body;

    let passedValidation = true;
    let validationMessages = {};


    //first name validation
    if (typeof firstName !== "string" || firstName.trim().length == 0) {

        passedValidation = false;
        validationMessages.firstName = "Please enter your first name";
    }
    // else if (typeof firstName !== "string" || firstName.trim().length < 2) {

    //     passedValidation = false;
    //     validationMessages.firstName = "The first name should be at least 2 characters long.";
    // }

    //last name validation
    if (typeof lastName !== "string" || lastName.trim().length == 0) {

        passedValidation = false;
        validationMessages.lastName = "Please enter your last name";
    }
    // else if (typeof lastName !== "string" || lastName.trim().length < 2) {

    //     passedValidation = false;
    //     validationMessages.lastName = "The last name should be at least 2 characters long.";
    // }


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
            from: "luocying@hotmail.com",
            subject: "Welcome to LaChinita",
            html:
                `Hello ${firstName} ${lastName} !<br>
                Your email address is: ${email} <br>
                Please confirm your password: ${password}<br><br>
                We are very happy to have you as our new member. <br><br>
                As a registered user, you will receive our latest promotions and exclusive offers. 
                We hope you enjoy exploring our products and services and find everything you are looking for.<br><br>
                However, we understand that our emails may not be for everyone. 
                If you would like to unsubscribe from our mailing list, 
                please feel free to contact our customer service team and they will be happy to assist you.<br><br>
                Thanks again for joining us.
                We look forward to serving you and giving you the best possible experience.<br><br>
                Sincerely,<br>
                LaChinita Team<br>`
        };

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


    if (passedValidation) {

        // const sgMail = require('@sendgrid/mail');
        // sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

        // const mg = {
        //     to: email,
        //     from: "luocying@hotmail.com",
        //     subject: "Welcome Back",
        //     html:
        //         `Welcome back ${firstName} ${lastName} !<br>`
        // };

        // sgMail.send(mg)
        //     .then(() => {
        //         res.render("general/home");
        //     })
        //     .catch(err => {
        //         console.log(err);
        //         res.render("general/log-in", {
        //             title: "Log in Page",
        //             validationMessages,
        //             values: req.body
        //         });
        //     })
        res.redirect("/home");
    }
    else {
        res.render("general/log-in", {
            title: "Log in Page",
            validationMessages,
            values: req.body
        });
    }

});

module.exports = router;