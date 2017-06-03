var express = require('express');
var router = express.Router();
var middleware = require('./middleware');

var SiteModel = require('../../model/site');

router.use(middleware.isTokenValidated)
    .get('/', function (req, res, next) {
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
    .post('/', function (req, res, next) {
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
