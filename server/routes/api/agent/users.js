var express = require('express');
var router = express.Router();
var middleware = require('./middleware');

var UserModel = require('../../../model/user');

router
    .get('/search', middleware.isTokenValid, function (req, res, next) {
        var searchParams = req.query;
        searchParams.reqUser = req.user;
        if (searchParams.term === '')
            res.send([]);
        else
            UserModel.searchAgents(searchParams, function (err, r) {
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
        UserModel.addOne(newSite, function (err, r) {
            if (err)
                res.send({
                    error: err
                });
            else
                res.send(r);
        });
    });

module.exports = router;
