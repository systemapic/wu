Wu.Socket = Wu.Class.extend({


	initialize : function () {

		// var socket = io();
		var socket = io.connect();


		socket.on('connect', function(){
			console.log('connect!');
			// Emit ready event.
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

			app.SidePane.DataLibrary.uploaded(data);
		});

		socket.on('processingDone', function (data) {
			console.log('processingDone!', data);

			var size = Wu.Util.bytesToSize(data.size);
			var elapsed = data.elapsed;
			var bytesPerSec = Wu.Util.bytesToSize(data.size / elapsed / 1000) + '/s';
			var description = 'Processing of ' + size + ' took ' + elapsed / 1000 + ' seconds';

			app.feedback.setAction({
				title : 'Processing done!',
				description : description,
				id : Wu.Util.createRandom(5)
			});
		});


		socket.on('errorMessage', function (data) {
			console.log('errorMessage!', data);
		});


		this._socket = socket;

		// Emit ready event.
		// socket.emit('ready', 'ko')

		// Listen for get-feelings event.
		socket.on('get-feelings', function () {
			socket.emit('send-feelings', 'good');
		});

		// Listen for session event.
		socket.on('session', function(data) {
			message = 'Hey ' + data.name + '!\n\n' 
			message += 'Server says you feel '+ data.feelings + '\n'
			message += 'I know these things because sessions work!\n\n'
			message += 'Also, you joined ' + data.loginDate + '\n'
			console.log(message)
		});

	},


	getSocket : function () {
		return this._socket;

	},	

	
});