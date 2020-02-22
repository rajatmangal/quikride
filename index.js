if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const http = require('http');
const express = require('express');
const passport = require('passport');
const flash = require('express-flash');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
const passwordValidator = require('password-validator');
const mongoose = require('mongoose');
const adminRouter = require('./routers/admin.router');
const app = express();
const User = require('./models/user');
const passConfig = require('./config/passport-config')
const regConfig = require('./config/register-config')
const resetConfig = require('./config/reset-config')
const chatApp = require('./chat/chat');
const thread = require('./models/thread');
const messages = require('./models/messages');
const moment = require('moment');
var randomString = require('random-string');
const mailer = require('./config/mailer-config');
const port = process.env.PORT || 3000;

const server = http.createServer(app);
chatApp.connectChat(server);

app.set('view-engine', 'ejs')
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');


if(process.env.USE_MONGO_CLUSTER) { 
    mongoose.connect('mongodb+srv://mongoadmin:cmpt470carpool@cluster0-yeuix.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
} else {
    mongoose.connect('mongodb://localhost/users', {useNewUrlParser: true, useUnifiedTopology: true});
}
var db = mongoose.connection;


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use('/admin', adminRouter);
app.use(cookieParser());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({extended : false}));


app.get('/', checkAuthentication, (req,res) => {
    res.render('index.ejs',{ name: req.user.username});
});

app.get('/verify', checkNotAuthenticated, (req,res) => {
    res.render('verify.ejs');
});

app.post('/verify', checkNotAuthenticated, async (req,res) => {
    try {
        const {emailToken} = req.body;
        const user = await User.findOne({'emailToken': emailToken});
        if (!user) {
            req.flash('error', 'User associated with this token not found');
            res.redirect('/verify');
            return;
        }
        user.emailConfirmed = true;
        user.emailToken = '';
        await user.save();
        res.redirect('/login');
    } catch(error) {
        console.log(error);
    }
});

app.get('/forgot', checkNotAuthenticated, (req,res) => {
    res.render('forgot.ejs');
});

app.post('/forgot', checkNotAuthenticated, async (req,res) => {
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

app.get('/reset/:token', checkNotAuthenticated, async (req,res) => {
    var user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() }});
    if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
    }
    res.render('reset.ejs', {token: req.params.token});
});

app.post('/reset/:token', checkNotAuthenticated, async (req,res) => {
    await resetConfig.resetPassword(req, res);
});

app.get('/map', checkAuthentication, (req,res) => {
    res.render('map.ejs',{ name: req.user.username});
});

app.get('/login', checkNotAuthenticated, (req,res) => {
    res.render('login.ejs');
});

app.get('/register', checkNotAuthenticated, (req,res) => {
    res.render('register.ejs');
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true 
}));

app.post('/register', checkNotAuthenticated, async (req,res) => {
    regConfig.registerUser(req,res);
});

app.delete('/logout', (req,res) => {
    req.logOut();
    res.redirect('/login');
})

app.get('/chats', checkAuthentication, async (req,res) => {
    const users = await User.find({}, (err,res) => {
        if(err) {
            throw err;
        }
    });
    res.render('chats.ejs', {
        user: req.user,
        users: users
    })
});

app.get('/chat/:id', checkAuthentication, (req,res) => {
    thread.findOne({$or: [{'group_name': req.user._id.toString()+ req.params.id}, {'group_name':  req.params.id+ req.user._id.toString()}]}, (err,res1) => {
        if(res1===null) {
            //create a new thread
            var newThread = new thread({ users: [req.user._id, mongoose.Types.ObjectId(req.params.id)], group_name: req.user._id.toString()+ req.params.id, created_by: new mongoose.Types.ObjectId(), created_at: moment(new Date().getTime()).format('MMMM Do YYYY h:mm a')});
            thread.create(newThread, (err,res2) => {
                 if(err) {
                     throw err;
                 }
                 else {
                    res.render('chat.ejs', {id: req.user._id.toString()+ req.params.id, userId: req.user.username})
                 }
             });
            
        } else {
            thread.findOne({ users: req.user._id}, (err,res2) => {
                if(res2 == null) {
                    res.send("Sorry not authorized");
                } else{
                    messages.find({thread: res1.group_name}, (err,res3) =>{
                        if(err) {
                            throw err;
                        } else{
                            res.render('chat.ejs', {id: res1.group_name, userId: req.user.username, messages: res3})
                        }
                    });
                }
            });
        }
    })
})


function checkAuthentication(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}
server.listen(port, (res,req) => {
    console.log(`Listening to port ${port}`);
});


