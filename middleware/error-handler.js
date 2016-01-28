var _ = require('lodash');
var httpStatus = require('http-status');
/**
 * @returns error handler middleware
 */
module.exports = function () {
  var fields = ['code', 'message', 'errors', 'stack'];

  // In future we can hide stack on production env
  // if (env === 'production') {
  //   fields = ['code', 'message', 'errors'];
  // }

  /**
   * Defines request type and forms error's response by this type.
   *
   * @param {Object} err error object
   * @param {Object} req express request object
   * @param {Object} res express response object
   * @param {Object} next next middleware in line in the
   * request-response cycle of an Express application
   */
  return function (err, req, res, next) {
    var type = err.type || 'json';

    //pick required fields
    err = _.pick(err, fields);
    err.code = err.code || httpStatus.INTERNAL_SERVER_ERROR;

    res.status(err.code);

    console.log('Error: ', err);

    if (type === 'html') {
      res.render('error', {
        error: err
      });
    } else if (type === 'json') {
      res.json({
        error: err
      });
    } else {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(err.message);
    }
  };
};