var mongoose = require('mongoose');
var async = require('async');
var _ = require('lodash');

var User = require('./user');

var Schema = mongoose.Schema;

var roomSchema = new Schema(
    {
        displayName: String,
        users: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }],
        site: {
            type: Schema.Types.ObjectId,
            ref: 'Site'
        }
    },
    {
        timestamps: true
    }
);

var Room = mongoose.model('Room', roomSchema);

Room.createOne = function (data, callback) {
    Room.create(data, function (err, r) {
        callback(err, r);
    });
};

Room.getOneByCustomerId = function (customerId, callback) {
    Room
        .findOne({
            users: {
                $in: [customerId]
            }
        })
        .select('_id displayName')
        .exec(function (err, r) {
            callback(err, r);
        })
};

Room.getManyBySiteIdForAgent = function (siteId, callback) {
    async.waterfall([
        function (callback) {
            async.parallel({
                rooms: function (callback) {
                    Room
                        .find({
                            site: siteId
                        })
                        .select('_id displayName site users')
                        .exec(function (err, r) {
                            if (err)
                                return callback(err, null);
                            callback(err, r);
                        })
                },
                users: function (callback) {
                    User
                        .find({
                            site: siteId
                        })
                        .select('_id displayName')
                        .exec(function (err, r) {
                            if (err)
                                return callback(err, null);
                            callback(err, r);
                        })
                }
            }, function (err, result) {
                if (err || !result)
                    return callback(err, null);
                callback(err, result);
            })
        },
        function (prevResult, callback) {
            prevResult.rooms.forEach(function (room, roomIndex) {
                room.users.forEach(function (user) {
                    var userIndex = _.findIndex(prevResult.users, {_id: user});
                    prevResult.rooms[roomIndex].displayName = prevResult.users[userIndex].displayName;
                });
            });
            callback(null, prevResult.rooms);
        }
    ], function (err, result) {
        callback(err, result);
    });
};

module.exports = Room;