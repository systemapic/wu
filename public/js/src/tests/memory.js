Wu.TestSuite = {

	projectMemoryLeak : function (runs) {
		var first = true;
		var n = 0;
		var runs = runs || 5;

		var a = setInterval(function () {
			var p = first ? 'project-aff995e7-c6de-4783-afb1-5f8a5bffae2f' : 'project-4ba8d217-6245-4311-8efc-c62eb0dbaa73';
			Wu.Mixin.Events.fire('projectSelected', { detail : {
				projectUuid : p
			}}); 
			Wu.Mixin.Events.fire('projectSelected', { detail : {
				projectUuid : p
			}});

			first = !first; 
			n += 1;

			if (n>runs) {
				console.log('test done!');
				clearInterval(a);
			}
		}, 2000);
	},

	layersMemoryLeak : function (runs) {

		var n = 0;
		var m = 0;
		var lm = app.MapPane.getControls().layermenu;
		var layers = _.toArray(lm.getLayers());
		var runs = runs || _.size(layers) * 2;
		

		var a = setInterval(function () {

			var layer = layers[m];
			lm.toggleLayer(layer);


			n += 1;

			if (n % 2 == 0) m+= 1;

			if (n >= runs) {
				console.log('test done!');
				clearInterval(a);
			}

		}, 1000);

	}

};

