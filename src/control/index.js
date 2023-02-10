import {Control, control} from './Control.js';
import {Layers, layers} from './Control.Layers.js';
import {Zoom, zoom} from './Control.Zoom.js';
import {Scale, scale} from './Control.Scale.js';
import {Attribution, attribution} from './Control.Attribution.js';

Control.Layers = Layers;
Control.Zoom = Zoom;
Control.Scale = Scale;
Control.Attribution = Attribution;

control.layers = layers;
control.zoom = zoom;
control.scale = scale;
control.attribution = attribution;

export {Control, control};
