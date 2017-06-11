var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
require('./db/connection');
var io = require('socket.io');
var session = require('express-session');
var mongoose = require('mongoose').Promise = global.Promise;
var config = require('./config');

var app = express();

// global var
app.locals.siteTitle = 'Embed Chat';

// add io to app in order to use in www
app.io = io();

app.use(session({
    cookie: {
        maxAge: 3600000
    },
    secret: config.session.secret,
    resave: true,
    saveUninitialized: false
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'images', 'chat.svg')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(sassMiddleware({
    src: path.join(__dirname, 'scss'),
    dest: path.join(__dirname, 'public/stylesheets'),
    outputStyle: 'compressed',
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true,
    prefix: '/stylesheets'
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/', require('./routes/auth'));
app.use('/sites', require('./routes/site'));
app.use('/chat', require('./routes/chat'));
app.use('/api', require('./routes/api/cors'));

// API agent
app.use('/api/agent/auth', require('./routes/api/agent/auth'));
app.use('/api/agent/sites', require('./routes/api/agent/sites'));
app.use('/api/agent/users', require('./routes/api/agent/users'));
app.use('/api/agent/rooms', require('./routes/api/agent/rooms'));

// API customer
app.use('/api/customer/auth', require('./routes/api/customer/auth'));
app.use('/api/customer/chat', require('./routes/api/customer/chat'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
