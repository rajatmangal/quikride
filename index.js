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
const messages = require('./models/messages');
const port = process.env.PORT || 3000;


const server = http.createServer(app);
app.set('view-engine', 'ejs')
app.set('views',__dirname + "/public");
console.log(__dirname + "/public");
chatApp.connectChat(server);
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
        console.log(res)
    });
    res.render('chats.ejs', {
        user: req.user,
        users: users
    })
});

app.get('/chat/:id1/:id2', checkAuthentication, (req,res) => {
    console.log(typeof(req.params.id1));
    console.log(req.params.id2);

    thread.findOne({$or: [{'group_name': req.params.id1+ req.params.id2}, {'group_name':  req.params.id2+ req.params.id1}]}, (err,res1) => {
        console.log(res1)
        if(res1===null) {
            //create a new thread
            var newThread = new thread({ users: [mongoose.Types.ObjectId(req.params.id1), mongoose.Types.ObjectId(req.params.id2)], group_name: req.params.id1+ req.params.id2, created_by: new mongoose.Types.ObjectId(), created_at: new Date().getTime()});
            thread.create(newThread, (err,res2) => {
                 if(err) {
                     throw err;
                 }
                 else {
                    res.render('chat.ejs', {id: req.params.id, userId: req.user.username})
                 }
             });
            
        } else {
            thread.findOne({ users: req.user._id}, (err,res2) => {
                if(res2 == null) {
                    res.send("Sorry not authorized");
                } else{
                    messages.find({thread: req.params.id}, (err,res3) =>{
                        if(err) {
                            throw err;
                        } else{
                            console.log(typeof res3)
                            console.log(res3);

                            res.render('chat.ejs', {id: req.params.id, userId: req.user.username, messages: res3})
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


