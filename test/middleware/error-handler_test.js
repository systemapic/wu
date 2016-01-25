'use strict';

var path = require('path');
var express = require('express');
var supertest = require('supertest');
var httpStatus = require('http-status');
var errorHandler = require('../../middleware/error-handler');

describe('Error handler', function () {

  before(function () {
    var server = express()
      .get('/', function (req, res) {
        res.json({
          status: 'Ok'
        });
      })
      .get('/error', function (req, res, next) {
        next(new Error('Ooops'));
      })
      .use(errorHandler());

    server.set('views', path.resolve(__dirname, '../../../../lib/views'));

    this.app = supertest(server);
  });

  it('should not handle error if request proceeded successfully', function () {
    return this.app.get('/')
      .expect(httpStatus.OK);
  });

});
