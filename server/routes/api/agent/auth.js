var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../../../config');

var UserModel = require('../../../model/user');

router
    .get('/me', function (req, res, next) {
        if (req.cookies.token) {
            var decoded = jwt.decode(req.cookies.token);
            res.send(decoded);
        } else
            res.sendStatus(401);
    })
    .post('/register', function (req, res, next) {
        var newUser = req.body;
        newUser.level = config.userLevel.agent;

        UserModel.createAgent(newUser, function (err, result) {
            if (err)
                res.send({
                    error: err
                });
            else
                res.send(result)
        });
    })
    .post('/login', function (req, res, next) {
        UserModel.authenticateAgent(req.body, function (err, user) {
            if (user) {
                req.session.user = user;
                var token = jwt.sign({
                    _id: user._id,
                    email: user.email,
                    displayName: user.displayName,
                    level: user.level
                }, config.jwt.secret);
                res.send({
                    'token': token,
                    id: user._id,
                    email: user.email,
                    displayName: user.displayName,
                    level: user.level
                });
            } else {
                res.send({
                    error: 'InvalidCredential'
                });
            }
        });
    });

module.exports = router;
