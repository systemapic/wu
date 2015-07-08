var feedbackTimer;

window.onload = function () {
	console.log('window.onload');

	  // We need to access the form element
	  var form = document.getElementById("login-form");

	  // // to takeover its submit event.
	  // form.addEventListener("submit", function (event) {
	  //   event.preventDefault();

	  //   console.log('login form submit click!');

	  //   // sendData();
	  //   getAccessToken();
	  // });

	if (!checkToken()){
		document.getElementById('input-email').focus();
		document.getElementById('forgot-email').focus();
		return;
	} 

	var options = {
		token : getToken()
	}

	sendRequest('/reset/checktoken', options, function (err, body){
		console.log('checked token', err, body);

		var response = JSON.parse(body);
		if (!response.valid) {
			console.error('invalid token');
			
			showForgotPassword();

			var feedbackDiv = document.getElementById('forgot-feedback');
			feedbackDiv.innerHTML = 'Your token has expired. Please request a new one above.';
			feedbackDiv.style.color = 'red';
			feedbackDiv.style.fontSize = '18px';
			feedbackDiv.style.paddingTop = '10px';
		} 
	});

}

function initScripts() {
	spin();
	checkmobile();
	addhooks();

	// if token, password time
	checkToken() ? showCreatePassword() : showLogin();
}

function checkToken() {
	var token = getToken();
	return token && token.length > 38;
}

function getToken() {
	var token = window.location.search.split('=')[1];
	return token;
}

function getAccessToken() {

	var username = document.getElementById('input-email').value;
	var password = document.getElementById('input-pass').value

	console.log('getAccessToken u/p; ', username, password);

	var options = {
		grant_type : 'password',
		username : username,
		password : password,
		scope : 'offline_access'
	}

	sendAccessTokenRequest('/oauth/token', options, function (err, body) {
		console.log('access token return, err, body', err, body);

		if (err) return console.log(err);

		var result = JSON.parse(body);

		if (result.error) return console.log(result);

		var access_token = result.access_token;
		console.log('Access token: ', access_token);
		window.access_token = access_token;

		if (window.access_token) {
			// make GET request with access token

			// setTimeout(getPortal, 1000);

			var url = 'https://dev.systemapic.com/?access_token=' + window.access_token;

			console.log('url: ', url);
			setTimeout(function () {
				window.location.href = url;
			}, 1000);
		}

	});	
}


function getPortal() {
	console.log('getPortal');

	var url = window.location.origin + '/portal';
	var http = new XMLHttpRequest();
	http.open( "GET", url, false );
	http.setRequestHeader('Authorization', 'Bearer ' + window.access_token); 
	http.send( null );
	return http.responseText;

	// var http = new XMLHttpRequest(),
	//     url = window.location.origin + '/portal';
	// http.open("GET", url, true);
	// http.setRequestHeader('Content-type', 'application/json');
	// http.setRequestHeader('Authorization', 'Bearer ' + window.access_token); 
	// http.onreadystatechange = function() {
	// 	if (http.readyState == 4) {
	// 		callback && callback(null, http.responseText); 
	// 	} 
	// }
	// http.send(JSON.stringify(options));

}

function sendAccessTokenRequest(entryPoint, options, callback) {
	var http = new XMLHttpRequest(),
	    url = window.location.origin + entryPoint;
	http.open("POST", url, true);
	http.setRequestHeader('Content-type', 'application/json');
	http.setRequestHeader('Authorization', 'Basic YWJjMTIzOnNzaC1zZWNyZXQ=');
	http.onreadystatechange = function() {
		if (http.readyState == 4) {
			callback && callback(null, http.responseText); 
		} 
	}
	http.send(JSON.stringify(options));
}



function spin() {

	// spinning map + logo
	var content = L.DomUtil.get('spinning-content');
	var container = L.DomUtil.get('spinning-map');
	var config = loginConfig;
	config.content = content;
	config.container = container;
	var spinner = new L.SpinningMap(config);
}

function checkmobile() {

	// mobile css
	if (L.Browser.mobile) {
		var styletag = document.getElementById('styletag');
		var styleURL = '<link rel="stylesheet" href="https://projects.ruppellsgriffon.com/css/mobilestyle-login.css">';
		styletag.innerHTML = styleURL;
	}
}


function addhooks() {

	// forgot password link
	var forgotLink = document.getElementById('forgot-link');
	forgotLink.onclick = function () {
		showForgotPassword();
	}	

	// request reset
	var requestButton = document.getElementById('request-button');
	requestButton.onclick = function () {
		var forgotInput = document.getElementById('forgot-email');
		var email = forgotInput.value;

		requestReset({
			email : email
		}, function (err, body) {
			console.log('err, body', err, body);
			showLogin();
			setFeedback(body);
		});
	}

	// create password
	var createButton = document.getElementById('create-button');
	createButton.onclick = submitNewPassword;

	// 
}

function submitNewPassword () {	
	console.log('submitNewPassword');
	if (!passwordValid || !passwordSame) return console.log('too weak');

	var pass1 = document.getElementById('password-input').value;
	var pass2 = document.getElementById('password-repeat').value;

	if (pass1 != pass2) return console.log('not same');

	var options = {
		token : getToken(),
		password : pass1,
	}

	// send to server
	sendRequest('/reset/password', options, function (err, body){
		console.log('/reset', err, body);
		var result = JSON.parse(body);
		if (result.err) return console.error(result.err);

		var form = document.getElementById('login-form');
		var e = document.getElementById('input-email');
		var p = document.getElementById('input-pass');

		// auto login after success
		e.value = result.email;
		p.value = pass1;
		form.submit();
	});

}


function sendRequest(entryPoint, options, callback) {
	var http = new XMLHttpRequest(),
	    url = window.location.origin + entryPoint;
	http.open("POST", url, true);
	http.setRequestHeader('Content-type', 'application/json');
	http.onreadystatechange = function() {
		if (http.readyState == 4 && http.status == 200) {
			callback && callback(null, http.responseText); 
		}
	}
	http.send(JSON.stringify(options));
}

function requestReset (options, callback) {

	var http = new XMLHttpRequest(),
	    url = window.location.origin + '/reset';

	http.open("POST", url, true);

	//Send the proper header information along with the request
	http.setRequestHeader('Content-type', 'application/json');

	http.onreadystatechange = function() {
		if (http.readyState == 4 && http.status == 200) {

			// callback
			callback && callback(null, http.responseText); 
		}
	}

	http.send(JSON.stringify(options));
}

function hideAll() {
	hideLogin();
	hideForgotPassword();
	hideCreatePassword();
}

function hideForgotPassword() {
	var forgotDiv = document.getElementById('login-forgot-wrapper');
	forgotDiv.style.display = 'none';
}

function showForgotPassword() {
	hideAll();
	var forgotDiv = document.getElementById('login-forgot-wrapper');
	forgotDiv.style.display = 'block';
}

function hideLogin() {
	var loginWrap = document.getElementById('login-inner-wrapper');
	loginWrap.style.display = 'none';
}

function showLogin() {
	hideAll();
	var loginWrap = document.getElementById('login-inner-wrapper');
	loginWrap.style.display = 'block';
}

function hideCreatePassword() {
	var p = document.getElementById('login-password-wrapper');
	p.style.display = 'none';
}

function showCreatePassword() {
	var p = document.getElementById('login-password-wrapper');
	p.style.display = 'block';
}

function missingInfo () {
	setFeedback('Please provide both email and password.')
}

function setFeedback (msg) {
	var msgBox = document.getElementById('feedback-message');
	msgBox.innerHTML = msg;
	feedbackTimer = setTimeout(clearFeedback, 10000);
}

function clearFeedback () {
	var msgBox = document.getElementById('feedback-message');
	msgBox.innerHTML = '';
	feedbackTimer && clearTimeout(feedbackTimer);
}

function loginClick () {
	clearFeedback();

	var inputPass = document.getElementById('input-pass');
	var inputEmail = document.getElementById('input-email');
	var password = inputPass.value;
	var email = inputEmail.value;

	if (!password || !email) return missingInfo();

	var options = {
		password : password,
		email : email
	}

	sendLoginCheck(options, function (err, authenticated) {
		console.log('/loginCheck ok?', err, authenticated);

		if (authenticated) {
			console.log('hello ', authenticated.name);
			setFeedback('Authenticated!', authenticated.name);

			// var form = document.getElementById('login-form');
			// form.action = '/login';
			// form.submit();

		} else {
			console.log('not auth!');
			setFeedback('Not authenticated!');
		}

	});
}

function sendLoginCheck (options, callback) {

	var http = new XMLHttpRequest(),
	    url = window.location.origin + '/loginCheck';

	http.open("POST", url, true);

	//Send the proper header information along with the request
	http.setRequestHeader('Content-type', 'application/json');

	http.onreadystatechange = function() {
		if (http.readyState == 4 && http.status == 200) {

			// callback
			callback && callback(null, http.responseText); 
		}
	}

	http.send(JSON.stringify(options));
}

function debugSetPassword () {

	var http = new XMLHttpRequest(),
	    url = window.location.origin + '/debugSetPassword';

	http.open("POST", url, true);

	//Send the proper header information along with the request
	http.setRequestHeader('Content-type', 'application/json');

	http.onreadystatechange = function() {
		if (http.readyState == 4 && http.status == 200) {

			// callback
			callback && callback(null, http.responseText); 
		}
	}

	http.send(JSON.stringify({debug : true}));
}


zxcvbn_load_hook = function () {

	var p = document.getElementById('password-input');
	var r = document.getElementById('password-repeat');
	p.onkeyup = keyedup;
	r.onkeyup = keyedup;
}

function keyedup() {
	var p = document.getElementById('password-input');
	var r = document.getElementById('password-repeat');
	var s = document.getElementById('password-strength');

	var password = p.value;
	var score = zxcvbn(password);
	console.log(score);
	s.innerHTML = prettyStrength(score.score);

	score.score == 4 ? markStrong() : markWeak();
	checkButton();
	p.value == r.value ? markSame() : markNotSame();
	checkButton();
}

function checkButton() {
	var createButton = document.getElementById('create-button');
	if (passwordSame && passwordValid) {
		createButton.disabled = false;		
	} else {
		createButton.disabled = true;		
	}
}

function markSame() {
	passwordSame = true;
	var pro = document.getElementById('password-repeat-ok');
	pro.innerHTML = '√';
	pro.style.color = 'green';
}

function markNotSame() {
	passwordSame = false;
	var pro = document.getElementById('password-repeat-ok');
	pro.innerHTML = 'X';
	pro.style.color = 'red';
}

var passwordValid;
var passwordSame;
function markWeak() {
	passwordValid = false;
	var pio = document.getElementById('password-input-ok');
	pio.innerHTML = 'X';
	pio.style.color = 'red';
}	

function markStrong() {
	passwordValid = true;
	var pio = document.getElementById('password-input-ok');
	pio.innerHTML = '√';
	pio.style.color = 'green';
}


function prettyStrength (s) {
	if (s==0) return 'Password strength: <div class="red">Very Weak</div></div>';
	if (s==1) return 'Password strength: <div class="red">Very Weak</div></div>';
	if (s==2) return 'Password strength: <div class="red">Weak</div></div>';
	if (s==3) return 'Password strength: <div class="blue">Medium</div></div>';
	if (s==4) return 'Password strength: <div class="green">Strong</div></div>';
}

