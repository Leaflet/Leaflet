export {GridLayer, gridLayer} from './GridLayer.js';
import {TileLayer, tileLayer} from './TileLayer.js';
import {TileLayerWMS, tileLayerWMS} from './TileLayer.WMS.js';
TileLayer.WMS = TileLayerWMS;
tileLayer.wms = tileLayerWMS;
export {TileLayer, tileLayer};
