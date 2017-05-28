var express = require('express');
var router = express.Router();

var pageParams = {
    pageTitle: 'Home',
    pageId: 'home'
};

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', pageParams);
});

module.exports = router;
