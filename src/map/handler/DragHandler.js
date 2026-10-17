import {LeafletMap} from '../Map.js';
import {Handler} from '../../core/Handler.js';
import {Draggable} from '../../dom/Draggable.js';
import {LatLngBounds} from '../../geo/LatLngBounds.js';
import {Bounds} from '../../geometry/Bounds.js';

/*
 * Handler.MapDrag is used to make the map draggable (with panning inertia), enabled by default.
 */

// @namespace LeafletMap
// @section Interaction Options
LeafletMap.mergeOptions({
	// @option dragging: Boolean = true
	// Whether the map is draggable with pointer or not.
	dragging: true,

	// @section Panning Inertia Options
	// @option inertia: Boolean = *
	// If enabled, panning of the map will have an inertia effect where
	// the map builds momentum while dragging and continues moving in
	// the same direction for some time. Feels especially nice on touch
	// devices. Enabled by default.
	inertia: true,

	// @option inertiaDeceleration: Number = 3000
	// The rate with which the inertial movement slows down, in pixels/second².
	inertiaDeceleration: 3400, // px/s^2

	// @option inertiaMaxSpeed: Number = Infinity
	// Max speed of the inertial movement, in pixels/second.
	inertiaMaxSpeed: Infinity, // px/s

	// @option easeLinearity: Number = 0.2
	easeLinearity: 0.2,

	// @option maxBoundsViscosity: Number = 0.0
	// If `maxBounds` is set, this option will control how solid the bounds
	// are when dragging the map around. The default value of `0.0` allows the
	// user to drag outside the bounds at normal speed, higher values will
	// slow down map dragging outside bounds, and `1.0` makes the bounds fully
	// solid, preventing the user from dragging outside the bounds.
	maxBoundsViscosity: 0.0
});

export class DragHandler extends Handler {
	addHooks() {
		if (!this._draggable) {
			const map = this._map;

			this._draggable = new Draggable(map._mapPane, map._container);

			this._draggable.on({
				dragstart: this._onDragStart,
				drag: this._onDrag,
				dragend: this._onDragEnd
			}, this);

			this._draggable.on('predrag', this._onPreDragLimit, this);
			if (map.options.worldCopyJump) {
				this._draggable.on('predrag', this._onPreDragWrap, this);
			}
		}
		this._map._container.classList.add('leaflet-grab', 'leaflet-touch-drag');
		this._draggable.enable();
		this._positions = [];
		this._times = [];
	}

	removeHooks() {
		this._map._container.classList.remove('leaflet-grab', 'leaflet-touch-drag');
		this._draggable.disable();
	}

	moved() {
		return this._draggable?._moved;
	}

	moving() {
		return this._draggable?._moving;
	}

	_onDragStart() {
		const map = this._map;

		map._stop();
		if (this._map.options.maxBounds && this._map.options.maxBoundsViscosity) {
			const bounds = new LatLngBounds(this._map.options.maxBounds);

			this._offsetLimit = new Bounds(
				this._map.latLngToContainerPoint(bounds.getNorthWest()).multiplyBy(-1),
				this._map.latLngToContainerPoint(bounds.getSouthEast()).multiplyBy(-1)
					.add(this._map.getSize()));

			this._viscosity = Math.min(1.0, Math.max(0.0, this._map.options.maxBoundsViscosity));
		} else {
			this._offsetLimit = null;
		}

		this._worldCopyOffset = 0;
		this._pendingWorldCopy = 0;

		map
			.fire('movestart')
			.fire('dragstart');

		if (map.options.inertia) {
			this._positions = [];
			this._times = [];
		}
	}

	_onDrag(e) {
		if (this._pendingWorldCopy) {
			this._map._fireWorldCopyJump(this._pendingWorldCopy);
			this._pendingWorldCopy = 0;
		}

		if (this._map.options.inertia) {
			const time = this._lastTime = Date.now(),
			pos = this._lastPos = this._draggable._absPos || this._draggable._newPos;

			this._positions.push(pos);
			this._times.push(time);

			this._prunePositions(time);
		}

		this._map
			.fire('move', e)
			.fire('drag', e);
	}

	_prunePositions(time) {
		while (this._positions.length > 1 && time - this._times[0] > 50) {
			this._positions.shift();
			this._times.shift();
		}
	}

	_viscousLimit(value, threshold) {
		return value - (value - threshold) * this._viscosity;
	}

	_onPreDragLimit() {
		if (!this._viscosity || !this._offsetLimit) { return; }

		const offset = this._draggable._newPos.subtract(this._draggable._startPos);

		const limit = this._offsetLimit;
		if (offset.x < limit.min.x) { offset.x = this._viscousLimit(offset.x, limit.min.x); }
		if (offset.y < limit.min.y) { offset.y = this._viscousLimit(offset.y, limit.min.y); }
		if (offset.x > limit.max.x) { offset.x = this._viscousLimit(offset.x, limit.max.x); }
		if (offset.y > limit.max.y) { offset.y = this._viscousLimit(offset.y, limit.max.y); }

		this._draggable._newPos = this._draggable._startPos.add(offset);
	}

	_onPreDragWrap() {
		const draggable = this._draggable,
		unwrapped = draggable._newPos,
		wrapped = this._map._wrapPanePos(unwrapped),
		offset = wrapped.x - unwrapped.x;

		draggable._absPos = unwrapped.clone();
		draggable._newPos = wrapped;

		// Announce the jump from _onDrag, after Draggable has moved the pane.
		this._pendingWorldCopy = offset - this._worldCopyOffset;
		this._worldCopyOffset = offset;
	}

	_onDragEnd(e) {
		const map = this._map,
		options = map.options,

		noInertia = !options.inertia || e.noInertia || this._times.length < 2;

		map.fire('dragend', e);

		if (noInertia) {
			map.fire('moveend');

		} else {
			this._prunePositions(Date.now());

			const direction = this._lastPos.subtract(this._positions[0]),
			duration = (this._lastTime - this._times[0]) / 1000,
			ease = options.easeLinearity,

			speedVector = direction.multiplyBy(ease / duration),
			speed = speedVector.distanceTo([0, 0]),

			limitedSpeed = Math.min(options.inertiaMaxSpeed, speed),
			limitedSpeedVector = speedVector.multiplyBy(limitedSpeed / speed),

			decelerationDuration = limitedSpeed / (options.inertiaDeceleration * ease);
			let offset = limitedSpeedVector.multiplyBy(-decelerationDuration / 2).round();

			if (!offset.x && !offset.y) {
				map.fire('moveend');

			} else {
				offset = map._limitOffset(offset, map.options.maxBounds);

				requestAnimationFrame(() => {
					map.panBy(offset, {
						duration: decelerationDuration,
						easeLinearity: ease,
						noMoveStart: true,
						animate: true
					});
				});
			}
		}
	}
}

// @section Handlers
// @property dragging: Handler
// Map dragging handler.
LeafletMap.addInitHook('addHandler', 'dragging', DragHandler);
