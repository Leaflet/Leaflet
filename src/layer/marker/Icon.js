L.Icon = L.Class.extend({
	options: {
		/*
		iconUrl: (String) (required)
		iconSize: (Point) (can be set through CSS)
		iconAnchor: (Point) (centered by default if size is specified, can be set in CSS with negative margins)
		popupAnchor: (Point) (if not specified, popup opens in the anchor point)
		shadowUrl: (Point) (no shadow by default)
		shadowSize: (Point)
		*/
		className: ''
	},

	initialize: function (options) {
		L.Util.setOptions(this, options);
	},

	createIcon: function () {
		return this._createIcon('icon');
	},

	createShadow: function () {
		return this._createIcon('shadow');
	},

	_createIcon: function (name) {
		var src = this._getIconUrl(name);

		if (!src) { return null; }

		var img;
		/* If size is defined, use defined value. Otherwise, set size equal to
		 * the actual size of the imageUrl upon image load */
		if (this.options[name + 'Size']) {
			img = this._createImg(src, function () { return; });
		}
		/* There is no default size set, so when the image is loaded, we will
		 * set the size to be that of the image loaded. */
		else {
			/* Create local reference to thisto avoid 'this' name clashes */
			var me = this;
			img = this._createImg(src, function () {
				var size = new L.Point(this.width, this.height);
				me._styleHelper(this, name, size, me.options);
			});
		}

		this._setIconStyles(img, name);
		return img;
	},

	/* Automatically configures other image values based on the size supplied,
	 * given that those properties are not already defined in options. */
	_styleHelper: function (img, name, size, options) {
		var anchor = options.iconAnchor;
		var popupAnchor = options.popupAnchor;

		if (!anchor && size) {
			anchor = new L.Point(Math.round(size.x / 2), size.y);
		}
		if (name === 'icon' && !popupAnchor && size) {
			popupAnchor = new L.Point(0, -Math.round((size.y * 8) / 10));
		}
		if (name === 'shadow' && anchor) {
			if (options.shadowOffset) {
				anchor._add(options.shadowOffset);
			}
			else {
				anchor._add(new L.Point(-8, 0));
			}
		}

		img.className = 'leaflet-marker-' + name + ' ' + options.className + ' leaflet-zoom-animated';
		img.style.width	 = size.x + 'px';
		img.style.height = size.y + 'px';

		if (anchor) {
			img.style.marginLeft = (-anchor.x) + 'px';
			img.style.marginTop	 = (-anchor.y) + 'px';
		}
	},

	_setIconStyles: function (img, name) {
		var size;
		/* Size is defined */
		if (this.options[name + 'Size']) {
			size = this.options[name + 'Size'];
			this._styleHelper(img, name, size, this.options);
		}
		/* Otherwise, size is not defined. The img.onload function will be handle
		 * image property configuration. */
	},

	/**
	 * src: A string for the filepath to load as the image.
	 * loadFunc: a function to be called when the image loads. loadFunc is bound
	 *			 to the scope of the image.
	 */
	_createImg: function (src, loadFunc) {
		var el;

		if (!L.Browser.ie6) {
			el = document.createElement('img');
			/* Set the onload method before setting source, since IE will have
			 * already loaded the image and cached it if src is set first. This
			 * causes the "load" event to not be fired. */
			el.onload = function () {
                loadFunc.apply(el, []);
            };
			el.src = src;
		} else {
			el = document.createElement('div');
			/* TODO: onload support for IE 6 */
			el.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + src + '")';
		}
		return el;
	},

	_getIconUrl: function (name) {
		return this.options[name + 'Url'];
	}
});


// TODO move to a separate file

L.Icon.Default = L.Icon.extend({
	options: {},

	_getIconUrl: function (name) {
		var path = L.Icon.Default.imagePath;
		if (!path) {
			throw new Error("Couldn't autodetect L.Icon.Default.imagePath, set it manually.");
		}

		return path + '/marker-' + name + '.png';
	}
});

L.Icon.Default.imagePath = (function () {
	var scripts = document.getElementsByTagName('script'),
		leafletRe = /\/?leaflet[\-\._]?([\w\-\._]*)\.js\??/;

	var i, len, src, matches;

	for (i = 0, len = scripts.length; i < len; i++) {
		src = scripts[i].src;
		matches = src.match(leafletRe);

		if (matches) {
			return src.split(leafletRe)[0] + '/images';
		}
	}
}());
