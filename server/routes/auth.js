var express = require('express');
var router = express.Router();

var UserModel = require('../model/user');

// just create a default account
UserModel.createNewUser({
    email: 'agent1@email.com',
    password: '121212',
    display_name: 'Agent 1',
    level: 1
});

var pageParams = {
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
        res.render('auth/register', pageParams.register);
    })
    .post('/register', function (req, res, next) {
        var registerPageParams = {
            pageTitle: pageParams.register.pageTitle,
            pageId: pageParams.register.pageId
        };

        // validate
        if (!req.body.email || !req.body.password || !req.body.display_name) {
            registerPageParams.messages = [{
                type: 'warning',
                content: 'Please fill all required fields'
            }];
            res.render('auth/register', registerPageParams);
            return;
        }

        var newUser = req.body;
        newUser.level = 4;

        UserModel.createNewUser(newUser, function (err, result) {
            if (err) {
                registerPageParams.messages = [{
                    type: 'info',
                    content: 'User with this email already existed'
                }];
                res.render('auth/register', registerPageParams);
            } else {
                res.redirect('/login?register=success');
            }
        });
    })
    .get('/login', function (req, res, next) {
        var loginPageParams = {
            pageTitle: pageParams.login.pageTitle,
            pageId: pageParams.login.pageId
        };
        if (req.query.register) {
            loginPageParams.messages = [{
                type: 'success',
                content: 'You can now sign in with just-created account'
            }];
        }
        res.render('auth/login', loginPageParams);
    })
    .post('/login', function (req, res, next) {
        var loginPageParams = {
            pageTitle: pageParams.login.pageTitle,
            pageId: pageParams.login.pageId
        };

        // validate
        if (!req.body.email || !req.body.password) {
            loginPageParams.messages = [{
                type: 'warning',
                content: 'Please fill all required fields'
            }];
            res.render('auth/login', loginPageParams);
            return;
        }

        UserModel.authenticate(req.body, function (err, user) {
            if (user) {
                req.session.user = user;
                res.redirect('/chat');
            } else {
                loginPageParams.messages = [{
                    type: 'danger',
                    content: 'Login failed'
                }];
                res.render('auth/login', loginPageParams);
            }
        });
    })
    .get('/logout', function (req, res, next) {
        req.session.destroy();
        res.redirect('/');
    });

module.exports = router;
