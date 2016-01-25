'use strict'; 
var path = require('path');
 
module.exports = function(grunt) {  
	grunt.loadNpmTasks('grunt-contrib-watch');	// Watches folders for filechanges 
	grunt.loadNpmTasks('grunt-contrib-cssmin');	// CSS Minifyer 
	grunt.loadNpmTasks('grunt-sass'); 		// Non Ruby C++ sass 
	grunt.loadNpmTasks('grunt-contrib-concat');    	// Slå sammen JS filer 
	grunt.loadNpmTasks('grunt-contrib-uglify');	// JS minifyer 
	grunt.loadNpmTasks('grunt-preprocess');		// Preprocess conditional HTML tags
	grunt.loadNpmTasks('grunt-env');		// Set environment for conditional HTML 
	grunt.loadNpmTasks('grunt-contrib-htmlmin');	// HTML minifyer
	grunt.loadNpmTasks('grunt-contrib-jshint');	// Checks JS
	grunt.loadNpmTasks('grunt-mocha-test'); // Mocha test
					
	grunt.initConfig({
		// Look for filechanges,
		// run tasks,
		watch:{
			// If change to any of the SASS files,
			// compile new CSS file
			cssLogin : {
				files:[  'public/css/login.css' ],
				tasks:[  'concat:cssLogin', 'cssmin:cssLogin' ]
			},

			jsLogin : {
				files: [ 'public/js/src/controls/spinningmap.control.js', 'public/js/src/core/login.js' ],
				tasks:[  'concat:jsLogin', 'uglify:jsLogin' ]
			},

			css : {
				files:[  'scss/*', 'public/css/**/*.css' ],
				tasks:[  'sass', 'cssmin' ]
			},

			// If there is a change to any of the JS files
			jsPortal : {
				files:['public/js/src/**/*.js'],				
				tasks:[ 'concat:jsPortal', 'uglify:jsPortal' ]
			},

			jsDependencies : {
				files:['public/js/lib/**/*.js'],				
				tasks:[  'concat:jsDependencies', 'uglify:jsDependencies' ]
			}			
		},


		// TASKS
		// TASKS
		// TASKS

		// TASK: Compile CSS from SCSS 
		sass:{
			// task 
			dev:{  
				// another target 
				options:{  
					// dictionary of render options 
					sourceMap:false,
						extDot:'last'
				},
				files:{  
					'public/css/style.css':'scss/style.scss'
				}
			}
		},

		// TASK: Minify CSS 
		cssmin:{
			css:{  
				src:'public/css/style.css',
				dest:'public/css/style.min.css'
			},

				
			cssDependencies:{  
				src : 'public/dist/tmp/css.dependencies.css',
				dest : 'public/dist/css.dependencies.min.css'
				
			},

			cssPortal : {
				src : 'public/dist/tmp/css.portal.css',
				dest : 'public/dist/css.portal.min.css'
			},

			cssLogin : {
				src : 'public/dist/tmp/css.login.combined.css',
				dest : 'public/dist/login.min.css'
			},

			phantomJSthumb : {
				 
					src : 'public/css/phantomJSthumb.css',
					dest : 'public/dist/phantomJSthumb.css'
			},

			phantomJS : {
					src : 'public/css/phantomJS.css',
					dest : 'public/dist/phantomJS.css'
			},

			fonts : {
					src : 'public/css/fonts.css',
					dest : 'public/dist/fonts.css'
			}

			// mobilestyle : {
				 
			// 		src : 'public/css/mobilestyle.css',
			// 		dest : 'public/dist/css/mobilestyle.css'
			// },

			// mobilestyleLogin : {
				 
			// 		src : 'public/css/mobilestyle-login.css',
			// 		dest : 'public/dist/css/mobilestyle-login.css'
			// },
			// padstyle : {
				 
			// 		src : 'public/css/padstyle.css',
			// 		dest : 'public/dist/css/padstyle.css'
			// },	
		},

		// TASK: Merge JS files
		concat:{

			options : {  
				// separator:';',
			},
																	

			// Goes in header
			jsDependencies : {  
				
				src : [  

					// d3
					'public/js/lib/d3.js/d3.js',

					// c3
					'public/js/lib/c3/c3.js',
					'public/js/lib/dc.js/crossfilter.js',
					'public/js/lib/dc.js/dc.js',

					// dependencies 
					'public/js/lib/codemirror/mode/cartocss/jquery-2.1.1.min.js',
					'public/js/lib/lodash/lodash.min.js',
					'public/js/lib/async/async.js',
					
					// leaflet + mapbox
					'public/js/lib/leaflet.js/leaflet-0.7.3-src.js',
					'public/js/lib/leaflet.js/plugins/leaflet.utfgrid.js',
					'public/js/lib/leaflet.js/plugins/leaflet-draw/leaflet.draw-src.js',

					// tools
					'public/js/lib/dropzone.js/dropzone.min.js',
					'public/js/lib/list.js/list.min.js',
					'public/js/lib/sortable.js/Sortable.js',

					// resumable
					'public/js/lib/resumable/resumable.js',

					// // grande
					// 'public/js/lib/grande/js/grande.class.js',
					// 'public/js/lib/grande/js/grande.js',
					// 'public/js/lib/grande/js/grande.attachments.js',

					// codemirror
					'public/js/lib/codemirror/mode/cartocss/cartoref.js',
					'public/js/lib/codemirror/lib/codemirror.js',
					'public/js/lib/codemirror/mode/cartocss/runmode.js',
					'public/js/lib/codemirror/mode/cartocss/searchcursor.js',
					'public/js/lib/codemirror/mode/cartocss/codemirror.carto.js',
					'public/js/lib/codemirror/mode/cartocss/codemirror.carto.complete.js',
					'public/js/lib/codemirror/mode/cartocss/codemirror.search.js',
					'public/js/lib/codemirror/mode/cartocss/codemirror.palette.js',
					'public/js/lib/codemirror/mode/cartocss/sexagesimal.js',
					'public/js/lib/codemirror/mode/cartocss/spectrum.js',
					'public/js/lib/codemirror/mode/sql/sql.js',

					// extra
					'public/js/lib/opentip/opentip-native.js',
					'public/js/lib/jss.js/jss.js',	
					'public/js/lib/keymaster/keymaster.js',	
					'public/js/lib/moment.js/moment.min.js',
					'public/js/lib/sniffer/sniffer.module.js',
					'public/js/lib/cryptojs/sha3.js',
					'public/js/lib/nouislider/nouislider.js'
				],
				
				dest : 'public/dist/tmp/systemapic.dependencies.combined.js'

			},

			// goes in footer
			jsPortal : {  
				src : [  
					// Class 
					'public/js/src/core/class.js',
					'public/js/src/core/api.js',

					// socket.io
					'public/js/src/core/api.socket.js',

					// controller
					'public/js/src/core/controller.js',

					'public/js/src/core/data.js',
					'public/js/src/core/evented.js',
					'public/js/src/ext/resumable.js',
					
					// Panes
					'public/js/src/panes/pane.js',
					'public/js/src/panes/pane.header.js',
					'public/js/src/panes/pane.progress.js',
					'public/js/src/panes/pane.map.js',
					'public/js/src/panes/pane.status.js',
					'public/js/src/panes/pane.start.js',
					'public/js/src/panes/pane.feedback.js',
					'public/js/src/panes/pane.share.js',
					'public/js/src/panes/pane.mapsettings.js',
					'public/js/src/panes/pane.fullscreen.js',
					'public/js/src/panes/pane.login.js',
					'public/js/src/panes/pane.account.js',
					'public/js/src/panes/pane.guide.js',


					// chrome
					'public/js/src/chrome/chrome.js',	
					'public/js/src/chrome/chrome.top.js',	
					'public/js/src/chrome/chrome.bottom.js',						
					'public/js/src/chrome/chrome.left.js',	
					'public/js/src/chrome/chrome.right.js',	

					'public/js/src/chrome/data/chrome.data.js',

					'public/js/src/chrome/projects/chrome.projects.js',
					'public/js/src/chrome/users/chrome.users.js',
					'public/js/src/chrome/settings/chrome.settings.js',
					'public/js/src/chrome/settings/chrome.settings.filters.js',
					'public/js/src/chrome/settings/chrome.settings.cartocss.js',
					'public/js/src/chrome/settings/chrome.settings.tooltip.js',
					'public/js/src/chrome/settings/chrome.settings.mapsettings.js',
					'public/js/src/chrome/settings/chrome.settings.settingsselector.js',
					'public/js/src/chrome/settings/chrome.settings.styler.js',
					'public/js/src/chrome/settings/styler.js',
					'public/js/src/chrome/settings/styler.polygon.js',
					'public/js/src/chrome/settings/styler.point.js',
					'public/js/src/chrome/settings/styler.line.js',
					'public/js/src/chrome/settings/chrome.settings.layers.js',
					'public/js/src/chrome/settings/chrome.settings.extras.js',


					// Controls 
					'public/js/src/controls/control.js',
					'public/js/src/controls/control.zoom.js',
					'public/js/src/controls/control.geojson.draw.js',
					'public/js/src/controls/control.draw.js',
					'public/js/src/controls/control.zindex.js',
					'public/js/src/controls/control.measure.js',
					'public/js/src/controls/control.geolocation.js',
					'public/js/src/controls/control.layermenu.js',
					'public/js/src/controls/control.description.js',
					'public/js/src/controls/control.mouseposition.js',
					'public/js/src/controls/control.style.js',
					'public/js/src/controls/control.tooltip.js',				
					'public/js/src/controls/control.spinningmap.js',
					'public/js/src/ext/popup.chart.js',
					'public/js/src/controls/control.chart.js',
					

					// Models 
					'public/js/src/models/model.js',
					'public/js/src/models/model.projects.js',
					'public/js/src/models/model.clients.js',
					'public/js/src/models/model.users.js',
					'public/js/src/models/model.layers.js',
					'public/js/src/models/model.files.js',
					'public/js/src/models/model.roles.js',
					'public/js/src/models/model.D3List.js',

					// Access
					'public/js/src/core/access.js',
			
					// Analytics
					'public/js/src/ext/analytics.js',

					// Satellite angle
					'public/js/src/ext/satelliteAngle.js',	

					// Buttons
					'public/js/src/ext/buttons.js',

					// Language file
					'public/js/src/lang/language.english.js',

					// Extend Leaflet
					'public/js/src/ext/extendLeaflet.js',
					
					// Momory
					'public/js/src/tests/memory.js',
					
					// App 
					'public/js/src/core/app.js'




				],
				
				dest : 'public/dist/tmp/systemapic.combined.js'

			},

			
			cssDependencies : {  
				
				src : [  

					'public/js/lib/leaflet.js/plugins/leaflet-search/src/leaflet-search.css',

					// 'public/js/lib/grande/css/menu.css',                    
					// 'public/js/lib/grande/css/editor.css',
					'public/css/bootstrap.min.css',
					// 'public/css/font-awesome-4.4.0/css/font-awesome.min.css',
					'public/css/mapbox.css',        
					'public/js/lib/leaflet.js/leaflet.css',
					'public/js/lib/leaflet.js/plugins/styleEditor/Leaflet.StyleEditor.css',
					'public/js/lib/powerange/powerange.min.css',
					'public/js/lib/codemirror/lib/codemirror.css',
					'public/js/lib/codemirror/mode/cartocss/codemirror.carto.css',
					'public/js/lib/codemirror/mode/cartocss/codemirror.fetta.css',
					'public/js/lib/codemirror/theme/mbo.css',
					'public/js/lib/nouislider/nouislider.min.css',
					'public/css/opentip.css',
					'public/js/lib/c3/c3.css',
					'public/js/lib/dc.js/dc.css'
				],
				
				dest : 'public/dist/tmp/css.dependencies.css'
			},


			cssDepAddToMinified : {

				src : [
					'public/js/lib/codemirror/mode/cartocss/spectrum.css', // Does not work when merged with other css dependency files'			
					'public/dist/css.dependencies.min.css'
				],

				dest : 'public/dist/css.dependencies.min.css'

			},

			cssPortal : {
				
				src : [
					'public/css/style.css',
					'public/css/evil.css',	
					'public/css/chrome.css',
					'public/css/knut.css',
					'public/css/experiments.css',
					'public/css/jevil.css'					
				],

				dest : 'public/dist/tmp/css.portal.css'
			},

			cssLogin : {
				
				src : [
					// 'public/css/mapbox.css',
					// 'public/css/login.css'

					// 'public/css/font-awesome-4.4.0/css/font-awesome.min.css',
					'public/css/invitation.css'				
				],

				dest : 'public/dist/tmp/css.login.combined.css'
			},


			jsLogin : {
				
				src : [
					// 'public/js/lib/mapbox.js/mapbox.2.1.4.js',
					// 'public/js/src/controls/control.spinningmap.js',
					// 'public/js/src/config/login-config.js',
					// 'public/js/lib/zxcvbn/zxcvbn-async.js',
					// 'public/js/src/core/login.js',

					'public/js/src/core/class.js',
					'public/js/src/core/invitation.js'

				],

				dest : 'public/dist/tmp/login.combined.js'
			}			

		},

		// TASK: MINIFY JS
		uglify:{
			options:{  
				compress:{  
					drop_console:true
				}
			},
			
			jsPortal:{  
				files:{  
					'public/dist/js.portal.min.js' : 'public/dist/tmp/systemapic.combined.js'
				}
			},

			jsDependencies : {  
				files : {  
					'public/dist/js.dependencies.min.js' : 'public/dist/tmp/systemapic.dependencies.combined.js'
				}
			},


			jsLogin : {  
				files : {  
					'public/dist/login.min.js' : 'public/dist/tmp/login.combined.js'
				}
			}

		},


		// Set environment for conditional HTML
		env : {

			options : {

			/* Shared Options Hash */
			//globalOption : 'foo'

			},

			dev: {

				NODE_ENV : 'DEVELOPMENT'

			},

			prod : {

				NODE_ENV : 'PRODUCTION'

			}

		},


		// Preprocess – for conditional HTML tags
		preprocess : {

			dev : {

				src : 'views/app.ejs',
				dest : 'views/app.serve.ejs'

			},

			prod : {

				src : 'views/app.ejs',
				dest : 'views/tmp/app.temp.ejs'
			},

			login : {
				src : 'views/login.ejs',
				dest : 'views/login.serve.ejs'
			}
		},


		htmlmin: {
			dist: {
				options: {
				removeComments: true,
				collapseWhitespace: true
				},
				files: {
					'views/app.serve.ejs': 'views/tmp/app.temp.ejs',     // 'destination': 'source'
				}
			},

		// jshint: {
		// 	ignore_warning: {
		// 		options: {
		// 			'-W015': true,
		// 		},
		// 		src: ['dist/tmp/systemapic.combined.js'],
		// 	},
		// },
		},

		mochaTest: {
			options: {
				reporter: 'spec',
				timeout: 10000
			},

			unit: {
				src: [
					'test/**/*_test.js'
				]
			}
		}
	});
  
  

	grunt.registerTask('login', 
		function () {
			grunt.task.run([
				'concat:cssLogin',
				'cssmin:cssLogin',
				'concat:jsLogin',
				'uglify:jsLogin'
			]);
		}
	);

	grunt.registerTask('waiter',
		function() {  
			grunt.task.run([  
				'watch'
			]);
		}    
	); 

	grunt.registerTask('css', 
		function () {
			grunt.task.run([
				'concat:cssDependencies',
				'cssmin:cssDependencies',
				'concat:cssPortal',
				'cssmin:cssPortal'
			]);
		}

	);

	grunt.registerTask('js', 
		function () {
			grunt.task.run([
				'concat:jsDependencies',
				'uglify:jsDependencies',
				'concat:jsPortal',
				'uglify:jsPortal'
			]);
		}
	);


	grunt.registerTask('prod', function () { grunt.task.run([ 
		
			'sass',
			'concat:cssDependencies',
			'cssmin:cssDependencies',
			'concat:cssDepAddToMinified',
			'concat:cssPortal',
			'cssmin:cssPortal',
			'cssmin:phantomJSthumb',
			'cssmin:phantomJS',
			// 'cssmin:mobilestyle',
			// 'cssmin:mobilestyleLogin',
			// 'cssmin:padstyle',
			'concat:jsDependencies',
			'uglify:jsDependencies',
			'concat:jsPortal',
			'uglify:jsPortal',
			'env:prod', 
			'preprocess:prod',
			'login',
			'preprocess:login',
			'htmlmin'


	])});

	grunt.registerTask('dev',  function () { grunt.task.run([ 
		
			'sass',
			'concat:cssDependencies',
			'cssmin:cssDependencies',
			'concat:cssDepAddToMinified',
			'env:dev', 
			'preprocess:dev',
			'login',
			'preprocess:login'
	])});

	grunt.registerTask('test', function () { grunt.task.run([
		'mochaTest'
	])});

	grunt.registerTask('default', ['waiter']);
};
