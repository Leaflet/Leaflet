L.Handler = L.Class.extend({
	initialize: function(map, enabled) {
		this._map = map;
		if (enabled) { this.enable(); }
	}
});