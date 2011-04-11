/*
 * L.Handler classes are used internally to inject interaction features to the Map class.
 */

L.Handler = L.Class.extend({
	initialize: function(handlee) {
		// not sure this is the best name for this property
		this._handlee = handlee;
		// this ensures map handles looking for ._map can still find it
		// I would remove this and change them but with out full test coverage
		// am worried I will break something
		this._map = handlee;
	},
	
	enabled: function() {
		return !!this._enabled;
	}	
});