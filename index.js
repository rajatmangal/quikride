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
const mongoose = require('./setup/mongoose')
const adminRouter = require('./routers/admin.router');
const app = express();
const server = http.createServer(app);
const chatApp = require('./chat/chat');
const port = process.env.PORT || 3000;

chatApp.connectChat(server);

app.set('view-engine', 'ejs')
app.set('views', __dirname + '/views');
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

//All Middlewares
app.use(express.static(__dirname + '/public'));
app.use('/admin', adminRouter);
app.use(cookieParser());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({extended : false}));
app.use(express.json());


//Routers
app.use(require('./routers/user.router'));
app.use(require('./routers/verify.router'));
app.use(require('./routers/chat.router'));
app.use(require('./routers/map.router'));
app.use(require('./routers/reset.router'));
app.use(require('./routers/posts.router'));

//Start the Server
server.listen(port, (res,req) => {
    console.log(`Listening to port ${port}`);
});


