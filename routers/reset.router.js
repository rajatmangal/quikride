const express = require('express');
const resetConfig = require('../config/reset-config');
const randomString = require('random-string');
const mailer = require('../config/mailer-config');
const authentication = require('../utils/authentication.util')
const User = require('../models/user');

const router = new express.Router();

router.get('/forgot', authentication.checkNotAuthenticated, (req,res) => {
    res.render('forgot.ejs');
});

router.post('/forgot', authentication.checkNotAuthenticated, async (req,res) => {
    try {
        const {forgot} = req.body;
        const user = await User.findOne({'email': forgot});
        if (!user) {
            res.render('forgot.ejs', {
                message: 'User associated with this email not found'
            })
            return;
        }
        var token = randomString();
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; //1 hour
        await user.save();
        const html = `Reset your password by clicking this link (link expires in 1 hour): <a href="http://localhost:3000/reset/${token}" target="_blank">http://localhost:3000/reset/${token}</a>`;
        await mailer.sendEmail('donotreply@quikride.com', forgot, 'Quikride: reset password', html);
        console.log("Reset password email sent");
        res.render('forgot.ejs', {
            message: "Email to reset password has been sent"
        })
    } catch(error) {
        console.log(error);
    }
});

router.get('/reset/:token', authentication.checkNotAuthenticated, async (req,res) => {
    var user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() }});
    if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
    }
    res.render('reset.ejs', {token: req.params.token});
});

router.post('/reset/:token', authentication.checkNotAuthenticated, async (req,res) => {
    await resetConfig.resetPassword(req, res);
});


module.exports = router