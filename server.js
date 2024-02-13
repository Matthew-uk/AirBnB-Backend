const dotenv = require('dotenv').config({path: './config.env'})
const mongoose = require('mongoose');
const server = require('./app');

const DB_con_Str = process.env.DBI || 'mongodb://127.0.0.1:27017/DomeDB'


server.listen(4276, () => {
    console.log('API in hot and ready to serve')
})

mongoose.connect(DB_con_Str).then((con) => {
}).catch(err => {
    console.log(err)
})