/*
 * L.TileLayer.CloudMade is an extention of L.TileLayer to make adding a cloudmade tile layer a little easier, including double resolution tiles for retina displays.
 */
 
L.TileLayer.CloudMade = L.TileLayer.extend({
	
	options: {
		url: 'http://{s}.tile.cloudmade.com/{key}/{theme}{@2x}/{size}/{z}/{x}/{y}.png',
		attribution: 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
		maxZoom: 18,
		theme: 997,
		tileSize: 256,
		retinaString: "@2x",
		_retinaString: "",
		supportRetina: true,
		forceRetina: false,
		retina: false
	},
	
	initialize: function(api_key, options) {
	
		L.Util.setOptions(this, options);
		
		var originalSize = this.options.tileSize;
		
		if ((this.options.forceRetina || window.devicePixelRatio == 2) && this.options.supportRetina) {
			this.options.retina = true;
			this.options.tileSize = originalSize/2;
			this.options._retinaString = this.options.retinaString;
			this.options.zoomOffset = 1;
		}
		
		this._url = this.options.url
				.replace('{key}', api_key)
				.replace('{theme}',this.options.theme)
				.replace('{size}',originalSize)
				.replace('{@2x}',this.options._retinaString);
		
		if (typeof this.options.subdomains == 'string') {
			this.options.subdomains = this.options.subdomains.split('');
		}
		
	}
	
});