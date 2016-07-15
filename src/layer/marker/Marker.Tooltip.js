/*
 * Tooltip extension to L.Marker, adding tooltip-related methods.
 */

L.Marker.include({
	_getTooltipAnchor: function () {
		return this.options.icon.options.tooltipAnchor || [0, 0];
	}
});
