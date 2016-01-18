var assert = require('assert');
var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');
var crypto = require('crypto');
var request = require('request');
var User = require('../models/user');
var File = require('../models/file');
var Layer = require('../models/layer');
var config = require('../config/server-config.js').serverConfig;
mongoose.connect(config.mongo.url); 
var supertest = require('supertest');
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);

module.exports = util = { 

    test_user : { 
        email : 'mocha_test_user@systemapic.com',
        firstName : 'John',
        lastName : 'Doe',
        uuid : 'test-user-uuid',
        password : 'test-user-password'
    },

    test_file : {
        uuid : 'test_file_uuid',
        family : 'test_file_family',
        createdBy : 'test-user-uuid',
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

    get_access_token : function (done) {
        api.post('/oauth/token')
        .set('Authorization', 'Basic YWJjMTIzOnNzaC1zZWNyZXQ=')
        .send({ 
            grant_type : 'password',
            username : util.test_user.email,
            password : util.test_user.password
        })
        .expect(200)
        .end(function (err, res) {
            done(err, util.parse(res.text));
        });
    },

    token : function (done) {
        util.get_access_token(function (err, tokens) {
            done(err, tokens.access_token);
        });
    },

    get_users_access_token : function (_user, callback) {
      api.post('/oauth/token')
        .set('Authorization', 'Basic YWJjMTIzOnNzaC1zZWNyZXQ=')
        .send({
            grant_type : 'password',
            username : _user.email,
            password : _user.password
        })
        .expect(200)
        .end(function (err, res) {
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
            var parsed = JSON.parse(body)
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
        user.save(done);
    },

    delete_user : function (done) {
        User.findOne({uuid : util.test_user.uuid})
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
        user.save(callback);
    },

    delete_user_by_id: function (_userId, callback) {
        User.findOne({uuid : _userId})
            .remove()
            .exec(callback);
    },

    create_project : function (done) {
        util.token(function (err, token) {
            api.post('/api/project/create')
            .set('Authorization', 'Bearer ' + token)
            .send({name : 'mocha-test-project'})
            .expect(200)
            .end(function (err, res) {
                assert.ifError(err);
                var project = util.parse(res.text).project;
                assert.ok(project);
                assert.ok(project.uuid);
                assert.equal(project.name, 'mocha-test-project');
                // tmp.project = project;
                util.test_user.pid = project.uuid;
                done();
            });
        });
    },

    delete_project : function (done) {
        util.token(function (err, token) {
            api.post('/api/project/delete')
            .set('Authorization', 'Bearer ' + token)
            .send({projectUuid : util.test_user.pid})
            .expect(200)
            .end(done);
        });
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
        File.findOne({uuid : util.test_file.uuid})
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
        Layer.findOne({uuid : util.test_layer.uuid})
            .remove()
            .exec(callback);
    }
}