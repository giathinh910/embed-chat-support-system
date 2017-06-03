var mongoose = require('mongoose');
var async = require('async');

var Schema = mongoose.Schema;

var messageSchema = new Schema(
    {
        domain: {
            type: String,
            required: true
        },
        displayName: {
            type: String,
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

var Site = mongoose.model('Site', messageSchema);

Site.getList = function (params, callback) {
    if (params)
        Site.find({user: params.user}, function (err, docs) {
            callback(err, docs);
        })
};

Site.addNewSite = function (data, callback) {
    async.waterfall([
        function (callback) {
            Site
                .findOne({
                    domain: data.domain,
                    user: data.user
                })
                .exec(function (err, site) {
                    if (err)
                        console.log(err);
                    else
                        callback(null, site);
                });
        },
        function (site, callback) {
            if (site)
                callback('SiteExisted', null);
            else
                Site.create(data, function (err, doc) {
                    callback(err, doc);
                })
        }
    ], function (err, result) {
        callback(err, result);
    });
};

module.exports = Site;