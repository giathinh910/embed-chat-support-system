var mongoose = require('mongoose');
var async = require('async');
var extend = require('extend');
var _ = require('lodash');

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
        },
        agents: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
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
        .limit(parseInt(options.perPage))
        .sort({
            _id: -1
        })
        .populate({
            path: 'agents',
            select: '_id email displayName'
        })
        .exec(function (err, sites) {
            if (err)
                console.log(err);
            else
                callback(null, sites);
        });
};

Site.getOne = function (siteId, callback) {
    Site
        .findOne({
            _id: siteId
        })
        .populate({
            path: 'agents',
            select: '_id email displayName'
        })
        .exec(function (err, site) {
            callback(err, site);
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
                        return callback('SiteExisted', null);
                    else
                        callback(null, site);
                });
        },
        function (site, callback) {
            Site.create(data, function (err, doc) {
                callback(err, doc);
            })
        }
    ], function (err, result) {
        if (callback)
            callback(err, result);
    });
};

Site.assignAgent = function (data, callback) {
    Site.findById(data.siteId, function (err, site) {
        if (err) {
            callback(err, site);
            return;
        }
        if (_.findIndex(site.agents, mongoose.Types.ObjectId(data.agentId)) === -1) {
            site.agents.unshift(data.agentId);
        }
        site.save(function (err, updatedSite) {
            if (err) {
                callback(err, updatedSite);
                return;
            }
            callback(err, updatedSite);
        });
    });
};

Site.unassignAgent = function (data, callback) {
    Site.findById(data.siteId, function (err, site) {
        if (err) {
            callback(err, site);
            return;
        }
        var agentIndex = _.findIndex(site.agents, mongoose.Types.ObjectId(data.agentId));
        if (agentIndex > -1) {
            site.agents.splice(agentIndex, 1);
        }
        site.save(function (err, updatedSite) {
            if (err) {
                callback(err, updatedSite);
                return;
            }
            callback(err, updatedSite);
        });
    });
};

module.exports = Site;