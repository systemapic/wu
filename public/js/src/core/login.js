var spinner;
// var s = spinner;
function spin () {

	var content = L.DomUtil.get('spinning-content');
	var container = L.DomUtil.get('spinning-map');

	// config
	var config = loginConfig;
	config.content = content;
	config.container = container;

	// create spinner
	spinner = new L.SpinningMap(loginConfig);
}