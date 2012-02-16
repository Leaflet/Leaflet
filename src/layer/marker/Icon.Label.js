L.Icon.Label = L.Icon.extend({
	//user specified css class
	iconLabelClass: '',
	//label's text component, if this is null the element will not be created
	labelText: null,
	
	//This is now the top left position of the icon within the wrapper.
	//If the label height is greater than the icon you will need to set the y value. 
	//y = (label height - icon height) / 2
	iconAnchor: new L.Point(0, 0),
	
	//This is the top left position of the label within the wrapper. By default it will display at the right 
	//middle position of the default icon. x = width of icon + padding
	//If the icon height is greater than the label height you will need to set the y value. 
	//y = (icon height - label height) / 2
	labelAnchor: new L.Point(29, 8),
	
	//This is the position of the wrapper div. Use this to position icon + label relative to the Lat/Lng.
	//By default the point of the default icon is anchor
	wrapperAnchor: new L.Point(13, 41),

	initialize: function (labelText, iconUrl) {
		L.Icon.prototype.initialize.call(this, iconUrl);
		if (labelText) {
			this.labelText = labelText;
		}
	},

	createIcon: function () {
		return this._createLabel(L.Icon.prototype._createIcon.call(this, 'icon'));
	},
	
	createShadow: function() {
		var shadow = L.Icon.prototype._createIcon.call(this, 'shadow');
		//need to reposition the shadow
		if(shadow) {
			shadow.style.marginLeft = (-this.wrapperAnchor.x) + 'px';
			shadow.style.marginTop = (-this.wrapperAnchor.y) + 'px';
		}
		return shadow;
	},

	_createLabel: function (img) {
		if (!this.labelText)
			return img;

		var wrapper = document.createElement('div'),
		    label = document.createElement('span');

		label.className = 'leaflet-marker-iconlabel ' + this.iconLabelClass;

		label.innerHTML = this.labelText;

		//set up label's styles
		label.style.marginLeft = this.labelAnchor.x + 'px';
		label.style.marginTop = this.labelAnchor.y + 'px';
		
		//set up wrapper anchor
		wrapper.style.marginLeft = (-this.wrapperAnchor.x) + 'px';
		wrapper.style.marginTop = (-this.wrapperAnchor.y) + 'px';

		wrapper.className = 'leaflet-marker-icon-wrapper';
		
		//reset icons margins (as super makes them -ve)
		img.style.marginLeft = this.iconAnchor.x + 'px';
		img.style.marginTop = this.iconAnchor.y + 'px';
		
		wrapper.appendChild(img);
		wrapper.appendChild(label);

		return wrapper;
	}
});