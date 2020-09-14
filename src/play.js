/* eslint-disable*/
// import { LatLng } from "./geo/LatLng";
// import "./geo/LatLngtoBounds";

import {LatLng} from './geo';

var x = new LatLng(15.5, 10);
//var z = LatLng(1,1);

console.log(x);
console.log(x.toString())
console.log(LatLng.prototype);
console.log(x.prototype);
console.log(x.toBounds(100,100));

var expected = {
    _southWest: {lat: 15.499550842361463, lng: 9.999533890157746},
    _northEast: {lat: 15.500449157638537, lng: 10.000466109842254}
};
console.log(x.toBounds(100,100) == expected);