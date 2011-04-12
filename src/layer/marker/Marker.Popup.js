/*
 * Popup extension to L.Marker, adding openPopup & bindPopup methods. 
 */

L.Marker.include({
	openPopup: function() {
		this._popup.setLatLng(this._latlng);
		this._map.openPopup(this._popup);
		
		return this;
	},
	
	closePopup: function() {
		if (this._popup) {
			this._popup._close();
		}
	},
	
	bindPopup: function(content, options) {
		options = L.Util.extend({offset: this.options.icon.popupAnchor}, options);
		
		this._popup = new L.Popup(options);
		this._popup.setContent(content);
		this.on('click', this.openPopup, this);
		
		return this;
	}
});