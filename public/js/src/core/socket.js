Wu.Socket = Wu.Class.extend({

	initialize : function () {

		// create socket
		this._socket = io.connect();

		// add listeners
		this._listen();

		// add loops
		this._addLoops();
	},

	_addLoops : function () {
		setInterval(function () {
			this._getServerStats();
		}.bind(this), 2000);
	},

	_getServerStats : function () {
		var socket = this._socket;
		socket.emit('get_server_stats');
	},

	sendUserEvent : function (options) {
		// defaults
		options.user = options.user || app.Account.getFullName();
		options.timestamp = options.timestamp || Date.now();

		// send event
		var socket = this._socket;
		socket.emit('user_event', options);
	},

	send : function (channel, options, callback) {

		// send event
		var socket = this._socket;
		socket.emit(channel, options);

	},

	_listen : function () {
		var socket = this._socket;

		socket.on('server_stats', function (data) {
			var stats = data.server_stats;
			if (app.Chrome) app.Chrome.Top.updateCPUclock(stats.cpu_usage);
		});
		socket.on('connect', function(){
			console.log('Securely connected to socket.');
			socket.emit('ready', 'koko')
		});
		socket.on('event', function(data){
			console.log('event data: ', data);
		});

		socket.on('tile_count', function(data){
			Wu.Mixin.Events.fire('tileCount', {
				detail : data
			});
		});
		socket.on('tileset_meta', function(data){
			Wu.Mixin.Events.fire('tileset_meta', {
				detail : data
			});
		});

		socket.on('disconnect', function(){
			console.log('disconnect!');
		});
		socket.on('hola', function(data){
			console.log('hola!', data);
		});
		socket.on('processingProgress', function(data){
			Wu.Mixin.Events.fire('processingProgress', {
				detail : data
			});
		});
		socket.on('stats', function(data){
		});
		socket.on('uploadDone', function (data) {
		});
		socket.on('generate_tiles', function (data) {

			console.log('generate tiles done?', data);

			if (data.err) {
				console.error('generetate err', data);

				return;
			}

			// fire
			Wu.Mixin.Events.fire('generatedTiles', {
				detail : data
			});

		});
		socket.on('downloadReady', function (data) {

			// select project
			var event_id = 'downloadReady-' + data.file_id;
			Wu.Mixin.Events.fire(event_id, {detail : data});
		});
		socket.on('processingDone', function (data) {

			// notify data lib
			var file_id = data.file_id;
			var import_took_ms = data.import_took_ms;

			app.Data._onImportedFile(file_id, import_took_ms);
		});
		
		socket.on('errorMessage', function (data) {
			console.log('errorMessage!', data);

			var content = data.error;

			var uniqueIdentifier = content.uniqueIdentifier;

			if (uniqueIdentifier) {
				
				// file error
				Wu.Mixin.Events.fire('processingError', {
					detail : content
				});

			} else {

				app.FeedbackPane.setError({
					title : content.title,
					description : content.description
				});
			}

		});
		

	},

	getSocket : function () {
		return this._socket;
	},	

	
});