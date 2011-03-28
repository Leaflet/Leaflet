/*
 * L.Handler classes are used internally to inject interaction features to the Map class.
 */

L.Handler = L.Class.extend({
	initialize: function(map) {
		this._map = map;
	},
	
	enabled: function() {
		return !!this._enabled;
	}	
});