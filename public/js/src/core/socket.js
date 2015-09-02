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

			// set uploaded
			// app.SidePane.DataLibrary.uploaded(data);

			// if (data.layers.length) {
			// 	// set processing started on file
			// 	var fileUuid = data.files[0].uuid;
			// 	app.SidePane.DataLibrary.processFile(fileUuid, 0, 1);
			// }
		});
		socket.on('processingDone', function (data) {
			console.log('processingDone!!!', data);

			var file_id = data.file_id;
			app.SidePane.DataLibrary._socketNotificationOfDoneFile(file_id)

			// var size = Wu.Util.bytesToSize(data.size),
			//     elapsed = data.elapsed,
			//     bytesPerSec = Wu.Util.bytesToSize(data.size / elapsed / 1000) + '/s',
			//     description = 'Processing of ' + size + ' took ' + elapsed / 1000 + ' seconds',
			//     uniqueIdentifier = data.uniqueIdentifier,
			//     fileUuid = data.processingDone;

			// if (data.error) {
			// 	app.feedback.setError({
			// 		title : 'Processing error!',
			// 		description : data.error,
			// 		id : uniqueIdentifier
			// 	});
			// } else {
			// 	app.feedback.setSuccess({
			// 		title : 'Processing done!',
			// 		description : description,
			// 		id : uniqueIdentifier
			// 	});

			// 	app.SidePane.DataLibrary.processFileDone(fileUuid, 100, 1);
			// }

			
		});
		socket.on('errorMessage', function (data) {
			console.log('errorMessage!', data);

			// app.feedback.setError({
			// 	title : 'Error:',
			// 	description : data.error,
			// });
		});
		// // Listen for get-feelings event.
		// socket.on('get-feelings', function () {
		// 	socket.emit('send-feelings', 'good');
		// });
		// // Listen for session event.
		// socket.on('session', function(data) {
		// 	message = 'Hey ' + data.name + '!\n\n' 
		// 	message += 'Server says you feel '+ data.feelings + '\n'
		// 	message += 'I know these things because sessions work!\n\n'
		// 	message += 'Also, you joined ' + data.loginDate + '\n'
		// 	console.log('session');
		// });

	},

	getSocket : function () {
		return this._socket;
	},	

	
});