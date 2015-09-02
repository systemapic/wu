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

	_listen : function () {
		var socket = this._socket;

		socket.on('server_stats', function (data) {
			var stats = data.server_stats;
			app.Chrome.Top.updateCPUclock(stats.cpu_usage);
		})

		socket.on('connect', function(){
			console.log('Securely connected to socket.');
			socket.emit('ready', 'koko')
		});
		socket.on('event', function(data){
			console.log('event data: ', data);
		});
		socket.on('disconnect', function(){
			console.log('disconnect!');
		});
		socket.on('hola', function(data){
			console.log('hola!', data);
		});
		socket.on('processingProgress', function(data){
			console.log('processingProgress:', data);
		});
		socket.on('stats', function(data){
			console.log('stats:', data);
		});
		socket.on('uploadDone', function (data) {
			console.log('uploadDone!', data);

		});
		socket.on('processingDone', function (data) {
			console.log('processingDone!!!', data);

			// notify data lib
			var file_id = data.file_id;
			app.SidePane.DataLibrary._socketNotificationOfDoneFile(file_id)
			
		});
		socket.on('errorMessage', function (data) {
			console.log('errorMessage!', data);

			
		});
		

	},

	getSocket : function () {
		return this._socket;
	},	

	
});