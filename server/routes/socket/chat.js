var jwt = require('jsonwebtoken');
var request = require('request');
var config = require('../../config');
var _ = require('lodash');
var util = require('util');

var SiteModel = require('../../model/site');

var onlineCustomers = {
    // 'domain-id': [
    //     {
    //         sockets: [],
    //         user: {
    //             _id: '',
    //             email: '',
    //             displayName: '',
    //             level: '',
    //             domain: ''
    //         }
    //     }
    // ]
};

var onlineAgents = [
    // {
    //     sockets: [],
    //     user: {
    //         _id: '',
    //         email: '',
    //         displayName: '',
    //         level: '',
    //         domain: ''
    //     }
    // }
];

module.exports = function (io) {
    // Establish handshake
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

    // Bind customer connection
    io.of('/ws/chat/customer').on('connect', function (socket) {
        console.log('a customer connected', socket.id);

        /*=== HANDLE USER GOING ONLINE ======================================================*/
        // get user info from token
        var decoded = jwt.decode(socket.request._query['token'], {complete: true}),
            decodedUser = decoded.payload;

        // init a domain container
        if (!onlineCustomers[decodedUser.site]) {
            onlineCustomers[decodedUser.site] = [];
        }

        var onlineUserIndex = _.findIndex(onlineCustomers[decodedUser.site], function (onlineUser) {
            return String(onlineUser.user._id) === decodedUser._id;
        });

        if (onlineUserIndex === -1) { // case user hasn't existed yet
            onlineCustomers[decodedUser.site].push({
                sockets: [socket.id],
                user: decodedUser
            });
            // broadcast user online
            socket.broadcast.emit('a customer comes online', decodedUser);
        } else { // case user has already online, just push socket id
            onlineCustomers[decodedUser.site][onlineUserIndex].sockets.push(socket.id);
        }

        console.log('customers', util.inspect(onlineCustomers, {showHidden: false, depth: null}));
        /*=====================================================================================*/


        socket.join(decodedUser.room._id);

        socket.on('user says', function (message) {
            console.log('user says', message);
        });


        /*=== HANDLE USER GOING OFFLINE ======================================================*/
        socket.on('disconnect', function () {
            console.log('a customer disconnected', socket.id);

            // find the online user by socket.id
            var onlineUserIndex = _.findIndex(onlineCustomers[decodedUser.site], function (onlineUser) {
                if (_.indexOf(onlineUser.sockets, socket.id) !== -1)
                    return true;
            });

            // find socket id index by socket.id
            var onlineUserSocketIndex = _.indexOf(onlineCustomers[decodedUser.site][onlineUserIndex].sockets, socket.id);

            // remove the socket.id from that user
            onlineCustomers[decodedUser.site][onlineUserIndex].sockets.splice(onlineUserSocketIndex, 1);

            // if sum of socket id of that user equals 0, then remove that user (come offline)
            if (onlineCustomers[decodedUser.site][onlineUserIndex].sockets.length === 0) {
                socket.broadcast.emit('a customer comes offline', onlineCustomers[decodedUser.site][onlineUserIndex].user);
                onlineCustomers[decodedUser.site].splice(onlineUserIndex, 1);
            }

            console.log('customers', onlineCustomers[decodedUser.site]);
        });
        /*=====================================================================================*/
    });

    // Bind agent connection
    io.of('/ws/chat/agent').on('connect', function (socket) {
        console.log('an agent connected', socket.id);

        /*=== HANDLE USER GOING ONLINE ======================================================*/
        // get user info from token
        var decoded = jwt.decode(socket.request._query['token'], {complete: true}),
            decodedUser = decoded.payload;

        var onlineAgentIndex = _.findIndex(onlineAgents, function (onlineAgent) {
            return String(onlineAgent.user._id) === decodedUser._id;
        });

        // case user hasn't existed yet
        if (onlineAgentIndex === -1) {
            onlineAgents.push({
                sockets: [socket.id],
                user: decodedUser
            });
            // broadcast user online
            socket.broadcast.emit('an agent comes online', decodedUser);
        }
        // case user has already online, just push socket id
        else {
            onlineAgents[onlineAgentIndex].sockets.push(socket.id);
        }

        console.log('agents', util.inspect(onlineAgents, {showHidden: false, depth: null}));
        /*=====================================================================================*/


        var siteId = socket.request._query['siteId'];

        socket.on('request init data for agent', function() {
            socket.emit('respond init data for agent', {
                onlineCustomers: onlineCustomers[siteId]
            });
        });

        socket.emit('init data for agent', {
            onlineCustomers: onlineCustomers[siteId]
        });

        socket.on('agent says', function (message) {
            console.log('agent says', message);
        });


        /*=== HANDLE USER GOING OFFLINE ======================================================*/
        socket.on('disconnect', function () {
            console.log('an agent disconnected', socket.id);

            // find the online user by socket.id
            var onlineAgentIndex = _.findIndex(onlineAgents, function (onlineUser) {
                if (_.indexOf(onlineUser.sockets, socket.id) !== -1)
                    return true;
            });

            // find socket id index by socket.id
            var onlineUserSocketIndex = _.indexOf(onlineAgents[onlineAgentIndex].sockets, socket.id);

            // remove the socket.id from that user
            onlineAgents[onlineAgentIndex].sockets.splice(onlineUserSocketIndex, 1);

            // if sum of socket id of that user equals 0, then remove that user (come offline)
            if (onlineAgents[onlineAgentIndex].sockets.length === 0) {
                socket.broadcast.emit('an agent comes offline', onlineAgents[onlineAgentIndex].user);
                onlineAgents.splice(onlineAgentIndex, 1);
            }

            console.log('agents', onlineAgents);
        });
        /*=====================================================================================*/
    })
};