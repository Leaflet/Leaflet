
import {Control} from './Control.js';
import {LeafletMap} from '../map/Map.js';
import * as DomUtil from '../dom/DomUtil.js';
import * as DomEvent from '../dom/DomEvent.js';
import {Marker} from '../layer/marker/Marker.js';
import {Polyline} from '../layer/vector/Polyline.js';
import {Polygon} from '../layer/vector/Polygon.js';
import {Circle} from '../layer/vector/Circle.js';
import {FeatureGroup} from '../layer/FeatureGroup.js';

/*
 * @class DrawControl
 * @inherits Control
 *
 * A control for drawing and editing shapes on the map.
 * Provides tools for drawing markers, polylines, polygons, and circles.
 */

// @namespace DrawControl
// @constructor DrawControl(options?: DrawControl options)
// Creates a draw control
export class DrawControl extends Control {

	static {
		// @section
		// @aka DrawControl options
		this.setDefaultOptions({
			// @option position: String = 'topright'
			// The position of the control (one of the map corners).
			position: 'topright',

			// @option draw: Object = {}
			// Options for drawing tools.
			draw: {
				marker: true,
				polyline: true,
				polygon: true,
				circle: true
			},

			// @option edit: Object = {}
			// Options for editing tools.
			edit: {
				edit: true,
				remove: true
			}
		});
	}

	initialize(options) {
		super.initialize(options);
		this._activeTool = null;
		this._drawnLayers = new FeatureGroup();
		this._tempLayer = null;
		this._editMode = false;
		this._selectedLayer = null;
		this._editMarkers = [];
		this._mapInteractionState = {};
	}

	onAdd(map) {
		const container = DomUtil.create('div', 'leaflet-control-draw leaflet-bar');

		this._map = map;
		this._drawnLayers.addTo(map);

		if (this.options.draw.marker) {
			this._createButton('●', 'Draw Marker', 'leaflet-draw-marker', container, this._toggleMarker);
		}
		if (this.options.draw.polyline) {
			this._createButton('〰', 'Draw Polyline', 'leaflet-draw-polyline', container, this._togglePolyline);
		}
		if (this.options.draw.polygon) {
			this._createButton('⬠', 'Draw Polygon', 'leaflet-draw-polygon', container, this._togglePolygon);
		}
		if (this.options.draw.circle) {
			this._createButton('◯', 'Draw Circle', 'leaflet-draw-circle', container, this._toggleCircle);
		}

		if (this.options.edit.edit || this.options.edit.remove) {
			DomUtil.create('div', 'leaflet-draw-separator', container);
		}

		if (this.options.edit.edit) {
			this._createButton('✎', 'Edit Shape', 'leaflet-draw-edit', container, this._toggleEdit);
		}
		if (this.options.edit.remove) {
			this._createButton('✕', 'Delete Shape', 'leaflet-draw-delete', container, this._toggleDelete);
		}

		this._createButton('✖', 'Cancel', 'leaflet-draw-cancel', container, this._cancel);

		return container;
	}

	onRemove() {
		this._disableAllTools();
		this._drawnLayers.remove();
	}

	_createButton(html, title, className, container, fn) {
		const link = DomUtil.create('a', className, container);
		link.innerHTML = html;
		link.href = '#';
		link.title = title;

		link.setAttribute('role', 'button');
		link.setAttribute('aria-label', title);

		DomEvent.disableClickPropagation(link);
		DomEvent.on(link, 'click', DomEvent.stop);
		DomEvent.on(link, 'click', fn, this);
		DomEvent.on(link, 'click', this._refocusOnMap, this);

		return link;
	}

	_toggleMarker() {
		this._toggleTool('marker');
	}

	_togglePolyline() {
		this._toggleTool('polyline');
	}

	_togglePolygon() {
		this._toggleTool('polygon');
	}

	_toggleCircle() {
		this._toggleTool('circle');
	}

	_toggleEdit() {
		this._toggleTool('edit');
	}

	_toggleDelete() {
		this._toggleTool('delete');
	}

	_toggleTool(tool) {
		if (this._activeTool === tool) {
			this._disableAllTools();
		} else {
			this._disableAllTools();
			this._activeTool = tool;
			this._enableTool(tool);
		}
	}

	_enableTool(tool) {
		const container = this._container;
		const buttons = container.querySelectorAll('a');

		buttons.forEach((btn) => {
			btn.classList.remove('leaflet-draw-active');
		});

		const activeButton = container.querySelector(`.leaflet-draw-${tool}`);
		if (activeButton) {
			activeButton.classList.add('leaflet-draw-active');
		}

		this._map.getContainer().classList.add('leaflet-crosshair');
		this._disableMapInteraction();

		switch (tool) {
		case 'marker':
			this._enableMarkerDraw();
			break;
		case 'polyline':
			this._enablePolylineDraw();
			break;
		case 'polygon':
			this._enablePolygonDraw();
			break;
		case 'circle':
			this._enableCircleDraw();
			break;
		case 'edit':
			this._enableEditMode();
			break;
		case 'delete':
			this._enableDeleteMode();
			break;
		}
	}

	_disableAllTools() {
		if (this._activeTool) {
			this._disableTool(this._activeTool);
		}
		this._activeTool = null;

		const container = this._container;
		if (container) {
			const buttons = container.querySelectorAll('a');
			buttons.forEach((btn) => {
				btn.classList.remove('leaflet-draw-active');
			});
		}

		if (this._map) {
			this._map.getContainer().classList.remove('leaflet-crosshair');
			this._restoreMapInteraction();
		}
	}

	_disableTool(tool) {
		switch (tool) {
		case 'marker':
			this._disableMarkerDraw();
			break;
		case 'polyline':
			this._disablePolylineDraw();
			break;
		case 'polygon':
			this._disablePolygonDraw();
			break;
		case 'circle':
			this._disableCircleDraw();
			break;
		case 'edit':
			this._disableEditMode();
			break;
		case 'delete':
			this._disableDeleteMode();
			break;
		}
	}

	_cancel() {
		this._disableAllTools();
	}

	_enableMarkerDraw() {
		this._map.on('click', this._onMarkerClick, this);
	}

	_disableMarkerDraw() {
		this._map.off('click', this._onMarkerClick, this);
	}

	_onMarkerClick(e) {
		const marker = new Marker(e.latlng, {draggable: true});
		marker.addTo(this._drawnLayers);
		this._fireDrawEvent('draw:created', {layer: marker, layerType: 'marker'});
	}

	_enablePolylineDraw() {
		this._polylinePoints = [];
		this._tempPolyline = null;
		this._map.on('click', this._onPolylineClick, this);
		this._map.on('dblclick', this._onPolylineDblClick, this);
		this._map.on('mousemove', this._onPolylineMouseMove, this);
	}

	_disablePolylineDraw() {
		this._map.off('click', this._onPolylineClick, this);
		this._map.off('dblclick', this._onPolylineDblClick, this);
		this._map.off('mousemove', this._onPolylineMouseMove, this);
		if (this._tempPolyline) {
			this._tempPolyline.remove();
			this._tempPolyline = null;
		}
		this._polylinePoints = [];
	}

	_onPolylineClick(e) {
		this._polylinePoints.push(e.latlng);

		if (this._polylinePoints.length === 1) {
			this._tempPolyline = new Polyline(this._polylinePoints, {
				color: '#3388ff',
				weight: 3,
				opacity: 0.8,
				dashArray: '10, 10'
			});
			this._tempPolyline.addTo(this._map);
		} else {
			this._tempPolyline.setLatLngs(this._polylinePoints);
		}
	}

	_onPolylineMouseMove(e) {
		if (this._polylinePoints.length > 0) {
			const tempPoints = [...this._polylinePoints, e.latlng];
			this._tempPolyline.setLatLngs(tempPoints);
		}
	}

	_onPolylineDblClick(e) {
		DomEvent.preventDefault(e);
		if (this._polylinePoints.length >= 2) {
			const polyline = new Polyline(this._polylinePoints);
			polyline.addTo(this._drawnLayers);
			this._fireDrawEvent('draw:created', {layer: polyline, layerType: 'polyline'});
		}
		this._disablePolylineDraw();
		this._enablePolylineDraw();
	}

	_enablePolygonDraw() {
		this._polygonPoints = [];
		this._tempPolygon = null;
		this._map.on('click', this._onPolygonClick, this);
		this._map.on('dblclick', this._onPolygonDblClick, this);
		this._map.on('mousemove', this._onPolygonMouseMove, this);
	}

	_disablePolygonDraw() {
		this._map.off('click', this._onPolygonClick, this);
		this._map.off('dblclick', this._onPolygonDblClick, this);
		this._map.off('mousemove', this._onPolygonMouseMove, this);
		if (this._tempPolygon) {
			this._tempPolygon.remove();
			this._tempPolygon = null;
		}
		this._polygonPoints = [];
	}

	_onPolygonClick(e) {
		this._polygonPoints.push(e.latlng);

		if (this._polygonPoints.length === 1) {
			this._tempPolygon = new Polygon(this._polygonPoints, {
				color: '#3388ff',
				weight: 3,
				opacity: 0.8,
				fillOpacity: 0.2,
				dashArray: '10, 10'
			});
			this._tempPolygon.addTo(this._map);
		} else {
			this._tempPolygon.setLatLngs(this._polygonPoints);
		}
	}

	_onPolygonMouseMove(e) {
		if (this._polygonPoints.length > 0) {
			const tempPoints = [...this._polygonPoints, e.latlng];
			this._tempPolygon.setLatLngs(tempPoints);
		}
	}

	_onPolygonDblClick(e) {
		DomEvent.preventDefault(e);
		if (this._polygonPoints.length >= 3) {
			const polygon = new Polygon(this._polygonPoints);
			polygon.addTo(this._drawnLayers);
			this._fireDrawEvent('draw:created', {layer: polygon, layerType: 'polygon'});
		}
		this._disablePolygonDraw();
		this._enablePolygonDraw();
	}

	_enableCircleDraw() {
		this._circleCenter = null;
		this._tempCircle = null;
		this._isDrawingCircle = false;
		this._map.on('click', this._onCircleClick, this);
		this._map.on('mousemove', this._onCircleMouseMove, this);
	}

	_disableCircleDraw() {
		this._map.off('click', this._onCircleClick, this);
		this._map.off('mousemove', this._onCircleMouseMove, this);
		if (this._tempCircle) {
			this._tempCircle.remove();
			this._tempCircle = null;
		}
		this._circleCenter = null;
		this._isDrawingCircle = false;
	}

	_onCircleClick(e) {
		if (!this._isDrawingCircle) {
			this._circleCenter = e.latlng;
			this._isDrawingCircle = true;
			this._tempCircle = new Circle(this._circleCenter, {
				radius: 0,
				color: '#3388ff',
				weight: 3,
				opacity: 0.8,
				fillOpacity: 0.2,
				dashArray: '10, 10'
			});
			this._tempCircle.addTo(this._map);
		} else {
			const radius = this._tempCircle.getRadius();
			if (radius > 0) {
				const circle = new Circle(this._circleCenter, {radius});
				circle.addTo(this._drawnLayers);
				this._fireDrawEvent('draw:created', {layer: circle, layerType: 'circle'});
			}
			this._disableCircleDraw();
			this._enableCircleDraw();
		}
	}

	_onCircleMouseMove(e) {
		if (this._isDrawingCircle && this._circleCenter) {
			const radius = this._map.distance(this._circleCenter, e.latlng);
			this._tempCircle.setRadius(radius);
		}
	}

	_enableEditMode() {
		this._editMode = true;
		this._drawnLayers.eachLayer((layer) => {
			layer.on('click', this._onLayerClick, this);
			layer.setStyle({weight: 4});
		});
	}

	_disableEditMode() {
		this._editMode = false;
		this._clearEditMarkers();
		this._selectedLayer = null;
		this._drawnLayers.eachLayer((layer) => {
			layer.off('click', this._onLayerClick, this);
			layer.setStyle({weight: 3});
		});
	}

	_enableDeleteMode() {
		this._deleteMode = true;
		this._drawnLayers.eachLayer((layer) => {
			layer.on('click', this._onDeleteLayerClick, this);
			layer.setStyle({color: '#ff0000'});
		});
	}

	_disableDeleteMode() {
		this._deleteMode = false;
		this._drawnLayers.eachLayer((layer) => {
			layer.off('click', this._onDeleteLayerClick, this);
			layer.setStyle({color: '#3388ff'});
		});
	}

	_onLayerClick(e) {
		if (!this._editMode) { return; }

		DomEvent.stopPropagation(e);
		const layer = e.layer || e.target;

		if (this._selectedLayer === layer) {
			this._clearEditMarkers();
			this._selectedLayer = null;
		} else {
			this._clearEditMarkers();
			this._selectedLayer = layer;
			this._createEditMarkers(layer);
		}
	}

	_onDeleteLayerClick(e) {
		if (!this._deleteMode) { return; }

		DomEvent.stopPropagation(e);
		const layer = e.layer || e.target;

		this._drawnLayers.removeLayer(layer);
		this._fireDrawEvent('draw:deleted', {layer});
	}

	_createEditMarkers(layer) {
		if (layer instanceof Marker) {
			return;
		}

		let latlngs = [];

		if (layer instanceof Circle) {
			const center = layer.getLatLng();
			const radius = layer.getRadius();
			const point = this._map.latLngToLayerPoint(center);
			const edgePoint = point.add([radius / this._map.getZoomScale(this._map.getZoom()), 0]);
			const edgeLatLng = this._map.layerPointToLatLng(edgePoint);

			this._createEditMarker(center, (newLatLng) => {
				layer.setLatLng(newLatLng);
			});

			this._createEditMarker(edgeLatLng, (newLatLng) => {
				const newRadius = this._map.distance(center, newLatLng);
				layer.setRadius(newRadius);
			});

			return;
		}

		if (layer instanceof Polygon) {
			latlngs = layer.getLatLngs()[0] || layer.getLatLngs();
		} else if (layer instanceof Polyline) {
			latlngs = layer.getLatLngs();
		}

		if (!Array.isArray(latlngs)) {
			latlngs = [latlngs];
		}

		latlngs.forEach((latlng, index) => {
			this._createEditMarker(latlng, (newLatLng) => {
				const currentLatLngs = layer.getLatLngs();
				if (layer instanceof Polygon) {
					if (Array.isArray(currentLatLngs[0])) {
						currentLatLngs[0][index] = newLatLng;
					} else {
						currentLatLngs[index] = newLatLng;
					}
				} else {
					currentLatLngs[index] = newLatLng;
				}
				layer.setLatLngs(currentLatLngs);
			});
		});
	}

	_createEditMarker(latlng, onDrag) {
		const marker = new Marker(latlng, {
			draggable: true,
			icon: {
				createIcon: () => {
					const icon = DomUtil.create('div', 'leaflet-edit-marker');
					icon.style.width = '12px';
					icon.style.height = '12px';
					icon.style.backgroundColor = '#fff';
					icon.style.border = '2px solid #3388ff';
					icon.style.borderRadius = '50%';
					icon.style.cursor = 'move';
					return icon;
				},
				createShadow: () => null
			}
		});

		marker.on('drag', (e) => {
			onDrag(e.latlng);
		});

		marker.addTo(this._map);
		this._editMarkers.push(marker);
	}

	_clearEditMarkers() {
		this._editMarkers.forEach((marker) => {
			marker.remove();
		});
		this._editMarkers = [];
	}

	_disableMapInteraction() {
		const map = this._map;
		if (!map) { return; }

		this._mapInteractionState = {
			dragging: map.dragging?.enabled(),
			scrollWheelZoom: map.scrollWheelZoom?.enabled(),
			doubleClickZoom: map.doubleClickZoom?.enabled(),
			boxZoom: map.boxZoom?.enabled(),
			keyboard: map.keyboard?.enabled(),
			tapHold: map.tapHold?.enabled()
		};

		if (map.dragging?.enabled()) {
			map.dragging.disable();
		}
		if (map.scrollWheelZoom?.enabled()) {
			map.scrollWheelZoom.disable();
		}
		if (map.doubleClickZoom?.enabled()) {
			map.doubleClickZoom.disable();
		}
		if (map.boxZoom?.enabled()) {
			map.boxZoom.disable();
		}
		if (map.keyboard?.enabled()) {
			map.keyboard.disable();
		}
		if (map.tapHold?.enabled()) {
			map.tapHold.disable();
		}
	}

	_restoreMapInteraction() {
		const map = this._map;
		if (!map) { return; }

		const state = this._mapInteractionState;

		if (state.dragging && !map.dragging?.enabled()) {
			map.dragging.enable();
		}
		if (state.scrollWheelZoom && !map.scrollWheelZoom?.enabled()) {
			map.scrollWheelZoom.enable();
		}
		if (state.doubleClickZoom && !map.doubleClickZoom?.enabled()) {
			map.doubleClickZoom.enable();
		}
		if (state.boxZoom && !map.boxZoom?.enabled()) {
			map.boxZoom.enable();
		}
		if (state.keyboard && !map.keyboard?.enabled()) {
			map.keyboard.enable();
		}
		if (state.tapHold && !map.tapHold?.enabled()) {
			map.tapHold.enable();
		}

		this._mapInteractionState = {};
	}

	_fireDrawEvent(type, data) {
		if (this._map) {
			this._map.fire(type, data);
		}
	}

	// @method getDrawnLayers(): FeatureGroup
	// Returns the FeatureGroup containing all drawn layers.
	getDrawnLayers() {
		return this._drawnLayers;
	}

	// @method clearLayers(): this
	// Removes all drawn layers from the map.
	clearLayers() {
		this._drawnLayers.clearLayers();
		return this;
	}
}

// @namespace LeafletMap
// @section Control options
// @option drawControl: Boolean = false
// Whether a [draw control](#control-draw) is added to the map by default.
LeafletMap.mergeOptions({
	drawControl: false
});

LeafletMap.addInitHook(function () {
	if (this.options.drawControl) {
		this.drawControl = new DrawControl();
		this.addControl(this.drawControl);
	}
});
