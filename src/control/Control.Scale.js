L.Control.Scale = L.Control.extend({
	options: {
		position: 'bottomleft',
		maxWidth: 100,
		metric: true,
		imperial: true,
		nautical: false,
		updateWhenIdle: false
	},

	onAdd: function (map) {
		this._map = map;

		var className = 'leaflet-control-scale',
		    container = L.DomUtil.create('div', className),
		    options = this.options;

		if (options.metric) {
			this._mScale = L.DomUtil.create('div', className + '-line', container);
		}
		if (options.imperial) {
			this._iScale = L.DomUtil.create('div', className + '-line', container);
		}
		if (options.nautical) {
			this._nScale = L.DomUtil.create('div', className + '-line', container);
		}

		map.on(options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
		this._update();

		return container;
	},

	onRemove: function (map) {
		map.off(this.options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
	},

	_update: function () {
		var bounds = this._map.getBounds(),
		    centerLat = bounds.getCenter().lat,
		    halfWorldMeters = new L.LatLng(centerLat, 0).distanceTo(new L.LatLng(centerLat, 180)),
		    dist = halfWorldMeters * (bounds.getNorthEast().lng - bounds.getSouthWest().lng) / 180,

		    size = this._map.getSize(),
		    options = this.options,
		    maxMeters = 0;

		if (size.x > 0) {
			maxMeters = dist * (options.maxWidth / size.x);
		}

		if (options.metric && maxMeters) {
			this._updateMetric(maxMeters);
		}

		if (options.imperial && maxMeters) {
			this._updateImperial(maxMeters);
		}

		if (options.nautical && maxMeters) {
			this._updateNautical(maxMeters);
		}
	},

	_updateMetric: function (maxMeters) {
		var meters = this._getRoundNum(maxMeters);

		this._mScale.style.width = this._getScaleWidth(meters / maxMeters) + 'px';
		this._mScale.innerHTML = meters < 1000 ? meters + ' m' : (meters / 1000) + ' km';
	},

	_updateImperial: function (maxMeters) {
		var maxFeet = maxMeters * 3.2808399,
			scale = this._iScale,
			maxMiles, miles, feet;

		if (maxFeet > 5280) {
			maxMiles = maxFeet / 5280;
			miles = this._getRoundNum(maxMiles);

			scale.style.width = this._getScaleWidth(miles / maxMiles) + 'px';
			scale.innerHTML = miles + ' mi';

		} else {
			feet = this._getRoundNum(maxFeet);

			scale.style.width = this._getScaleWidth(feet / maxFeet) + 'px';
			scale.innerHTML = feet + ' ft';
		}
	},

	_updateNautical: function (maxMeters) {
		var maxNauticalMiles = maxMeters / 1852,
			scale = this._nScale,
			nauticalMiles;

		if (maxNauticalMiles >= 1) {
			nauticalMiles = this._getRoundNum(maxNauticalMiles);
		} else {
			nauticalMiles = this._getRoundNumDecimal(maxNauticalMiles);
		}

		scale.style.width = this._getScaleWidth(nauticalMiles / maxNauticalMiles) + 'px';
		scale.innerHTML = nauticalMiles + ' nm';
	},

	_getScaleWidth: function (ratio) {
		return Math.round(this.options.maxWidth * ratio) - 10;
	},

	_getRoundNum: function (num) {
		var pow10 = Math.pow(10, (Math.floor(num) + '').length - 1),
		    d = num / pow10;

		d = d >= 10 ? 10 : d >= 5 ? 5 : d >= 3 ? 3 : d >= 2 ? 2 : 1;

		return pow10 * d;
	},

	_getRoundNumDecimal: function (num) {
		if(num > 0.1) {
			return Math.round(num * 10) / 10;
		} else {
			return Math.round(num * 100) / 100;
		}
	}
});

L.control.scale = function (options) {
	return new L.Control.Scale(options);
};