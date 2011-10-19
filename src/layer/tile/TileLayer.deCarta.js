L.TileLayer.deCarta = L.TileLayer.extend({
	defaultParams: {
		tileFormat: 'PNG',
		sessionID: new Date().getTime(),
		mapConfig: 'global-decarta',
		dataset: 'navteq-world'
	},
	
	// Taken from deCarta's new mobile JS library
	// check it out at: http://developer.decarta.com/docs/read/Mobile_JS
	llLUT: [
		'89.787438015348100000,360.00000000000000000',
		'85.084059050110410000,180.00000000000000000',
		'66.653475896509040000,90.00000000000000000',
		'41.170427238429790000,45.000000000000000000',
		'22.076741328793200000,22.500000000000000000',
		'11.251819676168665000,11.250000000000000000',
		'5.653589942659626000,5.625000000000000000',
		'2.830287664051185000,2.812500000000000000',
		'1.415581451872543800,1.406250000000000000',
		'0.707845460801532700,0.703125000000000000',
		'0.353929573271679340,0.351562500000000000',
		'0.176965641673330230,0.175781250000000000',
		'0.088482927761462040,0.087890625000000000',
		'0.044241477246363230,0.043945312500000000',
		'0.022120740293895182,0.021972656250000000',
		'0.011060370355776452,0.010986328125000000',
		'0.005530185203987857,0.005493164062500000',
		'0.002765092605263539,0.002746582031250000',
		'0.001382546303032519,0.001373291015625000',
		'0.000691272945568983,0.000686645507812500',
		'0.000345636472797214,0.000343322753906250'
	],

	initialize: function(/*String*/ url, /*Object*/ options) {
		this._url = url.replace(/^(https?:\/\/.*?)\/.*/i, '$1');
		
		this.params = L.Util.extend({}, this.defaultParams);
		this.params.width = this.params.height = this.options.tileSize;
		
		for (var key in options) {
			// all keys that are not TileLayer options go to WMS params
			if (!this.options.hasOwnProperty(key)) {
				this.params[key] = options[key];
			}
		}

		L.Util.setOptions(this, options);
	},
	
	
	getTileUrl: function(/*Point*/ tilePoint, /*Number*/ zoom)/*-> String*/ {
		var tileSize = this.options.tileSize,
			numTilesHalf = 2 << (zoom - 2);
			
		console.log((numTilesHalf - tilePoint.y) - 1);
			
		return this._url + '/openls/image-cache/TILE?'+
		   'LLMIN=0.0,0.0' +
		   '&LLMAX=' + this.llLUT[zoom] +
		   '&CACHEABLE=true' + 
		   '&DS=' + this.params.dataset + 
		   '&WIDTH=' + tileSize + 
		   '&HEIGHT=' + tileSize + 
		   '&CLIENTNAME=' + this.params.clientName +
		   '&SESSIONID=' + this.params.sessionID +
		   '&FORMAT=' + this.params.tileFormat +
		   '&CONFIG=' + this.params.mapConfig +
		   '&N=' + ((numTilesHalf - tilePoint.y) - 1) +
		   '&E=' + (tilePoint.x - numTilesHalf);
	}
});