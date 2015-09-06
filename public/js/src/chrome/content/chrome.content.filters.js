Wu.Chrome.Content.Filters = Wu.Chrome.Content.extend({

	_initialize : function () {

		// init container
		this._initContainer();

		// add events
		this._addEvents();
	},

	_initContainer : function () {

		// create container
		this._container = Wu.DomUtil.create('div', 'chrome chrome-content chrome-pane filters', this.options.appendTo);
	},

	_initLayout : function () {

		// active layer
		this._initLayout_activeLayers('Datasets', 'Select a dataset to filter...');

		// wrapper
		this._codewrap = Wu.DomUtil.create('input', 'chrome chrome-content cartocss code-wrapper', this._container);

		
		// sql editor
		this._createSqlEditor();

		// create refresh button
		this._createRefresh();

		// insert titles
		this._createTitles();

		// hide by default
		this._hideEditors();

		// set sizes
		this._updateDimensions();

		// mark as inited
		this._inited = true;

	},

	_refresh : function () {
		this._flush();
		this._initLayout();
	},

	_flush : function () {
		this._SQLEditor = null;
		this._container.innerHTML = '';
	},


	_cleanup : function () {

	},

	_removeEvents : function () {

		// Wu.DomEvent.off(window, 'resize', this._windowResize, this);

	},



	_createTitles : function () {
		
		// create
		this._sqltitle = Wu.DomUtil.create('div', 'chrome chrome-content cartocss title');
		this._sqltitle.innerHTML = 'SQL';
		
		// insert
		var s = this._SQLEditor.getWrapperElement();
		s.parentElement.insertBefore(this._sqltitle, s);

	},

	_windowResize : function () {
		this._updateDimensions();
		app._map.invalidateSize();
	},

	_createRefresh : function () {

	},

	_updateStyle : function () {


	},
	
	_updateDimensions : function () {

		if (!this._SQLEditor) return;

		// get dimensions
		var dims = app.Chrome.Right.getDimensions();
		// set sizes
		var sql = this._SQLEditor.getWrapperElement();
		if (sql) {
			sql.style.width = dims.width + 'px';
			sql.style.height = (dims.height/3*1) - 220 + 'px';
		}
	},

	_createRefresh : function () {

		var text = (navigator.platform == 'MacIntel') ? 'Save (⌘-S)' : 'Save (Ctrl-S)';
		this._refreshButton = Wu.DomUtil.create('div', 'chrome chrome-content cartocss refresh-button', this._container, text);

		Wu.DomEvent.on(this._refreshButton, 'click', this._updateStyle, this);
	},


	_updateStyle : function () {

		// return if no active layer
		if (!this._layer) return console.error('no layer');

		// get sql
		var sql = this.getSQLValue();

		// get css
		var css = this.getCartocssValue();
	
		// request new layer
		var layerOptions = {
			sql : sql,
			css : css,
			layer : this._layer
		}

		this._updateLayer(layerOptions);

	},

	getCartocssValue : function () {
		var css = this._layer.getCartoCSS();
		return css;
	},

	getSQLValue : function () {
		return this._SQLEditor.getValue();
	},

	_createSQL : function (file_id, sql) {

		if (sql) {
			// replace 'table' with file_id in sql
			sql.replace('table', file_id);

			// wrap
			sql = '(' + sql + ') as sub';

		} else {
			// default
			sql = '(SELECT * FROM  ' + file_id + ') as sub';
		}
		return sql;
	},

	_updateLayer : function (options, done) {

		console.log('_updateLayer, options, ', options);

		var css 	= this.getCartocssValue(),
		    layer 	= options.layer,
		    file_id 	= layer.getFileUuid(),
		    sql 	= options.sql,
		    sql 	= this._createSQL(file_id, sql),
		    project 	= this._project;


		var layerOptions = layer.store.data.postgis;

		layerOptions.sql = sql;
		layerOptions.css = css;
		layerOptions.file_id = file_id;		

		var layerJSON = {
			geom_column: 'the_geom_3857',
			geom_type: 'geometry',
			raster_band: '',
			srid: '',
			affected_tables: '',
			interactivity: '',
			attributes: '',
			access_token: app.tokens.access_token,
			cartocss_version: '2.0.1',
			cartocss : css,
			sql: sql,
			file_id: file_id,
			return_model : true,
			layerUuid : layer.getUuid()
		}

		// create layer on server
		Wu.post('/api/db/createLayer', JSON.stringify(layerJSON), function (err, newLayerJSON) {

			// new layer
			var newLayerStyle = Wu.parse(newLayerJSON);

			// catch errors
			if (newLayerStyle.error) {
				done && done();
				return console.error(newLayerStyle.error);
			}

			// set & update
			layer.setStyle(newLayerStyle.options);
			layer.update({enable : true});

			// return
			done && done();
		});

	},

	_refreshLayer : function () {
		console.log('_refreshLayer');
	},

	open : function () {
		console.log('open!', this);
	},


	_selectedActiveLayer : function (e) {
		console.log('selected active layer, filter', e);

		// get layer
		var layerUuid = e.target.value;
		this._layer = this._project.getLayer(layerUuid);

		// selecting layer in dropdown...
		// .. problems:
		// 1. what if layer is not in layer menu?
		// 2. if not, should it be added?
		// 3. what if user just clicks wrong layer?
		// 4. should actually layers not in layermenu be available in dropdown? (they are now)
		// 5. 
		// ----------
		// SOLUTION: temporarily add layers to map for editing, remove when done editing.

		// filter chart
		this._createFilterDropdown();

		// refresh
		this._refreshEditor();

		// add layer temporarily to map
		this._tempaddLayer();
	},

	_tempaddLayer : function () {

		// remember
		this._temps = this._temps || [];

		// remove other styling layers
		this._tempRemoveLayers();

		// add
		this._layer._addThin();

		// remember
		this._temps.push(this._layer);

	},

	_tempRemoveLayers : function () {
		if (!this._temps) return;

		// remove other layers added tempy for styling
		this._temps.forEach(function (layer) {
			layer._removeThin();
		}, this);
	},

	opened : function () {

	},

	closed : function () {
		// clean up
		this._tempRemoveLayers();
		this._cleanup();
	},

	_refreshEditor : function () {
		console.log('filter refresheditor');

		this._refreshSQL();

		// show
		this._showEditors();

		// refresh codemirror (cause buggy)
		this._SQLEditor.refresh();
	},

	_refreshCartoCSS : function () {

	},

	_refreshSQL : function () {

		// get
		var meta = this._layer.getPostGISData();
		var rawsql = meta.sql;
		var table = meta.table_name;
		var sql = rawsql.replace(table, 'table').replace('  ', ' ');

		// remove (etc) as sub
		var sql = this._cleanSQL(sql);

		// set
		this._SQLEditor.setValue(sql);
	
	},

	_cleanSQL : function (sql) {
		var first = sql.substring(0,1);
		var last = sql.slice(-8);

		// if sql is of format (SELECT * FROM table) as sub
		if (first == '(' && last == ') as sub') {
			var clean_sql = sql.substr(1, sql.length -9);
			return clean_sql;
		}

		return sql;
	},


	show : function () {
		if (!this._inited) this._initLayout();

		// hide others
		this.hideAll();

		// show this
		this._container.style.display = 'block';

		// mark button
		Wu.DomUtil.addClass(this.options.trigger, 'active-tab');
	},

	_showEditors : function () {
		this._SQLEditor.getWrapperElement().style.opacity = 1;
		this._sqltitle.style.opacity = 1;
		this._refreshButton.style.opacity = 1;
	},

	_hideEditors : function () {
		this._SQLEditor.getWrapperElement().style.opacity = 0;
		this._sqltitle.style.opacity = 0;
		this._refreshButton.style.opacity = 0;
	},


	_createSqlEditor : function () {

		// editor
		this._SQLEditor = CodeMirror.fromTextArea(this._codewrap, {
    			lineNumbers: true,    			
    			mode: {
    				name : 'text/x-sql',
    			},
    			matchBrackets: true,
    			lineWrapping: false,
    			paletteHints : true,
    			gutters: ['CodeMirror-linenumbers', 'errors']
  		});
	},

	_getColumns : function () {
		if (!this._layer) return false;

		var meta = Wu.parse(this._layer.getPostGISData().metadata);

		console.log('_getColumns meta', meta);

		var columns = meta.columns;

		console.log('cols', columns);

		return columns;
	},

	_createFilterDropdown : function () {

		console.log('_createFilterDropdown', this._layer);

		// get columns
		

		var title = 'Columns'
		var subtitle = 'Select a column to filter by...';

		// active layer wrapper
		var wrap = Wu.DomUtil.create('div', 'chrome chrome-content styler-content active-layer wrapper', this._container);

		// title
		var title = Wu.DomUtil.create('div', 'chrome chrome-content active-layer title', wrap, title);
		
		// create dropdown
		var selectWrap = Wu.DomUtil.create('div', 'chrome chrome-content active-layer select-wrap', wrap);
		var select = this._select = Wu.DomUtil.create('select', 'active-layer-select', selectWrap);

		// get layers
		var columns = this._getColumns();

		// placeholder
		var option = Wu.DomUtil.create('option', '', select);
		option.innerHTML = subtitle;
		option.setAttribute('disabled', '');
		option.setAttribute('selected', '');


		console.log('columns: --> ', columns);


		for (var c in columns) {
			// var column = columns[c];
			var option = Wu.DomUtil.create('option', 'active-layer-option', select);
			option.value = c;
			option.innerHTML = c;
		}


		// select event
		Wu.DomEvent.on(select, 'change', this._selectedFilterColumn, this); // todo: mem leak?


	},

	_selectedFilterColumn : function (e) {

		var column = e.target.value;

		console.log('valuye: ', column);

		this._createFilterChart(column);
	},

	_createFilterChart : function (column) {

		console.log('_createFilterChart');

		// create div
		this._filterDiv = Wu.DomUtil.createId('div', 'chrome-content-filter-chart', this._container);

		var chart = dc.barChart(this._filterDiv);

		this._getHistogram(column, function (err, histogram) {

			console.log('got histo', err, histogram);
			// return;



			// d3.json(histogram, function (err, data) {
			// 	console.log('d3 err', err);
			// 	console.log('data: ', data);

			var data = histogram;

			console.log('LENGTH', data.length);

			var ndx             = crossfilter(data),
			    runDimension    = ndx.dimension(function(d) {return +d.bucket;}), 			// x-axis
			    speedSumGroup   = runDimension.group().reduceSum(function(d) {return d.freq;});	// y-axis

			chart
			.width(340)
			.height(160)
			.gap(1)
			.x(d3.scale.linear().domain([0, data.length + 1]))
			.brushOn(true) // drag filter

			// .centerBar(true)
			.renderLabel(true)
			// .yAxisLabel("Y Axis")
			.elasticX(true)
			.elasticY(true)
			.dimension(runDimension)
			// .round(dc.round.floor)
			.group(speedSumGroup)
			// .renderTitle(true).title(function (d) {
			// 	return 'test: ' + d.value;
			// })
			// .renderHorizontalGridLines(true)
			// .label(function (d) {
			// 	console.log(d);
			// 	return 'test';
			// })
			.margins({top: 10, right: 30, bottom: 30, left: 80})
			.filterPrinter(function (filters) {
				var f = filters[0];
				console.log('left: ', f[0]);	// prints min/max of bucket filter
				console.log('right: ', f[1]);

				console.error('TODO: get filter value from bucket; create SQL');
				return f[0];
			});

			chart.render();

			labels = chart.g().selectAll("rect.bar text");
			console.log(labels);

			// });


		});


	},

	_getHistogram : function (column, done) {
		if (!this._layer) return;

		var postgisData = this._layer.getPostGISData();

		console.log('postgisData', postgisData);

		

		var options = {
			layer_id : postgisData.layer_id,
			file_id : postgisData.file_id,
			column : column,
			access_token : app.tokens.access_token,
			num_buckets : 50
		}

		console.log('options', options);

		// return;

		// get histogram 
		Wu.post('/api/db/fetchHistogram', JSON.stringify(options), function (err, histogramJSON) {

			console.log('fetchHistogram', err, histogramJSON);

			// // new layer
			// var newLayerStyle = Wu.parse(newLayerJSON);

			var histogramData = Wu.parse(histogramJSON);

			// console.log('histogramData', histogramData);

			// // catch errors
			// if (newLayerStyle.error) {
			// 	done && done();
			// 	return console.error(newLayerStyle.error);
			// }

			// // set & update
			// layer.setStyle(newLayerStyle.options);
			// layer.update({enable : true});

			// return
			done && done(null, histogramData);
		});


	}
});


