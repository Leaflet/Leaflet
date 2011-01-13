L.Icon = L.Class.extend({
	iconUrl: L.ROOT_URL + 'images/marker.png',
	shadowUrl: L.ROOT_URL + 'images/marker-shadow.png',
	
	//iconSize: new L.Point(24, 37),
	//shadowSize: new L.Point(42, 37),
	
	iconAnchor: new L.Point(13, 41),
	popupAnchor: new L.Point(0, -33),
	
	initialize: function(iconUrl) {
		if (iconUrl) {
			this.iconUrl = iconUrl;
		}
	},
	
	createIcon: function() {
		return this._createImg('icon');
	},
	
	createShadow: function() {
		return this._createImg('shadow');
	},
	
	_createImg: function(name) {
		var img = L.DomUtil.create('img', 'leaflet-marker-' + name);
		
		img.src = this[name + 'Url'];
		
		if (this.iconAnchor) {
			img.style.marginLeft = (-this.iconAnchor.x) + 'px';
			img.style.marginTop = (-this.iconAnchor.y) + 'px';
		} else {
			L.DomEvent.addListener(img, 'load', this._setAnchorToCenter);
		}
		
		return img;
	},
	
	_setAnchorToCenter: function() {
		this.style.marginLeft = (-this.width/2) + 'px';
		this.style.marginTop = (-this.height/2) + 'px';
	}
});