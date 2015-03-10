var loginConfig = {
	autoStart : true,
	accessToken : 'MAPBOX-ACCESS-TOKEN',
	layer : 'MAPBOX-LAYER-ID',
	logo : 'RELATIVE-PATH-FOR-PNG',
	wrapper : false,
	speed : 1000,
	position : {
		lat : 59.942, 	// oslo
		lng : 10.716,
		zoom : [4, 14]
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


	ga : {
		id : 'GOOGLE-ANALYTICS-ID'
	}
}