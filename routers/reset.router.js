const express = require('express');
const resetConfig = require('../config/reset-config');
const randomString = require('random-string');
const mailer = require('../config/mailer-config');
const authentication = require('../utils/authentication.util')
const User = require('../models/user');

const router = new express.Router();

router.get('/forgot', authentication.checkNotAuthenticated, (req,res) => {
    res.locals.title = "Forget Password";
    res.render('forgot.ejs');
});

router.post('/forgot', authentication.checkNotAuthenticated, async (req,res) => {
    try {
        const {forgot} = req.body;
        const user = await User.findOne({'email': forgot});
        if (!user) {
            res.locals.title = "Forget Password";
            res.render('forgot.ejs', {
                message: 'User associated with this email not found'
            })
            return;
        }
        if (user.facebookId || user.googleId) {
            return res.render('forgot.ejs', {
                message: "Email associated with Facebook or Google login. Unable to reset password."
            });
        }
        var token = randomString();
        user.resetPasswordToken = token;
        user.linkExpires = new Date().getTime() + 3600000; //1 hour
        await user.save();
        const html = `Reset your password by clicking this link (link expires in 1 hour): <a href="http://localhost:3000/reset/${token}" target="_blank">http://localhost:3000/reset/${token}</a>`;
        await mailer.sendEmail('donotreply@quikride.com', forgot, 'Quikride: reset password', html);
        console.log("Reset password email sent");
        res.locals.title = "Forget Password";
        res.render('forgot.ejs', {
            message: "Email to reset password has been sent"
        })
    } catch(error) {
        console.log(error);
    }
});

router.get('/reset/:token', authentication.checkNotAuthenticated, async (req,res) => {
    var user = await User.findOne({ resetPasswordToken: req.params.token, linkExpires: { $gt: new Date().getTime() }});
    if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
    }
    res.locals.title = "Reset Password";
    res.render('reset.ejs', {token: req.params.token});
});

router.post('/reset/:token', authentication.checkNotAuthenticated, async (req,res) => {
    await resetConfig.resetPassword(req, res);
});


module.exports = router