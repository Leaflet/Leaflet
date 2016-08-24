/**
 * @class ColorIcon
 * @aka L.ColorIcon
 * @inherits Icon
 *
 * Represents a lightweight embedded SVG icon for markers with variable color.
 *
 * The icon is implemented using `data:` URL instead of `iconUrl` and `shadowUrl`,
 * therefore these two options do not work with ColorIcon.
 *
 * This icon does not use any external images.
 *
 * @example
 * ```js
 * var myIcon = L.colorIcon({ color: "#baf" });
 *
 * L.marker([50, 14], { icon: myIcon }).addTo(map);
 * ```
 *
 */
L.ColorIcon = L.Icon.extend({
	options: {
		color: '#3388cc',
		iconAnchor: [12, 41],
		iconSize: [25, 41],
		popupAnchor: [1, -36],
		shadowAnchor: [12,41],
		shadowSize: [41,41],
		tooltipAnchor: [16, -28],
	},

	createIcon: function (oldIcon) {
		var color = this.options.color;
		var src = ('data:image/svg+xml;utf-8,'
			+ '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
			+ '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="25" height="41">'
			+ '<path style="fill:' + color + ';stroke:rgba(0,0,0,0.4);stroke-width:1.1;stroke-linecap:round"'
				+ ' d="m 12.544,0.93645 c -6.573,0 -12.044,5.691 -12.044,11.866 0,2.778 1.564,6.308 2.694,8.746'
				+ ' l 9.306,17.872 9.262,-17.872 c 1.13,-2.438 2.738,-5.791 2.738,-8.746 0,-6.175 -5.383,-11.866 -11.956,-11.866'
				+ ' z m 0,7.155 c 2.584,0.017 4.679,2.122 4.679,4.71 0,2.588 -2.095,4.663 -4.679,4.679 -2.584,-0.017 -4.679,-2.09'
				+ ' -4.679,-4.679 0,-2.588 2.095,-4.693 4.679,-4.71 z" />'
			+ '<path style="fill:none;stroke:#ffffff;stroke-width:1.1;stroke-linecap:round;stroke-opacity:0.2"'
				+ ' d="m 12.531,2.04345 c -5.944,0 -10.938,5.219 -10.938,10.75 0,2.359 1.443,5.832 2.563,8.25'
				+ ' l 0.031,0.031 8.313,15.969 8.25,-15.969 0.031,-0.031 c 1.135,-2.448 2.625,-5.706 2.625,-8.25 0,-5.538'
				+ ' -4.931,-10.75 -10.875,-10.75 z m 0,4.969 c 3.168,0.021 5.781,2.601 5.781,5.781 0,3.18 -2.613,5.761'
				+ ' -5.781,5.781 -3.168,-0.02 -5.75,-2.61 -5.75,-5.781 0,-3.172 2.582,-5.761 5.75,-5.781 z" />'
			+ '</svg>');

		var img = this._createImg(src, oldIcon && oldIcon.tagName === 'IMG' ? oldIcon : null);
		this._setIconStyles(img, 'icon');
		return img;
	},

	createShadow: function (oldIcon) {
		var src = 'data:image/png;base64,'
			+ 'iVBORw0KGgoAAAANSUhEUgAAACkAAAApCAQAAAACach9AAACMUlEQVR4Ae3ShY7jQBAE0Aoz/f9/'
			+ 'HTMzhg1zrdKUrJbdx+Kd2nD8VNudfsL/Th///dyQN2TH6f3y/BGpC379rV+S+qqetBOxImNQXL8J'
			+ 'CAr2V4iMQXHGNJxeCfZXhSRBcQMfvkOWUdtfzlLgAENmZDcmo2TVmt8OSM2eXxBp3DjHSMFutqS7'
			+ 'SbmemzBiR+xpKCNUIRkdkkYxhAkyGoBvyQFEJEefwSmmvBfJuJ6aKqKWnAkvGZOaZXTUgFqYULWN'
			+ 'SHUckZuR1HIIimUExutRxwzOLROIG4vKmCKQt364mIlhSyzAf1m9lHZHJZrlAOMMztRRiKimp/rp'
			+ 'dJDc9Awry5xTZCte7FHtuS8wJgeYGrex28xNTd086Dik7vUMscQOa8y4DoGtCCSkAKlNwpgNtphj'
			+ 'rC6MIHUkR6YWxxs6Sc5xqn222mmCRFzIt8lEdKx+ikCtg91qS2WpwVfBelJCiQJwvzixfI9cxZQW'
			+ 'giSJelKnwBElKYtDOb2MFbhmUigbReQBV0Cg4+qMXSxXSyGUn4UbF8l+7qdSGnTC0XLCmahIgUHL'
			+ 'hLOhpVCtw4CzYXvLQWQbJNmxoCsOKAxSgBJno75avolkRw8iIAFcsdc02e9iyCd8tHwmeSSoKTow'
			+ 'IgvscSGZUOA7PuCN5b2BX9mQM7S0wYhMNU74zgsPBj3HU7wguAfnxxjFQGBE6pwN+GjME9zHY7zG'
			+ 'p8wVxMShYX9NXvEWD3HbwJf4giO4CFIQxXScH1/TM+04kkBiAAAAAElFTkSuQmCC';

		var img = this._createImg(src, oldIcon && oldIcon.tagName === 'IMG' ? oldIcon : null);
		this._setIconStyles(img, 'shadow');
		return img;
	},

});

// @factory L.colorIcon(options: ColorIcon options)
// Creates a `ColorIcon` instance with the given options.
L.colorIcon = function (options) {
	return new L.ColorIcon(options);
};

