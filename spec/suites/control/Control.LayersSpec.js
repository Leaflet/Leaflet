import {Control, Map, Marker, TileLayer, Util} from 'leaflet';
import UIEventSimulator from 'ui-event-simulator';
import {createContainer, pointerType, removeMapContainer} from '../SpecHelper.js';

describe('Control.Layers', () => {
	let container, map;

	beforeEach(() => {
		container = container = createContainer();
		map = new Map(container);

		map.setView([0, 0], 14);
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	describe('baselayerchange event', () => {
		it('is fired on input that changes the base layer', () => {
			const baseLayers = {'Layer 1': new TileLayer(''), 'Layer 2': new TileLayer('')},
			    layers = new Control.Layers(baseLayers).addTo(map),
			    spy = sinon.spy();

			map.on('baselayerchange', spy);
			UIEventSimulator.fire('click', layers._baseLayersList.getElementsByTagName('input')[0]);
			expect(spy.called).to.be.true;
			expect(spy.args[0][0].name).to.equal('Layer 1');
			expect(spy.args[0][0].layer).to.equal(baseLayers['Layer 1']);
			UIEventSimulator.fire('click', layers._baseLayersList.getElementsByTagName('input')[1]);
			expect(spy.calledTwice).to.be.true;
			expect(spy.args[1][0].name).to.equal('Layer 2');
			expect(spy.args[1][0].layer).to.equal(baseLayers['Layer 2']);
		});

		it('works after removing and readding the Control.Layers to the map', () => {
			const baseLayers = {'Layer 1': new TileLayer(''), 'Layer 2': new TileLayer('')},
			    layers = new Control.Layers(baseLayers).addTo(map),
			    spy = sinon.spy();

			map.on('baselayerchange', spy);

			map.removeControl(layers);
			map.addControl(layers);

			UIEventSimulator.fire('click', layers._baseLayersList.getElementsByTagName('input')[0]);
			expect(spy.called).to.be.true;
			expect(spy.args[0][0].name).to.equal('Layer 1');
			expect(spy.args[0][0].layer).to.equal(baseLayers['Layer 1']);
			UIEventSimulator.fire('click', layers._baseLayersList.getElementsByTagName('input')[1]);
			expect(spy.calledTwice).to.be.true;
			expect(spy.args[1][0].name).to.equal('Layer 2');
			expect(spy.args[1][0].layer).to.equal(baseLayers['Layer 2']);
		});

		it('is not fired on input that doesn\'t change the base layer', () => {
			const overlays = {'Marker 1': new Marker([0, 0]), 'Marker 2': new Marker([0, 0])},
			    layers = new Control.Layers({}, overlays).addTo(map),
			    spy = sinon.spy();

			map.on('baselayerchange', spy);
			UIEventSimulator.fire('click', layers._overlaysList.getElementsByTagName('input')[0]);

			expect(spy.called).to.be.false;
		});
	});

	describe('updates', () => {
		it('when an included layer is added or removed from the map', () => {
			const baseLayer = new TileLayer(),
			    overlay = new Marker([0, 0]),
			    layers = new Control.Layers({'Base': baseLayer}, {'Overlay': overlay}).addTo(map);

			const spy = sinon.spy(layers, '_update');

			map.addLayer(overlay);
			map.removeLayer(overlay);

			expect(spy.called).to.be.true;
			expect(spy.callCount).to.eql(2);
		});

		it('when an included layer is added or removed from the map, it\'s (un)checked', () => {
			const baseLayer = new TileLayer(),
			    overlay = new Marker([0, 0]);
			new Control.Layers({'Baselayer': baseLayer}, {'Overlay': overlay}).addTo(map);

			function isChecked() {
				return !!(map._container.querySelector('.leaflet-control-layers-overlays input').checked);
			}

			expect(isChecked()).to.be.false;
			map.addLayer(overlay);
			expect(isChecked()).to.be.true;
			map.removeLayer(overlay);
			expect(isChecked()).to.be.false;
		});

		it('not when a non-included layer is added or removed', () => {
			const baseLayer = new TileLayer(),
			    overlay = new Marker([0, 0]),
			    layers = new Control.Layers({'Base': baseLayer}).addTo(map);

			const spy = sinon.spy(layers, '_update');

			map.addLayer(overlay);
			map.removeLayer(overlay);

			expect(spy.called).to.be.false;
		});

		it('updates when an included layer is removed from the control', () => {
			const baseLayer = new TileLayer(),
			    overlay = new Marker([0, 0]),
			    layers = new Control.Layers({'Base': baseLayer}, {'Overlay': overlay}).addTo(map);

			layers.removeLayer(overlay);
			expect(map._container.querySelector('.leaflet-control-layers-overlays').children.length)
				.to.be.equal(0);
		});

		it('silently returns when trying to remove a non-existing layer from the control', () => {
			const layers = new Control.Layers({'base': new TileLayer()}).addTo(map);

			expect(() => {
				layers.removeLayer(new Marker([0, 0]));
			}).to.not.throw();

			expect(layers._layers.length).to.be.equal(1);
		});

		it('having repeated layers works as expected', () => {
			const layerA = new TileLayer(''), layerB = new TileLayer(''),
			    baseLayers = {'Layer 1': layerA, 'Layer 2': layerB, 'Layer 3': layerA},
			    layers = new Control.Layers(baseLayers).addTo(map);

			function checkInputs(idx) {
				const inputs = map._container.querySelectorAll('.leaflet-control-layers-base input');
				for (let i = 0; i < inputs.length; i++) {
					expect(inputs[i].checked === (idx === i)).to.be.true;
				}
			}

			UIEventSimulator.fire('click', layers._baseLayersList.getElementsByTagName('input')[1]);
			checkInputs(1);
			expect(map._layers[Util.stamp(layerB)]).to.be.equal(layerB);
			expect(map._layers[Util.stamp(layerA)]).to.be.equal(undefined);
			UIEventSimulator.fire('click', layers._baseLayersList.getElementsByTagName('input')[0]);
			checkInputs(0);
			expect(map._layers[Util.stamp(layerA)]).to.be.equal(layerA);
			expect(map._layers[Util.stamp(layerB)]).to.be.equal(undefined);
			UIEventSimulator.fire('click', layers._baseLayersList.getElementsByTagName('input')[2]);
			checkInputs(2);
			expect(map._layers[Util.stamp(layerA)]).to.be.equal(layerA);
			expect(map._layers[Util.stamp(layerB)]).to.be.equal(undefined);
		});
	});

	describe('is removed cleanly', () => {
		it('and layers in the control can still be removed', () => {
			const baseLayer = new TileLayer('').addTo(map);
			const layersCtrl = new Control.Layers({'Base': baseLayer}).addTo(map);
			map.removeControl(layersCtrl);

			expect(() => {
				map.removeLayer(baseLayer);
			}).to.not.throw();
		});

		it('and layers in the control can still be removed when added after removing control from map', () => {
			const baseLayer = new TileLayer('').addTo(map);
			const layersCtrl = new Control.Layers().addTo(map);
			map.removeControl(layersCtrl);
			layersCtrl.addBaseLayer(baseLayer, 'Base');

			expect(() => {
				map.removeLayer(baseLayer);
			}).to.not.throw();
		});
	});

	describe('is created with an expand link', ()  => {
		it('when collapsed', () => {
			new Control.Layers(null, null, {collapsed: true}).addTo(map);
			expect(map._container.querySelector('.leaflet-control-layers-toggle')).to.be.ok;
		});

		it('when not collapsed', () => {
			new Control.Layers(null, null, {collapsed: false}).addTo(map);
			expect(map._container.querySelector('.leaflet-control-layers-toggle')).to.be.ok;
		});
	});

	describe('collapse when collapsed: true', () => {
		it('expands on "Enter" keydown when toggle is focused', () => {
			const layersCtrl = new Control.Layers(null, null, {collapsed: true}).addTo(map);
			const toggle = layersCtrl._container.querySelector('.leaflet-control-layers-toggle');
			UIEventSimulator.fire('keydown', toggle, {code: 'Enter'});
			expect(map._container.querySelector('.leaflet-control-layers-expanded')).to.be.ok;
		});

		it('expands on click', () => {
			const layersCtrl = new Control.Layers(null, null, {collapsed: true}).addTo(map);
			const toggle = layersCtrl._container.querySelector('.leaflet-control-layers-toggle');
			UIEventSimulator.fire('click', toggle);
			expect(map._container.querySelector('.leaflet-control-layers-expanded')).to.be.ok;
		});

		it('does not expand on "Enter" keydown when toggle is not focused', () => {
			new Control.Layers(null, null, {collapsed: true}).addTo(map);
			UIEventSimulator.fire('keydown', document, {code:'Enter'});
			expect(map._container.querySelector('.leaflet-control-layers-expanded')).to.be.null;
		});

		it('expands when mouse is over', () => {
			const layersCtrl = new Control.Layers(null, null, {collapsed: true}).addTo(map);
			UIEventSimulator.fire('pointerenter', layersCtrl._container, {pointerType});
			expect(map._container.querySelector('.leaflet-control-layers-expanded')).to.be.ok;
		});

		it.skipIfTouch('collapses when mouse is out', () => {
			const layersCtrl = new Control.Layers(null, null, {collapsed: true}).addTo(map);
			UIEventSimulator.fire('pointerenter', layersCtrl._container, {pointerType});
			expect(map._container.querySelector('.leaflet-control-layers-expanded')).not.to.be.null;
			UIEventSimulator.fire('pointerleave', layersCtrl._container, {pointerType});
			expect(map._container.querySelector('.leaflet-control-layers-expanded')).to.be.null;
		});

		it('collapses when map is clicked', () => {
			const layersCtrl = new Control.Layers(null, null, {collapsed: true}).addTo(map);
			UIEventSimulator.fire('pointerenter', layersCtrl._container, {pointerType});
			expect(map._container.querySelector('.leaflet-control-layers-expanded')).not.to.be.null;
			UIEventSimulator.fire('click', map._container);
			expect(map._container.querySelector('.leaflet-control-layers-expanded')).to.be.null;
		});
	});

	describe('does not collapse when collapsed: false', () => {
		it('does not collapse when mouse enters or leaves', () => {
			const layersCtrl = new Control.Layers(null, null, {collapsed: false}).addTo(map);
			expect(map._container.querySelector('.leaflet-control-layers-expanded')).not.to.be.null;
			UIEventSimulator.fire('pointerenter', layersCtrl._container, {pointerType});
			expect(map._container.querySelector('.leaflet-control-layers-expanded')).not.to.be.null;
			UIEventSimulator.fire('pointerleave', layersCtrl._container, {pointerType});
			expect(map._container.querySelector('.leaflet-control-layers-expanded')).not.to.be.null;
		});

		it('does not collapse when map is clicked', () => {
			new Control.Layers(null, null, {collapsed: false}).addTo(map);
			expect(map._container.querySelector('.leaflet-control-layers-expanded')).to.be.ok;
			UIEventSimulator.fire('click', map._container);
			expect(map._container.querySelector('.leaflet-control-layers-expanded')).to.be.ok;
		});

		it('is scrollable if necessary when added on map', () => {
			const layersCtrl = new Control.Layers(null, null, {collapsed: false});
			let i = 0;

			// Need to create a DIV with specified height and insert it into DOM, so that the browser
			// gives it an actual size.
			map.remove();
			container.style.height = container.style.width = '200px';
			map = new Map(container);

			for (; i < 20; i += 1) {
				// Default text size: 12px => 12 * 20 = 240px height (not even considering padding/margin).
				layersCtrl.addOverlay(new Marker([0, 0]), i);
			}

			layersCtrl.addTo(map);

			expect(container.clientHeight).to.be.greaterThan(0); // Make sure first that the map container has a height, otherwise this test is useless.
			expect(container.clientHeight).to.be.greaterThan(layersCtrl._container.clientHeight);
			expect(layersCtrl._section.classList.contains('leaflet-control-layers-scrollbar')).to.be.true;
		});

		it('becomes scrollable if necessary when too many layers are added while it is already on map', () => {
			const layersCtrl = new Control.Layers(null, null, {collapsed: false});
			let i = 0;

			// Need to create a DIV with specified height and insert it into DOM, so that the browser
			// gives it an actual size.
			map.remove();
			container.style.height = container.style.width = '200px';
			map = new Map(container);

			layersCtrl.addTo(map);
			expect(layersCtrl._section.classList.contains('leaflet-control-layers-scrollbar')).to.be.false;

			for (; i < 20; i += 1) {
				// Default text size: 12px => 12 * 20 = 240px height (not even considering padding/margin).
				layersCtrl.addOverlay(new Marker([0, 0]), i);
			}

			expect(container.clientHeight).to.be.greaterThan(layersCtrl._container.clientHeight);
			expect(layersCtrl._section.classList.contains('leaflet-control-layers-scrollbar')).to.be.true;
		});
	});

	describe('sortLayers', () => {
		it('keeps original order by default', () => {
			const baseLayerOne = new TileLayer('').addTo(map);
			const baseLayerTwo = new TileLayer('').addTo(map);
			const markerC = new Marker([0, 2]).addTo(map);
			const markerB = new Marker([0, 1]).addTo(map);
			const markerA = new Marker([0, 0]).addTo(map);

			new Control.Layers({
				'Base One': baseLayerOne,
				'Base Two': baseLayerTwo
			}, {
				'Marker C': markerC,
				'Marker B': markerB,
				'Marker A': markerA
			}).addTo(map);

			const elems = map.getContainer().querySelectorAll('div.leaflet-control-layers label span span');
			expect(elems[0].innerHTML.trim()).to.be.equal('Base One');
			expect(elems[1].innerHTML.trim()).to.be.equal('Base Two');
			expect(elems[2].innerHTML.trim()).to.be.equal('Marker C');
			expect(elems[3].innerHTML.trim()).to.be.equal('Marker B');
			expect(elems[4].innerHTML.trim()).to.be.equal('Marker A');
		});

		it('sorts alphabetically if no function is specified', () => {
			const baseLayerOne = new TileLayer('').addTo(map);
			const baseLayerTwo = new TileLayer('').addTo(map);
			const markerA = new Marker([0, 0]).addTo(map);
			const markerB = new Marker([0, 1]).addTo(map);
			const markerC = new Marker([0, 2]).addTo(map);

			new Control.Layers({
				'Base Two': baseLayerTwo,
				'Base One': baseLayerOne
			}, {
				'Marker A': markerA,
				'Marker C': markerC,
				'Marker B': markerB
			}, {
				sortLayers: true
			}).addTo(map);

			const elems = map.getContainer().querySelectorAll('div.leaflet-control-layers label span span');
			expect(elems[0].innerHTML.trim()).to.be.equal('Base One');
			expect(elems[1].innerHTML.trim()).to.be.equal('Base Two');
			expect(elems[2].innerHTML.trim()).to.be.equal('Marker A');
			expect(elems[3].innerHTML.trim()).to.be.equal('Marker B');
			expect(elems[4].innerHTML.trim()).to.be.equal('Marker C');
		});

		it('uses the compare function to sort layers', () => {
			const baseLayerOne = new TileLayer('', {customOption: 999}).addTo(map);
			const baseLayerTwo = new TileLayer('', {customOption: 998}).addTo(map);
			const markerA = new Marker([0, 0], {customOption: 102}).addTo(map);
			const markerB = new Marker([0, 1], {customOption: 100}).addTo(map);
			const markerC = new Marker([0, 2], {customOption: 101}).addTo(map);

			new Control.Layers({
				'Base One': baseLayerOne,
				'Base Two': baseLayerTwo
			}, {
				'Marker A': markerA,
				'Marker B': markerB,
				'Marker C': markerC
			}, {
				sortLayers: true,
				sortFunction(a, b) { return a.options.customOption - b.options.customOption; }
			}).addTo(map);

			const elems = map.getContainer().querySelectorAll('div.leaflet-control-layers label span span');
			expect(elems[0].innerHTML.trim()).to.be.equal('Base Two');
			expect(elems[1].innerHTML.trim()).to.be.equal('Base One');
			expect(elems[2].innerHTML.trim()).to.be.equal('Marker B');
			expect(elems[3].innerHTML.trim()).to.be.equal('Marker C');
			expect(elems[4].innerHTML.trim()).to.be.equal('Marker A');
		});
	});
});
