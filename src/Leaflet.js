
(function (root) {
	root.L = {
		VERSION: '0.3',

		ROOT_URL: root.L_ROOT_URL || (function () {
			var scripts = document.getElementsByTagName('script'),
				leafletRe = /\/?leaflet[\-\._]?([\w\-\._]*)\.js\??/;

			var i, len, src, matches;

			for (i = 0, len = scripts.length; i < len; i++) {
				src = scripts[i].src;
				matches = src.match(leafletRe);

				if (matches) {
					if (matches[1] === 'include') {
						return '../../dist/';
					}
					return src.split(leafletRe)[0] + '/';
				}
			}
			return '';
		}()),

		noConflict: function () {
			root.L = this._originalL;
			return this;
		},

		_originalL: root.L
	};
}(this));
