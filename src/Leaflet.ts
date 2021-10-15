/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {version} from '../package.json';
export {version};

// import {L.PoligonosApp} from './PoligonosApp';

const polygonsArray = require('./polygons.geojson');

import {GeoJSON} from './layer/vector/GeoJSON';

  L.geoJSON(data, {
 	style: function (feature) {
 		return {color: feature.properties.color};
 	}
 }).bindPopup(function (layer) {
 	return layer.feature.properties.description;
 }).addTo(map);

const PoligonosApp = L.Class.extend({

	// A property with initial value = 42
	myDemoProperty: makeUnique(polygonsArray),

	// A method
	myDemoMethod: function() {

		// const s = new Server();

		// ui

		return this.myDemoProperty;
	}

});

// poligonosapp plugin new class
// export function poligonosapp(){
    // require('./PoligonosApp');
    // return require('./PoligonosApp');
// }

export * from PoligonosApp;

// control
export * from './control/index';

// core
export * from './core/index';

// dom
export * from './dom/index';

// geometry
export * from './geometry/index';

// geo
export * from './geo/index';

// layer
export * from './layer/index';

// map
export * from './map/index';

// export require('iconv').Iconv;


