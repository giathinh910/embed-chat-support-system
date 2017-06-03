var jwt = require('jsonwebtoken');
var jwtConfig = require('../config').jwt;

module.exports = {
    checkUserLoggedIn: function (req, res, next) {
        var token = req.cookies.token;
        if (token) {
            var user = jwt.verify(token, jwtConfig.secret);
            if (user) {
                req.session.user = user;
                next();
            }
        } else {
            res.redirect('/login');
        }
    },
    checkUserNotLoggedIn: function (req, res, next) {
        var token = req.cookies.token;
        if (token) {
            var user = jwt.verify(token, jwtConfig.secret);
            console.log(user);
            if (user) {
                req.session.user = user;
                res.redirect('/chat');
            }
        } else {
            next();
        }
    }
};

// module.exports = {
//     checkUserLoggedIn: function (req, res, next) {
//         if (req.session.user) {
//             res.locals.user = req.session.user;
//             next();
//         } else {
//             res.redirect('/login');
//         }
//     },
//     checkUserNotLoggedIn: function (req, res, next) {
//         if (!req.session.user) {
//             next();
//         } else {
//             res.redirect('/chat');
//         }
//     }
// };