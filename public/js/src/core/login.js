var spinner;
// var s = spinner;
function spin () {

	var content = L.DomUtil.get('spinning-content');
	var container = L.DomUtil.get('spinning-map');

	spinner = new L.SpinningMap({
		// gl : true,
		autoStart : true,
		accessToken : 'pk.eyJ1Ijoic3lzdGVtYXBpYyIsImEiOiJkV2JONUNVIn0.TJrzQrsehgz_NAfuF8Sr1Q',
		layer : 'systemapic.kcjonn12',
		logo : loginConfig.logo,
		content : content,  // todo
		wrapper : false,
		container : container,
		speed : 1000,
		position : {
			// lat : -33.83214,
			// lng : 151.22299,

			lat : 59.94338,
			lng : 10.71445,

			zoom : [4, 15]
		},
		circle : {
			radius : 120, 
			color : 'rgba(247, 175, 38, 0.3)',
			border : {
				px : 4,
				solid : 'solid',
				color : 'white'
			}
		},
	});
}