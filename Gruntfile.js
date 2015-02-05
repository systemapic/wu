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
				files:[  'app/public/css/login.css' ],
				tasks:[  'concat:cssLogin', 'cssmin:cssLogin' ]
			},

			jsLogin : {
				files: [ 'app/public/js/src/controls/spinningMap.js', 'app/public/js/src/core/login.js' ],
				tasks:[  'concat:jsLogin', 'uglify:jsLogin' ]
			},

			css : {
				files:[  'app/scss/*' ],
				tasks:[  'sass', 'cssmin' ]
			},

			// If there is a change to any of the JS files
			js : {
				files:[  

				// JS 
				// Class 
				'app/public/js/src/core/class.js',
				// Sidepane 
				'app/public/js/src/panes/sidepane/sidepane.js',
				'app/public/js/src/panes/sidepane/sidepane.item.js',
				'app/public/js/src/panes/sidepane/sidepane.clients.js',
				'app/public/js/src/panes/sidepane/sidepane.project.js',
				'app/public/js/src/panes/sidepane/sidepane.client.js',
				'app/public/js/src/panes/sidepane/sidepane.users.js',
				'app/public/js/src/panes/sidepane/sidepane.map.js',
				'app/public/js/src/panes/sidepane/sidepane.mapSettings.js',
				'app/public/js/src/panes/sidepane/sidepane.documents.js',
				'app/public/js/src/panes/sidepane/sidepane.dataLibrary.js',
				'app/public/js/src/panes/sidepane/sidepane.mediaLibrary.js',
				// Panes 
				'app/public/js/src/panes/headerpane.js',
				'app/public/js/src/panes/mappane.js',
				// Controls 
				'app/public/js/src/controls/layermenuControl.js',
				'app/public/js/src/controls/inspectControl.js',
				'app/public/js/src/controls/descriptionControl.js',
				'app/public/js/src/controls/legendsControl.js',
				'app/public/js/src/controls/mousepositionControl.js',
				'app/public/js/src/controls/baselayertoggleControl.js',
				// Models 
				'app/public/js/src/models/projects.js',
				'app/public/js/src/models/clients.js',
				'app/public/js/src/models/users.js',
				'app/public/js/src/models/layers.js',
				'app/public/js/src/models/colorThemes.js',
				// App 
				'app/public/js/src/core/app.js',
				// Dependencies 
				'app/public/js/lib/lodash/lodash.min.js',
				'app/public/js/lib/parallel.js/parallel.js',
				// Leaflet 
				'app/public/js/lib/leaflet/Leaflet/dist/leaflet-src.js',
				'app/public/js/lib/mapbox.js/mapbox.standalone.2.1.2.js',
				'app/public/js/lib/leaflet/plugins/leaflet-omnivore.min.js',
				'app/public/js/lib/leaflet/plugins/leaflet.geojson.draw.js',
				'app/public/js/lib/leaflet/plugins/leaflet.draw.min.js',
				'app/public/js/lib/leaflet/plugins/leaflet.draw.note.js',
				'app/public/js/src/core/extendLeaflet.js',
				'app/public/js/lib/leaflet/plugins/styleEditor/Leaflet.StyleEditor.js',
				'app/public/js/lib/leaflet/plugins/styleEditor/Leaflet.StyleForms.js',
				// tools 
				'app/public/js/lib/dropzone.js/dropzone.min.js',
				'app/public/js/lib/icanhaz/icanhaz.min.js',
				'app/public/js/lib/list.js/list.min.js',
				'app/public/js/lib/sortable.js/Sortable.js',
				'app/public/js/lib/powerange/powerange.min.js',
				'app/public/js/lib/grande.js/js/grande.class.js',
				'app/public/js/lib/grande.js/js/grande.js',
				'app/public/js/lib/grande.js/js/grande.attachments.js'
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
						'app/public/css/style.css':'app/scss/style.scss'
					}
				}
			},

		// TASK: Minify CSS 
		cssmin:{  
			css:{  
				src:'app/public/css/style.css',
				dest:'app/public/css/style.min.css'
			},

				
			cssDependencies:{  
				src : 'app/public/dist/combined/css.dependencies.css',
				dest : 'app/public/dist/css.dependencies.min.css'
				
			},

			cssPortal : {
				src : 'app/public/dist/combined/css.portal.css',
				dest : 'app/public/dist/css.portal.min.css'
			},

			cssLogin : {
				src : 'app/public/dist/combined/css.login.combined.css',
				dest : 'app/public/dist/css.login.min.css'
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
					'app/public/js/src/core/class.js',

					// Extend Leaflet
					'app/public/js/src/leaflet.js/plugins/extendLeaflet.js',

					// Sidepane 
					'app/public/js/src/panes/sidepane/sidepane.js',
					'app/public/js/src/panes/sidepane/sidepane.item.js',
					'app/public/js/src/panes/sidepane/sidepane.clients.js',
					'app/public/js/src/panes/sidepane/sidepane.project.js',
					'app/public/js/src/panes/sidepane/sidepane.client.js',
					'app/public/js/src/panes/sidepane/sidepane.users.js',
					'app/public/js/src/panes/sidepane/sidepane.map.js',
					'app/public/js/src/panes/sidepane/sidepane.mapSettings.js',
					'app/public/js/src/panes/sidepane/sidepane.documents.js',
					'app/public/js/src/panes/sidepane/sidepane.dataLibrary.js',
					'app/public/js/src/panes/sidepane/sidepane.mediaLibrary.js',

					// Panes 
					'app/public/js/src/panes/headerpane.js',
					'app/public/js/src/panes/mappane.js',
					'app/public/js/src/panes/statuspane.js',

					// Controls 
					'app/public/js/src/controls/layermenuControl.js',
					'app/public/js/src/controls/inspectControl.js',
					'app/public/js/src/controls/descriptionControl.js',
					'app/public/js/src/controls/legendsControl.js',
					'app/public/js/src/controls/mousepositionControl.js',
					'app/public/js/src/controls/baselayertoggleControl.js',

					// Models 
					'app/public/js/src/models/projects.js',
					'app/public/js/src/models/clients.js',
					'app/public/js/src/models/users.js',
					'app/public/js/src/models/layers.js',
					'app/public/js/src/models/colorThemes.js',
					'app/public/js/src/help/themeToggle.js',

					// App 
					'app/public/js/src/core/app.js'
				],
				
				dest : 'app/public/dist/combined/systemapic.combined.js',

			},
			jsDependencies : {  
				
				src : [  

					// dependencies 
					'app/public/js/lib/lodash/lodash.min.js',
					'app/public/js/lib/parallel.js/parallel.js',
					
					// leaflet + mapbox
					'app/public/js/src/leaflet.js/leaflet-0.7.3-src.js',
					'app/public/js/lib/mapbox.js/mapbox.standalone.2.1.2.js',
					'app/public/js/src/leaflet.js/plugins/leaflet-omnivore.min.js',
					'app/public/js/src/leaflet.js/plugins/leaflet.geojson.draw.js',
					'app/public/js/src/leaflet.js/plugins/leaflet.draw.min.js',
					'app/public/js/src/leaflet.js/plugins/leaflet.draw.note.js',
					'app/public/js/src/leaflet.js/plugins/styleEditor/leaflet.styleeditor.js',
					'app/public/js/src/leaflet.js/plugins/styleEditor/leaflet.styleforms.js',

					// tools 
					'app/public/js/lib/dropzone.js/dropzone.min.js',
					'app/public/js/lib/icanhaz/icanhaz.min.js',
					'app/public/js/lib/list.js/list.min.js',
					'app/public/js/lib/sortable.js/Sortable.js',
					'app/public/js/lib/powerange/powerange.min.js',
					'app/public/js/src/grande.js/js/grande.class.js',
					'app/public/js/src/grande.js/js/grande.js',
					'app/public/js/src/grande.js/js/grande.attachments.js'

				],
				
				dest : 'app/public/dist/combined/systemapic.dependencies.combined.js',

			},
			
			cssDependencies : {  
				
				src : [  
					'app/public/js/src/grande.js/css/menu.css',                    
					'app/public/js/src/grande.js/css/editor.css',
					'app/public/css/dependencies/bootstrap.min.css',
					'app/public/css/dependencies/font-awesome.min.css',
					'app/public/css/dependencies/mapbox.css',        
					'app/public/js/src/leaflet.js/leaflet.css',
					'app/public/js/src/leaflet.js/plugins/styleEditor/Leaflet.StyleEditor.css',
					'app/public/js/lib/powerange/powerange.min.css'
				],
				
				dest : 'app/public/dist/combined/css.dependencies.css'
			},

			cssPortal : {
				
				src : [
					'app/public/css/style.css',
					'app/public/css/evil.css',
					'app/public/css/knut.css',
				],

				dest : 'app/public/dist/combined/css.portal.css'
			},

			cssLogin : {
				
				src : [
					'app/public/css/mapbox.css',
					'app/public/css/login.css'					
				],

				dest : 'app/public/dist/combined/css.login.combined.css'
			},


			jsLogin : {
				
				src : [
					'app/public/js/lib/mapbox.js/mapbox.2.1.4.js',
					'app/public/js/lib/mapbox-gl.js/mapbox-gl.js',					
					'app/public/js/src/controls/spinningMap.js',
					'app/public/js/src/core/login.js',
				],

				dest : 'app/public/dist/combined/login.combined.js'
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
					'app/public/dist/js.portal.min.js' : 'app/public/dist/combined/systemapic.combined.js',

				}
			},

			jsDependencies : {  
				files : {  
					'app/public/dist/js.dependencies.min.js' : 'app/public/dist/combined/systemapic.dependencies.combined.js',
				}
			},


			jsLogin : {  
				files : {  
					'app/public/dist/combined/login.min.js' : 'app/public/dist/combined/login.combined.js',	
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