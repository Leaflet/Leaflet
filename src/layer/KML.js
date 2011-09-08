L.KML = L.FeatureGroup.extend({
	initialize: function(kml, options) {
		L.Util.setOptions(this, options);
		this._kml = kml;
		this._layers = {};
		
		if (kml) {
			this.addKML(kml);
		}
	},
	
	addKML: function(kml) {
		var req = new window.XMLHttpRequest();
		req.open('GET', kml, false);
		req.overrideMimeType('text/xml');
		req.send(null);
		if (req.status != 200) return;
		var layers = L.KML.parseKML(req.responseXML);
		for (var i = 0; i < layers.length; i++)
			this.addLayer(layers[i]);
	}
});

L.Util.extend(L.KML, {
	parseKML: function(xml) {
		var style = this.parseStyle(xml);
		var el = xml.getElementsByTagName("Placemark");
		var layers = [];
		for (var i = 0; i < el.length; i++) {
			var l = this.parsePlacemark(el[i], xml, style);
			if (l) layers.push(l);
		}
		return layers;
	},

	parseStyle: function(xml) {
		var style = {};
		var sl = xml.getElementsByTagName("Style");

		//for (var i = 0; i < sl.length; i++) {
		var attributes = {color:true, width:true};

		for (var i = 0; i < sl.length; i++) {
			var e = sl[i];
			var options = {};
			var ls = e.getElementsByTagName("LineStyle");
			if (!ls.length) continue;
			ls = ls[0];
			for (var c = 0; c < ls.childNodes.length; c++) {
				var ce = ls.childNodes[c];
				var key = ce.tagName;
				if (!attributes[key]) continue;
				var value = ce.childNodes[0].nodeValue;
				if (key == 'color') value = "#" + value.substring(2,8);
				if (key == 'width') key = 'weight';
				options[key] = value;
			}
			style['#' + e.getAttribute('id')] = options;
		}
		return style;
	},

	parsePlacemark: function(place, xml, style) {
		var i, el, options = {};
		el = place.getElementsByTagName('styleUrl');
		for (i = 0; i < el.length; i++) {
			var url = el[i].childNodes[0].nodeValue;
			for (var a in style[url])
				options[a] = style[url][a];
		}
		var layers = [];

		el = place.getElementsByTagName('LineString');
		for (i = 0; i < el.length; i++) {
			var l = this.parseLine(el[i], xml, options);
			if (l) layers.push(l);
		}

		el = place.getElementsByTagName('Point');
		for (i = 0; i < el.length; i++) {
			var l = this.parsePoint(el[i], xml, options);
			if (l) layers.push(l);
		}

		if (!layers.length) return;
		var layer = layers[0];
		if (layers.length > 1) 
			layer = new L.FeatureGroup(layers);

		var name=undefined, descr="";
		el = place.getElementsByTagName('name');
		if (el.length) name = el[0].childNodes[0].nodeValue;
		el = place.getElementsByTagName('description');
		for (i = 0; i < el.length; i++) {
			for (var j = 0; j < el[i].childNodes.length; j++)
				descr = descr + el[i].childNodes[j].nodeValue;
		}

		if (name) {
			layer.bindPopup("<h2>" + name + "</h2>" + descr);
		}
		return layer;
	},

	parseLine: function(line, xml, options) {
		var el = line.getElementsByTagName('coordinates');
		if (!el.length) return;
		var coords = [];
		var text = el[0].childNodes[0].nodeValue.split(' ');
		for (var i = 0; i < text.length; i++) {
			var ll = text[i].split(',');
			if (ll.length < 2) continue;
			coords.push(new L.LatLng(ll[1], ll[0]));
		}
		return new L.Polyline(coords, options);
	},

	parsePoint: function(line, xml, options) {
		var el = line.getElementsByTagName('coordinates');
		if (!el.length) return;
		var ll = el[0].childNodes[0].nodeValue.split(',');
		return new L.Marker(new L.LatLng(ll[1], ll[0]), options);
	}
});
