const mongoose = require('mongoose');
const passwordValidator = require('password-validator');
const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
var randomString = require('random-string');
const mailer = require('./mailer-config');

function checkUsername(username){
    if(username.length < 6 || username.length > 20) {
        return false
    }
    return true
}

function checkPassword(password){
    var passwordCheck =  new passwordValidator();
    passwordCheck
        .is().min(8)                                    // Minimum length 8
        .is().max(20)                                  // Maximum length 100
        .has().uppercase()                              // Must have uppercase letters
        .has().lowercase()
        .has().symbols()                              // Must have lowercase letters
        .has().digits()                                 // Must have digits
        .has().not().spaces()                           // Should not have spaces
        .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
    return passwordCheck.validate(password)
}

async function hashPassword(password){
    return await bcrypt.hash(password,10);
}

async function registerUser(req, res) {
    try{
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var username = req.body.username;
        if(username.length < 6 || username.length > 20) {
            return res.render('register.ejs', {
                message: "username should have a minimum length of 6 and maximum of 20"
            });
        }
        var email = req.body.email;
        var password = req.body.password;
        var password2 = req.body.password2;
        if(password !== password2) {
            return res.render('register.ejs', {
                message: "Those Passwords didn't match. Please try again."
            });
        }
        var passwordCheck =  new passwordValidator();
        passwordCheck
            .is().min(8)                                    // Minimum length 8
            .is().max(20)                                  // Maximum length 100
            .has().uppercase()                              // Must have uppercase letters
            .has().lowercase()
            .has().symbols()                              // Must have lowercase letters
            .has().digits()                                 // Must have digits
            .has().not().spaces()                           // Should not have spaces
            .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
        if(!passwordCheck.validate(req.body.password)) {
            res.locals.title = "Register";
            return res.render('register.ejs', {
                message: "Your password must have a least length of 8 and should include atleast 1 digit, 1 Uppercase Letter ,1 Lowercase Letter and 1 special character."
            });
        }
        else {
            const hashedPassword = await bcrypt.hash(req.body.password,10);
            var emailToken = randomString();
            var newUser = new User({firstName: firstName, lastName: lastName, username: username, email: email ,password:hashedPassword, emailToken:emailToken, linkExpires: new Date().getTime() + 3600000});
            await User.register(newUser, req.body.password, async function(err, user) {
                if(err) {
                    req.flash('error', err.message);
                    res.locals.title = "Register";
                    return res.render('register.ejs', {
                        message: err.message
                    });
                }
                else {
                }
                    console.log("New User Saved");
                    const html = `Verify your account by clicking this link (link expires in 1 hour): <a href="http://localhost:3000/verify/${emailToken}" target="_blank">http://localhost:3000/verify/${emailToken}</a>`;
                    await mailer.sendEmail('donotreply@quikride.com', email, 'Quikride: verify your email', html);
                    console.log("Verification email sent");
                    return res.render('register.ejs', {
                        message: "Success! Check your email for the verification link."
                    });
            });
        }
    } catch (e){
        console.log(e)
        res.redirect('/register');
    }
}


module.exports.registerUser = registerUser;
module.exports.checkUsername = checkUsername;
module.exports.checkPassword = checkPassword;
module.exports.hashPassword = hashPassword;
