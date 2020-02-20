const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');


var threadSchema = new mongoose.Schema({
    users: [{
        type: mongoose.ObjectId,
        required : true
    }],
    group_name: {
        type: String,
        required : true
    },
    created_by: {
        type: mongoose.ObjectId,
        required : true
    },
    created_at: {
        type: Number,
        required : true
    }
});

// This adds some methods to the UserSchema
// threadSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("thread", threadSchema);
