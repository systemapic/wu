function darktheme () {

	var styletag = Wu.DomUtil.get("styletag");

	var _darktheme = document.createElement("link");
		_darktheme.rel = 'stylesheet';
		_darktheme.href = '//85.10.202.87:8080/css/darktheme.css';

		styletag.appendChild(_darktheme);
}

function lighttheme () {

	var styletag = Wu.DomUtil.get("styletag");
	styletag.innerHTML = '';

}


