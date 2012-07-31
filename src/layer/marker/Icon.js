L.Icon = L.Class.extend({
	options: {
		/*
		iconUrl: (String) (required)
		iconSize: (Point) (can be set through CSS)
		iconAnchor: (Point) (centered by default if size is specified, can be set in CSS with negative margins)
		popupAnchor: (Point) (if not specified, popup opens in the anchor point)
		shadowUrl: (Point) (no shadow by default)
		shadowSize: (Point)
		shadowAnchor: (Point)
		*/
		className: ''
	},

	initialize: function (options) {
		L.Util.setOptions(this, options);
	},

	/* The marker received is used for a callback that updates the marker when
	 * the Icon image loads and has its style set */
	createIcon: function (marker) {
		return this._createIcon('icon', marker);
	},

	/* The marker received is used for a callback that updates the marker when
	 * the Icon image loads and has its style set */
	createShadow: function (marker) {
		return this._createIcon('shadow', marker);
	},

	/* The marker received is used for a callback that updates the marker when
	 * the Icon image loads and has its style set */
	_createIcon: function (name, marker) {
		var src = this._getIconUrl(name);

		if (!src) {
			if (name === 'icon') {
				throw new Error("iconUrl not set in Icon options (see the docs).");
			}
			return null;
		}

		var img;
		/* If size is defined, use defined value. Otherwise, set size equal to
		 * the actual size of the imageUrl upon image load */
		if (this.options[name + 'Size']) {
			img = this._createImg(src, function () { return; });
		}
		/* There is no default size set, so when the image is loaded, we will
		 * set the size to be that of the image loaded. */
		else {
			/* Create local reference to this to avoid 'this' name clashes */
			var me = this;
			/* Creates the image from the src provided. When the image loads, it
			 * calls a function that gets the native size, sets icon styles that
			 * are undefined, and then tells the marker to update itself. When
			 * the marker updates itself, this ensures that the map shows the
			 * marker icon in the correct position with the correct style. */
			img = this._createImg(src, function () {
				var size = new L.Point(this.width, this.height);
				me._styleHelper(this, name, size, me.options);
				marker.update();
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

		if (!anchor) {
			anchor = new L.Point(Math.round(size.x / 2), size.y);
		}
		if (name === 'icon' && !popupAnchor) {
			popupAnchor = new L.Point(0, -Math.round((size.y * 8) / 10));
		}
		if (name === 'shadow') {
			anchor = L.point(options.shadowAnchor || anchor);
		}

		/* Must append, because this is set upon Icon load, which could happen
		 * after appending to className elsewhere. We don't want to overwrite
		 * other class names. */
		img.className += ' leaflet-marker-' + name + ' ' + options.className + ' leaflet-zoom-animated';
		img.style.width	 = size.x + 'px';
		img.style.height = size.y + 'px';

		// By now, anchor has been defined
		img.style.marginLeft = (-anchor.x) + 'px';
		img.style.marginTop	 = (-anchor.y) + 'px';

		img.style.visibility = 'visible';
	},

	_setIconStyles: function (img, name) {
		var size;
		/* Size is defined, so we can set styles without waiting for image to load. */
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
			el.style.visibility = 'hidden';
			/* Set the onload method before setting source, since IE will have
			 * already loaded the image and cached it if src is set first. This
			 * causes the "load" event to not be fired. */
			el.onload = function () {
				// TODO: use L.Util.bind
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

L.icon = function (options) {
	return new L.Icon(options);
};
