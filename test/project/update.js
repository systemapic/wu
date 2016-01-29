var assert = require('assert');
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
var config = require('../../config/server-config.js').serverConfig;
var helpers = require('./../helpers');
var token = helpers.token;
var expected = require('../../shared/errors');
var httpStatus = require('http-status');
var second_test_user = {
    email : 'second_mocha_test_user@systemapic.com',
    firstName : 'Igor',
    lastName : 'Ziegler',
    uuid : 'second_test-user-uuid',
    password : 'second_test-user-password'
};

module.exports = function () {
    var tmpProject ={};

    before(function (done) {
        helpers.create_project_by_info({
            name: 'mocha-test-project',
            uuid: 'uuid-mocha-test-project',
            access: {
                edit: [helpers.test_user.uuid]
            },
            createdBy: helpers.test_user.uuid
        }, function (err, project) {
            if (err) {
                return done(err);
            }

            tmpProject = project;
            done();
        });
    });

    after(function (done) {
        helpers.delete_project_by_id(tmpProject.uuid, done);
    });

    describe('/api/project/update', function () {

        it("should respond with status code 401 when not authenticated", function (done) {
            api.post('/api/project/update')
                .send({
                    name: 'mocha-test-updated-name',
                    project_id: 'some project id'
                })
                .expect(httpStatus.UNAUTHORIZED)
                .end(done);
        });

        it('should respond with status code 400 and specific error message if no project_id', function (done) {
            token(function (err, access_token) {
                api.post('/api/project/update')
                    .send({
                        name: 'mocha-test-updated-name',
                        access_token: access_token
                    })
                    .expect(httpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);
                        expect(result.error.message).to.be.equal(expected.missing_information.errorMessage);
                        expect(result.error.code).to.be.equal(httpStatus.BAD_REQUEST);
                        expect(result.error.errors.missingRequiredFields).to.be.an.array;
                        expect(result.error.errors.missingRequiredFields).to.include('project_id');
                        done();
                    });
            });
        });

        it('should respond with status code 400 and specific error message if no field to update', function (done) {
            token(function (err, access_token) {
                api.post('/api/project/update')
                    .send({
                        project_id: tmpProject.uuid,
                        access_token: access_token
                    })
                    .expect(httpStatus.BAD_REQUEST)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

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

        it('should respond with status code 400 and specific error message when not authorized', function (done) {
            helpers.users_token(second_test_user, function (err, access_token) {
                api.post('/api/project/update')
                    .send({
                        name: 'mocha-test-updated-name',
                        project_id: tmpProject.uuid,
                        access_token: access_token
                    })
                    .expect(httpStatus.BAD_REQUEST, helpers.createExpectedError(expected.no_access.errorMessage))
                    .end(done);
            });
        });


        it('should respond with status code 200 and shouldn\'t update nonexistent fields', function (done) {
            console.log(tmpProject.uuid);
            token(function (err, access_token) {
                api.post('/api/project/update')
                    .send({
                        project_has_not_this_field: 'mocha-test-updated-name',
                        project_id: tmpProject.uuid,
                        access_token: access_token
                    })
                    .expect(200, {})
                    .end(done);
            });
        });

        it('should be able to update all fields of project', function (done) {
            token(function (err, access_token) {
                api.post('/api/project/update')
                    .send({
                        access_token: access_token,
                        name: 'mocha-test-updated-name',
                        slug: 'mocha-test-updated-slug',
                        logo: 'mocha-test-updated-logo',
                        position: {lat: 44, lng: 44, zoom: 4},
                        bounds: {
                            northEast: {
                                lat: 44,
                                lng: 33
                            },
                            southWest: {
                                lat: 55,
                                lng: 44
                            },
                            minZoom: 3,
                            maxZoom: 5
                        },
                        folders: [{
                            uuid: "test_folder_uuid",
                            title: "test_folder_title",
                            content: "test_folder_content"
                        }],
                        controls: {
                            zoom: false,
                            measure: false,
                            description: false,
                            mouseposition: false,
                            layermenu: false,
                            draw: false,
                            legends: true,
                            inspect: true,
                            geolocation: true,
                            vectorstyle: true,
                            baselayertoggle: true,
                            cartocss: true
                        },
                        description: 'mocha-test-updated-description',
                        keywords: 'mocha-test-updated-keywords',
                        colorTheme: 'mocha-test-updated-colorTheme',
                        connectedAccounts: {
                            mapbox: [{
                                username: 'test_user_name',
                                accessToken: 'test_access_token'
                            }],
                            cartodb: ["test_cartodb"]
                        },
                        settings: {
                            screenshot: false,
                            socialSharing: false,
                            documentsPane: false,
                            dataLibrary: false,
                            saveState: true,
                            autoHelp: true,
                            autoAbout: true,
                            darkTheme: true,
                            tooltips: true,
                            mediaLibrary: true,
                            mapboxGL: true,
                            d3popup: true
                        },
                        categories: ['test_categories'],
                        thumbCreated: true,
                        state: 'test_state',
                        pending: ['test_pending'],
                        project_id: tmpProject.uuid
                    })
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);

                        expect(result.name.name).to.be.equal('mocha-test-updated-name');
                        expect(result.slug.slug).to.be.equal('mocha-test-updated-slug');
                        expect(result.logo.logo).to.be.equal('mocha-test-updated-logo');
                        expect(result.position.position.lat).to.be.equal('44');
                        expect(result.position.position.lng).to.be.equal('44');
                        expect(result.position.position.zoom).to.be.equal('4');
                        expect(result.bounds.bounds.northEast.lat).to.be.equal('44');
                        expect(result.bounds.bounds.northEast.lng).to.be.equal('33');
                        expect(result.bounds.bounds.southWest.lat).to.be.equal('55');
                        expect(result.bounds.bounds.southWest.lng).to.be.equal('44');
                        expect(result.bounds.bounds.minZoom).to.be.equal('3');
                        expect(result.bounds.bounds.maxZoom).to.be.equal('5');
                        expect(result.folders.folders[0].uuid).to.be.equal('test_folder_uuid');
                        expect(result.folders.folders[0].title).to.be.equal('test_folder_title');
                        expect(result.folders.folders[0].content).to.be.equal('test_folder_content');
                        expect(result.controls.controls.zoom).to.be.false;
                        expect(result.controls.controls.measure).to.be.false;
                        expect(result.controls.controls.mouseposition).to.be.false;
                        expect(result.controls.controls.layermenu).to.be.false;
                        expect(result.controls.controls.draw).to.be.false;
                        expect(result.controls.controls.legends).to.be.true;
                        expect(result.controls.controls.inspect).to.be.true;
                        expect(result.controls.controls.geolocation).to.be.true;
                        expect(result.controls.controls.vectorstyle).to.be.true;
                        expect(result.controls.controls.baselayertoggle).to.be.true;
                        expect(result.controls.controls.cartocss).to.be.true;
                        expect(result.description.description).to.be.equal('mocha-test-updated-description');
                        expect(result.keywords.keywords[0]).to.be.equal('mocha-test-updated-keywords');
                        expect(result.categories.categories[0]).to.be.equal('test_categories');
                        expect(result.colorTheme.colorTheme).to.be.equal('mocha-test-updated-colorTheme');
                        expect(result.connectedAccounts.connectedAccounts.mapbox[0].username).to.be.equal('test_user_name');
                        expect(result.connectedAccounts.connectedAccounts.mapbox[0].accessToken).to.be.equal('test_access_token');
                        expect(result.connectedAccounts.connectedAccounts.cartodb[0]).to.be.equal('test_cartodb');
                        expect(result.settings.settings.screenshot).to.be.false;
                        expect(result.settings.settings.socialSharing).to.be.false;
                        expect(result.settings.settings.documentsPane).to.be.false;
                        expect(result.settings.settings.dataLibrary).to.be.false;
                        expect(result.settings.settings.saveState).to.be.true;
                        expect(result.settings.settings.autoHelp).to.be.true;
                        expect(result.settings.settings.autoAbout).to.be.true;
                        expect(result.settings.settings.darkTheme).to.be.true;
                        expect(result.settings.settings.tooltips).to.be.true;
                        expect(result.settings.settings.mediaLibrary).to.be.true;
                        expect(result.settings.settings.mapboxGL).to.be.true;
                        expect(result.settings.settings.d3popup).to.be.true;
                        expect(result.thumbCreated.thumbCreated).to.be.true;
                        expect(result.state.state).to.be.equal('test_state');
                        expect(result.pending.pending[0]).to.be.equal('test_pending');
                        done();
                    });
            });
        });

    });
};
