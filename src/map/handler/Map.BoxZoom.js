/*
 * L.Handler.ShiftDragZoom is used internally by L.Map to add shift-drag zoom (zoom to a selected bounding box).
 */

L.Map.BoxZoom = L.Handler.extend({
	initialize: function (map) {
		this._map = map;
		this._container = map._container;
		this._pane = map._panes.overlayPane;
	},

	addHooks: function () {
		L.DomEvent.addListener(this._container, 'mousedown', this._onMouseDown, this);
	},

	removeHooks: function () {
		L.DomEvent.removeListener(this._container, 'mousedown', this._onMouseDown);
	},

	_onMouseDown: function (e) {
		if (!e.shiftKey || ((e.which !== 1) && (e.button !== 1))) {
			return false;
		}

		L.DomUtil.disableTextSelection();

		this._startLayerPoint = this._map.mouseEventToLayerPoint(e);

		this._box = L.DomUtil.create('div', 'leaflet-zoom-box', this._pane);
		L.DomUtil.setPosition(this._box, this._startLayerPoint);

		//TODO move cursor to styles
		this._container.style.cursor = 'crosshair';

		L.DomEvent.addListener(document, 'mousemove', this._onMouseMove, this);
		L.DomEvent.addListener(document, 'mouseup', this._onMouseUp, this);

		L.DomEvent.preventDefault(e);
	},

	_onMouseMove: function (e) {
		var layerPoint = this._map.mouseEventToLayerPoint(e),
			dx = layerPoint.x - this._startLayerPoint.x,
			dy = layerPoint.y - this._startLayerPoint.y;

		var newX = Math.min(layerPoint.x, this._startLayerPoint.x),
			newY = Math.min(layerPoint.y, this._startLayerPoint.y),
			newPos = new L.Point(newX, newY);

		L.DomUtil.setPosition(this._box, newPos);

		this._box.style.width = (Math.abs(dx) - 4) + 'px';
		this._box.style.height = (Math.abs(dy) - 4) + 'px';
	},

	_onMouseUp: function (e) {
		this._pane.removeChild(this._box);
		this._container.style.cursor = '';

		L.DomUtil.enableTextSelection();

		L.DomEvent.removeListener(document, 'mousemove', this._onMouseMove);
		L.DomEvent.removeListener(document, 'mouseup', this._onMouseUp);

		var layerPoint = this._map.mouseEventToLayerPoint(e);

		var bounds = new L.LatLngBounds(
				this._map.layerPointToLatLng(this._startLayerPoint),
				this._map.layerPointToLatLng(layerPoint));

		this._map.fitBounds(bounds);
	}
});
