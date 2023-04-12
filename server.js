/*************************************************************************************
* WEB322 - 2231 Project
* I declare that this assignment is my own work in accordance with the Seneca Academic
* Policy. No part of this assignment has been copied manually or electronically from
* any other source (including web sites) or distributed to other students.
*
* Student Name  : Wing Lo
* Student ID    : 109191213
* Course/Section: WEB322 NCC
*
**************************************************************************************/
const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const rentals = require("./models/rentals-db");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const fileUpload = require("express-fileupload");
const mongoStore = require("connect-mongo");


//setup the express app
const app = express();

//set up express-fuleupload
app.use(fileUpload());


//set up dotenv protect environment variables
const dotenv = require("dotenv");
dotenv.config({ path: "./config/keys.env" });


// Set up HandleBars
app.engine(".hbs", exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main"
}));

app.set("view engine", ".hbs");

// Make the "assets" folder public.
app.use(express.static(path.join(__dirname, "/assets")));


// Set up body-parser
app.use(express.urlencoded({ extended: false }));

// Set up express-session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,

    store: mongoStore.create({ mongoUrl: process.env.MONGO_CONN_STRING }),
    cookie: { maxAge: 180 * 60 * 1000 }
}));

app.use((req, res, next) => {
    // res.locals.user is a global handlebars variable.
    // This means that every single handlebars file can access this variable.
    res.locals.user = req.session.user;
    req.session.isClerk;
    //res.locals.session = req.session;
    next();
});

app.use(function (req, res, next) {
    res.locals.isClerk = req.session.isClerk;
    next();
});

//configure the controllers
const generalController = require("./controllers/general");
const rentalsController = require("./controllers/rentals");
const loadDataController = require("./controllers/load-data");


app.use("/", generalController);
app.use("/rentals", rentalsController);
app.use("/load-data", loadDataController);




/*=================================================================================================================================*/
// *** DO NOT MODIFY THE LINES BELOW ***

// This use() will not allow requests to go beyond it
// so we place it at the end of the file, after the other routes.
// This function will catch all other requests that don't match
// any other route handlers declared before it.
// This means we can use it as a sort of 'catch all' when no route match is found.
// We use this function to handle 404 requests to pages that are not found.
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// This use() will add an error handler function to
// catch all errors.
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send("Something broke!")
});

// Define a port to listen to requests on.
const HTTP_PORT = process.env.PORT || 8080;

// Call this function after the http server starts listening for requests.
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

/* ======================= Connect to mongoDB ========================== */

//connect to the mongodb database
mongoose.connect(process.env.MONGO_CONN_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB database.");

    // Listen on port 8080. The default port for http is 80, https is 443. We use 8080 here
    // because sometimes port 80 is in use by other applications on the machine
    app.listen(HTTP_PORT, onHttpStart);

}).catch(err => {
    console.log(`Unable to connect to the MongoDB database. ERROR: ${err}`);
});