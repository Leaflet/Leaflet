(function() {
	function getFiles() {
		var memo = {},
		    files = [],
		    i, src;

		function addFiles(srcs) {
			for (var j = 0, len = srcs.length; j < len; j++) {
				memo[srcs[j]] = true;
			}
		}

		for (i in deps) {
			addFiles(deps[i].src);
		}

		for (src in memo) {
			files.push(src);
		}

		return files;
	}
	var scripts = getFiles();

	function getSrcUrl() {
		var scripts = document.getElementsByTagName('script');
		for (var i = 0; i < scripts.length; i++) {
			var src = scripts[i].src;
			if (src) {
				var res = src.match(/^(.*)leaflet-include\.js$/);
				if (res) {
					return res[1] + '../src/';
				}
			}
		}
	}

	var path = getSrcUrl();
    for (var i = 0; i < scripts.length; i++) {
		document.writeln("<script src='" + path + scripts[i] + "'></script>");
	}
    document.writeln('<script defer>L.Icon.Default.imagePath = "' + path + '../dist/images";</script>');
})();

function getRandomLatLng(map) {
	var bounds = map.getBounds(),
		southWest = bounds.getSouthWest(),
		northEast = bounds.getNorthEast(),
		lngSpan = northEast.lng - southWest.lng,
		latSpan = northEast.lat - southWest.lat;

	return new L.LatLng(
			southWest.lat + latSpan * Math.random(),
	        southWest.lng + lngSpan * Math.random());
}

function logEvent(e) {
	console.log(e.type);
}
