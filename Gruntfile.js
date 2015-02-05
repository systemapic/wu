'use strict'; 
var path = require('path');
 
module.exports = function(grunt) {  
	grunt.loadNpmTasks('grunt-contrib-watch');	// Watches folders for filechanges 
	grunt.loadNpmTasks('grunt-contrib-cssmin');	// CSS Minifyer 
	grunt.loadNpmTasks('grunt-sass'); 	// Non Ruby C++ sass 
	grunt.loadNpmTasks('grunt-contrib-concat');    	// Slå sammen JS filer 
	grunt.loadNpmTasks('grunt-contrib-uglify');	// JS minifyer 
					
	grunt.initConfig(    {  
		

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
				files: [ 'public/js/src/controls/spinningMap.js', 'public/js/src/core/login.js' ],
				tasks:[  'concat:jsLogin', 'uglify:jsLogin' ]
			},

			css : {
				files:[  'scss/*' ],
				tasks:[  'sass', 'cssmin' ]
			},

			// If there is a change to any of the JS files
			js : {
				files:[  

				// JS 
				// Class 
				'public/js/src/core/class.js',
				// Sidepane 
				'public/js/src/panes/sidepane/sidepane.js',
				'public/js/src/panes/sidepane/sidepane.item.js',
				'public/js/src/panes/sidepane/sidepane.clients.js',
				'public/js/src/panes/sidepane/sidepane.project.js',
				'public/js/src/panes/sidepane/sidepane.client.js',
				'public/js/src/panes/sidepane/sidepane.users.js',
				'public/js/src/panes/sidepane/sidepane.map.js',
				'public/js/src/panes/sidepane/sidepane.mapSettings.js',
				'public/js/src/panes/sidepane/sidepane.documents.js',
				'public/js/src/panes/sidepane/sidepane.dataLibrary.js',
				'public/js/src/panes/sidepane/sidepane.mediaLibrary.js',
				// Panes 
				'public/js/src/panes/headerpane.js',
				'public/js/src/panes/mappane.js',
				// Controls 
				'public/js/src/controls/layermenuControl.js',
				'public/js/src/controls/inspectControl.js',
				'public/js/src/controls/descriptionControl.js',
				'public/js/src/controls/legendsControl.js',
				'public/js/src/controls/mousepositionControl.js',
				'public/js/src/controls/baselayertoggleControl.js',
				// Models 
				'public/js/src/models/projects.js',
				'public/js/src/models/clients.js',
				'public/js/src/models/users.js',
				'public/js/src/models/layers.js',
				'public/js/src/models/colorThemes.js',
				// App 
				'public/js/src/core/app.js',
				// Dependencies 
				'public/js/lib/lodash/lodash.min.js',
				'public/js/lib/parallel.js/parallel.js',
				// Leaflet 
				'public/js/lib/leaflet/Leaflet/dist/leaflet-src.js',
				'public/js/lib/mapbox.js/mapbox.standalone.2.1.2.js',
				'public/js/lib/leaflet/plugins/leaflet-omnivore.min.js',
				'public/js/lib/leaflet/plugins/leaflet.geojson.draw.js',
				'public/js/lib/leaflet/plugins/leaflet.draw.min.js',
				'public/js/lib/leaflet/plugins/leaflet.draw.note.js',
				'public/js/src/core/extendLeaflet.js',
				'public/js/lib/leaflet/plugins/styleEditor/Leaflet.StyleEditor.js',
				'public/js/lib/leaflet/plugins/styleEditor/Leaflet.StyleForms.js',
				// tools 
				'public/js/lib/dropzone.js/dropzone.min.js',
				'public/js/lib/icanhaz/icanhaz.min.js',
				'public/js/lib/list.js/list.min.js',
				'public/js/lib/sortable.js/Sortable.js',
				'public/js/lib/powerange/powerange.min.js',
				'public/js/lib/grande.js/js/grande.class.js',
				'public/js/lib/grande.js/js/grande.js',
				'public/js/lib/grande.js/js/grande.attachments.js'
			],
			tasks:[  'concat', 'uglify', ]
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
					sourceMap:true,
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
				src : 'public/dist/combined/css.dependencies.css',
				dest : 'public/dist/css.dependencies.min.css'
				
			},

			cssPortal : {
				src : 'public/dist/combined/css.portal.css',
				dest : 'public/dist/css.portal.min.css'
			},

			cssLogin : {
				src : 'public/dist/combined/css.login.combined.css',
				dest : 'public/dist/css.login.min.css'
			}			
		},



		// TASK: Merge JS files
		concat:{  

			options : {  
				separator:';',
			},
			
			jsPortal : {  
				src : [  
					// Class 
					'public/js/src/core/class.js',

					// Extend Leaflet
					'public/js/src/leaflet.js/plugins/extendLeaflet.js',

					// Sidepane 
					'public/js/src/panes/sidepane/sidepane.js',
					'public/js/src/panes/sidepane/sidepane.item.js',
					'public/js/src/panes/sidepane/sidepane.clients.js',
					'public/js/src/panes/sidepane/sidepane.project.js',
					'public/js/src/panes/sidepane/sidepane.client.js',
					'public/js/src/panes/sidepane/sidepane.users.js',
					'public/js/src/panes/sidepane/sidepane.map.js',
					'public/js/src/panes/sidepane/sidepane.mapSettings.js',
					'public/js/src/panes/sidepane/sidepane.documents.js',
					'public/js/src/panes/sidepane/sidepane.dataLibrary.js',
					'public/js/src/panes/sidepane/sidepane.mediaLibrary.js',

					// Panes 
					'public/js/src/panes/headerpane.js',
					'public/js/src/panes/mappane.js',
					'public/js/src/panes/statuspane.js',

					// Controls 
					'public/js/src/controls/layermenuControl.js',
					'public/js/src/controls/inspectControl.js',
					'public/js/src/controls/descriptionControl.js',
					'public/js/src/controls/legendsControl.js',
					'public/js/src/controls/mousepositionControl.js',
					'public/js/src/controls/baselayertoggleControl.js',

					// Models 
					'public/js/src/models/projects.js',
					'public/js/src/models/clients.js',
					'public/js/src/models/users.js',
					'public/js/src/models/layers.js',
					'public/js/src/models/colorThemes.js',
					'public/js/src/help/themeToggle.js',

					// App 
					'public/js/src/core/app.js'
				],
				
				dest : 'public/dist/combined/systemapic.combined.js',

			},
			jsDependencies : {  
				
				src : [  

					// dependencies 
					'public/js/lib/lodash/lodash.min.js',
					'public/js/lib/parallel.js/parallel.js',
					
					// leaflet + mapbox
					'public/js/src/leaflet.js/leaflet-0.7.3-src.js',
					'public/js/lib/mapbox.js/mapbox.standalone.2.1.2.js',
					'public/js/src/leaflet.js/plugins/leaflet-omnivore.min.js',
					'public/js/src/leaflet.js/plugins/leaflet.geojson.draw.js',
					'public/js/src/leaflet.js/plugins/leaflet.draw.min.js',
					'public/js/src/leaflet.js/plugins/leaflet.draw.note.js',
					'public/js/src/leaflet.js/plugins/styleEditor/leaflet.styleeditor.js',
					'public/js/src/leaflet.js/plugins/styleEditor/leaflet.styleforms.js',

					// tools 
					'public/js/lib/dropzone.js/dropzone.min.js',
					'public/js/lib/icanhaz/icanhaz.min.js',
					'public/js/lib/list.js/list.min.js',
					'public/js/lib/sortable.js/Sortable.js',
					'public/js/lib/powerange/powerange.min.js',
					'public/js/src/grande.js/js/grande.class.js',
					'public/js/src/grande.js/js/grande.js',
					'public/js/src/grande.js/js/grande.attachments.js'

				],
				
				dest : 'public/dist/combined/systemapic.dependencies.combined.js',

			},
			
			cssDependencies : {  
				
				src : [  
					'public/js/src/grande.js/css/menu.css',                    
					'public/js/src/grande.js/css/editor.css',
					'public/css/dependencies/bootstrap.min.css',
					'public/css/dependencies/font-awesome.min.css',
					'public/css/dependencies/mapbox.css',        
					'public/js/src/leaflet.js/leaflet.css',
					'public/js/src/leaflet.js/plugins/styleEditor/Leaflet.StyleEditor.css',
					'public/js/lib/powerange/powerange.min.css'
				],
				
				dest : 'public/dist/combined/css.dependencies.css'
			},

			cssPortal : {
				
				src : [
					'public/css/style.css',
					'public/css/evil.css',
					'public/css/knut.css',
				],

				dest : 'public/dist/combined/css.portal.css'
			},

			cssLogin : {
				
				src : [
					'public/css/mapbox.css',
					'public/css/login.css'					
				],

				dest : 'public/dist/combined/css.login.combined.css'
			},


			jsLogin : {
				
				src : [
					'public/js/lib/mapbox.js/mapbox.2.1.4.js',
					'public/js/lib/mapbox-gl.js/mapbox-gl.js',					
					'public/js/src/controls/spinningMap.js',
					'public/js/src/core/login.js',
				],

				dest : 'public/dist/combined/login.combined.js'
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
					'public/dist/js.portal.min.js' : 'public/dist/combined/systemapic.combined.js',

				}
			},

			jsDependencies : {  
				files : {  
					'public/dist/js.dependencies.min.js' : 'public/dist/combined/systemapic.dependencies.combined.js',
				}
			},


			jsLogin : {  
				files : {  
					'public/dist/combined/login.min.js' : 'public/dist/combined/login.combined.js',	
				}
			},

		}
	}    ); 
  
  

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
				'watch',

			]);
		}    
	); 

	grunt.registerTask('cssdeps', 
		function () {
			grunt.task.run([
				'concat:cssDependencies',
				'cssmin:cssDependencies',
				'concat:cssPortal',
				'cssmin:cssPortal'
			]);
		}

	);

	grunt.registerTask('jsdeps', 
		function () {
			grunt.task.run([
				'concat:jsDependencies',
				'uglify:jsDependencies',
				'concat:jsPortal',
				'uglify:jsPortal'
			]);
		}
	)

	grunt.registerTask('default',
		[  
			'waiter'
		]    
	);
}