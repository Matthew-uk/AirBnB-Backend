const express = require('express');
const app = express();
const morgan  = require('morgan');
const passport = require('passport');
const session    = require("express-session")
const MongoDBStore = require("connect-mongodb-session")(session);


const store = new MongoDBStore({
  uri: process.env.DBI,
  collection: 'sessions'
})

const { signup, login, forgetPwd, resetPwd, facebookAuthCBMW, facebookAuthCB, googleAuthCBMW, googleAuthCB } = require('./controllers/authCtrl');
const userRoute = require('./routes/userRoute');


app.use(morgan('dev'));
app.use(express.json());
app.use(session({ 
  secret: process.env.SESSION_SECRET, 
  resave: false, 
  saveUninitialized: true,
  store,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 * 30 }
}))

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/cb', googleAuthCBMW, googleAuthCB);
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile'] }));
app.get('/auth/facebook/cb', facebookAuthCBMW, facebookAuthCB);

app.post('/sign-up', signup);
app.post('/sign-in', passport.authenticate('local'), login);
app.post('/forgot-password', forgetPwd);
app.patch('/reset/:token', resetPwd);

app.get('/', (req, res) => {
    res.status(200).json({
        resp: "Welcome to the Dome"
    })
})

app.use('/users', userRoute)

module.exports = app;