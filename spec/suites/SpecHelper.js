import {Assertion, util} from 'chai';
import {Browser, latLng, point} from 'leaflet';

util.addMethod(Assertion.prototype, 'near', function (expected, delta = 1) {
	expected = point(expected);

	new Assertion(this._obj.x).to.be.within(expected.x - delta, expected.x + delta);
	new Assertion(this._obj.y).to.be.within(expected.y - delta, expected.y + delta);
});

util.addMethod(Assertion.prototype, 'nearLatLng', function (expected, delta = 1e-4) {
	expected = latLng(expected);

	new Assertion(this._obj.lat).to.be.within(expected.lat - delta, expected.lat + delta);
	new Assertion(this._obj.lng).to.be.within(expected.lng - delta, expected.lng + delta);
});

// A couple of tests need the browser to be touch-capable
it.skipIfNotTouch = Browser.touch ? it : it.skip;
it.skipIfTouch = Browser.touchNative ? it.skip : it;

export const touchEventType = Browser.touchNative ? 'touch' : 'pointer';
// Note: this override is needed to workaround prosthetic-hand fail,
//       see https://github.com/Leaflet/prosthetic-hand/issues/14


export function createContainer(width, height) {
	width = width ? width : '400px';
	height = height ? height : '400px';
	const container = document.createElement('div');
	container.style.position = 'absolute';
	container.style.top = '0px';
	container.style.left = '0px';
	container.style.height = height;
	container.style.width = width;
	container.style.opacity = '0.4';
	document.body.appendChild(container);

	return container;
}

export function removeMapContainer(map, container) {
	if (map) {
		map.remove();
	}
	if (container) {
		document.body.removeChild(container);
	}
}

console.log('Browser.pointer', Browser.pointer);
console.log('Browser.touchNative', Browser.touchNative);

export const pointerType = Browser.touchNative ? 'touch' : 'mouse';
