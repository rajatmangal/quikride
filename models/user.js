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
    required : true,
    unique: true,
    minLength: 6,
    maxLength: 20
  },
  email: {
    type : String,
    required : true,
    unique: true
  },
  password: {
    type : String,
    required : true,
    minLength: 8,
    maxLength: 20
  },
});

// This adds some methods to the UserSchema
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);
