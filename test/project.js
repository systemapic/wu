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
var User = require('../models/user');
var config = require('../config/server-config.js').serverConfig;
var util = require('./util');
var token = util.token;
var expected = require('../shared/errors');
var second_test_user = {
    email : 'second_mocha_test_user@systemapic.com',
    firstName : 'Igor',
    lastName : 'Ziegler',
    uuid : 'second_test-user-uuid',
    password : 'second_test-user-password'  
};

describe('Project', function () {

    // prepare
    var tmp = {};
    this.slow(500);
    before(function(done) { util.create_user(done); });
    after(function(done) { util.delete_user(done); });


    describe('Create /api/project/create', function () {

        it('should be able to create empty project and get valid project in response', function (done) {
            this.slow(1500);
            token(function (err, token) {
                api.post('/api/project/create')
                .set('Authorization', 'Bearer ' + token)
                .send({name : 'mocha-test-project'})
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        done(err);
                    }
                    var project = util.parse(res.text).project;
                    assert.ok(project);
                    assert.ok(project.uuid);
                    assert.equal(project.name, 'mocha-test-project');
                    tmp.project = project;
                    done();
                });
            });
        });

        it("should respond with status code 401 when not authenticated", function (done) {
            api.post('/api/project/create')
                .send({
                    name : 'mocha-test-project',
                })
                .expect(401)
                .end(done);
        });

        it('should respond with status code 422 and specific error message if empty body', function (done) {
            token(function (err, token) {
                api.post('/api/project/create')
                    .set('Authorization', 'Bearer ' + token)
                    .send()
                    .expect(422, expected.missing_information)
                    .end(done);
            });
        });

        it('should respond with status code 422 and specific error message if no project name', function (done) {
            token(function (err, token) {
                api.post('/api/project/create')
                    .set('Authorization', 'Bearer ' + token)
                    .send({foo : 'mocha-test-updated-name'})
                    .expect(422, expected.missing_information)
                    .end(done);
            });
        });


    });

    describe('Update /api/project/update', function () {

        it("should respond with status code 401 when not authenticated", function (done) {
            api.post('/api/project/update')
                .send({
                    name : 'mocha-test-updated-name',
                    project_id : 'some project id'
                })
                .expect(401)
                .end(done);
        });

        it('should respond with status code 422 and specific error message if empty body', function (done) {
            token(function (err, token) {
                api.post('/api/project/update')
                    .set('Authorization', 'Bearer ' + token)
                    .send()
                    .expect(422, expected.missing_information)
                    .end(done);
            });
        });

        it('should respond with status code 422 and specific error message if no project_id', function (done) {
            token(function (err, token) {
                api.post('/api/project/update')
                    .set('Authorization', 'Bearer ' + token)
                    .send({name : 'mocha-test-updated-name'})
                    .expect(422, expected.missing_information)
                    .end(done);
            });
        });

        it('should respond with status code 422 and specific error message if no field to update', function (done) {
            token(function (err, token) {
                api.post('/api/project/update')
                    .set('Authorization', 'Bearer ' + token)
                    .send({project_id : tmp.project.uuid})
                    .expect(422, expected.missing_information)
                    .end(done);
            });
        });

        context ('when user can\'t edit project', function () {
            
            before(function (done) {
                util.create_user_by_parameters(second_test_user, done);
            });

            after(function (done) {
                util.delete_user_by_id(second_test_user.uuid, done);
            });

            it('should respond with status code 422 and specific error message', function (done) {
                util.users_token(second_test_user, function (err, token) {
                    api.post('/api/project/update')
                        .set('Authorization', 'Bearer ' + token)
                        .send({
                            name: 'mocha-test-updated-name',
                            project_id: tmp.project.uuid
                        })
                        .expect(422, expected.no_access)
                        .end(done);
                });
            }); 

        });

        it('should respond with status code 200 and shouldn\'t update nonexistent fields', function (done) {
            token(function (err, token) {
                api
                    .post('/api/project/update')
                    .set('Authorization', 'Bearer ' + token)
                    .send({
                        project_has_not_this_field : 'mocha-test-updated-name',
                        project_id : tmp.project.uuid
                    })
                    .expect(200, {})
                    .end(done);
            });
        });

        it('should be able to update name, slug, logo, position, bounds, folders, of project', function (done) {
            token(function (err, token) {
                api.post('/api/project/update')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    name : 'mocha-test-updated-name',
                    slug : 'mocha-test-updated-slug',
                    logo : 'mocha-test-updated-logo',
                    position: { lat: 44, lng: 44, zoom: 4},
                    bounds : {
                        northEast : {
                            lat : 44,
                            lng : 33
                        },
                        southWest : {
                            lat : 55,
                            lng : 44
                        },
                        minZoom : 3,
                        maxZoom : 5
                    },
                    folders : [{
                        uuid    : "test_folder_uuid",
                        title   : "test_folder_title",
                        content : "test_folder_content"
                    }],
                    controls : {
                        zoom : false,
                        measure : false,
                        description : false,
                        mouseposition : false,
                        layermenu : false,
                        draw : false,
                        legends : true,
                        inspect : true,
                        geolocation : true,
                        vectorstyle : true,
                        baselayertoggle : true,
                        cartocss : true
                    },
                    description : 'mocha-test-updated-description',
                    keywords : 'mocha-test-updated-keywords',
                    colorTheme : 'mocha-test-updated-colorTheme',
                    connectedAccounts : {
                        mapbox  : [{
                            username : 'test_user_name',
                            accessToken : 'test_access_token'
                        }],
                        cartodb : ["test_cartodb"]
                    },
                    settings : {
                        screenshot  : false,
                        socialSharing   : false,
                        documentsPane   : false,
                        dataLibrary     : false,
                        saveState   : true,
                        autoHelp    : true,
                        autoAbout   : true,
                        darkTheme   : true,
                        tooltips    : true,
                        mediaLibrary    : true,
                        mapboxGL    : true,
                        d3popup     : true,
                    },
                    categories: ['test_categories'],
                    thumbCreated: true,
                    state: 'test_state',
                    pending: ['test_pending'],
                    project_id : tmp.project.uuid
                })
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        done(err);
                    }
                    var result = util.parse(res.text);

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

    describe('Delete /api/project/delete', function () {

        it('should be able to delete project', function (done) {
            token(function (err, token) {
                api.post('/api/project/delete')
                    .set('Authorization', 'Bearer ' + token)
                    .send({project_id : tmp.project.uuid})
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                        }
                        var result = util.parse(res.text);
                        assert.ok(result.deleted);
                        assert.equal(result.project, tmp.project.uuid);
                        done();
                    });
            });
        });

        it("should respond with status code 401 when not authenticated", function (done) {
            api.post('/api/project/delete')
                .send({project_id : tmp.project.uuid})
                .expect(401)
                .end(done);
        });

        it('should respond with status code 422 and specific error message if empty body', function (done) {
            token(function (err, token) {
                api.post('/api/project/delete')
                    .set('Authorization', 'Bearer ' + token)
                    .send()
                    .expect(422, expected.missing_information)
                    .end(done);
            });
        });

        it('should respond with status code 422 and specific error message if no project_id', function (done) {
            token(function (err, token) {
                api.post('/api/project/delete')
                    .set('Authorization', 'Bearer ' + token)
                    .send({foo : 'mocha-test-updated-name'})
                    .expect(422, expected.no_such_project)
                    .end(done);
            });
        });

    });

    describe('Unique /api/project/unique', function () {
        it("should respond with status code 401 when not authenticated", function (done) {
            api.post('/api/project/unique')
                .send({})
                .expect(401)
                .end(done);
        });

        it('should respond with status code 200', function (done) {
            token(function (err, token) {
                api.post('/api/project/unique')
                    .set('Authorization', 'Bearer ' + token)
                    .send({})
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                        }

                        var result = util.parse(res.text);

                        expect(result.unique).to.be.true;
                        done();
                    });
            });
        });

    })

});
