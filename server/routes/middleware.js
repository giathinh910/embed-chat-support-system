module.exports = {
    checkUserLoggedIn: function (req, res, next) {
        if (req.session.user) {
            res.locals.user = req.session.user;
            next();
        } else {
            res.redirect('/login');
        }
    },
    checkUserNotLoggedIn: function (req, res, next) {
        if (!req.session.user) {
            next();
        } else {
            res.redirect('/chat');
        }
    }
};