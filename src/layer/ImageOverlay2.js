/*
 * L.VectorOverlay takes an SVG element over the map (to specific geographical bounds).
 *
 * This is modeled according to 'L.ImageOverlay' and could really be mastered as just
 * modifying that code, but for some reason my code went always to mapbox.js stuff
 * so I decided to use wholly different name to be sure. AK090215
 */

L.ImageOverlay2 = L.Layer.extend({

	options: {
		opacity: 1,
		alt: '',
		interactive: false
	},

	initialize: function (url, bounds, options) { // (String or SvgElement, LatLngBounds, Object)

    // Note: could use 'setUrl(url)' to be more DRY
    //
    if (typeof url === 'string' || url instanceof String) {
		  this._url = url;    // 'this._el' will be initialized later to the '<img>' element
		} else {
		  this._svg = url;   // <svg> element (may already be populated by the caller)
		}
		this._bounds = L.latLngBounds(bounds);

		L.setOptions(this, options);
	},

	onAdd: function () {
		if (!this._el) {
			this._initImage();

			if (this.options.opacity < 1) {
				this._updateOpacity();
			}
		}

    console.log( "getPane: " + this.getPane() );
    console.log( "_el: " + this._el );

		this.getPane().appendChild(this._el);
		this._initInteraction();
		this._reset();
	},

	onRemove: function () {
		L.DomUtil.remove(this._el);
	},

	setOpacity: function (opacity) {
		this.options.opacity = opacity;

		if (this._el) {
			this._updateOpacity();
		}
		return this;
	},

	setStyle: function (styleOpts) {
		if (styleOpts.opacity) {
			this.setOpacity(styleOpts.opacity);
		}
		return this;
	},

	bringToFront: function () {
		if (this._map) {
			L.DomUtil.toFront(this._el);
		}
		return this;
	},

	bringToBack: function () {
		if (this._map) {
			L.DomUtil.toBack(this._el);
		}
		return this;
	},

	_initInteraction: function () {
		if (!this.options.interactive) { return; }
		L.DomUtil.addClass(this._el, 'leaflet-interactive');
		L.DomEvent.on(this._el, 'click dblclick mousedown mouseup mouseover mousemove mouseout contextmenu',
				this._fireMouseEvent, this);
	},

	_fireMouseEvent: function (e, type) {
		if (this._map) {
			this._map._fireMouseEvent(this, e, type, true);
		}
	},

	setUrl: function (url) {   // (String)   (we don't support changing the SVG element like this; even the name of the method says 'Url')

    if (typeof url === 'string' || url instanceof String) {
      if ((!this._url) && this._el) {
        // about to replace an 'svg' with an 'img' - we should remove the svg first, or disallow such use? tbd
        throw 'replacing \'svg\' element with \'img\' currently not allowed';
      }
		  this._url = url;
    } else {
      throw 'using \'setUrl()\' with svg element currently not allowed';
    }

		if (this._el) {
			this._el.src = url;
		}
		return this;
	},

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

	_initImage: function () {
    var el;

    if (this._url) {
		  el = this._el = L.DomUtil.create('img',
				'leaflet-image-layer ' + (this._zoomAnimated ? 'leaflet-zoom-animated' : ''));

      el.onselectstart = L.Util.falseFn;
      el.onmousemove = L.Util.falseFn;

      el.onload = L.bind(this.fire, this, 'load');
      el.src = this._url;
      el.alt = this.options.alt;
    } else {
      // 'this._svg' has the svg element, provided by the application level
      //
      el = this._el = this._svg;
		  el.className = 'leaflet-image-layer ' + (this._zoomAnimated ? 'leaflet-zoom-animated' : '');

      // No need to trigger 'onload' for vectors, is there (the reason would be to keep the
      // interface 1-to-1 with images.
      //
      L.bind(this.fire, this, 'load')();    // call immediately

      el.onselectstart = L.Util.falseFn;
      el.onmousemove = L.Util.falseFn;

      this.fire('load');   // element is there already (emulate a load)
    }
	},

	_animateZoom: function (e) {
		var bounds = new L.Bounds(
			this._map._latLngToNewLayerPoint(this._bounds.getNorthWest(), e.zoom, e.center),
		    this._map._latLngToNewLayerPoint(this._bounds.getSouthEast(), e.zoom, e.center));

		var offset = bounds.min.add(bounds.getSize()._multiplyBy((1 - 1 / e.scale) / 2));

		L.DomUtil.setTransform(this._el, offset, e.scale);
	},

	_reset: function () {
		var el = this._el,
		    bounds = new L.Bounds(
		        this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
		        this._map.latLngToLayerPoint(this._bounds.getSouthEast())),
		    size = bounds.getSize();

		L.DomUtil.setPosition(el, bounds.min);

		el.style.width  = size.x + 'px';
		el.style.height = size.y + 'px';
	},

	_updateOpacity: function () {
    if (this.options.opacity < 1) {
      // tbd. Is it true 'svg' element has no opacity setting in DOM? How about CSS styling it?
      //      (i.e. can we make 'L.DomUtil.setOpacity' support it?
      //
      throw 'Cannot set <svg> opacity (use a group within it)';

		  L.DomUtil.setOpacity(this._el, this.options.opacity);
    }
	}
});

L.imageOverlay2 = function (url, bounds, options) {
	return new L.ImageOverlay2(url, bounds, options);
};
