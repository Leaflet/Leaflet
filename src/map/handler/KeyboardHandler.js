import {Handler} from '../../core/Handler.js';
import {on, off, stop} from '../../dom/DomEvent.js';
import {Point} from '../../geometry/Point.js';

/*
 * KeyboardHandler is handling keyboard interaction with the map, enabled by default.
 */

export class KeyboardHandler extends Handler {

	static initHooks = true;

	// `KeyboardEvent.key` values, so zoom keys follow the keyboard layout and cover the numpad too;
	// `=` and `_` keep the US `+` and `-` keys working both with and without Shift
	static keys = {
		left: ['ArrowLeft'],
		right: ['ArrowRight'],
		down: ['ArrowDown'],
		up: ['ArrowUp'],
		zoomIn: ['+', '='],
		zoomOut: ['-', '_']
	};

	constructor(map) {
		super(map);

		this._setPanDelta(map.options.keyboardPanDelta);
		this._setZoomDelta(map.options.zoomDelta);

		this.callInitHooks();
	}

	addHooks() {
		const container = this._map._container;

		// make the container focusable by tabbing
		if (container.tabIndex <= 0) {
			container.tabIndex = 0;
		}

		const shortcuts = this._map.options.ariaKeyShortcuts;
		if (shortcuts) {
			// ARIA names physical keys by their unshifted character, so the default is for a US layout
			container.ariaKeyShortcuts = shortcuts === true ?
				'ArrowLeft ArrowRight ArrowUp ArrowDown = Plus -' : shortcuts;
		}

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

		if (this._map.options.ariaKeyShortcuts) {
			this._map._container.removeAttribute('aria-keyshortcuts');
		}

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

		// script focus matches :focus-visible by default, which would show a focus ring on every click
		this._map._container.focus({preventScroll: true, focusVisible: false});
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
		const panKeys = this._panKeys = {},
		{left, right, down, up} = KeyboardHandler.keys;

		for (const key of left) { panKeys[key] = [-panDelta, 0]; }
		for (const key of right) { panKeys[key] = [panDelta, 0]; }
		for (const key of down) { panKeys[key] = [0, panDelta]; }
		for (const key of up) { panKeys[key] = [0, -panDelta]; }
	}

	_setZoomDelta(zoomDelta) {
		const zoomKeys = this._zoomKeys = {},
		{zoomIn, zoomOut} = KeyboardHandler.keys;

		for (const key of zoomIn) { zoomKeys[key] = zoomDelta; }
		for (const key of zoomOut) { zoomKeys[key] = -zoomDelta; }
	}

	_addHooks() {
		on(document, 'keydown', this._onKeyDown, this);
	}

	_removeHooks() {
		off(document, 'keydown', this._onKeyDown, this);
	}

	_onKeyDown(e) {
		if (e.altKey || e.ctrlKey || e.metaKey) { return; }

		const key = e.key,
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

				map.panBy(offset);
			}
		} else if (key in this._zoomKeys) {
			if (!map._zoomInputBlocked()) {
				map.setZoom(map.getZoom() + (e.shiftKey ? 3 : 1) * this._zoomKeys[key]);
			}

		} else if (key === 'Escape' && map._popup && map._popup.options.closeOnEscapeKey) {
			map.closePopup();

		} else {
			return;
		}

		stop(e);
	}
}
