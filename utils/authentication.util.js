var LocalStrategy = require('passport-local').Strategy;

function checkAuthentication(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/home')
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/');
    }
    return next();
}

module.exports = {
    checkAuthentication,
    checkNotAuthenticated
}