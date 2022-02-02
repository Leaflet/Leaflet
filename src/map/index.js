import {Map} from './Map';

import {DoubleClickZoom} from './handler/Map.DoubleClickZoom';
Map.DoubleClickZoom = DoubleClickZoom;

import {Drag} from './handler/Map.Drag';
Map.Drag = Drag;

import {ScrollWheelZoom} from './handler/Map.ScrollWheelZoom';
Map.ScrollWheelZoom = ScrollWheelZoom;

import {TouchZoom} from './handler/Map.TouchZoom';
Map.TouchZoom = TouchZoom;

export {Map, createMap as map} from './Map';
