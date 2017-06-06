var jwt = require('jsonwebtoken');
var jwtConfig = require('../../../config').jwt;

module.exports = {
    isTokenValidated: function (req, res, next) {
        var bearerToken = req.headers.authorization;
        if (bearerToken) {
            var user = jwt.verify(bearerToken.replace('Bearer ', ''), jwtConfig.secret);
            if (user) {
                req.user = user;
                next();
            }
        }
        else
            res.sendStatus(401);
    }
};