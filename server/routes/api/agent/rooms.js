var express = require('express');
var router = express.Router();
var middleware = require('./middleware');

var RoomModel = require('../../../model/room');

router
    .get('/site/:siteId', middleware.isTokenValid, function (req, res, next) {
        RoomModel.getManyBySiteIdForAgent(req.params.siteId, function (err, r) {
            if (err)
                res.send({
                    error: err
                });
            else
                res.send(r);
        })
    });

module.exports = router;
