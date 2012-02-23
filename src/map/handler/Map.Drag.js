/*
 * L.Handler.MapDrag is used internally by L.Map to make the map draggable.
 */

L.Map.Drag = L.Handler.extend({
	addHooks: function () {
		if (!this._draggable) {
			this._draggable = new L.Draggable(this._map._mapPane, this._map._container);

			this._draggable
				.on('dragstart', this._onDragStart, this)
				.on('drag', this._onDrag, this)
				.on('dragend', this._onDragEnd, this);

			var options = this._map.options;

			if (options.worldCopyJump && !options.continuousWorld) {
				this._draggable.on('predrag', this._onPreDrag, this);
				this._map.on('viewreset', this._onViewReset, this);
			}
		}
		this._draggable.enable();
	},

	removeHooks: function () {
		this._draggable.disable();
	},

	moved: function () {
		return this._draggable && this._draggable._moved;
	},

	_onDragStart: function () {
		this._map
			.fire('movestart')
			.fire('dragstart');

		this._directions = [];
		this._times = [];
		this._prevPos = this._prevTime = null;
	},

	_onDrag: function () {
		var newTime = new Date();

		if (this._prevPos) {
			this._directions.push(this._draggable._newPos.subtract(this._prevPos));
			var delta = newTime - this._prevTime;
			this._times.push(delta);

			if (this._directions.length > 10) {
				this._directions.shift();
				this._times.shift();
			}
		}

		this._prevPos = this._draggable._newPos;
		this._prevTime = newTime;

		this._map
			.fire('move')
			.fire('drag');
	},

	_onViewReset: function () {
		var pxCenter = this._map.getSize().divideBy(2),
			pxWorldCenter = this._map.latLngToLayerPoint(new L.LatLng(0, 0));

		this._initialWorldOffset = pxWorldCenter.subtract(pxCenter);
	},

	_onPreDrag: function () {
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

	_onDragEnd: function () {
		var map = this._map;

		/*map
			.fire('moveend')
			.fire('dragend');*/

		var p = new L.Point(0, 0),
			len = this._directions.length,
			dir,
			duration = 0;

		dir = this._directions.reduce(function (a, b) {
			return a.add(b);
		});
		duration = this._times.reduce(function (a, b) {
			return a + b;
		}) + (+new Date() - this._prevTime);

		var a = 10000,
			v0v = dir.divideBy(duration / 1000),
			v0 = v0v.distanceTo(p),
			t = v0 / a,
			offset = v0v.multiplyBy(- t / 2).round();

		console.log(offset.distanceTo(p), t);

		L.Util.requestAnimFrame(L.Util.bind(function() {
			this._map.panBy(offset, {
				duration: Math.round(t * 100) / 100,
				easing: 'cubic-bezier(.39,.3,.36,.98)'
			});
		}, this));

		if (map.options.maxBounds) {
			// TODO predrag validation instead of animation
			L.Util.requestAnimFrame(this._panInsideMaxBounds, map, true, map._container);
		}
	},

	_panInsideMaxBounds: function () {
		this.panInsideBounds(this.options.maxBounds);
	}
});
