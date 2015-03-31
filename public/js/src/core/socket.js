Wu.Socket = Wu.Class.extend({

	initialize : function () {

		// create socket
		this._socket = io.connect();

		// add listeners
		this._listen();
	},

	_listen : function () {
		var socket = this._socket;

		socket.on('connect', function(){
			console.log('connect!');
			socket.emit('ready', 'ko')
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
		socket.on('uploadDone', function (data) {
			console.log('uploadDone!', data);

			// set uploaded
			app.SidePane.DataLibrary.uploaded(data);
		});
		socket.on('processingDone', function (data) {
			console.log('processingDone!', data);

			var size = Wu.Util.bytesToSize(data.size),
			    elapsed = data.elapsed,
			    bytesPerSec = Wu.Util.bytesToSize(data.size / elapsed / 1000) + '/s',
			    description = 'Processing of ' + size + ' took ' + elapsed / 1000 + ' seconds',
			    uniqueIdentifier = data.uniqueIdentifier;

			if (data.error) {
				app.feedback.setError({
					title : 'Processing error!',
					description : data.error,
					id : uniqueIdentifier
				});
			} else {
				app.feedback.setSuccess({
					title : 'Processing done!',
					description : description,
					id : uniqueIdentifier
				});
			}

			
		});
		socket.on('errorMessage', function (data) {
			console.log('errorMessage!', data);
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