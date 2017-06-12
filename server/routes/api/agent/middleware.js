var jwt = require('jsonwebtoken');
var config = require('../../../config');

module.exports = {
    isTokenValid: function (req, res, next) {
        var bearerToken = req.headers.authorization;
        if (bearerToken) {
            var user = jwt.verify(bearerToken.replace('Bearer ', ''), config.jwt.secret);
            if (user && user.level <= config.userLevel.agent) { // agent & admin are allowed
                req.user = user;
                next();
            } else
                res.sendStatus(401);
        }
        else
            res.sendStatus(401);
    }
};