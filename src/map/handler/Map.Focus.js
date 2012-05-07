/*
 * L.Handler.Focus is used internally by L.Map to make the map focusable.
 */

L.Map.mergeOptions({
    focus: true
});

L.Map.Focus = L.Handler.extend({
	_focused: false,

	initialize: function (map) {
		this._map = map;
		this._container = map._container;

		this._makeFocusable();
		this._focused = false;
	},

	addHooks: function () {
		var container = this._container;
		L.DomEvent
			.addListener(container, 'focus', this.onFocus, this)
			.addListener(container, 'blur', this.onBlur, this)
			.addListener(container, 'click', this.onClick, this);
	},

	removeHooks: function () {
		var container = this._container;
		L.DomEvent
			.removeListener(container, 'focus', this.onFocus, this)
			.removeListener(container, 'blur', this.onBlur, this)
			.removeListener(container, 'click', this.onClick, this);
	},

	onClick: function (e) {
		if (!this._focused) {
			this._container.focus();
		}
	},

	onFocus: function (e) {
		this._focused = true;
		this._map.fire('focus');
	},

	onBlur: function (e) {
		this._focused = false;
		this._map.fire('blur');
	},

	_makeFocusable: function () {
		var map = this._map, container = this._container;

		
		// While we want the map to be "focusable", we don't want the map to
		// appear focused (i.e. no outline etc...)
		L.DomUtil.addClass(container, 'leaflet-container-nofocus');

		// Allows user to tab to the container.
		//  -1 => User can focus container by clicks, but not tabs
		//   0 => User can focus container by clicks or tabs. Order is based on
		//        DOM source order.
		//   N => User can focus container by clicks or tabs. N = tab order.
		container.tabIndex = "0";
	}
});

L.Map.addInitHook('addHandler', 'focus', L.Map.Focus);
