const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');


var MessageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    thread: {
        type: String,
        required: true
    },
    created_at: {
        type: String,
        required : true
    }
});

// This adds some methods to the UserSchema
// MessageSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("messages", MessageSchema);
