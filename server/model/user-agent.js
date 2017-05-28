var mongoose = require('mongoose');
var async = require('async');
var bcryptConfig = require('../config').bcrypt;
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

var userAgentSchema = new Schema({
    email: String,
    password: String,
    display_name: String,
    level: Number
});

var UserAgent = mongoose.model('UserAgent', userAgentSchema);

var defaultUserAgent = {
    email: 'agent1@email.com',
    password: '121212',
    display_name: 'Agent 1',
    level: 1
};

async.waterfall([
    function (callback) {
        UserAgent
            .findOne({email: defaultUserAgent.email})
            .exec(function (err, userAgent) {
                callback(err, userAgent);
            });
    },
    function (userAgent, callback) {
        if (!userAgent) {
            bcrypt.hash(defaultUserAgent.password, bcryptConfig.saltRounds, function (err, hash) {
                defaultUserAgent.password = hash;
                callback(err, defaultUserAgent);
            });
        }
    },
    function (hashedPasswordUserAgent) {
        UserAgent.create(hashedPasswordUserAgent, function (err, r) {
            if (err)
                console.log(err);
            console.log('created default agent user', r);
        });
    }
], function (err, result) {
    console.log(result);
});

module.exports = UserAgent;