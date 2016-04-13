// dependencies
var _ = require('lodash');
var redis = require('redis');
var async = require('async');

// config
var config = require('/systemapic/config/wu-config').serverConfig;

// connect redis
var redis = require('redis');
var redisStore = redis.createClient(6379, config.redis.layers.host, {detect_buffers : true});
redisStore.auth(config.redis.layers.auth);
redisStore.on('error', function (err) { console.error('redisStore err: ', err); });

// find keys
redisStore.keys('*', function (err, layers) {
    async.eachSeries(layers, function (key, callback) {

        // debug, do nothing
        async.setImmediate(function () {
            callback(null);
        });

        // // delete key! CAREFUL!!
        // redisStore.del(key, function (err, deleted) {
        //     console.log('err, deleted', err, deleted);
        //      async.setImmediate(function () {
        //         callback(null);
        //     });
        // });

    }, function (err) {
        console.log('err ', err);
        process.exit(err);
    });
});