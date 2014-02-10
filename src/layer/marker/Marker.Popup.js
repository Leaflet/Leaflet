/*
 * Popup extension to L.Marker, adding popup-related methods.
 */

L.Marker.include({
	bindPopup: function (content, options) {
		var anchor = L.point(this.options.icon.options.popupAnchor || [0, 0])
			.add(L.Popup.prototype.options.offset);

		options = L.extend({offset: anchor}, options);

		return L.Layer.prototype.bindPopup.call(this, content, options);
	},

	_openPopup: L.Layer.prototype.togglePopup
});
