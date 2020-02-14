const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');


var UserSchema = new mongoose.Schema({
  firstName: {
    type : String,
    required : true
  },
  lastName: {
    type : String,
    required : true
  },
  username: {
    type : String,
    required : true
  },
  email: {
    type : String,
    required : true
  },
  password: {
    type : String,
    required : true
  },
});

// This adds some methods to the UserSchema
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
