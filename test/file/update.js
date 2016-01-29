var supertest = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var api = supertest('https://' + process.env.SYSTEMAPIC_DOMAIN);
var helpers = require('../helpers');
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
var testFile = helpers.test_file;

module.exports = function () {
    describe('/api/file/update', function () {

        it('should respond with status code 401 when not authenticated', function (done) {
            api.post('/api/file/update')
                .send({})
                .expect(httpStatus.UNAUTHORIZED, helpers.createExpectedError(expected.invalid_token.errorMessage))
                .end(done);
        });

        it('should respond with status code 400 if fileUuid doesn\'t exist in request body', function (done) {
            token(function (err, access_token) {
                api.post('/api/file/update')
                    .send({access_token: access_token})
                    .expect(httpStatus.BAD_REQUEST, helpers.createExpectedError(expected.missing_information.errorMessage))
                    .end(done);
            });
        });

        it('should respond with status code 400 and error if file doesn\'t exist', function (done) {
            token(function (err, access_token) {
                api.post('/api/file/update')
                    .send({
                        uuid: "invalid file id",
                        access_token: access_token
                    })
                    .expect(httpStatus.BAD_REQUEST, helpers.createExpectedError(expected.bad_file_uuid.errorMessage))
                    .end(done);
            });
        });

        before(function (done) {
            helpers.create_user_by_parameters(second_test_user, done);
        });

        after(function (done) {
            helpers.delete_user_by_id(second_test_user.uuid, done);
        });

        it('should respond with status code 400 and error if not authenticated', function (done) {
            helpers.users_token(second_test_user, function (err, access_token) {
                api.post('/api/file/update')
                    .send({
                        uuid: testFile.uuid,
                        access_token: access_token
                    })
                    .expect(httpStatus.BAD_REQUEST, helpers.createExpectedError(expected.no_access.errorMessage))
                    .end(done);
            });
        });

        it('should respond with status code 200 and update file correctly', function (done) {
            helpers.token(function (err, access_token) {
                var options = {
                    uuid: testFile.uuid,
                    name: 'new name',
                    description: 'new description',
                    keywords: ['new keywords'],
                    status: 'new status',
                    category: 'new category',
                    version: 1,
                    copyright: 'new copyright',
                    data: {
                        postgis: {                 // postgis data
                            database_name: 'new database_name',
                            table_name: 'new table_name',
                            data_type: 'new data_type',         // raster or vector
                            original_format: 'new original_format',   // GeoTIFF, etc.
                            metadata: 'new metadata'
                        },
                        raster: {
                            file_id: 'new file_id',
                            metadata: 'new metadata'
                        }
                    }
                };

                options.access_token = access_token;
                api.post('/api/file/update')
                    .send(options)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }

                        var result = helpers.parse(res.text);
                        expect(result.updated).to.be.not.empty;
                        expect(result.updated).to.include('name');
                        expect(result.updated).to.include('description');
                        expect(result.updated).to.include('keywords');
                        expect(result.updated).to.include('status');
                        expect(result.updated).to.include('category');
                        expect(result.updated).to.include('version');
                        expect(result.updated).to.include('copyright');
                        expect(result.updated).to.include('data');
                        expect(result.file.name).to.be.equal(options.name);
                        expect(result.file.description).to.be.equal(options.description);
                        expect(result.file.keywords[0]).to.be.equal(options.keywords[0]);
                        expect(result.file.status).to.be.equal(options.status);
                        expect(result.file.category).to.be.equal(options.category);
                        expect(result.file.version).to.be.equal(options.version);
                        expect(result.file.copyright).to.be.equal(options.copyright);
                        expect(result.file.data.postgis.database_name).to.be.equal(options.data.postgis.database_name);
                        expect(result.file.data.postgis.table_name).to.be.equal(options.data.postgis.table_name);
                        expect(result.file.data.postgis.data_type).to.be.equal(options.data.postgis.data_type);
                        expect(result.file.data.postgis.original_format).to.be.equal(options.data.postgis.original_format);
                        expect(result.file.data.postgis.metadata).to.be.equal(options.data.postgis.metadata);
                        expect(result.file.data.raster.file_id).to.be.equal(options.data.raster.file_id);
                        expect(result.file.data.raster.metadata).to.be.equal(options.data.raster.metadata);
                        done();
                    });
            });
        });
    });
};