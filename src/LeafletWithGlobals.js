import * as L from './Leaflet.js';
export * from './Leaflet.js';

// register mixins
L.AttributionControl.register();
L.Control.register();
L.DivOverlay.register();
L.Layer.register();
L.MapBoxZoom.register();
L.MapDoubleClickZoom.register();
L.MapDrag.register();
L.MapKeyboard.register();
L.MapPinchZoom.register();
L.MapScrollWheelZoom.register();
L.MapTapHold.register();
L.Popup.register();
L.Tooltip.register();
L.ZoomControl.register();

export default L;

const oldL = getGlobalObject().L;
getGlobalObject().L = L;
getGlobalObject().L.noConflict = function () {
	getGlobalObject().L = oldL;
	return this;
};

function getGlobalObject() {
	if (typeof globalThis !== 'undefined') { return globalThis; }
	if (typeof self !== 'undefined') { return self; }
	if (typeof window !== 'undefined') { return window; }
	if (typeof global !== 'undefined') { return global; }

	throw new Error('Unable to locate global object.');
}
