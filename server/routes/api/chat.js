var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var jwtConfig = require('../../config').jwt;

var RoomModel = require('../../model/room');
var MessageModel = require('../../model/message');

router
    .get('/room', function (req, res, next) {
        var decoded = jwt.decode(req.cookies.token);
        res.send(decoded);
    });

module.exports = router;
