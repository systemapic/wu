var api = require('../api/api');
var util =require('util');

/**
 * @returns slack middleware
 */
module.exports = function () {
    /**
     * Defines request type and forms error's response by this type.
     *
     * @param {Object} err error object
     * @param {Object} req express request object
     * @param {Object} res express response object
     * @param {Object} next next middleware in line in the
     * request-response cycle of an Express application
     */
    return function (req, res, next) {
        var slackMessage = req.slackMessage || {};
        var user = req.user || {};
        var userId = user._id || null;

        slackMessage.text = util.format("User %s has performed an action %s. request: %s", userId || slackMessage.userId , req.originalUrl || slackMessage.action, JSON.stringify(req.body));

        console.log("SLACKMESSAGE: ", slackMessage.text);
        api.slack._send(slackMessage);
        res.send(JSON.stringify(req.response));
    };
};