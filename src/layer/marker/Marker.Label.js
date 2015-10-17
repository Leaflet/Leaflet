/*
 * Label extension to L.Marker, adding label-related methods.
 */

L.Marker.include({
	_getLabelAnchor: function () {
		return this.options.icon.options.labelAnchor || [0, 0];
	}
});
