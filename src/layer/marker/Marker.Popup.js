/*
 * Popup extension to L.Marker, adding popup-related methods.
 */

L.Marker.include({
	_getPopupAnchor: function () {
		return this.options.icon.options.popupAnchor || [0, 0];
	}
});
