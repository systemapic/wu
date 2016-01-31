module.exports = {
	"serverConfig": {

		"instance" : "tx - dev",
		
		"token": {
			"accessTokenLength": "256",
			"refreshTokenLength": "256",
			"expiresIn": "36000"
		},
		"port": 3001,
		"mongo": {
			"url": "mongodb://systemapic:qHZrRctXdkd2pt5AuexKeDb7Sag55zdRxZw5XUEW@mongo/systemapic",
		},
		"redis": {

			"layers" : {
				"port": 6379,
				"host": "redislayers",
				"auth": "9p7bRrd7Zo9oFbxVJIhI09pBq6KiOBvU4C76SmzCkqKlEPLHVR02TN2I40lmT9WjxFiFuBOpC2BGwTnzKyYTkMAQ21toWguG7SZE",
				"db": 1
			},
			"stats" : {
				"port": 6379,
				"host": "redisstats",
				"auth": "9p7bRrd7Zo9oFbxVJIhI09pBq6KiOBvU4C76SmzCkqKlEPLHVR02TN2I40lmT9WjxFiFuBOpC2BGwTnzKyYTkMAQ21toWguG7SZE",
				"db": 1

			},
			"temp" : {
				"port": 6379,
				"host": "redistemp",
				"auth": "9p7bRrd7Zo9oFbxVJIhI09pBq6KiOBvU4C76SmzCkqKlEPLHVR02TN2I40lmT9WjxFiFuBOpC2BGwTnzKyYTkMAQ21toWguG7SZE",
				"db": 1
			}
		},
		"slack": {
			"webhook" : "https://hooks.slack.com/services/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",
			"token": "xoxb-3868763863-SGufYHEt7crFub8BoWpNNsHy",
			"channel": "systemapic-bot",
			"monitor": "systemapic-monitor",
			"errorChannel": "#dev-error-log",
			"botname": "systemapic-bot",
			"icon": "http://systemapic.com/wp-content/uploads/systemapic-color-logo-circle.png",
			"baseurl": "https://dev.systemapic.com/"
		},
		"portalServer": {
			"uri": "https://dev.systemapic.com/"
		},
		"defaultMapboxAccount": {
			"username": "systemapic",
			"accessToken": "pk.eyJ1Ijoic3lzdGVtYXBpYyIsImEiOiJQMWFRWUZnIn0.yrBvMg13AZC9lyOAAf9rGg"
		},
		"phantomJS": {
			"user": "bot@systemapic.com",
			"auth": "94a528a30ae70008b4cc94c0fd6bb844"
		},
		"nodemailer": {
			"service": "gmail",
			"auth": {
				"user" : "info@systemapic.com",
				"pass" : "!***REMOVED***@google"
			},
			"bcc": [
				"info@systemapic.com",
			],
			"from": "Systemapic.com <info@systemapic.com>"
		},
		"path": {
			"file"	: "/data/files/",
			"image"	: "/data/images/",
			"temp"	: "/data/tmp/",
			"log" 	: "/data/logs/",
			"cartocss": "/data/cartocss/",
			"tools"	: "../tools/",
			"legends": "/data/legends/",
			"geojson": "/data/geojson/",
			"raster_tiles" : "/data/raster_tiles/",
		},
		"portal": {
			"roles": {
				"superAdmin": "role-c5bb12e0-ec5d-42e8-b8af-3bb573c70b49",
				"portalAdmin": "role-4ae1b3ec-dc77-4069-9268-2f6d3f2d2385"
			},

			"invite_only" : false
		},
		"postgis": {
			"filters" : {
				"num_buckets" : 50
			}
		},
		"mail" : {
			"systemapic" : {
				"logo" : "images/mail-logo.png",
				"color" : "#313640"
			},

			"portal" : {
				"logo" : "local/mail-logo.png",
				"color" : "#313640"
			},

			"templates" : {

				"invited" : {
					"title" : "Hi! You've been invited!",
					"subject" : "Your access details to Systemapic",
					"body" : "[inviter_name] has invited you to collaborate on Systemapic.",
					"button_text" : "Click to sign in",
				},

				"contactRequest" : {
					"title" : "[inviter_name] wants to connect with you!",
					"subject" : "You have a contact request",
					"body" : "[inviter_name] would like to add you to their contact list.",
					"button_text" : "Accept request",
				}

			}
		},

	},
	"loginConfig": {
		"pageTitle" : "Systemapic Login",
		"autoStart": true,
		"accessToken": "pk.eyJ1Ijoic3lzdGVtYXBpYyIsImEiOiJQMWFRWUZnIn0.yrBvMg13AZC9lyOAAf9rGg",
		"layer": "systemapic.kcjonn12",
		"logo": "css/images/login-logo.png",

		// Set logo background
		"logoBackground" : "#FFFFFF",
		"logoBackgroundClass" : "no-class",

		// Logo used on login page
		"loginLogo": "local/login-logo.png",

		// Logo used on invitation page
		"invitationLogo" : "url('data:image/png;base64,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')",	
		
		"loginLogoWidth" : 210,

		"wrapper": false,
		"speed": 1000,
		"position": {
			"lat": 59.942,
			"lng": 10.716,
			"zoom": [
				15,
				16
			]
		},
		"circle": {
			"radius": 120,
			"color": "rgba(247, 175, 38, 0.3)",
			"border": {
				"px": 4,
				"solid": "solid",
				"color": "white"
			}
		},
		"ga": {
			"id": "UA-57572003-4"
		}
	},
	"clientConfig": {
		"id": "app",
		"portalName": "systemapic",
		"portalLogo": false,
		"portalTitle": "[tx] Systemapic Secure Portal",
		"panes": {
			"clients": true,
			"options": true,
			"documents": true,
			"dataLibrary": true,
			"users": true,
			"share": true,
			"mediaLibrary": false,
			"account": true
		},
		"attribution" : "<a href='https://systemapic.com' target='_blank'>Powered by Systemapic.com</a>",
		"logos": {
			"projectDefault": "/css/images/grinders/BG-grinder-small-grayDark-on-white.gif",
			"portalLogo" : "css/logos/web-logo.png",
			"portalLink" : "https://systemapic.com/",
			"clientLogo" : {
				"image" : "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOQAAAAwCAYAAAAB+Na0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkY4QzIxQjU2Mzk3MTFFNUJGQTFDQkI5NjJCQjk2QzQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkY4QzIxQjY2Mzk3MTFFNUJGQTFDQkI5NjJCQjk2QzQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGRjhDMjFCMzYzOTcxMUU1QkZBMUNCQjk2MkJCOTZDNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGRjhDMjFCNDYzOTcxMUU1QkZBMUNCQjk2MkJCOTZDNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmTmCHkAABJBSURBVHja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')",
				"size" : "110px 21px",
				"position" : "15px 10px",
				"backgroundColor" : "#FCFCFC",
				"backgroundSize" : "110px 21px",
				"backgroundPosition" : "15px 10px",
			},
			"loginLogo" : {
				"image" : "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOQAAAAwCAYAAAAB+Na0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkY4QzIxQjU2Mzk3MTFFNUJGQTFDQkI5NjJCQjk2QzQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkY4QzIxQjY2Mzk3MTFFNUJGQTFDQkI5NjJCQjk2QzQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGRjhDMjFCMzYzOTcxMUU1QkZBMUNCQjk2MkJCOTZDNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGRjhDMjFCNDYzOTcxMUU1QkZBMUNCQjk2MkJCOTZDNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmTmCHkAABJBSURBVHja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')",
				"backgroundColor" : "#FCFCFC",
				"backgroundSize" : "221px 53px",
				"backgroundPosition" : "36px 8px",
				"width" : "300px",
				"height" : "100px",
			}
		},
		"settings": {
			"chat": true,
			"colorTheme": true,
			"screenshot": true,
			"socialSharing": true,
			"print": true
		},
		"defaults": {
			"project": {
				"position": {
					"lat": 54.213861000644926,
					"lng": 6.767578125,
					"zoom": 4
				}
			}
		},
		"providers": {
			"mapbox": [{
				"username": "systemapic",
				"accessToken": "pk.eyJ1Ijoic3lzdGVtYXBpYyIsImEiOiJkV2JONUNVIn0.TJrzQrsehgz_NAfuF8Sr1Q"
			}]
		},
		"servers": {
			"portal": "https://dev.systemapic.com/",
			"subdomain" : "https://{s}.systemapic.com/",
			"tiles": {
				"uri": "https://{s}.systemapic.com/tiles/",
				"subdomains": ["tiles-txa", "tiles-txb", "tiles-txc", "tiles-txd"]
			},
			"proxy" : {
				"uri" : "https://{s}.systemapic.com/proxy/",
				"subdomains" : ["proxy-txa", "proxy-txb", "proxy-txc", "proxy-txd"]
			},
			"utfgrid": {
				"uri": "https://{s}.systemapic.com/tiles/",
				"subdomains": ["grid-txa", "grid-txb", "grid-txc", "grid-txd"]
			},
		},
		"ga": {
			"id": "UA-57572003-4"
		}
	}
}