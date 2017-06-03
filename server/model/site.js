var mongoose = require('mongoose');
var async = require('async');
var extend = require('extend');

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
    var options = extend({
        page: 1,
        perPage: 10
    }, params);

    var skip = (options.page - 1) * options.perPage; // page 1 will have skip = 0

    Site
        .find({user: options.user})
        .skip(skip)
        .limit(options.perPage)
        .sort({
            _id: -1
        })
        .exec(function (err, sites) {
            if (err)
                console.log(err);
            else
                callback(null, sites);
        });
};

Site.addOne = function (data, callback) {
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