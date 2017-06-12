var express = require('express');
var router = express.Router();
var middleware = require('./middleware');

var MessageModel = require('../../../model/message');

router
    .get('/', middleware.isTokenValid, function (req, res, next) {
        var reqParams = {
            site: req.query.site,
            room: req.query.room,
            user: req.user._id
        };
        MessageModel.getMessageForCustomer(reqParams, function (err, messages) {
            if (err)
                res.send(err);
            else
                res.send(messages);
        })
    });

module.exports = router;
