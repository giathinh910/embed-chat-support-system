module.exports = {
    checkUserAgentLoggedIn: function (req, res, next) {
        if (req.session.userAgent) {
            res.locals.userAgent = req.session.userAgent;
            next();
        } else {
            res.redirect('/login');
        }
    }
};