




// smoother zooming, especially on apple mousepad
L._lastScroll = new Date().getTime();
L.Map.ScrollWheelZoom.prototype._onWheelScroll = function (e) {
    if (new Date().getTime() - L._lastScroll < 200) { return; }
    var delta = L.DomEvent.getWheelDelta(e);
    var debounce = this._map.options.wheelDebounceTime;

    this._delta += delta;
    this._lastMousePos = this._map.mouseEventToContainerPoint(e);

    if (!this._startTime) {
        this._startTime = +new Date();
    }

    var left = Math.max(debounce - (+new Date() - this._startTime), 0);

    clearTimeout(this._timer);
    L._lastScroll = new Date().getTime();
    this._timer = setTimeout(L.bind(this._performZoom, this), left);

    L.DomEvent.stop(e);
}



L.Map.include({

	// refresh map container size
	reframe: function (options) {
		if (!this._loaded) { return this; }
		this._sizeChanged = true;
		this.fire('moveend');
	},

	fitBounds: function (bounds, options) {

		options = options || {};
		bounds = bounds.getBounds ? bounds.getBounds() : L.latLngBounds(bounds);

		var paddingTL = L.point(options.paddingTopLeft || options.padding || [0, 0]),
		    paddingBR = L.point(options.paddingBottomRight || options.padding || [0, 0]),

		    zoom = this.getBoundsZoom(bounds, false, paddingTL.add(paddingBR)),
		    paddingOffset = paddingBR.subtract(paddingTL).divideBy(2),

		    swPoint = this.project(bounds.getSouthWest(), zoom),
		    nePoint = this.project(bounds.getNorthEast(), zoom),
		    center = this.unproject(swPoint.add(nePoint).divideBy(2).add(paddingOffset), zoom);

		zoom = options && options.maxZoom ? Math.min(options.maxZoom, zoom) : zoom;

		// added minZoom option
		zoom = options && options.minZoom ? Math.max(options.minZoom, zoom) : zoom;

		return this.setView(center, zoom, options);
	},
});


L.Polygon.include({

	getCenter: function () {
		var i, j, p1, p2, f, area, x, y, center,
		    points = this._rings[0],
		    len = points.length;

		if (!len) { return null; }

		// polygon centroid algorithm; only uses the first ring if there are multiple

		area = x = y = 0;

		for (i = 0, j = len - 1; i < len; j = i++) {
			p1 = points[i];
			p2 = points[j];

			f = p1.y * p2.x - p2.y * p1.x;
			x += (p1.x + p2.x) * f;
			y += (p1.y + p2.y) * f;
			area += f * 3;
		}

		if (area === 0) {
			// Polygon is so small that all points are on same pixel.
			center = points[0];
		} else {
			center = [x / area, y / area];
		}
		return this._map.layerPointToLatLng(center);
	},
})

// prevent minifed bug
L.Icon.Default.imagePath = '/css/images';