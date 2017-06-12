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
        createdBy: {
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

//

module.exports = Message;