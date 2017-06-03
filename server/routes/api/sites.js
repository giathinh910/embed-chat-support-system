var express = require('express');
var router = express.Router();
var middleware = require('./middleware');
var jwt = require('jsonwebtoken');
var jwtConfig = require('../../config').jwt;

var SiteModel = require('../../model/site');

router
    .post('/', middleware.isTokenValidated, function (req, res, next) {
        var newSite = req.body;
        newSite.user = req.user._id;
        SiteModel.addNewSite(newSite, function (err, r) {
            if (err)
                res.send({
                    error: err
                });
            else
                res.send(r);
        });
    });

module.exports = router;
