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
   *
   * Q: what does 'interactive' actually do for us? Maybe not needed?
   */
	options: {
		interactive: false
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
		// this._initialized: boolean
		// this._top: Point             // NW corner in layer coordinates

		L.setOptions(this, options);
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
		this._initInteraction();      // Q: do we need this? ('ImageOverlay' has it but we're interactive anyways)
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

  // Q: is this needed?
  //
	_initInteraction: function () {

		if (this.options.interactive) {
		  var el = this._svgElem;
		  L.DomUtil.addClass(el, 'leaflet-interactive');

      /*** REMOVE
      // Note: Trying to disabled "dual panning" if the app makes 'svgElem' draggable (= can move above the map);
      //      we don't want also the map to move around.
      //
      // If we have this on, croc can be dragged relative the map (though it seems jerky),
      // but the "open" map areas won't pan, either (which is not what we want). AK150215
      //
      //L.DomEvent.disableClickPropagation(el);
      ***/

		  L.DomEvent.on(el, 'click dblclick mousedown mouseup mouseover mousemove mouseout contextmenu',
				this._fireMouseEvent, this);
		}
	},

	_fireMouseEvent: function (e, type) {
    // Note: This does not seem to matter, at all. (because 'this._map' is 'undefined')
    //
		if (this._map) {
			this._map._fireMouseEvent(this, e, type, true);
		}
	},

  // Q: should we have it here? (if it's about the attribution of the image,
  //    then we don't).
  //
	getAttribution: function () {
		return this.options.attribution;
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

	/*
	*
	*/
	_reset: function () {
		var el = this._svgElem;

		var bounds = L.bounds(
		      this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
		      this._map.latLngToLayerPoint(this._bounds.getSouthEast())),
		    size = bounds.getSize();

		if (!this._initial) {
			this._initial = true;
			el.setAttribute('viewBox', [0, 0, size.x, size.y].join(' '));
		}

		L.DomUtil.setPosition(el, bounds.min);
		this._top = bounds.min;

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
    var offset = this._top;   // same as: L.DomUtil.getPosition(this._svgElem); (cached by 'L.DomUtil.setPosition')
    var p = this._map.latLngToLayerPoint(latLng).subtract(offset);
		return p;
	},

  // Note: This has not been tested!!
  //
	svgPointToLatLng: function(p) {   // (Point) -> LatLng
    var offset = this._top;
		var latlng = this._map.layerPointToLatLng(p.add(offset));
		return latlng;
	}
});

L.activeOverlay = function (bounds, options) {
	return new L.ActiveOverlay(bounds, options);
};
