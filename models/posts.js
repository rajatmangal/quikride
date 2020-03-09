const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var postsSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    pickuplocation: {
        type: String,
        required: true
    },
    pickuplocationLat: {
        type: String,
        required: true
    },
    pickuplocationLon: {
        type: String,
        required: true
    },
    dropofflocation: {
        type: String,
        required: true
    },
    dropofflocationLat: {
        type: String,
        required: true
    },
    dropofflocationLon: {
        type: String,
        required: true
    },
    usermessage: {
        type: String,
        required: true
    },
    ridecost: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("posts", postsSchema);