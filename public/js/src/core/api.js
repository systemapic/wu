Wu.Api = Wu.Class.extend({

	// post to path
	post : function (path, options, done) {
		Wu.post(path, JSON.stringify(options), function (err, response) {
			done && done(err, response);
		});
	},

	shareDataset : function (options, done) {
		var path = '/api/dataset/share'; // todo: fix api names, organize
		this.post(path, options, done);
	},

	deleteDataset : function (options, done) {
		var path = '/api/file/delete';
		this.post(path, options, done);
	},

	verifyAccessToken : function () {
		var path = '/api/userinfo';
		this.post(path, {}, function (err, body) {
			if (err == 401) {
				console.error('you been logged out');
				window.location.href = app.options.servers.portal;
			}
		});
	}

});