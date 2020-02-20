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
const chatApp = require('./chat/chat');
const thread = require('./models/thread');
const port = process.env.PORT || 3000;

const server = http.createServer(app);
app.set('view-engine', 'ejs')
app.set('views',__dirname + "/public");
console.log(__dirname + "/public");
chatApp.connectChat(server);
app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb://localhost/users', {useNewUrlParser: true, useUnifiedTopology: true});
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

app.get('/chat/:id', checkAuthentication, (req,res) => {
    thread.findOne({group_name:req.params.id}, (err,res1) => {
        if(res1===null) {
            //craete a new thread
            var newThread = new thread({ users: [req.user._id], group_name: req.params.id, created_by: new mongoose.Types.ObjectId(), created_at: new Date().getTime()});
            thread.create(newThread, (err,res2) => {
                 if(err) {
                     throw err;
                 }
                 else {
                    res.render('chat.ejs', {id: req.params.id, userId: req.user._id})
                 }
             });
            
        } else {
            thread.findOne({ users: req.user._id}, (err,res2) => {
                if(res2 == null) {
                    res.send("Sorry not authorized");
                } else{
                    res.render('chat.ejs', {id: req.params.id, userId: req.user._id})
                }
            });
        }
    })
    // var newMessage = new messages({ sender: new mongoose.Types.ObjectId(), message:message, thread: new mongoose.Types.ObjectId(), created_at: new Date().getTime()});
    // messages.create(newMessage, (err,res) => {
    //         if(err) {
    //             throw err;
    //         }
    //         else {
    //         io.emit('message', chatUtil.generateMessage(message));
    //         callback("Delivered");
    //         }
    // });
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


