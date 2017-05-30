var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var jwtConfig = require('../../config').jwt;

var UserModel = require('../../model/user');

router
    .get('/me', function (req, res, next) {
        var decoded = jwt.decode(req.cookies.token);
        res.send(decoded);
    });

module.exports = router;
