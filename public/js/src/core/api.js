Wu.Api = Wu.Class.extend({

	initialize : function () {
		console.log('init api');
	},

	// post to path
	post : function (path, options, done) {
		console.log('post: ', path, options);
		Wu.post(path, JSON.stringify(options), function (err, response) {
			console.log('er, res', err, response);
			done && done(err, response);
		});
	},

	shareDataset : function (options, done) {
		console.log('post: ', path, options);
		var path = '/api/dataset/share'; // todo: fix api names, organize
		this.post(path, options, done);
	},

	deleteDataset : function (options, done) {
		var path = '/api/file/delete';
		this.post(path, options, done);
	},

});