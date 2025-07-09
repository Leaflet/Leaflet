import {Map} from '../Map.js';
import {Handler} from '../../core/Handler.js';
import {on, off, stop} from '../../dom/DomEvent.js';
import {Point} from '../../geometry/Point.js';


/*
 * Map.Keyboard is handling keyboard interaction with the map, enabled by default.
 */

// @namespace Map
// @section Keyboard Navigation Options
Map.mergeOptions({
	// @option keyboard: Boolean = true
	// Makes the map focusable and allows users to navigate the map with keyboard
	// arrows and `+`/`-` keys.
	keyboard: true,

	// @option keyboardPanDelta: Number = 80
	// Amount of pixels to pan when pressing an arrow key.
	keyboardPanDelta: 80
});

export class Keyboard extends Handler {

	static keyCodes = {
		left:    ['ArrowLeft'],
		right:   ['ArrowRight'],
		down:    ['ArrowDown'],
		up:      ['ArrowUp'],
		zoomIn:  ['Equal', 'NumpadAdd', 'BracketRight'],
		zoomOut: ['Minus', 'NumpadSubtract', 'Digit6', 'Slash']
	};

	initialize(map) {
		this._map = map;

		this._setPanDelta(map.options.keyboardPanDelta);
		this._setZoomDelta(map.options.zoomDelta);
	}

	addHooks() {
		const container = this._map._container;

		// make the container focusable by tabbing
		if (container.tabIndex <= 0) {
			container.tabIndex = '0';
		}

		// add aria-attribute for keyboard shortcuts to the container
		container.ariaKeyShortcuts = Object.values(Keyboard.keyCodes).flat().join(' ');

		on(container, {
			focus: this._onFocus,
			blur: this._onBlur,
			pointerdown: this._onPointerDown
		}, this);

		this._map.on({
			focus: this._addHooks,
			blur: this._removeHooks
		}, this);
	}

	removeHooks() {
		this._removeHooks();

		off(this._map._container, {
			focus: this._onFocus,
			blur: this._onBlur,
			pointerdown: this._onPointerDown
		}, this);

		this._map.off({
			focus: this._addHooks,
			blur: this._removeHooks
		}, this);
	}

	//  acquire/lose focus #594, #1228, #1540
	_onPointerDown() {
		if (this._focused) { return; }

		const body = document.body,
		docEl = document.documentElement,
		top = body.scrollTop || docEl.scrollTop,
		left = body.scrollLeft || docEl.scrollLeft;

		this._map._container.focus();

		window.scrollTo(left, top);
	}

	_onFocus() {
		this._focused = true;
		this._map.fire('focus');
	}

	_onBlur() {
		this._focused = false;
		this._map.fire('blur');
	}

	_setPanDelta(panDelta) {
		const keys = this._panKeys = {},
		codes = Keyboard.keyCodes;

		for (const code of codes.left) {
			keys[code] = [-1 * panDelta, 0];
		}
		for (const code of codes.right) {
			keys[code] = [panDelta, 0];
		}
		for (const code of codes.down) {
			keys[code] = [0, panDelta];
		}
		for (const code of codes.up) {
			keys[code] = [0, -1 * panDelta];
		}
	}

	_setZoomDelta(zoomDelta) {
		const keys = this._zoomKeys = {},
		codes = Keyboard.keyCodes;

		for (const code of codes.zoomIn) {
			keys[code] = zoomDelta;
		}
		for (const code of codes.zoomOut) {
			keys[code] = -zoomDelta;
		}
	}

	_addHooks() {
		on(document, 'keydown', this._onKeyDown, this);
	}

	_removeHooks() {
		off(document, 'keydown', this._onKeyDown, this);
	}

	_onKeyDown(e) {
		if (e.altKey || e.ctrlKey || e.metaKey) { return; }

		const key = e.code,
		map = this._map;
		let offset;

		if (key in this._panKeys) {
			if (!map._panAnim || !map._panAnim._inProgress) {
				offset = this._panKeys[key];
				if (e.shiftKey) {
					offset = new Point(offset).multiplyBy(3);
				}

				if (map.options.maxBounds) {
					offset = map._limitOffset(new Point(offset), map.options.maxBounds);
				}

				if (map.options.worldCopyJump) {
					const newLatLng = map.wrapLatLng(map.unproject(map.project(map.getCenter()).add(offset)));
					map.panTo(newLatLng);
				} else {
					map.panBy(offset);
				}
			}
		} else if (key in this._zoomKeys) {
			map.setZoom(map.getZoom() + (e.shiftKey ? 3 : 1) * this._zoomKeys[key]);

		} else if (key === 'Escape' && map._popup && map._popup.options.closeOnEscapeKey) {
			map.closePopup();

		} else {
			return;
		}

		stop(e);
	}
}

// @section Handlers
// @section Handlers
// @property keyboard: Handler
// Keyboard navigation handler.
Map.addInitHook('addHandler', 'keyboard', Keyboard);
