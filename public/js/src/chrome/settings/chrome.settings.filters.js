Wu.Chrome.SettingsContent.Filters = Wu.Chrome.SettingsContent.extend({

	options : {
		num_buckets : 50
	},


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

		// Scroller
		this._midSection = Wu.DomUtil.create('div', 'chrome-middle-section', this._container);
		this._midOuterScroller = Wu.DomUtil.create('div', 'chrome-middle-section-outer-scroller', this._midSection);
		this._midInnerScroller = Wu.DomUtil.create('div', 'chrome-middle-section-inner-scroller', this._midOuterScroller);

		// active layer
		this.layerSelector = this._initLayout_activeLayers('Datasets', 'Select a dataset to filter...', this._midInnerScroller);

		// create fixed bottom container
		this._bottomContainer = Wu.DomUtil.create('div', 'sql-bottom-container', this._container);

		// titles
		this._sqltitle = Wu.DomUtil.create('div', 'chrome chrome-content sql title', this._bottomContainer, 'SQL');
		this._sqlSave = Wu.DomUtil.create('div', 'sql-save', this._bottomContainer, 'Save');

		// CodeMirror
		this._codeWrapOuter = Wu.DomUtil.create('div', 'chrome-content sql-wrapper-outer', this._bottomContainer)
		this._codewrap = Wu.DomUtil.create('input', 'chrome chrome-content cartocss code-wrapper', this._codeWrapOuter);

		// sql editor
		this._createSqlEditor();

		// hide by default
		this._hideEditors();

		// set sizes
		this._updateDimensions();

		// mark as inited
		this._inited = true;

		// Init hooks
		this.initHooks();

	},

	initHooks : function () {
		Wu.DomEvent.on(this._sqlSave, 'click', this._updateStyle, this);
		Wu.DomEvent.on(this._sqltitle, 'click', this.toggleSql, this);
	},

	toggleSql : function () {
		if (this.sqlOpen) {
			Wu.DomUtil.removeClass(this._codeWrapOuter, 'active');
			Wu.DomUtil.removeClass(this._sqlSave, 'active');
			Wu.DomUtil.removeClass(this._bottomContainer, 'active');
			Wu.DomUtil.addClass(this._midSection, 'no-sql');
			this.sqlOpen = false;
		} else {
			Wu.DomUtil.addClass(this._codeWrapOuter, 'active');
			Wu.DomUtil.addClass(this._sqlSave, 'active');
			Wu.DomUtil.addClass(this._bottomContainer, 'active');
			Wu.DomUtil.removeClass(this._midSection, 'no-sql');
			this.sqlOpen = true;			
		}
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
	},

	_windowResize : function () {
		app._map.invalidateSize();
	},

	_updateDimensions : function () {

		if (!this._SQLEditor) return;

		// get dimensions
		var dims = app.Chrome.Right.getDimensions();

		// set sizes
		var sql = this._SQLEditor.getWrapperElement();
		if (sql) {
			sql.style.width = dims.width + 'px';
			sql.style.height = '1114px';
		}
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

		// update layer
		this._updateLayer(layerOptions);

	},

	getCartocssValue : function () {
		return this._layer.getCartoCSS();
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
		var css 	= this.getCartocssValue(),
		    layer 	= options.layer,
		    file_id 	= layer.getFileUuid(),
		    sql 	= options.sql,
		    sql 	= this._createSQL(file_id, sql),
		    project 	= this._project;

		// layer options
		var layerOptions = layer.store.data.postgis;
		layerOptions.sql = sql;
		layerOptions.css = css;
		layerOptions.file_id = file_id;		

		// layer json
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

			// update layer
			layer.updateStyle(newLayerStyle);

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

	_selectedActiveLayer : function (e, uuid) {

		// get uuid
		var layerUuid = uuid ? uuid : e.target.value;
		
		// Store uuid of layer we're working with
		this._storeActiveLayerUuid(layerUuid);

		// get layer
		this._layer = this._project.getLayer(layerUuid);

		// Clear chart
		if (this._chart) {
			this._chart.innerHTML = '';
			this._chart = null;
		}

		// filter chart
		this._createFilterDropdown();

		// refresh
		this._refreshEditor();

		// add layer temporarily to map
		this._tempaddLayer();

		// Display bottom container
		this._bottomContainer.style.opacity = 1;

		// Pad up scroller
		Wu.DomUtil.addClass(this._midSection, 'middle-section-padding-bottom');
	},

	opened : function () {
	},

	closed : function () {
		// clean up
		this._tempRemoveLayers();
		this._cleanup();
	},

	_refreshEditor : function () {

		// refresh sql
		this._refreshSQL();

		// show
		this._showEditors();

		// refresh codemirror (cause buggy)
		this._SQLEditor.refresh();
	},

	_refreshCartoCSS : function () {
	},

	_refreshSQL : function () {
		if (!this._layer) return;
		if (!this._layer.isPostgis()) return;

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

		// Enable settings from layer we're working with
		var layerUuid = this._getActiveLayerUuid();
		if (layerUuid) this._selectedActiveLayer(false, layerUuid);		

		// Select layer we're working on
		var options = this.layerSelector.childNodes;
		for (var k in options) {
			if (options[k].value == layerUuid) options[k].selected = true;
		}
	},

	_showEditors : function () {
		this._SQLEditor.getWrapperElement().style.opacity = 1;
	},

	_hideEditors : function () {
		this._SQLEditor.getWrapperElement().style.opacity = 0;
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

	_getSortedColumns : function () {
		if (!this._layer) return false

		if (!this._layer.getPostGISData) return false;
	
		var meta = Wu.parse(this._layer.getPostGISData().metadata),
		    columns = meta.columns,
		    keys = Object.keys(columns),
		    keysSorted = keys.sort();

		return keys.reverse();
	},

	_createFilterDropdown : function () {

		// remove already existing dropdown
		if (this._filterDropdown) {
			Wu.DomUtil.remove(this._filterDropdown);
		}

		// set titles
		var title = 'Columns'
		var subtitle = 'Select a column to filter by...';

		// active layer wrapper
		var wrap = this._filterDropdown = Wu.DomUtil.create('div', 'chrome chrome-content styler-content active-layer wrapper');

		// insert on top of container
		this._midInnerScroller.insertBefore(wrap, this._midInnerScroller.children[1]);

		// title
		var titleDiv = Wu.DomUtil.create('div', 'chrome chrome-content active-layer title', wrap, title);
		
		// create dropdown
		var selectWrap = Wu.DomUtil.create('div', 'chrome chrome-content active-layer select-wrap', wrap);
		var select = this._select = Wu.DomUtil.create('select', 'active-layer-select', selectWrap);

		// get layers
		var columns = this._getSortedColumns();

		// placeholder
		var option = Wu.DomUtil.create('option', '', select);
		option.innerHTML = subtitle;
		option.setAttribute('disabled', '');
		option.setAttribute('selected', '');

		// mute columns
		var mute_columns = [
			'_columns'
		]

		// fill dropdown
		columns && columns.forEach(function (column) {
			if (mute_columns.indexOf(column) == -1) {
				var option = Wu.DomUtil.create('option', 'active-layer-option', select);
				option.value = column;
				option.innerHTML = column;
			}
		});

		// select event
		Wu.DomEvent.on(select, 'change', this._selectedFilterColumn, this); // todo: mem leak?

		// clear old filterdi
		this._clearFilterDiv();

		// auto-select option if filter active
		this._autoSelectFilter();
	},

	_clearFilterDiv : function () {
		if (this._filterDiv) this._filterDiv.innerHTML = '';		
	},

	_selectNone : function () {
		this._select.selectedIndex = 0;
	},

	_autoSelectFilter : function () {
		if (!this._layer) return;
		if (!this._layer.isPostgis()) return this._selectNone();
		
		var filter = Wu.parse(this._layer.getFilter());

		if (!filter.length) return; 

		// column
		var column = filter[0].column;

		// create chart
		this._createFilterChart(column);

		// set index in dropdown
		this._select.selectedIndex = this._getDropdownIndex(column);
	},

	_getDropdownIndex : function (column) {
		for (var i = 0; i < this._select.length; i++) {
			if (this._select.options[i].value == column) return i;
		}
		return 0;
	},

	_selectedFilterColumn : function (e) {
		var column = e.target.value;
		this._createFilterChart(column);		
	},

	nullHistogram : function () {
		var histogram = [];
		for (var i = 0; i < this.options.num_buckets-1; i++) {
			histogram.push({
				bucket : i+1,
				freq : 0,
				range : false,
				range_min : 0,
				range_max : 0
			});
		}
		return histogram;
	},

	_createFilterChart : function (column) {

		// Create chart
		if (!this._chart) this._createHistogram(column);

		// Update chart
		this._updateHistogram(column);
	},

	_createHistogram : function (column) {

		// create div
		var filterDiv = this._filterDiv = Wu.DomUtil.createId('div', 'chrome-content-filter-chart');
		this._midInnerScroller.insertBefore(this._filterDiv, this._filterDropdown.nextSibling);

		// create filter label div
		this._filterLabel = Wu.DomUtil.create('div', 'chrome-content-filter-label', this._filterDiv);

		// Create null historgram
		histogram = this.nullHistogram();

		// Create Chart
		this._chart = dc.barChart(this._filterDiv);			

		// Update Chart Data
		this._updateChart(histogram, column);

		// Render chart
		this._chart.render();
	},

	_updateHistogram : function (column) {

		// get histogram from server
		this._getHistogram(column, function (err, histogram) {
			if (err) return console.error('histogram err: ', err);

			// Create null historgram
			if (!histogram) {
				histogram = this.nullHistogram();
				Wu.DomUtil.addClass(this._filterDiv, 'null-histogram');
			} else {
				Wu.DomUtil.removeClass(this._filterDiv, 'null-histogram');
			}

			// Update chart
			this._updateChart(histogram, column);

			// Reset filter
			this._chart.filterAll();

			// render
			this._chart.redraw();

			// check if filter already stored in layer
			this._applyAlreadyStoredFilter(column);			

		}.bind(this))
	},

	_updateChart : function (histogram, column) {

		var ndx = crossfilter(histogram),
		    runDimension = ndx.dimension(function(d) {return +d.bucket;}), 			// x-axis
		    speedSumGroup = runDimension.group().reduceSum(function(d) {return d.freq;}),	// y-axis
		    num_buckets = this.options.num_buckets;

		// chart settings
		this._chart
		    .width(400)
		    .height(180)
		    .gap(2)
		    .x(d3.scale.linear().domain([0, num_buckets]))
		    .brushOn(true) // drag filter
		    .renderLabel(true)
		    .dimension(runDimension)
		    .group(speedSumGroup)
		    .elasticX(true)
		    .elasticY(true)
		    .margins({top: 10, right: 10, bottom: 20, left: 40});

		// filter event (throttled)
		this._chart.on('filtered', function (chart, filter) {

			if (!filter) return this._registerFilter(false);

			// round buckets
			var buckets = [Math.round(filter[0]), Math.round(filter[1])];

			// apply sql filter, create new layer, etc.
			this._registerFilter(column, buckets, histogram);

		}.bind(this));

		// set y axis tick values
		var ytickValues = this._getYAxisTicks(histogram);
		this._chart.yAxis().tickValues(ytickValues);

		// prettier y-axis
		this._chart.yAxis().tickFormat(function(v) {
			if (v > 1000000) return Math.round(v/1000000) + 'M';
			if (v > 1000) return Math.round(v/1000) + 'k';
			return v;
		});

		// set x axis tick spacing
		var xtickValues = this._getXAxisTickSpacing(histogram);
		this._chart.xAxis().tickValues(xtickValues);
	
		// set format of x axis ticks
		this._chart.xAxis().tickFormat(function(v) {
			var bucket = this._getBucket(v, histogram);
			var value = Math.round(bucket.range_min * 100) / 100;
			return value;
		}.bind(this));

		// set events
		this._chart.renderlet(function (chart) {
			this._chart.select('.brush').on('mousedown', this._onBrushMousedown.bind(this));
		}.bind(this));
	},

	_onBrushMousedown : function (e) {
		// add full screen mouseup/mouseout catcher
		this._brushCatcher = Wu.DomUtil.create('div', 'brush-catcher', app._appPane);
		Wu.DomEvent.on(this._brushCatcher, 'mouseup', this._onBrushMouseup, this);
		Wu.DomEvent.on(this._brushCatcher, 'mouseout', this._onBrushMouseup, this);
	},

	_onBrushMouseup : function (e) {
		// remove catcher
		Wu.DomEvent.off(this._brushCatcher, 'mouseup', this._onBrushMouseup, this);
		Wu.DomEvent.off(this._brushCatcher, 'mouseout', this._onBrushMouseup, this);
		Wu.DomUtil.remove(this._brushCatcher);

		// timeout hack, due to d3 race conditions on brush events
		setTimeout(this._applyFilter.bind(this), 500);
	},

	_applyAlreadyStoredFilter : function (column) {
		var filter = this._layer.getFilter();
		if (!filter) return;

		var f = Wu.parse(filter);

		// find column
		var c = _.find(f, function (col) {
			return col.column == column;
		});

		if (!c) return;

		// filter, redraw
		this._chart.filter([c.bucket_min, c.bucket_max]);
		this._chart.redraw();
	},

	_getYAxisTicks : function (histogram) {
		var m = _.max(histogram, function (h) {
			return h.freq;
		});

		var max = m.freq;

		// five ticks
		var num_ticks = 3;
		var ticks = [];
		for (var n = 1; n < num_ticks + 1; n++) {
			var val = max/num_ticks * n;
			var val_rounded = Math.round(val/100) * 100;
			ticks.push(val_rounded);
		}
		return ticks;
	},

	_getXAxisTickSpacing : function (histogram) {

		var maxLength = 0;

		histogram.forEach(function(h) {
			var maxNo = Math.round(h.range_max * 100) / 100;
			var minNo = Math.round(h.range_min * 100) / 100;
			var max = maxNo.toString().length;
			var min = minNo.toString().length;
			if ( maxLength < max ) maxLength = max;
			if ( maxLength < min ) maxLength = min;
		});

		var ticks = this._getSpacedTicks(maxLength);
		return ticks;
	},

	_getSpacedTicks : function (maxLength) {

		// helper fn to find nearest custom number
		function nearest(n, v) {
			n = n / v;
			n = Math.ceil(n) * v;
			return n;
		}

		// get ticks dynamically, based on this.options.num_buckets
		var ticks = [];
		var num_buckets = this.options.num_buckets; // 20, 50, 100

		// total character length possible: 45
		var actual_buckets = parseInt(45/maxLength);
		var s = num_buckets / actual_buckets;
		var step = nearest(s, 5);

		for (var i = 1; i < actual_buckets; i++) {
			var a = step * i;
			if (a <= num_buckets) ticks.push(a);
		} 
		
		return ticks;
	},

	_clearFilter : function () {

		// get sql values
		var currentSQL = this._SQLEditor.getValue();
		var freshSQL = 'SELECT * FROM table';

		// return of no change
		if (currentSQL == freshSQL) return;

		// set sql
		this._SQLEditor.setValue(freshSQL);

		// update style
		this._updateStyle();

		// save filter to layer
		this._layer.setFilter(JSON.stringify([])); // will delete all column filters
	},

	_setFilterLabel : function (value) {
		this._filterLabel.innerHTML = value;
	},

	_registerFilter : function (column, buckets, histogram) {

		// no filter
		if (!column) {
			// set label
			this._setFilterLabel('No filter.');

			// return 
			return this._filters = false;
 		}

 		// filter
 		this._filters = {};
		this._filters.column = column;
		this._filters.buckets = buckets;
		this._filters.histogram = histogram;

		// set label
		var b = this._calculateBuckets(column, buckets, histogram);
		var label = 'Filtering '  + column.toUpperCase() + ' from ' + b.min + ' to ' + b.max + '.';
		this._setFilterLabel(label);
	},

	_getBucket : function (num, histogram, goingDown) {

		// find bucket
		var bucket = _.find(histogram, function (h) {	// doesn't find bucket if bucket is empty.. 
			return h.bucket == num;			//   must look below if goingDown..
		});

		// if bucket empty, find closest (up or down)
		var n = goingDown ? 0 : this.options.num_buckets;
		while (!bucket) {
			n = goingDown ? n + 1 : n - 1;
			bucket = _.find(histogram, function (h) {			// doesn't find bucket if bucket is empty.. 
				if (goingDown) {
					return h.bucket == num - n;			//   must look below if goingDown..
				} else {
					return h.bucket == num + n;			
				}
			});

			// debug stop, prevent infinite loop just in case
			if (n > 100) bucket = true;
		}

		return bucket;
	},

	_calculateBuckets : function (column, buckets, histogram) {

		// get bucket, range
		var bottom_bucket = buckets[0];
		var top_bucket = buckets[1];
		var bucket_min = this._getBucket(bottom_bucket, histogram, true);
		var bucket_max = this._getBucket(top_bucket, histogram);
		var range_min = Math.round(bucket_min.range_min * 100)/100;
		var range_max = Math.round(bucket_max.range_max * 100)/100;

		var b = {
			min : range_min,
			max : range_max,
			bottom : bottom_bucket, 
			top : top_bucket
		}

		return b;
	},

	_applyFilter : function (column, buckets, histogram) {

		if (!this._filters) return this._clearFilter();

		var column = this._filters.column;
		var buckets = this._filters.buckets;
		var histogram = this._filters.histogram;

		// calculate bucket values
		var b = this._calculateBuckets(column, buckets, histogram);
		
		// create SQL
		var sql = 'SELECT * FROM table';
		sql    += ' \nwhere ' + column + ' > ' + b.min + '\nand ' + column + ' < ' + b.max;

		// set sql
		this._SQLEditor.setValue(sql);

		// update style
		this._updateStyle();

		// save filter to layer
		this._layer.setFilter(JSON.stringify([{
			column : column,
			bucket_min : b.bottom,
			bucket_max : b.top
		}]));

	},

	_getHistogram : function (column, done, fresh) {

		// debug switch
		var fresh = true;

		// get fresh histogram from server, if requested
		if (fresh) return this._getFreshHistogram(column, done);

		// get stored histogram
		var postgisData = this._layer.getPostGISData();
		var file_id = postgisData.file_id;
		var file = app.Account.getFile(file_id);
		var histogram = file.getHistogram(column);
		done(null, histogram);
	},

	_getFreshHistogram : function (column, done) {
		if (!this._layer) return;

		var postgisData = this._layer.getPostGISData();

		var options = {
			layer_id : postgisData.layer_id,
			file_id : postgisData.file_id,
			column : column,
			access_token : app.tokens.access_token,
			num_buckets : this.options.num_buckets
		}

		// get histogram 
		Wu.post('/api/db/fetchHistogram', JSON.stringify(options), function (err, histogramJSON) {

			// parse
			var histogramData = Wu.parse(histogramJSON);

			// return
			done && done(null, histogramData);
		});
	}
});
