var express = require('express');
var router = express.Router();
var middleware = require('./middleware');

var MessageModel = require('../../../model/message');

router
    .get('/', middleware.isTokenValid, function (req, res, next) {
        //
    });

module.exports = router;
