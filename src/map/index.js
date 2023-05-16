import {Map} from './Map.js';
import {BoxZoom} from './handler/Map.BoxZoom.js';
Map.BoxZoom = BoxZoom;
import {DoubleClickZoom} from './handler/Map.DoubleClickZoom.js';
Map.DoubleClickZoom = DoubleClickZoom;
import {Drag} from './handler/Map.Drag.js';
Map.Drag = Drag;
import {Keyboard} from './handler/Map.Keyboard.js';
Map.Keyboard = Keyboard;
import {ScrollWheelZoom} from './handler/Map.ScrollWheelZoom.js';
Map.ScrollWheelZoom = ScrollWheelZoom;
import {TapHold} from './handler/Map.TapHold.js';
Map.TapHold = TapHold;
import {TouchZoom} from './handler/Map.TouchZoom.js';
Map.TouchZoom = TouchZoom;

export {Map, createMap as map} from './Map.js';
