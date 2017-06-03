var express = require('express');
var router = express.Router();
var middleware = require('../routes/middleware');

var pageData = {
    pageTitle: 'My Sites',
    pageId: 'sites'
};

router.get('/', middleware.checkUserLoggedIn, function (req, res, next) {
    var data = {
        pageTitle: pageData.pageTitle,
        pageId: pageData.pageId,
        user: req.session.user
    };
    res.render('sites', data);
});

module.exports = router;
