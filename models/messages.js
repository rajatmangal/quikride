const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');


var MessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.ObjectId,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    thread: {
        type: mongoose.ObjectId,
        required: true
    },
    created_at: {
        type: Number,
        required : true
    }
});

// This adds some methods to the UserSchema
// MessageSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("messages", MessageSchema);
