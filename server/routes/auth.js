var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var jwtConfig = require('../config').jwt;

var UserModel = require('../model/user');

// just create a default account
UserModel.createNewUser({
    email: 'agent1@email.com',
    password: '121212',
    display_name: 'Agent 1',
    level: 1
});

var pageData = {
    register: {
        pageTitle: 'Sign Up',
        pageId: 'register'
    },
    login: {
        pageTitle: 'Sign In',
        pageId: 'login'
    }
};

router
    .get('/register', function (req, res, next) {
        res.render('auth/register', pageData.register);
    })
    .post('/register', function (req, res, next) {
        var registerPageData = {
            pageTitle: pageData.register.pageTitle,
            pageId: pageData.register.pageId
        };

        // validate
        if (!req.body.email || !req.body.password || !req.body.display_name) {
            registerPageData.alerts = [{
                type: 'warning',
                content: 'Please fill all required fields'
            }];
            res.render('auth/register', registerPageData);
            return;
        }

        var newUser = req.body;
        newUser.level = 4;

        UserModel.createNewUser(newUser, function (err, result) {
            if (err) {
                registerPageData.alerts = [{
                    type: 'info',
                    content: 'User with this email already existed'
                }];
                res.render('auth/register', registerPageData);
            } else {
                res.redirect('/login?register=success');
            }
        });
    })
    .get('/login', function (req, res, next) {
        var loginPageData = {
            pageTitle: pageData.login.pageTitle,
            pageId: pageData.login.pageId
        };
        if (req.query.register) {
            loginPageData.alerts = [{
                type: 'success',
                content: 'You can now sign in with just-created account'
            }];
        }
        res.render('auth/login', loginPageData);
    })
    .post('/login', function (req, res, next) {
        var loginPageData = {
            pageTitle: pageData.login.pageTitle,
            pageId: pageData.login.pageId
        };

        // validate
        if (!req.body.email || !req.body.password) {
            loginPageData.alerts = [{
                type: 'warning',
                content: 'Please fill all required fields'
            }];
            res.render('auth/login', loginPageData);
            return;
        }

        UserModel.authenticate(req.body, function (err, user) {
            if (user) {
                req.session.user = user;
                var token = jwt.sign({
                    _id: user._id,
                    email: user.email,
                    display_name: user.display_name
                }, jwtConfig.secret);
                res.cookie('token', token).redirect('/chat');
            } else {
                loginPageData.alerts = [{
                    type: 'danger',
                    content: 'Login failed'
                }];
                res.render('auth/login', loginPageData);
            }
        });
    })
    .get('/logout', function (req, res, next) {
        req.session.destroy();
        res.clearCookie("token").redirect('/');
    });

module.exports = router;
