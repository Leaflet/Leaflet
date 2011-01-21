/*
 * Popup extension to L.Marker, adding openPopup & bindPopup methods. 
 */

L.Marker.include({
	openPopup: function() {
		this._map.closePopup();
		if (this._popup) {
			this._map.openPopup(this._popup);
		}
		return this;
	},
	
	bindPopup: function(content, options) {
		options = L.Util.extend({offset: this.options.icon.popupAnchor}, options);
		
		this._popup = new L.Popup(this._latlng, content, options);
		this.on('click', this.openPopup, this);
		
		return this;
	}
});