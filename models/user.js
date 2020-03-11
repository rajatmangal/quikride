const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');


var UserSchema = new mongoose.Schema({
  firstName: {
    type : String
  },
  lastName: {
    type : String
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
    minLength: 8,
    maxLength: 20
  },
  emailConfirmed: {
    type : Boolean,
    required : true,
    default : false
  },
  emailToken: {
    type : String
  },
  resetPasswordToken: {
    type : String,
    default: ''
  },
  linkExpires: {
    type : Date,
    default:''
  },
  facebookId: {
    type: String,
    default: ''
  },
  googleId: {
    type: String,
    default: ''
  },
  isDriver: {
    type: Boolean,
    default: false
  }
});

// This adds some methods to the UserSchema
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);
