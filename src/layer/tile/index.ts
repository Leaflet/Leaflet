export {GridLayer, gridLayer} from './GridLayer';
import {TileLayer, tileLayer} from './TileLayer';
import {TileLayerWMS, tileLayerWMS} from './TileLayer.WMS';
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
TileLayer.WMS = TileLayerWMS;
tileLayer.wms = tileLayerWMS;
export {TileLayer, tileLayer};
