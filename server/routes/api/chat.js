var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var jwtConfig = require('../../config').jwt;

var RoomModel = require('../../model/room');
var MessageModel = require('../../model/message');

router
    .post('/messages', function (req, res, next) {
        //
    });

module.exports = router;
