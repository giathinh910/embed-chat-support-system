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
    });

module.exports = router;
