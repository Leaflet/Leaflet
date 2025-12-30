import {LeafletMap} from './Map.js';
import {BoxZoom} from './handler/Map.BoxZoom.js';
LeafletMap.BoxZoom = BoxZoom;
import {DoubleClickZoom} from './handler/Map.DoubleClickZoom.js';
LeafletMap.DoubleClickZoom = DoubleClickZoom;
import {Drag} from './handler/Map.Drag.js';
LeafletMap.Drag = Drag;
import {Keyboard} from './handler/Map.Keyboard.js';
LeafletMap.Keyboard = Keyboard;
import {ScrollWheelZoom} from './handler/Map.ScrollWheelZoom.js';
LeafletMap.ScrollWheelZoom = ScrollWheelZoom;
import {TapHold} from './handler/Map.TapHold.js';
LeafletMap.TapHold = TapHold;
import {PinchZoom} from './handler/Map.PinchZoom.js';
LeafletMap.PinchZoom = PinchZoom;
LeafletMap.TouchZoom = PinchZoom; // backward compatibility

export {Map, LeafletMap} from './Map.js';
