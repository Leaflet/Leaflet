// Fork of the great but sadly outdated tool https://github.com/tmcw/happen
(function () {
	const h = {},
	events = {
		mouse: 	['click', 'contextmenu', 'dblclick', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup'],
		key: 	['keydown', 'keyup', 'keypress'],
		touch:	['touchstart', 'touchmove', 'touchend', 'touchcancel'],
		pointer:['click', 'contextmenu', 'pointerover', 'pointerenter', 'pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'pointerout', 'pointerleave', 'gotpointercapture', 'lostpointercapture'],
		wheel: 	['wheel'],
		drag: 	['drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'dragstart', 'drop'],
		focus: 	['focus', 'blur', 'focusin', 'focusout'],
	};
	h.EVENTS = events;

	h.DOM_DELTA_PIXEL = 0x00;
	h.DOM_DELTA_LINE = 0x01;
	h.DOM_DELTA_PAGE = 0x02;

	if (navigator.userAgent && navigator.userAgent.toLowerCase().includes('chrome')) {
		// Click & contextmenu event in Chromium is a PointerEvent, so we need to remove it from the mouse event list
		events.mouse.splice(events.mouse.indexOf('click'), 1);
		events.mouse.splice(events.mouse.indexOf('contextmenu'), 1);
	} else {
		// Click & contextmenu event in Chromium is a PointerEvent, so we need to remove it from the pointer event list
		events.pointer.splice(events.pointer.indexOf('click'), 1);
		events.pointer.splice(events.pointer.indexOf('contextmenu'), 1);
	}

	h.makeEvent = function (options) {

		// simulate browser defaults
		if (events.key.indexOf(options.type) > -1) {
			options.bubbles = options.bubbles ?? true;
			options.cancelable = options.cancelable ?? true;
			options.composed = options.composed ?? true;

		} else if (events.focus.indexOf(options.type) > -1) {
			if (options.type === 'focusin' || options.type === 'focusout') {
				options.bubbles = options.bubbles ?? true;
			}
			options.composed = options.composed ?? true;

		} else if (events.mouse.indexOf(options.type) > -1) {
			if (options.type === 'click' || options.type === 'contextmenu' || options.type === 'dblclick' || options.type === 'mousedown' || options.type === 'mouseup' || options.type === 'mousemove' || options.type === 'mouseout' || options.type === 'mouseover') {
				options.bubbles = options.bubbles ?? true;
				options.cancelable = options.cancelable ?? true;
				options.composed = options.composed ?? true;
			}
			if (options.type === 'contextmenu') {
				options.detail = options.detail ?? 1;
			}
			if (options.type === 'dblclick') {
				options.detail = options.detail ?? 2;
			}

		} else if (events.pointer.indexOf(options.type) > -1) {
			// TODO: pointercancel is unknown
			if (options.type === 'click' || options.type === 'contextmenu' || options.type === 'pointerdown' || options.type === 'pointerup' || options.type === 'pointermove' || options.type === 'pointerout' || options.type === 'pointerover') {
				options.bubbles = options.bubbles ?? true;
				options.cancelable = options.cancelable ?? true;
				options.composed = options.composed ?? true;
			}

		} else if (events.touch.indexOf(options.type) > -1) {
			// TODO: touchcancel is unknown
			options.bubbles = options.bubbles ?? true;
			options.composed = options.composed ?? true;
			if (options.type === 'touchstart' || options.type === 'touchmove' || options.type === 'touchend') {
				options.cancelable = options.cancelable ?? true;
			}

		} else if (events.wheel.indexOf(options.type) > -1) {
			options.bubbles = options.bubbles ?? true;
			options.cancelable = options.cancelable ?? true;
			options.composed = options.composed ?? true;

		} else if (events.drag.indexOf(options.type) > -1) {
			// TODO: drop is unknown
			options.bubbles = options.bubbles ?? true;
			options.composed = options.composed ?? true;
			if (options.type === 'drag' || options.type === 'dragenter' || options.type === 'dragover' || options.type === 'dragstart') {
				options.cancelable = options.cancelable ?? true;
			}
		}

		const EventOptions = {
			bubbles: options.bubbles ?? false,
			cancelable: options.cancelable ?? false,
			composed: options.composed ?? false
		};
		const UIEventOptions = {
			view: options.view ?? window ?? null,
			detail: options.detail ?? 0,
			...EventOptions
		};
		const EventModifierOptions = {
			ctrlKey: options.ctrlKey ?? false,
			shiftKey: options.shiftKey ?? false,
			altKey: options.altKey ?? false,
			metaKey: options.metaKey ?? false,
		};
		const MouseEventOptions = {
			screenX: options.screenX ?? 0,
			screenY: options.screenY ?? 0,
			clientX: options.clientX ?? 0,
			clientY: options.clientY ?? 0,
			button: options.button ?? 0,
			buttons: options.buttons ?? 0,
			relatedTarget: options.relatedTarget ?? null,
			...EventModifierOptions,
			...UIEventOptions
		};

		let evt;
		// Keyboard events
		if (events.key.indexOf(options.type) > -1) {
			// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/KeyboardEvent
			evt = new KeyboardEvent(options.type, {
				key: options.key ?? '',
				code : options.code ?? '',
				location: options.location ?? 0,
				repeat: options.repeat ?? false,
				isComposing: options.isComposing ?? false,
				...EventModifierOptions,
				...UIEventOptions,
				bubbles: options.bubbles ?? true,
				cancelable: options.cancelable ?? true,
				composed: options.composed ?? true
			});

		// Mouse events
		} else if (events.mouse.indexOf(options.type) > -1) {
			// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent
			evt = new MouseEvent(options.type, {
				...MouseEventOptions,
				bubbles: options.bubbles ?? true,
				cancelable: options.cancelable ?? true,
				composed: options.composed ?? true
			});

		// Pointer Events
		} else if (events.pointer.indexOf(options.type) > -1) {
			// https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent
			evt = new PointerEvent(options.type, {
				pointerId: options.pointerId ?? 0,
				width: options.width ?? 1,
				height: options.height ?? 1,
				pressure: options.pressure ?? 0,
				tangentialPressure: options.tangentialPressure ?? 0,
				tiltX: options.tiltX ?? 0,
				tiltY: options.tiltY ?? 0,
				twist: options.twist ?? 0,
				pointerType: options.pointerType ?? '',
				isPrimary: options.isPrimary ?? false,
				...MouseEventOptions,
				bubbles: options.bubbles ?? true,
				cancelable: options.cancelable ?? true,
				composed: options.composed ?? true
			});

		// Touch Events
		} else if (events.touch.indexOf(options.type) > -1) {

			if (typeof window.TouchEvent !== 'undefined') {
				// https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent
				evt = new TouchEvent(options.type, {
					changedTouches: h._convertToTouch(options.changedTouches) ?? [],
					targetTouches: h._convertToTouch(options.targetTouches) ?? [],
					touches: h._convertToTouch(options.touches) ?? [],
					...EventModifierOptions,
					...UIEventOptions
				});
			} else {
				// https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/UIEvent
				evt = new UIEvent(options.type, {
					changedTouches: options.changedTouches ?? [],
					targetTouches: options.targetTouches ?? [],
					touches: options.touches ?? [],
					...EventModifierOptions,
					...UIEventOptions
				});
			}

		// Wheel Events
		} else if (events.wheel.indexOf(options.type) > -1) {
			// https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/WheelEvent
			evt = new WheelEvent(options.type, {
				deltaX: options.deltaX ?? 0.0,
				deltaY: options.deltaY ?? 0.0,
				deltaZ: options.deltaZ ?? 0.0,
				deltaMode: options.deltaMode ?? h.DOM_DELTA_PIXEL,
				...MouseEventOptions
			});

		// Drag Events
		} else if (events.drag.indexOf(options.type) > -1) {
			// https://developer.mozilla.org/en-US/docs/Web/API/DragEvent/DragEvent
			evt = new DragEvent(options.type, {
				dragEventInit: options.dragEventInit ?? null,
				...MouseEventOptions
			});


		// Focus Events
		} else if (events.focus.indexOf(options.type) > -1) {
			// https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/FocusEvent

			const FocusEventOptions = {
				relatedTarget: options.relatedTarget ?? null,
				...UIEventOptions,
			};

			evt = new FocusEvent(options.type, FocusEventOptions);

		} else {
			throw new Error(`Event type '${options.type}' not available! `);
		}

		return evt;
	};

	h.dispatchEvent = function (element, evt) {
		element.dispatchEvent(evt);
	};

	h.once = function (element, options) {
		h.dispatchEvent(element, h.makeEvent(options || {}));
	};

	h.at = function (type, x, y, props) {
		this.once(document.elementFromPoint(x, y), {
			type,
			clientX: x,
			clientY: y,
			screenX: x,
			screenY: y,
			which: 1,
			button: 0,
		 ...props});
	};

	for (const type in events) {
		if (!Object.hasOwn(events, type)) { continue; }
		const shortcuts = events[type];
		for (let i = 0; i < shortcuts.length; i++) {
			const evType = shortcuts[i];
			h[evType] = (element, options) => {
				h.once(element, {...options, type: evType});
			};
		}
	}

	h.dblclick = function (element, options) {
		h.once(element, {...options, type: 'dblclick', detail: 2});
	};


	h._convertToTouch = (array) => {
		if (!array) {
			return [];
		}

		const TouchList = [];
		for (const obj of array) {

			if (!obj.target) {
				throw new Error(`A 'target' for the Touch-Object ${JSON.stringify(obj)} is required!`);
			}

			// https://developer.mozilla.org/en-US/docs/Web/API/Touch/Touch
			const touch = new Touch({
				identifier: obj.identifier ||  Math.round(Math.random() * 1000),
				target: obj.target,
				screenX: obj.screenX || 0,
				screenY: obj.screenY || 0,
				clientX: obj.clientX || 0,
				clientY: obj.clientY || 0,
				pageX: obj.pageX || 0,
				pageY: obj.pageY || 0,
				radiusX: obj.radiusX || 0,
				radiusY: obj.radiusY || 0,
				rotationAngle: obj.rotationAngle || 0,
				force: obj.force || 0,
			});

			TouchList.push(touch);
		}
		return TouchList;
	};


	if (typeof window !== 'undefined') { window.happen = h; }
	if (typeof module !== 'undefined') { module.exports = h; }

})(this);
