var express = require('express');
var router = express.Router();
var middleware = require('./middleware');

var SiteModel = require('../../../model/site');

router
    .get('/', middleware.isTokenValid, function (req, res, next) {
        var data = req.query;
        data.user = req.user._id;
        SiteModel.getList(data, function (err, r) {
            if (err)
                res.send({
                    error: err
                });
            else
                res.send(r);
        });
    })
    .get('/:siteId', middleware.isTokenValid, function (req, res, next) {
        SiteModel.getOne(req.params.siteId, function (err, r) {
            if (err)
                res.send({
                    error: err
                });
            else
                res.send(r);
        });
    })
    .post('/', middleware.isTokenValid, function (req, res, next) {
        var newSite = req.body;
        newSite.user = req.user._id;
        SiteModel.addOne(newSite, function (err, r) {
            if (err)
                res.send({
                    error: err
                });
            else
                res.send(r);
        });
    });

module.exports = router;
