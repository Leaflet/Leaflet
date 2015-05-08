/*
 * L.ActiveOverlay sets an SVG element over the map.
 *
 * The size and position of the 'svg' element itself remains fixed, relative to the map,
 * just as for 'L.ImageOverlay'.
 *
 * Elements within the SVG are not affected by the panning and scaling, and can be
 * managed using any SVG library (s.a. SnapSVG or D3).
 */

L.ActiveOverlay = L.Layer.extend({

	/* Design note: there does not seem to be a way to apply opacity to an 'svg' HTML tag,
	 *       so it's left out of options, compared to 'L.ImageOverlay'. To get the
	 *       same effect, one would set one group ('<g>') within the SVG and control
	 *       its opacity instead.
	 */
	options: {
		unit: 1.0             // SVG units (meters)
	},

	/* Design note: either the caller (as in here) or us could create the 'svgElem'.
	 *        This way is more in line with the 'L.ImageOverlay' parameter list (which has
	 *        the picture's URL as the first param). Also, this means we do not need to
	 *        expose the element as a property ('.svgElem') or return a value from 'initialize'.
	 */
	initialize: function (svgElem, bounds, options) { // (Svg element, LatLngBounds [, Object])

		this._svgElem = svgElem;
		this._bounds = bounds;
		this._zoomAnimated = true;

		// Set by '._reset()':
		//
		// this._initialized: boolean   (true)
		// this._svgSize: Point         (constant)
		// this._factor: number         (varies by the zoom level)

		L.Util.setOptions(this, options);
	},

	onAdd: function () {
		var el = this._svgElem;

		el.className = 'leaflet-active-layer ' + (this._zoomAnimated ? 'leaflet-zoom-animated' : '');

		el.classList.add('leaflet-active-layer');
		if (this._zoomAnimated) {
			el.classList.add('leaflet-zoom-animated');
		}

		// Q: No need to trigger 'onload' for vectors, is there (the reason would be to keep the
		//    interface 1-to-1 with 'L.ImageOverlay').
		//
		//L.bind(this.fire, this, 'load')();    // call immediately

		el.onselectstart = L.Util.falseFn;
		el.onmousemove = L.Util.falseFn;

		this.getPane().appendChild(el);
		this._reset();
	},

	onRemove: function () {
		L.DomUtil.remove(this._svgElem);
	},

	bringToFront: function () {
		if (this._map) {
			L.DomUtil.toFront(this._svgElem);
		}
		return this;
	},

	bringToBack: function () {
		if (this._map) {
			L.DomUtil.toBack(this._svgElem);
		}
		return this;
	},

	getEvents: function () {
		var events = {
			viewreset: this._reset
		};

		if (this._zoomAnimated) {
			events.zoomanim = this._animateZoom;
		}

		return events;
	},

	getBounds: function () {
		return this._bounds;
	},

	_animateZoom: function (e) {
		var bounds = L.bounds(
			this._map._latLngToNewLayerPoint(this._bounds.getNorthWest(), e.zoom, e.center),
		  this._map._latLngToNewLayerPoint(this._bounds.getSouthEast(), e.zoom, e.center)
		);

		var offset = bounds.min.add(bounds.getSize()._multiplyBy((1 - 1 / e.scale) / 2));

		L.DomUtil.setTransform(this._svgElem, offset, e.scale);
	},

	_reset: function () {      // ([Event]) ->
		var el = this._svgElem;

		if (!this._initial) {
			this._initial = true;

			// Find the width and height of the bounding box, in meters.
			//
			var nw = this._bounds.getNorthWest();

			var mWidth = nw.distanceTo(this._bounds.getNorthEast());    // width (m)
			var mHeight = nw.distanceTo(this._bounds.getSouthWest());   // height (m)

			var svgSize = L.point(mWidth, mHeight)._divideBy(this.options.unit);

			// The actual dimensions (in meters) get anchored in the SVG 'viewBox' properties
			// (and don't change by zooming or panning). These are the SVG coordinate dimensions
			// of the bounding box.
			//
			el.setAttribute('viewBox', [0, 0, svgSize.x, svgSize.y].join(' '));

			this._svgSize = svgSize;
		}

		// Pixels from the top left of the map, if the map hasn't been panned
		//
		var pBounds = L.bounds(
			this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
			this._map.latLngToLayerPoint(this._bounds.getSouthEast()));

		var size = pBounds.getSize();    // size in screen pixels

		// Note: We're currently only considering the 'x' factor in latLngToSvgPoint
		//      calculations. To be more precise, we could consider both (they are
		//      close to each other but not completely the same).
		//
		//console.log('X factor: ' + (size.x / this._svgSize.x));
		//console.log('Y factor: ' + (size.y / this._svgSize.y));

		this._factor = size.x / this._svgSize.x;      // pixels / m

		L.DomUtil.setPosition(el, pBounds.min);

		el.style.width  = size.x + 'px';
		el.style.height = size.y + 'px';
	},

	/*
	* Conversion of LatLng coordinates to/from SVG coordinates.
	*
	* Note: For a normal image, this would mean conversion from/to pixel coordinates
	*      (which feature is not in the 'ImageOverlay' API but could be).
	*/
	latLngToSvgPoint: function(latLng) {  // (LatLng) -> Point
		var offset = L.DomUtil.getPosition(this._svgElem);    // offset in screen pixels, without panning

		var p = this._map.latLngToLayerPoint(latLng)._subtract(offset)._divideBy(this._factor);
		return p;
	},

	// Note: This has not been tested!!
	//
	svgPointToLatLng: function(p) {   // (Point) -> LatLng
		var offset = L.DomUtil.getPosition(this._svgElem);

		var latlng = this._map.layerPointToLatLng(p.multiplyBy(this._factor)._add(offset));
		return latlng;
	},

	/*
	* Conversion of pixel dimensions (dx,dy) to/from SVG dimensions.
	*
	* Note: The ratio remains constant on a certain zoom level, so instead of calling
	*      conversions per each drag event (for example), the upper level can cache
	*      the ratios for (1,1) pixel and convert locally.
	*
	* Note: '_' preceding means we can destroy the argument.
	*/
	_pixelsToSvgRatio: function(_p) {    // (Point) -> Point
		return _p._divideBy(this._factor);
	}
});

L.activeOverlay = function (svgElem, bounds, options) {   // (SVGelem, LatLngBounds [, Object])
	return new L.ActiveOverlay(svgElem, bounds, options);
};
