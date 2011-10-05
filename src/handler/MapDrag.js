/*
 * L.Handler.MapDrag is used internally by L.Map to make the map draggable.
 */

L.Handler.MapDrag = L.Handler.extend({

	enable: function() {
		if (this._enabled) { return; }
		if (!this._draggable) {
			this._draggable = new L.Draggable(this._map._mapPane, this._map._container);

			this._draggable.on('dragstart', this._onDragStart, this);
			this._draggable.on('drag', this._onDrag, this);
			this._draggable.on('dragend', this._onDragEnd, this);

			var options = this._map.options;

			if (options.worldCopyJump && !options.continuousWorld) {
				this._draggable.on('predrag', this._onPreDrag, this);
				this._map.on('viewreset', this._onViewReset, this);
			}
		}
		this._draggable.enable();
		this._enabled = true;
	},

	disable: function() {
		if (!this._enabled) { return; }
		this._draggable.disable();
		this._enabled = false;
	},

	moved: function() {
		return this._draggable && this._draggable._moved;
	},

	_onDragStart: function() {
		this._map.fire('movestart');
		this._map.fire('dragstart');
	},

	_onDrag: function() {
		this._map.fire('move');
		this._map.fire('drag');
	},

	_onViewReset: function() {
		var pxCenter = this._map.getSize().divideBy(2),
			pxWorldCenter = this._map.latLngToLayerPoint(new L.LatLng(0,0));

		this._initialWorldOffset = pxWorldCenter.subtract(pxCenter);
	},

	_onPreDrag: function() {
		var map = this._map,
			worldWidth = map.options.scale(map.getZoom()),
			halfWidth = Math.round(worldWidth / 2),
			dx = this._initialWorldOffset.x,
			x = this._draggable._newPos.x,
			newX1 = (x - halfWidth + dx) % worldWidth + halfWidth - dx,
			newX2 = (x + halfWidth + dx) % worldWidth - halfWidth - dx,
			newX = Math.abs(newX1 + dx) < Math.abs(newX2 + dx) ? newX1 : newX2;

		this._draggable._newPos.x = newX;
	},

	_onDragEnd: function() {
		this._map.fire('moveend');
		this._map.fire('dragend');
	}
});
