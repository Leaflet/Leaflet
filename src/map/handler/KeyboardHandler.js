import {Handler} from '../../core/Handler.js';
import {on, off, stop} from '../../dom/DomEvent.js';
import {Point} from '../../geometry/Point.js';

/** @import {Marker} from '../../layer/marker/Marker.js' */

// Handles keyboard interaction with the map, enabled by default.
export class KeyboardHandler extends Handler {

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
			pointerdown: this._onPointerDown,
			keydown: this._onContainerKeyDown
		}, this);
	}

	removeHooks() {
		off(document, 'keydown', this._onKeyDown, this);

		if (this._map.options.ariaKeyShortcuts) {
			this._map._container.removeAttribute('aria-keyshortcuts');
		}

		off(this._map._container, {
			focus: this._onFocus,
			blur: this._onBlur,
			pointerdown: this._onPointerDown,
			keydown: this._onContainerKeyDown
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
		on(document, 'keydown', this._onKeyDown, this);
		this._map.fire('focus');
	}

	_onBlur() {
		this._focused = false;
		off(document, 'keydown', this._onKeyDown, this);
		this._map.fire('blur');
	}

	// on the container rather than the document, so that Escape also works when focus is on a marker or
	// inside the popup, which blurs the container and removes the document listener (#6551); controls are
	// left out so that e.g. Escape in a geocoder input doesn't close an unrelated popup
	/** @param {KeyboardEvent} e */
	_onContainerKeyDown(e) {
		const map = this._map,
		popup = map._popup,
		target = /** @type {Node} */ (e.target);

		if (e.key !== 'Escape' || e.defaultPrevented || !popup?.options.closeOnEscapeKey ||
			map._controlContainer.contains(target)) { return; }

		const inPopup = popup._container.contains(target),
		icon = /** @type {Marker | undefined} */ (popup._source)?._icon;

		map.closePopup();
		e.preventDefault();

		// closing removes the focused element, which would send focus back to the start of the page
		if (inPopup) { (icon && icon.tabIndex >= 0 ? icon : map._container).focus(); }
	}

	/** @param {KeyboardEvent} e */
	_onKeyDown(e) {
		if (e.altKey || e.ctrlKey || e.metaKey) { return; }

		const key = e.key,
		map = this._map,
		{left, right, down, up, zoomIn, zoomOut} = KeyboardHandler.keys,
		x = +right.includes(key) - +left.includes(key),
		y = +down.includes(key) - +up.includes(key),
		dz = +zoomIn.includes(key) - +zoomOut.includes(key),
		k = e.shiftKey ? 3 : 1;

		if (x || y) {
			if (!map._panAnim?._inProgress) {
				let offset = new Point(x, y).multiplyBy(k * map.options.keyboardPanDelta);
				if (map.options.maxBounds) {
					offset = map._limitOffset(offset, map.options.maxBounds);
				}
				map.panBy(offset);
			}
		} else if (dz) {
			if (!map._zoomInputBlocked()) {
				map.setZoom(map.getZoom() + k * dz * map.options.zoomDelta);
			}

		} else {
			return;
		}

		stop(e);
	}
}
