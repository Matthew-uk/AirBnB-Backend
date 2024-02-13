const express = require('express');
const app = express();
const morgan  = require('morgan');

app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        resp: "Welcome to the Dome"
    })
})

module.exports = app;