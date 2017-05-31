var mongoose = require('mongoose');
var async = require('async');

var Schema = mongoose.Schema;

var roomSchema = new Schema(
    {
        name: String,
        user: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }]
    },
    {
        timestamps: true
    }
);

var Room = mongoose.model('Room', roomSchema);

module.exports = Room;