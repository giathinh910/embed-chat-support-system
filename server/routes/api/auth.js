var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var jwtConfig = require('../../config').jwt;

var UserModel = require('../../model/user');

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
        newUser.level = 11;

        UserModel.createNewUser(newUser, function (err, result) {
            if (err) {
                res.send({
                    error: err
                });
            } else
                res.send(result);
        });
    })
    .post('/login', function (req, res, next) {
        UserModel.authenticate(req.body, function (err, user) {
            if (user) {
                req.session.user = user;
                var token = jwt.sign({
                    _id: user._id,
                    email: user.email,
                    displayName: user.displayName
                }, jwtConfig.secret);
                res.send({
                    'token': token,
                    user: {
                        email: user.email,
                        displayName: user.displayName
                    }
                });
            } else {
                res.status(404).send({
                    error: 'InvalidCredential'
                });
            }
        });
    });

module.exports = router;
