var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');
var crypto = require('crypto');
var request = require('request');
var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var User = require('../../models/user');
var helpers = require('./../helpers');
var token = helpers.token;
var expected = require('../../shared/errors');
var httpStatus = require('http-status');
var endpoints = require('../endpoints.js');
var coreTestData = require('../shared/core.json');
var testData = require('../shared/project/update.json');
var second_test_user = coreTestData.secondTestUser;
var async = require('async');

module.exports = function () {
    var tmpProject ={};
    var tmpSecondProject ={};

    before(function (done) {
        var ops = [];

        ops.push(function (callback) {
            helpers.create_project_by_info(testData.projectInfo, function (err, project) {
                if (err) return callback(err);
                tmpProject = project;
                callback();
            });
        });

        ops.push(function (callback) {
            helpers.create_project_by_info(testData.secondProjectInfo, function (err, project) {
                if (err) return callback(err);
                tmpSecondProject = project;
                callback();
            });
        });

        async.parallel(ops, done);
    });

    after(function (done) {
        var ops = [];

        ops.push(function (callback) {
            helpers.delete_project_by_id(tmpProject.uuid, callback);
        });
        
        ops.push(function (callback) {
            helpers.delete_project_by_id(tmpSecondProject.uuid, callback);
        });

        async.parallel(ops, done);
    });

    describe(endpoints.projects.update, function () {


        // test 1
        it("should respond with status code 401 when not authenticated", function (done) {
            api.post(endpoints.projects.update)
                .send({
                    name: 'mocha-test-updated-name',
                    project_id: 'some project id'
                })
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });


        // test 2
        it('should respond with status code 400 and specific error message if no project_id', function (done) {
            token(function (err, access_token) {
                api.post(endpoints.projects.update)
                    .send({
                        name: 'mocha-test-updated-name',
                        access_token: access_token
                    })
                    .expect(httpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        if (err) return done(err);
                        var result = helpers.parse(res.text);
                        expect(result.error.message).to.be.equal(expected.missing_information.errorMessage);
                        expect(result.error.code).to.be.equal(httpStatus.BAD_REQUEST);
                        expect(result.error.errors.missingRequiredFields).to.be.an.array;
                        expect(result.error.errors.missingRequiredFields).to.include('project_id');
                        done();
                    });
            });
        });

        // test 3
        it('should respond with status code 400 and specific error if no field to update', function (done) {
            token(function (err, access_token) {
                api.post(endpoints.projects.update)
                    .send({
                        project_id: tmpProject.uuid,
                        access_token: access_token
                    })
                    .expect(httpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        if (err) return done(err);
                        var result = helpers.parse(res.text);
                        expect(result.error.message).to.be.equal(expected.missing_information.errorMessage);
                        expect(result.error.code).to.be.equal(httpStatus.BAD_REQUEST);
                        done();
                    });
            });
        });

        before(function (done) {
            helpers.create_user_by_parameters(second_test_user, done);
        });

        after(function (done) {
            helpers.delete_user_by_id(second_test_user.uuid, done);
        });



        // test 4
        it('should respond with status code 400 and specific error message when not authorized', function (done) {
            helpers.users_token(second_test_user, function (err, access_token) {
                api.post(endpoints.projects.update)
                    .send({
                        name: 'mocha-test-updated-name',
                        project_id: tmpProject.uuid,
                        access_token: access_token
                    })
                    .expect(httpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        if (err) return done(err);
                        var result = helpers.parse(res.text);
                        expect(result.error.message).to.be.equal(expected.no_access.errorMessage);
                        expect(result.error.code).to.be.equal(httpStatus.BAD_REQUEST);
                        done();
                    });
            });
        });


        // test 5
        it('should respond with status code 200 and shouldn\'t update nonexistent fields', function (done) {
            token(function (err, access_token) {
                api.post(endpoints.projects.update)
                    .send({
                        project_has_not_this_field: 'mocha-test-updated-name',
                        project_id: tmpProject.uuid,
                        access_token: access_token
                    })
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        if (err) return done(err);
                        var result = helpers.parse(res.text);
                        expect(result.updated).to.be.an.array;
                        expect(result.project).to.exist;
                        done();
                    });
            });
        });


        // test 6
        it('should be able to update all fields of project', function (done) {
            token(function (err, access_token) {
                var projectUpdates = testData.projectUpdates;

                projectUpdates.access_token = access_token;
                api.post(endpoints.projects.update)
                    .send(projectUpdates)
                    .expect(httpStatus.OK)
                    .end(function (err, res) {
                        if (err) return done(err);
                        var result = helpers.parse(res.text);
                        expect(result.project.name).to.be.equal('mocha-test-updated-name');
                        expect(result.project.slug).to.be.equal('mocha-test-updated-slug');
                        expect(result.project.logo).to.be.equal('mocha-test-updated-logo');
                        expect(result.project.position.lat).to.be.equal('44');
                        expect(result.project.position.lng).to.be.equal('44');
                        expect(result.project.position.zoom).to.be.equal('4');
                        expect(result.project.bounds.northEast.lat).to.be.equal('44');
                        expect(result.project.bounds.northEast.lng).to.be.equal('33');
                        expect(result.project.bounds.southWest.lat).to.be.equal('55');
                        expect(result.project.bounds.southWest.lng).to.be.equal('44');
                        expect(result.project.bounds.minZoom).to.be.equal('3');
                        expect(result.project.bounds.maxZoom).to.be.equal('5');
                        expect(result.project.folders[0].uuid).to.be.equal('test_folder_uuid');
                        expect(result.project.folders[0].title).to.be.equal('test_folder_title');
                        expect(result.project.folders[0].content).to.be.equal('test_folder_content');
                        expect(result.project.controls.zoom).to.be.false;
                        expect(result.project.controls.measure).to.be.false;
                        expect(result.project.controls.mouseposition).to.be.false;
                        expect(result.project.controls.layermenu).to.be.false;
                        expect(result.project.controls.draw).to.be.false;
                        expect(result.project.controls.legends).to.be.true;
                        expect(result.project.controls.inspect).to.be.true;
                        expect(result.project.controls.geolocation).to.be.true;
                        expect(result.project.controls.vectorstyle).to.be.true;
                        expect(result.project.controls.baselayertoggle).to.be.true;
                        expect(result.project.controls.cartocss).to.be.true;
                        expect(result.project.description).to.be.equal('mocha-test-updated-description');
                        expect(result.project.keywords[0]).to.be.equal('mocha-test-updated-keywords');
                        expect(result.project.categories[0]).to.be.equal('test_categories');
                        expect(result.project.colorTheme).to.be.equal('mocha-test-updated-colorTheme');
                        expect(result.project.connectedAccounts.mapbox[0].username).to.be.equal('test_user_name');
                        expect(result.project.connectedAccounts.mapbox[0].accessToken).to.be.equal('test_access_token');
                        expect(result.project.connectedAccounts.cartodb[0]).to.be.equal('test_cartodb');
                        expect(result.project.settings.screenshot).to.be.false;
                        expect(result.project.settings.socialSharing).to.be.false;
                        expect(result.project.settings.documentsPane).to.be.false;
                        expect(result.project.settings.dataLibrary).to.be.false;
                        expect(result.project.settings.saveState).to.be.true;
                        expect(result.project.settings.autoHelp).to.be.true;
                        expect(result.project.settings.autoAbout).to.be.true;
                        expect(result.project.settings.darkTheme).to.be.true;
                        expect(result.project.settings.tooltips).to.be.true;
                        expect(result.project.settings.mediaLibrary).to.be.true;
                        expect(result.project.settings.mapboxGL).to.be.true;
                        expect(result.project.settings.d3popup).to.be.true;
                        expect(result.project.thumbCreated).to.be.true;
                        expect(result.project.state).to.be.equal('test_state');
                        expect(result.project.pending[0]).to.be.equal('test_pending');
                        expect(result.updated).to.be.an.array;
                        expect(result.updated).to.be.not.empty;
                        done();
                    });
            });
        });

        // test 7
        it('should should respond with status code 400 if some fields have bad type', function (done) {
            var shouldBeAStringButItIsObject = 'should be string, but now it is an object';
            var shouldBeArrayOfStringButItIsObject = 'should be array of strings, but now it is an object';
            token(function (err, access_token) {
                api.post(endpoints.projects.update)
                    .send({
                        access_token: access_token,
                        slug: {slug: shouldBeAStringButItIsObject},
                        logo: {logo: shouldBeAStringButItIsObject},
                        position: {
                            lat: {lat: shouldBeAStringButItIsObject},
                            lng: {lng: shouldBeAStringButItIsObject},
                            zoom: {zoom: shouldBeAStringButItIsObject},
                        },
                        bounds: {
                            northEast: {
                                lat: {lat: shouldBeAStringButItIsObject},
                                lng: {lng: shouldBeAStringButItIsObject},
                            },
                            southWest: {
                                lat: {lat: shouldBeAStringButItIsObject},
                                lng: {lng: shouldBeAStringButItIsObject},
                            },
                            minZoom: {minZoom: shouldBeAStringButItIsObject},
                            maxZoom: {maxZoom: shouldBeAStringButItIsObject}
                        },
                        folders: [{
                            uuid: {uuid: shouldBeAStringButItIsObject},
                            title: {title: shouldBeAStringButItIsObject},
                            content: {content: shouldBeAStringButItIsObject}
                        }],
                        controls: 'test',
                        description: {description: shouldBeAStringButItIsObject},
                        keywords: {keywords: shouldBeArrayOfStringButItIsObject},
                        colorTheme: {colorTheme: shouldBeAStringButItIsObject},
                        connectedAccounts: 'test',
                        settings: 'test',
                        categories: {categories: shouldBeArrayOfStringButItIsObject},
                        thumbCreated: true,
                        state: {state: shouldBeAStringButItIsObject},
                        pending: {pending: shouldBeArrayOfStringButItIsObject},
                        project_id: tmpProject.uuid
                    })
                    .expect(httpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        
                        var result = helpers.parse(res.text);
                        expect(result.error.message).to.be.equal(expected.invalid_fields.errorMessage);
                        expect(result.error.errors).to.be.an.array;
                        expect(result.error.errors).to.be.not.empty;
                        expect(result.error.errors.slug.value.slug).to.be.equal(shouldBeAStringButItIsObject);
                        expect(result.error.errors.slug.message).to.be.equal('Cast to String failed for value "[object Object]" at path "slug"');
                        expect(result.error.errors.logo.value.logo).to.be.equal(shouldBeAStringButItIsObject);
                        expect(result.error.errors.logo.message).to.be.equal('Cast to String failed for value "[object Object]" at path "logo"');
                        expect(result.error.errors['position.lat'].value.lat).to.be.equal(shouldBeAStringButItIsObject);
                        expect(result.error.errors['position.lat'].message).to.be.equal('Cast to String failed for value "[object Object]" at path "position.lat"');
                        expect(result.error.errors['position.lng'].value.lng).to.be.equal(shouldBeAStringButItIsObject);
                        expect(result.error.errors['position.lng'].message).to.be.equal('Cast to String failed for value "[object Object]" at path "position.lng"');
                        expect(result.error.errors['position.zoom'].value.zoom).to.be.equal(shouldBeAStringButItIsObject);
                        expect(result.error.errors['position.zoom'].message).to.be.equal('Cast to String failed for value "[object Object]" at path "position.zoom"');
                        expect(result.error.errors['bounds.northEast.lat'].value.lat).to.be.equal(shouldBeAStringButItIsObject);
                        expect(result.error.errors['bounds.northEast.lat'].message).to.be.equal('Cast to String failed for value "[object Object]" at path "bounds.northEast.lat"');
                        expect(result.error.errors['bounds.northEast.lng'].value.lng).to.be.equal(shouldBeAStringButItIsObject);
                        expect(result.error.errors['bounds.northEast.lng'].message).to.be.equal('Cast to String failed for value "[object Object]" at path "bounds.northEast.lng"');
                        expect(result.error.errors['bounds.southWest.lat'].value.lat).to.be.equal(shouldBeAStringButItIsObject);
                        expect(result.error.errors['bounds.southWest.lat'].message).to.be.equal('Cast to String failed for value "[object Object]" at path "bounds.southWest.lat"');
                        expect(result.error.errors['bounds.southWest.lng'].value.lng).to.be.equal(shouldBeAStringButItIsObject);
                        expect(result.error.errors['bounds.southWest.lng'].message).to.be.equal('Cast to String failed for value "[object Object]" at path "bounds.southWest.lng"');
                        expect(result.error.errors['bounds.maxZoom'].value.maxZoom).to.be.equal(shouldBeAStringButItIsObject);
                        expect(result.error.errors['bounds.maxZoom'].message).to.be.equal('Cast to String failed for value "[object Object]" at path "bounds.maxZoom"');
                        expect(result.error.errors['bounds.minZoom'].value.minZoom).to.be.equal(shouldBeAStringButItIsObject);
                        expect(result.error.errors['bounds.minZoom'].message).to.be.equal('Cast to String failed for value "[object Object]" at path "bounds.minZoom"');
                        expect(result.error.errors['folders.0.uuid'].value.uuid).to.be.equal(shouldBeAStringButItIsObject);
                        expect(result.error.errors['folders.0.uuid'].message).to.be.equal('Cast to String failed for value "[object Object]" at path "uuid"');
                        expect(result.error.errors['folders.0.title'].value.title).to.be.equal(shouldBeAStringButItIsObject);
                        expect(result.error.errors['folders.0.title'].message).to.be.equal('Cast to String failed for value "[object Object]" at path "title"');
                        expect(result.error.errors['folders.0.content'].value.content).to.be.equal(shouldBeAStringButItIsObject);
                        expect(result.error.errors['folders.0.content'].message).to.be.equal('Cast to String failed for value "[object Object]" at path "content"');
                        expect(result.error.errors['description'].value.description).to.be.equal(shouldBeAStringButItIsObject);
                        expect(result.error.errors['description'].message).to.be.equal('Cast to String failed for value "[object Object]" at path "description"');
                        expect(result.error.errors['keywords'].value.keywords).to.be.equal(shouldBeArrayOfStringButItIsObject);
                        expect(result.error.errors['keywords'].message).to.be.equal('Cast to Array failed for value "[object Object]" at path "keywords"');
                        expect(result.error.errors['colorTheme'].value.colorTheme).to.be.equal(shouldBeAStringButItIsObject);
                        expect(result.error.errors['colorTheme'].message).to.be.equal('Cast to String failed for value "[object Object]" at path "colorTheme"');
                        expect(result.error.errors['connectedAccounts'].value).to.be.equal('test');
                        expect(result.error.errors['connectedAccounts'].message).to.be.equal('Cast to Object failed for value "test" at path "connectedAccounts"');
                        expect(result.error.errors['settings'].value).to.be.equal('test');
                        expect(result.error.errors['settings'].message).to.be.equal('Cast to Object failed for value "test" at path "settings"');
                        expect(result.error.errors['controls'].value).to.be.equal('test');
                        expect(result.error.errors['controls'].message).to.be.equal('Cast to Object failed for value "test" at path "controls"');
                        expect(result.error.errors['categories'].value.categories).to.be.equal(shouldBeArrayOfStringButItIsObject);
                        expect(result.error.errors['categories'].message).to.be.equal('Cast to Array failed for value "[object Object]" at path "categories"');
                        expect(result.error.errors.state.value.state).to.be.equal(shouldBeAStringButItIsObject);
                        expect(result.error.errors.state.message).to.be.equal('Cast to String failed for value "[object Object]" at path "state"');
                        expect(result.error.errors['pending'].value.pending).to.be.equal(shouldBeArrayOfStringButItIsObject);
                        expect(result.error.errors['pending'].message).to.be.equal('Cast to Array failed for value "[object Object]" at path "pending"');
                        done();
                    });
            });
        });

        // test 8
        it('should respond with status code 400 and specific error message if project with specific name already exist', function (done) {
            token(function (err, access_token) {
                api.post(endpoints.projects.update)
                    .send({
                        project_id: tmpProject.uuid,
                        name: 'second-mocha-test-project',
                        access_token: access_token
                    })
                    .expect(httpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        if (err) return done(err);
                        var result = helpers.parse(res.text);
                        expect(result.error.message).to.be.equal(expected.project_with_such_name_already_exist.errorMessage);
                        expect(result.error.code).to.be.equal(httpStatus.BAD_REQUEST);
                        done();
                    });
            });
        });

    });
};
