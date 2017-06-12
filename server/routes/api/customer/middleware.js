var jwt = require('jsonwebtoken');
var config = require('../../../config');

module.exports = {
    isTokenValid: function (req, res, next) {
        var bearerToken = req.headers.authorization;
        if (bearerToken) {
            var user = jwt.verify(bearerToken.replace('Bearer ', ''), config.jwt.secret);
            console.log(user);
            if (user && user.level === config.userLevel.customer) { // only customer is allowed
                req.user = user;
                next();
            } else
                res.sendStatus(401);
        }
        else
            res.sendStatus(401);
    }
};
