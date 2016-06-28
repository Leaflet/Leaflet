/*
 * L.Handler.ContainerMutation triggers `invalidateResize` when the map's DOM container mutates.
 */

// @namespace Map
// @section Interaction Options
L.Map.mergeOptions({
	// @option trackContainerMutation: Boolean = false
	// Whether the map uses [mutation observers](https://developer.mozilla.org/docs/Web/API/MutationObserver)
	// to detect changes in its container and trigger `invalidateSize`. Disabled
	// by default due to support not being available in all web browsers.
	trackContainerMutation: false
});

L.Map.ContainerMutation = L.Handler.extend({
	addHooks: function () {
		if (!L.Browser.mutation) {
			return;
		}

		if (!this._observer) {
			this._observer = new MutationObserver(L.Util.bind(this._onMutation, this));
		}

		this._observer.observe(this._map.getContainer(), {
			childList: false,
			attributes: true,
			characterData: false,
			subtree: false,
			attributeFilter: ['style']
		});
	},

	removeHooks: function () {
		if (!L.Browser.mutation) {
			return;
		}
		this._observer.disconnect();
	},

	_onMutation: function () {
		this._map.invalidateSize();
	}
});

// @section Handlers
// @property containerMutation: Handler
// Container mutation handler (disabled unless [`trackContainerMutation`](#map-trackcontainermutation) is set).
L.Map.addInitHook('addHandler', 'trackContainerMutation', L.Map.ContainerMutation);
