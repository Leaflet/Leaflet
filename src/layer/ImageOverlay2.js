/*
 * L.ImageOverlay2 takes an SVG element over the map (to specific geographical bounds).
 *
 * The size and position of the 'svg' element itself remains fixed, relative to the map,
 * just as for an image overlay.
 *
 * This is modeled according to 'L.ImageOverlay' and could really be mastered as just
 * modifying that code, but I decided to use wholly different name to be sure. 
 * At least until I hear feedback on this. AK090215
 */

L.ImageOverlay2 = L.Layer.extend({

	options: {
		interactive: false
	},

	initialize: function (svgElem, bounds, options) { // (Svg element, LatLngBounds [, Object])
	
    this.svgElem= svgElem;  
		this._bounds = bounds;
    this._zoomAnimated = true;

		L.setOptions(this, options);
	},

	onAdd: function () {
    var el= this.svgElem;
    
    el.className = 'leaflet-image-layer ' + (this._zoomAnimated ? 'leaflet-zoom-animated' : '');

    console.log( el.classList );
    el.classList.add( 'leaflet-image-layer' );
    if (this._zoomAnimated) {
      el.classList.add( 'leaflet-zoom-animated' );
    }

    // No need to trigger 'onload' for vectors, is there (the reason would be to keep the
    // interface 1-to-1 with images.
    //
    //L.bind(this.fire, this, 'load')();    // call immediately

    el.onselectstart = L.Util.falseFn;
    el.onmousemove = L.Util.falseFn;

		this.getPane().appendChild(el);
		this._initInteraction();
		this._reset();
	},

	onRemove: function () {
		L.DomUtil.remove(this.svgElem);
	},

	bringToFront: function () {
		if (this._map) {
			L.DomUtil.toFront(this.svgElem);
		}
		return this;
	},

	bringToBack: function () {
		if (this._map) {
			L.DomUtil.toBack(this.svgElem);
		}
		return this;
	},

    /*
    * What is this 'interaction', anyways?
    */
	_initInteraction: function () {
    console.log( "Interactive: "+ this.options.interactive );

		if (this.options.interactive) {
		  var el = this.svgElem;
		  L.DomUtil.addClass(el, 'leaflet-interactive');

      // Note: Trying to disabled "dual panning" if the app makes 'svgElem' draggable (= can move above the map);
      //      we don't want also the map to move around.
      //		  
      // If we have this on, croc can be dragged relative the map (though it seems jerky),
      // but the "open" map areas won't pan, either (which is not what we want). AK150215
      //
      //L.DomEvent.disableClickPropagation(el);
		  
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
			this._map._latLngToNewLayerPoint( this._bounds.getNorthWest(), e.zoom, e.center ),
		  this._map._latLngToNewLayerPoint( this._bounds.getSouthEast(), e.zoom, e.center )
		);

		var offset = bounds.min.add( bounds.getSize()._multiplyBy((1 - 1 / e.scale) / 2) );

		L.DomUtil.setTransform( this.svgElem, offset, e.scale );
	},

  /*
  * 
  */
	_reset: function () {
    console.log( "EVENT SVG viewReset" );
    //console.log( this._map );

    var el = this.svgElem;
    
		var bounds = L.bounds(
		      this._map.latLngToLayerPoint( this._bounds.getNorthWest() ),
		      this._map.latLngToLayerPoint( this._bounds.getSouthEast() )
		    ),
		    size = bounds.getSize();

    if (!this._initial) {
      this._initial = true;
		  el.setAttribute( "viewBox", [0, 0, size.x, size.y].join(" ") );
    }
    
    //console.log( "initial size: " + this._initialSize.x +" "+ this._initialSize.y );
    //console.log( "current size: " + size.x +" "+ size.y );
    
    //console.log( "setPosition: " + bounds.min.x +" "+ bounds.min.y );

		L.DomUtil.setPosition(el, bounds.min);
    
		el.style.width  = size.x + 'px';
		el.style.height = size.y + 'px';
	},
	
	/*
	* Conversion of LatLng coordinates to/from SVG coordinates. 
	*
	* Note: For a normal image, this would mean conversion from/to pixel coordinates
	*      (which feature is not in the 'ImageOverlay' API but could be).
	*
	* TBD. Which are the right conversion functions here, or should we use 'distance()'? AK150215
	*/
	latLngToSvgPoint: function( latLng ) {  // (LatLng) -> Point

    console.log( this._map );
    console.log( this._map.latLngToLayerPoint );
    
    var p= this._map.latLngToLayerPoint( latLng );
    
    return p;
	},
	
	svgPointToLatLng: function( p ) {   // (Point) -> LatLng

    var latlng= this._map.layerPointToLatLng( p );
    
    return latlng;
	}
});

L.imageOverlay2 = function (bounds, options) {
	return new L.ImageOverlay2(bounds, options);
};
