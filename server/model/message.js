var mongoose = require('mongoose');
var async = require('async');

var Schema = mongoose.Schema;

var messageSchema = new Schema(
    {
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        room: {
            type: Schema.Types.ObjectId,
            ref: 'Room',
            required: true
        },
        content: String
    },
    {
        timestamps: true
    }
);

var Message = mongoose.model('Message', messageSchema);

//

module.exports = Message;