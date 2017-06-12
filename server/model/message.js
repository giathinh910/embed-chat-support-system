var mongoose = require('mongoose');
var async = require('async');

var Schema = mongoose.Schema;

var messageSchema = new Schema(
    {
        content: String,
        site: {
            type: Schema.Types.ObjectId,
            ref: 'Site',
            required: true
        },
        room: {
            type: Schema.Types.ObjectId,
            ref: 'Room',
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
);

var Message = mongoose.model('Message', messageSchema);

Message.createOne = function (data, callback) {
    Message.create(data, function (err, r) {
        callback(err, r);
    });
};

Message.getMessageForCustomer = function (params, callback) {
    Message
        .find({
            site: params.site,
            room: params.room,
            user: params.user
        })
        .populate('site room user')
        .exec(function (err, r) {
            r = r ? r : [];
            callback(err, r);
        });
};

module.exports = Message;