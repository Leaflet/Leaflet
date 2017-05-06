/*global L: true */

L.GPX = L.FeatureGroup.extend({
	initialize: function(gpx, options) {
		L.Util.setOptions(this, options);
		this._gpx = gpx;
		this._layers = {};
		
		if (gpx) {
			this.addGPX(gpx, options, this.options.async);
		}
	},
	
	loadXML: function(url, cb, options, async) {
		if (async == undefined) async = this.options.async;
		if (options == undefined) options = this.options;

		var req = new window.XMLHttpRequest();
		req.open('GET', url, async);
		req.overrideMimeType('text/xml');
		req.onreadystatechange = function() {
			if (req.readyState != 4) return;
			if(req.status == 200) cb(req.responseXML, options);
		};
		req.send(null);
	},

	addGPX: function(url, options, async) {
		var _this = this;
		var cb = function(gpx, options) { _this._addGPX(gpx, options) };
		this.loadXML(url, cb, options, async);
	},

	_addGPX: function(gpx, options) {
		var layers = L.GPX.parseGPX(gpx, options);
		if (layers) this.addLayer(layers);
	}
});

L.Util.extend(L.GPX, {
	parseGPX: function(xml, options) {
		var i, el, layers = [];
		var named = false;

		el = xml.getElementsByTagName('trkseg');
		for (i = 0; i < el.length; i++) {
			var l = this.parse_trkseg(el[i], xml, options);
			if (!l) continue;
			if (this.parse_name(el[i], l)) named = true;
			layers.push(l);
		}

		el = xml.getElementsByTagName('wpt');
		for (i = 0; i < el.length; i++) {
			var l = this.parse_wpt(el[i], xml, options);
			if (!l) continue;
			if (this.parse_name(el[i], l)) named = true;
			layers.push(l);
		}

		if (!layers.length) return;
		var layer = layers[0];
		if (layers.length > 1) 
			layer = new L.FeatureGroup(layers);
		if (!named) this.parse_name(xml, layer);
		return layer;
	},

	parse_name: function(xml, layer) {
		var i, el, name, descr="";
		el = xml.getElementsByTagName('name');
		if (el.length) name = el[0].childNodes[0].nodeValue;
		el = xml.getElementsByTagName('desc');
		for (i = 0; i < el.length; i++) {
			for (var j = 0; j < el[i].childNodes.length; j++)
				descr = descr + el[i].childNodes[j].nodeValue;
		}
		if (!name) return;
		var txt = "<h2>" + name + "</h2>" + descr;
		if (layer) layer.bindPopup(txt);
		return txt;
	},

	parse_trkseg: function(line, xml, options) {
		var el = line.getElementsByTagName('trkpt');
		if (!el.length) return;
		var coords = [];
		for (var i = 0; i < el.length; i++)
			coords.push(new L.LatLng(el[i].getAttribute('lat'),
						el[i].getAttribute('lon')));
		return new L.Polyline(coords, options);
	},

	parse_wpt: function(e, xml, options) {
		return new L.Marker(new L.LatLng(e.getAttribute('lat'),
						e.getAttribute('lon')), options);
	}
});
