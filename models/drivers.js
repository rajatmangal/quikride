const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');


var driversSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    userid : {
        type: String,
        required: true
    },
    fullNameOnLicense: {
        type: String,
        required: true
    },
    licenseClass: {
        type: String,
        required: true
    },
    licenseNumber: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("drivers", driversSchema);