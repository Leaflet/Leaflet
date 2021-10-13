// @class Class
// @aka L.Class
// @section
// @uninheritable
// Thanks to John Resig and Dean Edwards for inspiration!
import * as Util from './Util';
import {GeoJSON} from '../layer';

// import * as L from './src/Leaflet';

// Class.prototype._method = function (){}
// Class rename AbstractClass
// Class is a typescript keyword
export abstract class DemoAbstractClass {
	// @typescript-eslint/no-unsafe-call warning before user input @typescript-eslint/no-unsafe-call warning before user input https://github.com/poligonosapp/programming-typescript-answers/blob/master/src/ch04/exercises.ts
	// null unknown undefined https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html
	static type #options : GeoJSON;

	 static type #extend: GeoJSON;
	 static type #include: GeoJSON;
	 static type #initialize: GeoJSON;
}
() => {

	// static #extend();
	// static #include();
	// static #initialize();

};
