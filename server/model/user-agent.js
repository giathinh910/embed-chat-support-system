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

UserAgent.authenticate = function (inputUser, callback) {
    async.waterfall([
        function (callback) {
            UserAgent
                .findOne({email: inputUser.email})
                .exec(function (err, userAgent) {
                    if (err)
                        console.log(err);
                    if (userAgent)
                        callback(null, userAgent);
                    else
                        return callback(null, false);
                });
        },
        function (userAgent, callback) {
            bcrypt.compare(inputUser.password, userAgent.password, function (err, result) {
                if (err)
                    console.log(err);
                callback(null, userAgent);
            });
        }
    ], function (err, result) {
        if (callback)
            callback(err, result);
    });
};

UserAgent.createNewUser = function (inputUser, callback) {
    async.waterfall([
        function (callback) {
            UserAgent
                .findOne({email: inputUser.email})
                .exec(function (err, userAgent) {
                    callback(err, userAgent);
                });
        },
        function (userAgent, callback) {
            if (!userAgent)
                bcrypt.hash(inputUser.password, bcryptConfig.saltRounds, function (err, hash) {
                    inputUser.password = hash;
                    callback(err, inputUser);
                });
            else
                return callback('agent user existed', null);
        },
        function (hashedPasswordUserAgent, callback) {
            UserAgent.create(hashedPasswordUserAgent, function (err, r) {
                if (err)
                    console.log(err);
                callback(null, r);
            });
        }
    ], function (err, result) {
        if (callback)
            callback(err, result);
    });
};

module.exports = UserAgent;