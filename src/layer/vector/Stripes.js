/*
 * L.Stripes is an implementation of L.Pattern to make it simple to use a stripe fill pattern.
 */

L.Stripes = L.Pattern.extend({

	options: {
		weight: 4,
		spaceWeight: 4,
		color: '#000000',
		spaceColor: '#ffffff',
		opacity: 1.0,
		spaceOpacity: 0.0,
		angle: 0
	},

	_addPaths: function () {
		this._stripe = new L.PatternPath({
			stroke: true,
			weight: this.options.weight,
			color: this.options.color,
			opacity: this.options.opacity
		});

		this._space = new L.PatternPath({
			stroke: true,
			weight: this.options.spaceWeight,
			color: this.options.spaceColor,
			opacity: this.options.spaceOpacity
		});

		this.addPath(this._stripe);
		this.addPath(this._space);

		this._renderer._updateStripes(this);
	},

	setStyle: L.Pattern.prototype.setStyle
});

L.stripes = function (options) {
	return new L.Stripes(options);
};