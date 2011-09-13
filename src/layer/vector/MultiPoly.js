/*
 * Contains L.MultiPolyline and L.MultiPolygon layers. 
 */

(function() {
	function createMulti(klass) {
		return L.FeatureGroup.extend({
			initialize: function(latlngs, options) {
				this._layers = {};
				this._options = options;
				this.setLatLngs(latlngs);
			},

			setStyle: function(style) {
				for (var i in this._layers) {
					if (Object.hasOwnProperty.call(this._layers, i) && this._layers[i].setStyle) {
						this._layers[i].setStyle(style);
					}
				}
			},
			
			setLatLngs: function(latlngs) {
				var i = 0, len = latlngs.length;
				
				this._iterateLayers(function(layer) {
					if (i < len) {
						layer.setLatLngs(latlngs[i++]);
					} else {
						this.removeLayer(layer);
					}
				}, this);
				
				while (i < len) {
					this.addLayer(new klass(latlngs[i++], this._options));
				}
			}
		});
	}

	L.MultiPolyline = createMulti(L.Polyline);
	L.MultiPolygon = createMulti(L.Polygon);
}());
