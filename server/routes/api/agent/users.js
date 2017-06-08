var express = require('express');
var router = express.Router();
var middleware = require('./middleware');

var UserModel = require('../../../model/user');

router
    .get('/search', middleware.isTokenValid, function (req, res, next) {
        var data = req.query;
        data.reqUser = req.user;
        if (data.term === '')
            res.send([]);
        else
            UserModel.searchAgents(data, function (err, r) {
                if (err)
                    res.send({
                        error: err
                    });
                else
                    res.send(r);
            });
    })
    .get('/site/:siteId', middleware.isTokenValid, function (req, res, next) {
        var data = {
            reqUser: req.user,
            siteId: req.params.siteId
        };
        UserModel.getCustomerListBySiteId(data, function (err, r) {
            if (err)
                res.send({
                    error: err
                });
            else
                res.send(r);
        });
    });

module.exports = router;
