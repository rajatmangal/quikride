const mongoose = require('mongoose');
var user = require('./user')
var passportLocalMongoose = require('passport-local-mongoose');


var threadSchema = new mongoose.Schema({
    users: [{
        type: String,
        required : true
    }],
    group_name: {
        type: String,
        required : true
    },
    created_by: {
        type: String,
        required : true,
    },
    created_at: {
        type: Number,
        required : true
    },
    last_updated: {
        type: Number,
    },
    last_message: {
        type: String,
    },
    last_sender: {
        type: String,
    },
    id: {
        type: String,
        required : true
    }
});

// This adds some methods to the UserSchema
// threadSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("thread", threadSchema);
