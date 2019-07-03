/* eslint-env node */
// This is just a shim for node.js. See BrowserActual.js for actual implementation

export var node = true;
export var ie = false;
export var ielt9 = false;
export var edge = false;
export var webkit = false;
export var android = false;
export var android23 = false;
export var androidStock = false;
export var opera = false;
export var chrome = false;
export var gecko = false;
export var safari = false;
export var phantom = false;
export var opera12 = false;
export var win = false;
export var ie3d = false;
export var webkit3d = false;
export var gecko3d = false;
export var any3d = false;
export var mobile = false;
export var mobileWebkit = false;
export var mobileWebkit3d = false;
export var msPointer = false;
export var pointer = false;
export var touch = false;
export var mobileOpera = false;
export var mobileGecko = false;
export var retina = false;
export var passiveEvents = false;

// TODO: There are libraries that support some of these in Node (i.e. github.com/Automattic/node-canvas).
export var canvas = false;
export var svg = false;
export var vml = false;

export var requestFn = setImmediate;
export var cancelFn = clearImmediate;

export function requestAnimFrame(fn, context) {
	return setImmediate(fn.bind(context));
}

export function cancelAnimFrame(id) {
	if (id) {
		clearImmediate(id);
	}
}
