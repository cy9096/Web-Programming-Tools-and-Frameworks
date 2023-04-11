const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true

    },
    password: {
        type: String,
        required: true
    },
    profilePic: String,
    dateCreated: {
        type: Date,
        default: Date.now()
    }
});

userSchema.pre("save", function (next) {
    let user = this;

    //Genrate a unique SALT
    bcryptjs.genSalt()
        .then((salt) => {
            //Hash the password using the salt
            bcryptjs.hash(user.password, salt)
                .then((hashedPassword) => {
                    //The password was hashed successfully
                    user.password = hashedPassword;
                    next();
                })
                .catch(err => {
                    console.log(`Error occurrred when salting.. ${err}`);
                });
        })
        .catch(err => {
            console.log(`Error occurrred when salting.. ${err}`);
        });
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;