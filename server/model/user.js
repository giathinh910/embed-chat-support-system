var mongoose = require('mongoose');
var async = require('async');
var bcryptConfig = require('../config').bcrypt;
var bcrypt = require('bcrypt');
var extend = require('extend');
var config = require('../config');

var SiteModel = require('./site');

var Schema = mongoose.Schema;

var userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    return /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/.test(v);
                },
                message: '{VALUE} is not a valid email address!'
            }
        },
        password: {
            type: String,
            required: true
        },
        displayName: {
            type: String,
            required: true

        },
        level: {
            type: Number,
            required: true,
            min: 1,
            default: config.userLevel.customer
        },
        site: {
            type: Schema.Types.ObjectId,
            ref: 'Site'
        }
    },
    {
        timestamps: true
    }
);

var User = mongoose.model('User', userSchema);

User.createAgent = function (inputUser, callback) {
    async.waterfall([
        function (callback) {
            User
                .findOne({
                    email: inputUser.email,
                    level: {
                        $in: [config.userLevel.admin, config.userLevel.agent] // check both admin and agent level
                    }
                })
                .exec(function (err, user) {
                    if (err)
                        return callback(err, null);
                    if (user)
                        return callback('EmailExisted', null);
                    else
                        callback(null, null);
                });
        },
        function (foo, callback) {
            bcrypt.hash(inputUser.password, bcryptConfig.saltRounds, function (err, hash) {
                if (err)
                    callback(err, null);
                inputUser.password = hash;
                callback(null, inputUser);
            });
        },
        function (hashedPasswordUser, callback) {
            User.create(hashedPasswordUser, function (err, r) {
                if (err)
                    return callback(err.name, err);
                callback(null, r);
            });
        }
    ], function (err, result) {
        if (callback)
            callback(err, result);
    });
};

User.authenticateAgent = function (inputUser, callback) {
    async.waterfall([
        function (callback) {
            User
                .findOne({
                    email: inputUser.email,
                    level: {
                        $in: [config.userLevel.admin, config.userLevel.agent] // check both admin and agent level
                    }
                })
                .exec(function (err, user) {
                    if (err)
                        return callback(err, null);
                    if (!user)
                        return callback('UserNotExisted', null);
                    else
                        callback(null, user);
                });
        },
        function (user, callback) {
            bcrypt.compare(inputUser.password, user.password, function (err, result) {
                if (err)
                    callback(err, null);
                else
                    callback(null, user);
            });
        }
    ], function (err, result) {
        if (callback)
            callback(err, result);
    });
};

User.createCustomer = function (inputUser, callback) {
    async.waterfall([
        function (callback) { // check if site existed
            SiteModel
                .findOne({
                    _id: inputUser.site
                })
                .exec(function (err, site) {
                    if (err)
                        return callback(err, null);
                    if (!site)
                        return callback('SiteNotExisted', null);
                    else
                        callback(null, null);
                });
        },
        function (foo, callback) { // check if customer existed in that site
            User
                .findOne({
                    email: inputUser.email,
                    site: inputUser.site,
                    level: config.userLevel.customer
                })
                .exec(function (err, user) {
                    if (err)
                        return callback(err, null);
                    if (user)
                        return callback('EmailExisted', null);
                    else
                        callback(null, null);
                });
        },
        function (foo, callback) { // hashed password
            bcrypt.hash(inputUser.password, bcryptConfig.saltRounds, function (err, hash) {
                if (err)
                    callback(err, null);
                inputUser.password = hash;
                callback(null, inputUser);
            });
        },
        function (hashedPasswordUser, callback) { // create user
            User.create(hashedPasswordUser, function (err, r) {
                if (err)
                    return callback(err.name, err);
                callback(null, r);
            });
        }
    ], function (err, result) {
        if (callback)
            callback(err, result);
    });
};

User.authenticateCustomer = function (inputUser, callback) {
    async.waterfall([
        function (callback) {
            User
                .findOne({
                    email: inputUser.email,
                    site: inputUser.site,
                    level: config.userLevel.customer
                })
                .exec(function (err, user) {
                    if (err)
                        return callback(err, null);
                    if (!user)
                        return callback('UserNotExisted', null);
                    else
                        callback(null, user);
                });
        },
        function (user, callback) {
            bcrypt.compare(inputUser.password, user.password, function (err, result) {
                if (err)
                    callback(err, null);
                else
                    callback(null, user);
            });
        }
    ], function (err, result) {
        if (callback)
            callback(err, result);
    });
};

User.searchAgents = function (params, callback) {
    var searchParams = extend({
        term: ''
    }, params);
    User
        .find({
            email: {
                $regex: searchParams.term,
                $options: 'i'
            },
            _id: {
                $nin: [searchParams.reqUser._id]
            }
        })
        .sort({
            email: 1
        })
        .select('_id email displayName')
        .exec(function (err, users) {
            callback(err, users);
        });
};

module.exports = User;