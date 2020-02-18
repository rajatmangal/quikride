const mongoose = require('mongoose');
const passwordValidator = require('password-validator');
function registerUser(res, req) {
    try{
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var username = req.body.username;
        var email = req.body.email;
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
            return res.render('register.ejs', {
                message: "Your password must have a least length of 8 and should include atleast 1 digit, 1 Uppercase Letter ,1 Lowercase Letter and 1 special character."
            });
        }
        else {
            const hashedPassword = await bcrypt.hash(req.body.password,10);
            var newUser = new User({firstName: firstName, lastName: lastName, username: username, email: email,password:hashedPassword});
            await User.register(newUser, req.body.password, function(err, user) {
                if(err) {
                    // console.log(err.message);
                    req.flash('error', err.message);
                    // console.log(req.flash('error'));
                    return res.render('register.ejs', {
                        message: err.message
                    });
                }
                else {
                }
                    passport.authenticate("local")(req, res, function() {
                    return res.redirect('/');
                });
            });
        }
    } catch (e){
        console.log(e)
        res.redirect('/register');
    }
}


module.exports = registerUser;