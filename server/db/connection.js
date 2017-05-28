var mongoose = require('mongoose');
var config = require('../config').db;

//Set up default mongoose connection
mongoose.connect(config.url);

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;