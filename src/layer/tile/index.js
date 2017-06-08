export {GridLayer, gridLayer} from './GridLayer';
export {PixelGrid, pixelGrid} from './PixelGrid';
import {TileLayer, tileLayer} from './TileLayer';
import {TileLayerWMS, tileLayerWMS} from './TileLayer.WMS';
TileLayer.WMS = TileLayerWMS;
tileLayer.wms = tileLayerWMS;
export {TileLayer, tileLayer};
