Wu.ProgressPane = Wu.Class.extend({

	initialize : function (options) {
		
		// set options
		Wu.setOptions(this, options);

		// init container
		this.initContainer();

		console.log('Wu.ProgressPane initialize');

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
		console.log('setProgress', percent, this._current);
		if (percent < this._current + 2) return;

		var bar = this._progressBar;
		bar.style.opacity = 1;
		bar.style.width = percent + '%';
		this._current = percent;
	},

	hideProgress : function () {
		console.log('hidePoress');

		var bar = this._progressBar;
		bar.style.opacity = 0;
		this._current = 0;
		bar.style.width = 0;
	},
	
	// do a timed progress
	timedProgress : function (ms) {
		var that = this,
		    duration = ms || 5000, // five seconds default
		    steps = 10,	 	   // five steps default
		    p = 0;		   // start percentage
		
		// calculate delay
		var delay = parseInt(duration) / steps;

		// start progress
		this._timedProgress(p, delay, steps);	

	},

	_timedProgress : function (percent, delay, steps) {
		var that = this;

		// set progress to percent after delay
		percent = percent + (100/steps);
		this.setProgress(percent);
		
		setTimeout(function () {

			// play it again sam
			if (percent < 100) return that._timedProgress(percent, delay, steps);

			// done, hide progress bar
			that.hideProgress();

		}, delay)
	}


});