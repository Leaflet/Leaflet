// @class Class
// @aka L.Class
// @section
// @uninheritable
// Thanks to John Resig and Dean Edwards for inspiration!
import * as Util from './Util';
import {GeoJSON} from '../layer';
import {ReturnType} from "typescript";
import {LatLng} from "../geo";

// https://www.typescriptlang.org/docs/handbook/2/typeof-types.html
type LatLngReturnType = ReturnType<typeof LatLng>;
type GeoJSONReturnType = ReturnType<typeof GeoJSON>;

// import * as L from './src/Leaflet';

// Class.prototype._method = function (){}
// Class rename AbstractClass
// Class is a typescript keyword
export abstract class DemoAbstractClass {
	// @typescript-eslint/no-unsafe-call warning before user input @typescript-eslint/no-unsafe-call warning before user input https://github.com/poligonosapp/programming-typescript-answers/blob/master/src/ch04/exercises.ts
	// null unknown undefined https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html
	static options : GeoJSONReturnType;
	static extend: GeoJSONReturnType;
	static include: GeoJSONReturnType;
	static initialize: GeoJSONReturnType;
}
() => {

};
