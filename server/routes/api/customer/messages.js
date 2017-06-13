var express = require('express');
var router = express.Router();
var middleware = require('./middleware');

var MessageModel = require('../../../model/message');

router
    .get('/room/:roomId', middleware.isTokenValid, function (req, res, next) {
        var reqParams = {
            room: req.params.roomId,
            user: req.user._id
        };
        MessageModel.getManyByRoom(reqParams, function (err, messages) {
            if (err)
                res.send(err);
            else
                res.send(messages);
        })
    });

module.exports = router;
