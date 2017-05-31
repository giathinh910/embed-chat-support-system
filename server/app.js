var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var io = require('socket.io');
var session = require('express-session');
var config = require('./config');
var ioChat = require('./routes/socket/chat');
require('./db/connection');

var index = require('./routes/index');
var auth = require('./routes/auth');
var chat = require('./routes/chat');
var apiAuth = require('./routes/api/auth');
var apiChat = require('./routes/api/chat');

var app = express();

// global var
app.locals.siteTitle = 'Embed Chat';

// add io to app in order to use in www
app.io = io();

// init socket
ioChat(app.io);

app.use(session({
    secret: config.session.secret
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

app.use('/', index);
app.use('/', auth);
app.use('/chat', chat);
app.use('/api/auth', apiAuth);
app.use('/api/chat', apiChat);

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
