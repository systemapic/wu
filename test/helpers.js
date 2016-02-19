var assert = require('assert');
var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');
var crypto = require('crypto');
var request = require('request');
var _ = require('lodash');
var User = require('../models/user');
var File = require('../models/file');
var Layer = require('../models/layer');
var Project = require('../models/project');
var config = require('../config/wu-config.js').serverConfig;
var supertest = require('supertest');
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var endpoints = require('./endpoints.js');
var apiModule = {
    auth: require('../api/api.auth'),
    redis: require('../api/api.redis'),
    user: require('../api/api.user'),
    utils: require('../api/api.utils'),
    config: require('../config/wu-config.js').serverConfig
};

mongoose.connect(config.mongo.url); 

module.exports = util = {

    // variables, todo: move to shared file
    test_user : {
        email : 'mocha_test_user@systemapic.com',
        firstName : 'mocha',
        lastName : 'test',
        uuid : 'uuid-mocha-test-project',
        password : 'test-user-password',
        username : 'test-user'
    },

    test_file : {
        uuid : 'test_file_uuid',
        family : 'test_file_family',
        createdBy : 'uuid-mocha-test-project',
        createdByName : 'test_file_createdByName',
        files : ['test_file_files'],
        folder : 'test_file_folder',
        absfolder : 'test_file_absfolder',
        name : 'test_file_name',
        absfolder : 'test_file_absfolder',
        originalName : 'test_file_originalName',
        description : 'test_file_description',
        copyright : 'test_file_copyright',
        keywords : 'test_file_keywords',
        category : 'test_file_category',
        version : 1,
        status : 'test_file_status',
        keywords : 'test_file_keywords',
        type : 'test_file_type',
        format : ['test_file_format']
    },

    test_layer : {
        uuid: 'test_layer_uuid',
        title: 'test_layer_title',
        description: 'test_layer_description',
        file: 'test_layer_file',
        data: {
            postgis : {
                table_name: 'test_layer_data_postgis_table_name'
            }
        }
    },

    createExpectedError : function (errorMessage) {
        return {
            error: errorMessage
        };
    },

    get_access_token : function (done) {
        api.post(endpoints.users.token.token)
        .send({ 
            username : util.test_user.email,
            password : util.test_user.password
        })
        .end(function (err, res) {
            assert.ifError(err);
            assert.equal(res.status, 200);
            var tokens = util.parse(res.text);
            assert.equal(tokens.token_type, 'multipass');
            assert.equal(_.size(tokens.access_token), 43);
            done(err, tokens);
        });
    },

    token : function (done) {
        util.get_access_token(function (err, tokens) {
            done(err, tokens.access_token);
        });
    },

    get_users_access_token : function (_user, callback) {
      api.post(endpoints.users.token.token)
        .send({
            grant_type : 'password',
            username : _user.email,
            password : _user.password
        })
        .end(function (err, res) {
            assert.ifError(err);
            assert.equal(res.status, 200);
            callback(err, util.parse(res.text));
        });
    },

    users_token: function (_user, callback) {
        util.get_users_access_token(_user, function (err, tokens) {
            callback(err, tokens.access_token);
        });
    },

    parse : function (body) {
        try {
            var parsed = JSON.parse(body);
        } catch (e) {
            console.log('failed to parse:', body);
            throw e;
            return;
        }
        return parsed;
    },

    create_user : function (done) {
        var user = new User();
        user.local.email = util.test_user.email;    
        user.local.password = user.generateHash(util.test_user.password);
        user.uuid = util.test_user.uuid;
        user.firstName = util.test_user.firstName;
        user.lastName = util.test_user.lastName;
        user.username = util.test_user.username;
        user.save(done);
    },

    delete_user : function (done) {
        User
        .findOne({uuid : util.test_user.uuid})
        .remove()
        .exec(done);
    },

    create_user_by_parameters : function (_user, callback) {
        var user = new User();
        user.local.email = _user.email;    
        user.local.password = user.generateHash(_user.password);
        user.uuid = _user.uuid;
        user.firstName = _user.firstName;
        user.lastName = _user.lastName;
        user.files = _user.files;
        user.save(callback);
    },

    delete_user_by_id: function (_userId, callback) {
        User
        .findOne({uuid : _userId})
        .remove()
        .exec(callback);
    },

    create_project : function (done) {
        util.token(function (err, access_token) {
            api.post(endpoints.projects.create)
            .send({
                name : 'mocha-test-project', 
                access_token : access_token
            })
            .end(function (err, res) {
                assert.ifError(err);
                assert.equal(res.status, 200);
                var project = util.parse(res.text).project;
                assert.ok(project);
                assert.ok(project.uuid);
                assert.equal(project.name, 'mocha-test-project');
                util.test_user.pid = project.uuid;
                done();
            });
        });
    },

    delete_project : function (done) {
        util.token(function (err, access_token) {
            api.post(endpoints.projects.delete)
            .send({
                projectUuid : util.test_user.pid, 
                access_token : access_token
            })
            .end(function (err, res) {
                assert.ifError(err);
                assert.equal(res.status, 200);
                done();
            });
        });
    },

    create_project_by_info : function (info, callback) {
        var project = new Project();
        project.uuid = info.uuid;
        project.createdBy = info.createdBy;
        project.createdByName = info.createdByName;
        project.createdByUsername = info.createdByUsername;
        project.name = info.name;
        project.slug = info.slug;
        project.description = info.description;
        project.keywords = info.keywords;
        project.categories = info.categories;
        project.layers = info.layers;
        project.access = info.access;
        project.state = info.state;
        project.settings = info.settings;
        project.save(callback);
    },

    delete_project_by_id : function (id, callback) {
        Project
        .findOne({uuid : id})
        .remove()
        .exec(callback);
    },

    create_file : function (callback) {
        var file = new File();
        file.uuid = util.test_file.uuid;
        file.family = util.test_file.family;
        file.createdBy = util.test_file.createdBy;
        file.createdByName = util.test_file.createdByName;
        file.files = util.test_file.files;
        file.folder = util.test_file.folder;
        file.absfolder = util.test_file.absfolder;
        file.name = util.test_file.name;
        file.absfolder = util.test_file.absfolder;
        file.originalName = util.test_file.originalName;
        file.description = util.test_file.description;
        file.copyright = util.test_file.copyright;
        file.keywords = util.test_file.keywords;
        file.category = util.test_file.category;
        file.version = util.test_file.version;
        file.status = util.test_file.status;
        file.keywords = util.test_file.keywords;
        file.type = util.test_file.type;
        file.format = util.test_file.format;
        file.save(callback);
    },

    delete_file: function (callback) {
        File
        .findOne({uuid : util.test_file.uuid})
        .remove()
        .exec(callback);
    },

    create_file_by_parameters : function (newFile, callback) {
        var file = new File();
        file.uuid = newFile.uuid;
        file.family = newFile.family;
        file.createdBy = newFile.createdBy;
        file.createdByName = newFile.createdByName;
        file.files = newFile.files;
        file.folder = newFile.folder;
        file.absfolder = newFile.absfolder;
        file.name = newFile.name;
        file.absfolder = newFile.absfolder;
        file.originalName = newFile.originalName;
        file.description = newFile.description;
        file.copyright = newFile.copyright;
        file.keywords = newFile.keywords;
        file.category = newFile.category;
        file.version = newFile.version;
        file.status = newFile.status;
        file.keywords = newFile.keywords;
        file.type = newFile.type;
        file.format = newFile.format;
        file.data = newFile.data;
        file.save(callback);
    },

    delete_file_by_id : function (fileId, callback) {
        File
        .findOne({uuid : fileId})
        .remove()
        .exec(callback);
    },

    createLayer: function (callback) {
        var layer = new Layer();
        layer.uuid = util.test_layer.uuid;
        layer.title = util.test_layer.title;
        layer.description = util.test_layer.description;
        layer.file = util.test_layer.file;
        layer.data = util.test_layer.data;
        layer.save(callback);
    },

    deleteLayer: function (callback) {
        Layer
        .findOne({uuid : util.test_layer.uuid})
        .remove()
        .exec(callback);
    },

    create_layer_by_parameters: function (layerInfo, callback) {
        var layer = new Layer();
        layer.uuid = layerInfo.uuid;
        layer.title = layerInfo.title;
        layer.description = layerInfo.description;
        layer.file = layerInfo.file;
        layer.data = layerInfo.data;
        layer.save(callback);
    },

    delete_layer_by_id: function (layerId, callback) {
        Layer
        .findOne({uuid: layerId})
        .remove()
        .exec(callback);
    },

    createInviteToken: function (inviteParameters, done) {
        var ops = [];

        ops.push(function (callback) {
            User.findOne({uuid: util.test_user.uuid})
                .exec(function (err, user) {
                    if (err) {
                        return callback(err);
                    }

                    if (!user) {
                        return callback(new Error('No such user'));
                    }

                    return callback(null, user);
                });
        });

        ops.push(function (user, callback) {

            var inviteToken = apiModule.utils.getRandomChars(7, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890');
            var invite_options = JSON.stringify(inviteParameters);

            // save token to redis
            var redis_key = 'invite:token:' + inviteToken;
            apiModule.redis.tokens.set(redis_key, invite_options, function (err) {
                if (err) {
                    return callback(err);
                }
                
                callback(null, inviteToken);
            });

        });

        async.waterfall(ops, function (err, inviteToken) {
            if (err) {
                return done(err);
            }

            done(null, inviteToken);
        });
    }
}
