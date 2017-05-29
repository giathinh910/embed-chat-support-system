var mongoose = require('mongoose');
var async = require('async');
var bcryptConfig = require('../config').bcrypt;
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: String,
    password: String,
    display_name: String,
    level: Number
});

var User = mongoose.model('User', userSchema);

User.authenticate = function (inputUser, callback) {
    async.waterfall([
        function (callback) {
            User
                .findOne({email: inputUser.email})
                .exec(function (err, user) {
                    if (err)
                        console.log(err);
                    if (user)
                        callback(null, user);
                    else
                        return callback(null, false);
                });
        },
        function (user, callback) {
            bcrypt.compare(inputUser.password, user.password, function (err, result) {
                if (err)
                    console.log(err);
                callback(null, user);
            });
        }
    ], function (err, result) {
        if (callback)
            callback(err, result);
    });
};

User.createNewUser = function (inputUser, callback) {
    async.waterfall([
        function (callback) {
            User
                .findOne({email: inputUser.email})
                .exec(function (err, user) {
                    callback(err, user);
                });
        },
        function (user, callback) {
            if (!user)
                bcrypt.hash(inputUser.password, bcryptConfig.saltRounds, function (err, hash) {
                    inputUser.password = hash;
                    callback(err, inputUser);
                });
            else
                return callback('user existed', null);
        },
        function (hashedPasswordUser, callback) {
            User.create(hashedPasswordUser, function (err, r) {
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

module.exports = User;