const express = require('express');
const app = express();
const morgan  = require('morgan');
const { signup, login, forgetPwd, resetPwd } = require('./controllers/authCtrl');

app.use(morgan('dev'));
app.use(express.json());

app.post('/sign-up', signup);
app.post('/sign-in', login);
app.post('/forgot-password', forgetPwd);
app.patch('/reset/:token', resetPwd);

app.get('/', (req, res) => {
    res.status(200).json({
        resp: "Welcome to the Dome"
    })
})

module.exports = app;