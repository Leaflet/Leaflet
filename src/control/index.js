import {Control, control} from './Control';
import {Layers, layers} from './Control.Layers';
import {Zoom, zoom} from './Control.Zoom';
import {Scale, scale} from './Control.Scale';
import {Attribution, attribution} from './Control.Attribution';

Control.Layers = Layers;
Control.Zoom = Zoom;
Control.Scale = Scale;
Control.Attribution = Attribution;

control.layers = layers;
control.zoom = zoom;
control.scale = scale;
control.attribution = attribution;

export {Control, control};
