/*
 * Contains L.MultiPolyline and L.MultiPolygon layers. 
 */

(function() {
	function createMulti(klass) {
		return L.FeatureGroup.extend({
			initialize: function(latlngs, options) {
				this._layers = {};
				for (var i = 0, len = latlngs.length; i < len; i++) {
					this.addLayer(new klass(latlngs[i], options));
				}
			},

			setStyle: function(style) {
				for (var i in this._layers) {
					if (this._layers.hasOwnProperty(i) && this._layers[i].setStyle) {
						this._layers[i].setStyle(style);
					}
				}
			}
		});
	}

	L.MultiPolyline = createMulti(L.Polyline);
	L.MultiPolygon = createMulti(L.Polygon);
}());
