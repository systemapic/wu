var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
var token = helpers.token;
var httpStatus = require('http-status');
var Layer = require('../../models/layer');
var endpoints = require('../endpoints.js');
var expected = require('../../shared/errors');
var async = require('async');
var testData = require('../shared/layers/update.json');

// todo: implement this test!

module.exports = function () {
    describe(endpoints.layers.update, function () {

        var newLayerParameters = testData.newLayerParameters;
        var layerUpdates = testData.layerUpdates;
        var shouldBeAStringButItIsObject = 'should be string, but now it is an object';
        var notValidlayerUpdates = {
            title: {title: shouldBeAStringButItIsObject},
            description: {description: shouldBeAStringButItIsObject},
            satellite_position: {satellite_position: shouldBeAStringButItIsObject},
            copyright: {copyright: shouldBeAStringButItIsObject},
            tooltip: {tooltip: shouldBeAStringButItIsObject},
            style: {style: shouldBeAStringButItIsObject},
            filter: {filter: shouldBeAStringButItIsObject},
            legends: {legends: shouldBeAStringButItIsObject},
            opacity: {opacity: shouldBeAStringButItIsObject},
            zIndex: {zIndex: shouldBeAStringButItIsObject},
            data: 'testData'
        };

        var tmpLayer;

        before(function (done) {
            helpers.create_layer_by_parameters(newLayerParameters, function (err, result) {
                if (err) return done(err);
                tmpLayer = result;
                done();
            });
        });

        after(function (done) {
            helpers.delete_layer_by_id(tmpLayer.uuid, function (err) {
                if (err) return done(err);
                done();
            })
        });

        it('should respond with status code 401 when not authenticated', function (done) {
            api.post(endpoints.layers.update)
                .send({})
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });

        it('should respond with status code 400 and error if layer doesn\'t exist in request body', function (done) {
            token(function (err, access_token) {
                if (err) return done(err);
                api.post(endpoints.layers.update)
                    .send({access_token: access_token})
                    .expect(httpStatus.BAD_REQUEST)
                    .end(function (err, res) {

                        if (err) return done(err);
                        var result = helpers.parse(res.text);
                        expect(result.error.message).to.be.equal(expected.missing_information.errorMessage);
                        expect(result.error.code).to.be.equal(httpStatus.BAD_REQUEST);
                        expect(result.error.errors.missingRequiredFields).to.be.an.array;
                        expect(result.error.errors.missingRequiredFields).to.include('layer');
                        done();
                    });
            });
        });

        it('should respond with status code 404 and error if layer doesn\'t exist', function (done) {
            token(function (err, access_token) {
                if (err) return done(err);
                api.post(endpoints.layers.update)
                    .send({
                        layer: 'bad layer',
                        access_token: access_token
                    })
                    .expect(httpStatus.NOT_FOUND)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);
                        expect(result.error.message).to.be.equal(expected.no_such_layers.errorMessage);
                        done();
                    });
            });
        });

        it ('should respond with status code *** if user try update uuid of layer', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                api.post(endpoints.layers.update)
                    .send({
                        layer: tmpLayer.uuid,
                        access_token: access_token,
                        uuid: "new layer uuid"
                    })
                    .expect(httpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);
                        expect(result.error.message).to.be.equal(expected.uuid_can_not_be_changed.errorMessage);
                        done();
                    });
            });
        });

        it('should respond with status code 200 and update layer correctly', function (done) {
            token(function (err, access_token) {
                if (err) return done(err);
                var ops = [];
                layerUpdates.access_token = access_token;
                layerUpdates.layer = tmpLayer.uuid;
                ops.push(function (callback) {
                    api.post(endpoints.layers.update)
                        .send(layerUpdates)
                        .expect(httpStatus.OK)
                        .end(function (err, res) {
                            if (err) return callback(err);
                            callback(null, res);
                        });
                });

                ops.push(function (options, callback) {
                    Layer
                    .findOne({uuid: layerUpdates.layer})
                    .exec(function (err, res) {
                        if (err) {
                            return callback(err);
                        }

                        var result = helpers.parse(options.text);

                        expect(result.updated).to.be.not.empty;
                        expect(result.updated).to.include('satellite_position');
                        expect(result.updated).to.include('description');
                        expect(result.updated).to.include('copyright');
                        expect(result.updated).to.include('title');
                        expect(result.updated).to.include('tooltip');
                        expect(result.updated).to.include('style');
                        expect(result.updated).to.include('filter');
                        expect(result.updated).to.include('legends');
                        expect(result.updated).to.include('opacity');
                        expect(result.updated).to.include('zIndex');
                        expect(result.updated).to.include('data');
                        expect(res.uuid).to.be.equal(layerUpdates.layer);
                        expect(res.title).to.be.equal(layerUpdates.title);
                        expect(res.description).to.be.equal(layerUpdates.description);
                        expect(res.satellite_position).to.be.equal(layerUpdates.satellite_position);
                        expect(res.copyright).to.be.equal(layerUpdates.copyright);
                        expect(res.tooltip).to.be.equal(layerUpdates.tooltip);
                        expect(res.style).to.be.equal(layerUpdates.style);
                        expect(res.filter).to.be.equal(layerUpdates.filter);
                        expect(res.legends).to.be.equal(layerUpdates.legends);
                        expect(res.opacity).to.be.equal(layerUpdates.opacity);
                        expect(res.zIndex).to.be.equal(layerUpdates.zIndex);
                        expect(res.data.geojson).to.be.equal(layerUpdates.data.geojson);
                        expect(res.data.topojson).to.be.equal(layerUpdates.data.topojson);
                        expect(res.data.cartoid).to.be.equal(layerUpdates.data.cartoid);
                        expect(res.data.raster).to.be.equal(layerUpdates.data.raster);
                        expect(res.data.rastertile).to.be.equal(layerUpdates.data.rastertile);
                        expect(res.data.vectortile).to.be.equal(layerUpdates.data.vectortile);
                        expect(res.data.mapbox).to.be.equal(layerUpdates.data.mapbox);
                        expect(res.data.cartodb).to.be.equal(layerUpdates.data.cartodb);
                        expect(res.data.osm).to.be.equal(layerUpdates.data.osm);
                        expect(res.data.norkart).to.be.equal(layerUpdates.data.norkart);
                        expect(res.data.google).to.be.equal(layerUpdates.data.google);
                        expect(res.data.postgis.sql).to.be.equal(layerUpdates.data.postgis.sql);
                        expect(res.data.postgis.cartocss).to.be.equal(layerUpdates.data.postgis.cartocss);
                        expect(res.data.postgis.cartocss_version).to.be.equal(layerUpdates.data.postgis.cartocss_version);
                        expect(res.data.postgis.geom_column).to.be.equal(layerUpdates.data.postgis.geom_column);
                        expect(res.data.postgis.file_id).to.be.equal(layerUpdates.data.postgis.file_id);
                        expect(res.data.postgis.database_name).to.be.equal(layerUpdates.data.postgis.database_name);
                        expect(res.data.postgis.table_name).to.be.equal(layerUpdates.data.postgis.table_name);
                        expect(res.data.postgis.data_type).to.be.equal(layerUpdates.data.postgis.data_type);
                        expect(res.data.postgis.geom_type).to.be.equal(layerUpdates.data.postgis.geom_type);
                        expect(res.data.postgis.raster_band).to.be.equal(layerUpdates.data.postgis.raster_band);
                        expect(res.data.postgis.layer_id).to.be.equal(layerUpdates.data.postgis.layer_id);
                        expect(res.data.postgis.metadata).to.be.equal(layerUpdates.data.postgis.metadata);
                        callback();
                    });
                });
                async.waterfall(ops, function (err) {
                    if (err) return done(err);
                    done();
                });
            });
        });

        it('should should respond with status code 400 if some fields have bad type', function (done) {
            token(function (err, access_token) {
                if (err) {
                    return done(err);
                }

                notValidlayerUpdates.access_token = access_token;
                notValidlayerUpdates.layer = tmpLayer.uuid;
                api.post(endpoints.layers.update)
                    .send(notValidlayerUpdates)
                    .expect(httpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);
                        expect(result.error.message).to.be.equal(expected.invalid_fields.errorMessage);
                        expect(result.error.errors).to.be.an.array;
                        expect(result.error.errors).to.be.not.empty;
                        expect(result.error.errors.title.value.title).to.be.equal(shouldBeAStringButItIsObject);
                        expect(result.error.errors.title.message).to.be.equal('Cast to String failed for value "[object Object]" at path "title"');
                        expect(result.error.errors.description.value.description).to.be.equal(shouldBeAStringButItIsObject);
                        expect(result.error.errors.description.message).to.be.equal('Cast to String failed for value "[object Object]" at path "description"');
                        expect(result.error.errors.satellite_position.value.satellite_position).to.be.equal(shouldBeAStringButItIsObject);
                        expect(result.error.errors.satellite_position.message).to.be.equal('Cast to String failed for value "[object Object]" at path "satellite_position"');
                        expect(result.error.errors.copyright.value.copyright).to.be.equal(shouldBeAStringButItIsObject);
                        expect(result.error.errors.copyright.message).to.be.equal('Cast to String failed for value "[object Object]" at path "copyright"');
                        expect(result.error.errors.tooltip.value.tooltip).to.be.equal(shouldBeAStringButItIsObject);
                        expect(result.error.errors.tooltip.message).to.be.equal('Cast to String failed for value "[object Object]" at path "tooltip"');
                        expect(result.error.errors.style.value.style).to.be.equal(shouldBeAStringButItIsObject);
                        expect(result.error.errors.style.message).to.be.equal('Cast to String failed for value "[object Object]" at path "style"');
                        expect(result.error.errors.filter.value.filter).to.be.equal(shouldBeAStringButItIsObject);
                        expect(result.error.errors.filter.message).to.be.equal('Cast to String failed for value "[object Object]" at path "filter"');
                        expect(result.error.errors.legends.value.legends).to.be.equal(shouldBeAStringButItIsObject);
                        expect(result.error.errors.legends.message).to.be.equal('Cast to String failed for value "[object Object]" at path "legends"');
                        expect(result.error.errors.opacity.value.opacity).to.be.equal(shouldBeAStringButItIsObject);
                        expect(result.error.errors.opacity.message).to.be.equal('Cast to String failed for value "[object Object]" at path "opacity"');
                        expect(result.error.errors.zIndex.value.zIndex).to.be.equal(shouldBeAStringButItIsObject);
                        expect(result.error.errors.zIndex.message).to.be.equal('Cast to Number failed for value "[object Object]" at path "zIndex"');
                        expect(result.error.errors.data.value).to.be.equal('testData');
                        expect(result.error.errors.data.message).to.be.equal('Cast to Object failed for value "testData" at path "data"');
                        done();
                    });
            });
        });

    });
};