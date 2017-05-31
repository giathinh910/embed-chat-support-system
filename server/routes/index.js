var express = require('express');
var router = express.Router();
var middleware = require('../routes/middleware');

var pageParams = {
    pageTitle: 'Home',
    pageId: 'home'
};

/* GET home page. */
router.get('/', middleware.checkUserNotLoggedIn, function (req, res, next) {
    res.render('index', pageParams);
});

module.exports = router;
