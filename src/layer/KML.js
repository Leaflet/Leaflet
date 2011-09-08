/*global L: true */

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
		var el = xml.getElementsByTagName("Folder");
		var layers = [];
		for (var i = 0; i < el.length; i++) {
			var l = this.parseFolder(xml, style);
			if (l) layers.push(l);
		}
		el = xml.getElementsByTagName('Placemark');
		for (var i = 0; i < el.length; i++) {
			if (!this._check_folder(el[i])) continue;
			var l = this.parsePlacemark(el[i], xml, style);
			if (l) layers.push(l);
		}
		return layers;
	},

	_check_folder: function(e, folder) {
		e = e.parentElement;
		while (e && e.tagName != "Folder" && e != folder)
			e = e.parentElement;
		return e || e == folder;
	},

	parseStyle: function(xml) {
		var style = {};
		var sl = xml.getElementsByTagName("Style");

		//for (var i = 0; i < sl.length; i++) {
		var attributes = {color:true, width:true};

		function _parse(xml) {
			var options = {};
			for (var i = 0; i < xml.childNodes.length; i++) {
				var e = xml.childNodes[i];
				var key = e.tagName;
				if (!attributes[key]) continue;
				var value = e.childNodes[0].nodeValue;
				if (key == 'color') {
					options.opacity = parseInt(value.substring(0,2),16)/255.0;
					options.color = "#" + value.substring(2,8);
				} else if (key == 'width')
					options.weight = value;
			}
			return options;
		}

		for (var i = 0; i < sl.length; i++) {
			var e = sl[i], el;
			var options = {}, poptions = {};
			el = e.getElementsByTagName("LineStyle");
			if (el && el[0]) options = _parse(el[0]);
			el = e.getElementsByTagName("PolyStyle");
			if (el && el[0]) poptions = _parse(el[0]);
			if (poptions.color) options.fillColor = poptions.color;
			if (poptions.opacity) options.fillOpacity = poptions.opacity;
			style['#' + e.getAttribute('id')] = options;
		}
		return style;
	},

	parseFolder: function(xml, style) {
		var el, layers = [];
		el = xml.getElementsByTagName('Folder');
		for (var i = 0; i < el.length; i++) {
			if (!this._check_folder(el[i], xml)) continue;
			var l = this.parseFolder(el[i], style);
			if (l) layers.push(l);
		}
		el = xml.getElementsByTagName('Placemark');
		for (var i = 0; i < el.length; i++) {
			if (!this._check_folder(el[i], xml)) continue;
			var l = this.parsePlacemark(el[i], xml, style);
			if (l) layers.push(l);
		}
		if (!layers.length) return;
		if (layers.length == 1) return layers[0];
		return new L.FeatureGroup(layers);
	},

	parsePlacemark: function(place, xml, style) {
		var i, el, options = {};
		el = place.getElementsByTagName('styleUrl');
		for (i = 0; i < el.length; i++) {
			var url = el[i].childNodes[0].nodeValue;
			for (var a in style[url])
				options[a] = style[url][a];
		}
		var layer = null;

		el = place.getElementsByTagName('LineString');
		if (el && el[0]) layer = this.parseLine(el[0], xml, options);

		if (!layer) {
			el = place.getElementsByTagName('Polygon');
			if (el && el[0]) layer = this.parsePolygon(el[0], xml, options);
		}

		if (!layer) {
			el = place.getElementsByTagName('Point');
			if (el && el[0]) layer = this.parsePoint(el[0], xml, options);
		}

		if (!layer) return;

		var name, descr="";
		el = place.getElementsByTagName('name');
		if (el.length) name = el[0].childNodes[0].nodeValue;
		el = place.getElementsByTagName('description');
		for (i = 0; i < el.length; i++) {
			for (var j = 0; j < el[i].childNodes.length; j++)
				descr = descr + el[i].childNodes[j].nodeValue;
		}

		if (name)
			layer.bindPopup("<h2>" + name + "</h2>" + descr);

		return layer;
	},

	parseCoords: function(xml) {
		var el = xml.getElementsByTagName('coordinates');
		var coords = [];
		var text = el[0].childNodes[0].nodeValue.split(' ');
		for (var i = 0; i < text.length; i++) {
			var ll = text[i].split(',');
			if (ll.length < 2) continue;
			coords.push(new L.LatLng(ll[1], ll[0]));
		}
		return coords;
	},

	parseLine: function(line, xml, options) {
		var coords = this.parseCoords(line);
		if (!coords.length) return;
		return new L.Polyline(coords, options);
	},

	parsePoint: function(line, xml, options) {
		var el = line.getElementsByTagName('coordinates');
		if (!el.length) return;
		var ll = el[0].childNodes[0].nodeValue.split(',');
		return new L.Marker(new L.LatLng(ll[1], ll[0]), options);
	},

	parsePolygon: function(line, xml, options) {
		var el, polys = [], inner = [];
		el = line.getElementsByTagName('outerBoundaryIs');
		for (var i = 0; i < el.length; i++) {
			var coords = this.parseCoords(el[i]);
			if (coords) polys.push(coords);
		}
		el = line.getElementsByTagName('innerBoundaryIs');
		for (var i = 0; i < el.length; i++) {
			var coords = this.parseCoords(el[i]);
			if (coords) inner.push(coords);
		}
		if (!polys.length) return;
		if (options.fillColor) options.fill = true;
		if (polys.length == 1) return new L.Polygon(polys.concat(inner), options);
		return new L.MoltiPolygon(polys, options);
	}

});
