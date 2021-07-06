import {Map} from '../Map';
import {Handler} from '../../core/Handler';
import * as DomEvent from '../../dom/DomEvent';
import * as Util from '../../core/Util';
import * as DomUtil from '../../dom/DomUtil';

/*
 * L.Handler.Gesture is used by L.Map to add gesture based pan and zoom on toupad based devices.
 */

// @namespace Map
// @section Interaction Options
Map.mergeOptions({
	// @section Touch interaction options
	// @option touchpad: Boolean|String = *
	// Whether the map can be zoomed and panned by two finger gesture. If
	// passed `'center'`, it will zoom to the center of the view regardless of
	// where the touch events (fingers) were. Enabled for touch-capable web
	// browsers except for old Androids.
	touchpad: true,

	// @option resetTimeout: Integer
	// Sets the snap timeout after the zoom gesture ends.
	resetTimeout: 300,

	// @option zoomMultiplier: Float
	// Sets the zoom multiplier when doing the zoom gesture.
	zoomMultiplier: -0.05,

	// @option bounceAtGestureLimits: Boolean = true
	// Set it to false if you don't want the map to zoom beyond min/max zoom
	// and then bounce back when pinch-zooming.
	bounceAtGestureLimits: true
});

export var Gesture = Handler.extend({
	addHooks: function () {
		DomUtil.addClass(this._map._container, 'leaflet-touch-zoom');
		DomEvent.on(this._map._container, 'wheel', this._onGestureStart, this);
	},

	removeHooks: function () {
		DomUtil.removeClass(this._map._container, 'leaflet-touch-zoom');
		DomEvent.off(this._map._container, 'wheel', this._onGestureStart, this);
	},

	_onGestureStart: function (e) {
		if (e.deltaMode === e.DOM_DELTA_PIXEL) {
			DomEvent.preventDefault(e);

			var map = this._map;
			if (e.ctrlKey) {
				// touchpad two finger zoom

				this._zoom = map.getZoom() + e.deltaY * this._map.options.zoomMultiplier;

				if (!map.options.bounceAtGestureLimits && (
					(this._zoom < map.getMinZoom() && e.deltaY > 0) ||
					(this._zoom > map.getMaxZoom() && e.deltaY < 0))) {
					this._zoom = map._limitZoom(this._zoom);
				}

				this._centerPoint = map.getSize()._divideBy(2);
				if (map.options.gesture === 'center') {
					this._center = map.containerPointToLatLng(this._centerPoint);
				} else {
					this._pinchPoint = map.mouseEventToContainerPoint(e);
					this._centerLatLng = map.containerPointToLatLng(this._pinchPoint);
					var delta = this._pinchPoint._subtract(this._centerPoint);
					this._center = map.unproject(map.project(this._centerLatLng, this._zoom).subtract(delta), this._zoom);
				}

				Util.cancelAnimFrame(this._animRequest);
				var moveFn = Util.bind(map._move, map, this._center, this._zoom, {pinch: true, round: false});
				this._animRequest = Util.requestAnimFrame(moveFn, this, true);

				clearTimeout(this._timer);
				this._timer = setTimeout(Util.bind(this._zoomSnap, this), this._map.options.resetTimeout);
			} else {
				// touchpad two finger scroll

				map.panBy([e.deltaX, e.deltaY], {animate: false});
			}
		}
	},

	_zoomSnap: function () {
		Util.cancelAnimFrame(this._animRequest);

		if (this._map.options.zoomAnimation) {
			this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), true, this._map.options.zoomSnap);
		} else {
			this._map._resetView(this._center, this._map._limitZoom(this._zoom));
		}
	}
});

// @section Handlers
// @property Gesture: Handler
// Gesture touchpad pan zoom handler.
Map.addInitHook('addHandler', 'touchpad', Gesture);

