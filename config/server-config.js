module.exports = {
	"port": 3001,
	"mongo": {
		"url": "mongodb://mongo/systemapic"
	},
	"kueRedis": {
		"port": 6379,
		"host": "redis-kue",
		"auth": "crlAxeVBbmaxBY5GVTaxohjsgEUcrT5IdJyHi8J1fdGG8KqXdfw3RP0qyoGlLltoVjFjzZCcKHvBVQHpTUQ26W8ql6xurdm0hLIY"
	},
	"tokenRedis": {
		"port": 6379,
		"host": "redis-token",
		"auth": "9p7bRrd7Zo9oFbxVJIhI09pBq6KiOBvU4C76SmzCkqKlEPLHVR02TN2I40lmT9WjxFiFuBOpC2BGwTnzKyYTkMAQ21toWguG7SZE"
	},
	"temptokenRedis": {
		"port": 6379,
		"host": "redis-token",
		"auth": "9p7bRrd7Zo9oFbxVJIhI09pBq6KiOBvU4C76SmzCkqKlEPLHVR02TN2I40lmT9WjxFiFuBOpC2BGwTnzKyYTkMAQ21toWguG7SZE"
	},
	"slack": {
		"webhook": "https://hooks.slack.com/services/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",
		"token": "xoxb-3868763863-SGufYHEt7crFub8BoWpNNsHy",
		"channel": "#systemapic-bot",
		"errorChannel": "#dev-error-log",
		"botname": "systemapic-bot",
		"icon": "http://systemapic.com/wp-content/uploads/systemapic-color-logo-circle.png",
		"baseurl": "https://dev.systemapic.com/"
	},
	"vile": {
		"uri": "http://localhost:3003/",
		"link": "vile",
		"port": "3003"
	},
	"vileGrind": {
		"uri": "http://5.9.117.212:3069/",
		"link": "vileGrind",
		"port": "3069"
	},
	"vileosm": {
		"uri": ""
	},
	"grind": {
		"host": "http://5.9.117.212:3069/",
		"ssh": "tx"
	},
	"portalServer": {
		"uri": "https://dev.systemapic.com/"
	},
	"defaultMapboxAccount": {
		"username": "systemapic",
		"accessToken": "pk.eyJ1Ijoic3lzdGVtYXBpYyIsImEiOiJQMWFRWUZnIn0.yrBvMg13AZC9lyOAAf9rGg"
	},
	"phantomJS": {
		"data": "email=info@systemapic.com&password=ee6f143f4bbfce8107b192708f574af2"
	},
	"nodemailer": {
		"service": "gmail",
		"auth": {
			"user": "knutole@noerd.biz",
			"pass": "***REMOVED***@noerdbiz"
		},
		"bcc": [
			"info@systemapic.com"
		],
		"from": "Systemapic.com <info@systemapic.com>"
	},
	"path": {
		"file": "/data/files/",
		"image": "/data/images/",
		"temp": "/data/tmp/",
		"cartocss": "/data/cartocss/",
		"tools": "../tools/",
		"legends": "/data/legends/",
		"geojson": "/data/geojson/"
	},
	"portal": {
		"roles": {
			"superAdmin": "role-c263222d-f50d-41bb-83c1-a641da303b1e",
			"portalAdmin": "role-b716a9e3-9e5c-462a-9ee9-30100ce6077e"
		}
	}
}