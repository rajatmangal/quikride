const mongoose = require('mongoose');
const passwordValidator = require('password-validator');
const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

async function resetPassword(req, res) {
    try{
        var user = await User.findOne({ resetPasswordToken: req.params.token, linkExpires: { $gt: Date.now() } });
        var password = req.body.newPassword;
        var password2 = req.body.newPassword2;
        if(password !== password2) {
            return res.render('reset.ejs', {
                token: req.params.token,
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
        if(!passwordCheck.validate(req.body.newPassword)) {
            return res.render('reset.ejs', {
                token: req.params.token,
                message: "Your password must have a least length of 8 and should include atleast 1 digit, 1 Uppercase Letter ,1 Lowercase Letter and 1 special character."
            });
        }
        else {
            const hashedPassword = await bcrypt.hash(req.body.newPassword,10);

            user.password = hashedPassword;
            user.resetPasswordToken = '';
            user.linkExpires = null;
            await user.save();
            console.log('New password saved');
            return res.redirect('/login');
        }
    } catch (e){
        console.log(e)
        res.redirect('/reset', {token: req.params.token});
    }
}


module.exports.resetPassword = resetPassword;