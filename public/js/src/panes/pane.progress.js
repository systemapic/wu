Wu.ProgressPane = Wu.Class.extend({

	options : {

		color : 'white',
		
	},

	initialize : function (options) {
		
		// set options
		Wu.setOptions(this, options);

		// init container
		this.initContainer();

	},

	initContainer : function () {

		// create progress bar (share dom with other instances of Wu.ProgressPane)
		this._progressBar = app._progressBar = app._progressBar || Wu.DomUtil.create('div', 'status-progress-bar', app._appPane);

		// add to sidepane if assigned container in options
		if (this.options.addTo) this.addTo(this.options.addTo);

	},

	addTo : function () {
		var pane = this.options.addTo;
		pane.appendChild(this._progressBar);
	},

	setProgress : function (percent) {
		if (percent < this._current + 2) return;
		
		var bar = this._progressBar;
		bar.style.opacity = 1;
		bar.style.width = percent + '%';
		bar.style.backgroundColor = this.options.color;
		this._current = percent;
	},

	hideProgress : function () {
		var bar = this._progressBar;
		bar.style.opacity = 0;
		this._current = 0;
		bar.style.width = 0;
		// bar.style.backgroundColor = 'white';

		if (this._progressTimer) clearTimeout(this._progressTimer)
	},
	
	// do a timed progress
	timedProgress : function (ms) {
		var that = this,
		    duration = ms || 5000, // five seconds default
		    steps = 100,	 	   // five steps default
		    p = 0;		   // start percentage
		
		// calculate delay
		var delay = parseInt(parseInt(duration) / steps);

		// start progress
		that._timedProgress(p, delay, steps);

		// change color
		app._progressBar.style.backgroundColor = 'red';
	},

	_timedProgress : function (percent, delay, steps) {
		var that = this;

		// set progress to percent after delay
		percent = percent + (100/steps);
		that.setProgress(percent);
		
		that._progressTimer = setTimeout(function () {

			// play it again sam
			if (percent < 100) return that._timedProgress(percent, delay, steps);

			// done, hide progress bar
			that.hideProgress();

		}, delay)
	}


});