chai.util.addMethod(chai.Assertion.prototype, 'near', function (expected, delta = 1) {
	expected = L.point(expected);

	new chai.Assertion(this._obj.x).to.be.within(expected.x - delta, expected.x + delta);
	new chai.Assertion(this._obj.y).to.be.within(expected.y - delta, expected.y + delta);
});

chai.util.addMethod(chai.Assertion.prototype, 'nearLatLng', function (expected, delta = 1e-4) {
	expected = L.latLng(expected);

	new chai.Assertion(this._obj.lat).to.be.within(expected.lat - delta, expected.lat + delta);
	new chai.Assertion(this._obj.lng).to.be.within(expected.lng - delta, expected.lng + delta);
});

// A couple of tests need the browser to be touch-capable
it.skipIfNotTouch = L.Browser.touch ? it : it.skip;

const touchEventType = L.Browser.touchNative ? 'touch' : 'pointer'; // eslint-disable-line no-unused-vars
// Note: this override is needed to workaround prosthetic-hand fail,
//       see https://github.com/Leaflet/prosthetic-hand/issues/14

function createContainer(width, height) { /* eslint-disable-line no-unused-vars */
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

function removeMapContainer(map, container) { /* eslint-disable-line no-unused-vars */
	if (map) {
		map.remove();
	}
	if (container) {
		document.body.removeChild(container);
	}
}

console.log('L.Browser.pointer', L.Browser.pointer);
console.log('L.Browser.touchNative', L.Browser.touchNative);
