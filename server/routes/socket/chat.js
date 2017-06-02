var jwt = require('jsonwebtoken');
var request = require('request');
var config = require('../../config');
var _ = require('lodash');

var onlineUsers = [];

module.exports = function (io) {
    io.use(function (socket, next) {
        var handshakeData = socket.request;
        var token = handshakeData._query['token'];
        try {
            var user = jwt.verify(token, config.jwt.secret);
            console.log('socket handshake established');
            if (user)
                next();
        } catch (err) {
            console.log('jwt verify failed', {
                name: err.name,
                message: err.message
            });
            next(new Error('Authentication error'));
        }
    });

    io.of('/ws/chat')
        .on('connect', function (socket) {
            console.log('an user connected', socket.id);

            /*=== HANDLE USER GOING ONLINE ======================================================*/
            // get user info from token
            var decoded = jwt.decode(socket.request._query['token'], {complete: true});

            var decodedUser = decoded.payload;

            var onlineUserIndex = _.findIndex(onlineUsers, function (onlineUser) {
                return String(onlineUser.user._id) === decodedUser._id;
            });

            if (onlineUserIndex === -1) { // case user hasn't existed yet
                onlineUsers.push({
                    sockets: [socket.id],
                    user: decodedUser
                });
                // broadcast user online
                socket.broadcast.emit('an user comes online', decodedUser);
            } else { // case user has already online, just push socket id
                onlineUsers[onlineUserIndex].sockets.push(socket.id);
            }

            console.log('onlineUsers', onlineUsers);
            /*=====================================================================================*/


            socket.on('user says', function(message) {
                console.log('user says', message);
            });


            /*=== HANDLE USER GOING OFFLINE ======================================================*/
            socket.on('disconnect', function () {
                console.log('an user disconnected', socket.id);

                // find the online user by socket.id
                var onlineUserIndex = _.findIndex(onlineUsers, function (onlineUser) {
                    if (_.indexOf(onlineUser.sockets, socket.id) !== -1)
                        return true;
                });

                // find socket id index by socket.id
                var onlineUserSocketIndex = _.indexOf(onlineUsers[onlineUserIndex].sockets, socket.id);

                // remove the socket.id from that user
                onlineUsers[onlineUserIndex].sockets.splice(onlineUserSocketIndex, 1);

                // if sum of socket id of that user equals 0, then remove that user
                if (onlineUsers[onlineUserIndex].sockets.length === 0) {
                    socket.broadcast.emit('an user comes offline', onlineUsers[onlineUserIndex].user);
                    onlineUsers.splice(onlineUserIndex, 1);
                }

                console.log('onlineUsers', onlineUsers);
            });
            /*=====================================================================================*/
        })
};