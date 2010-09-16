/*
 * L.Handler classes are used internally to inject interaction features to the Map class.
 */

L.Handler = L.Class.extend({
	initialize: function(map, enabled) {
		this._map = map;
		if (enabled) { this.enable(); }
	}
});