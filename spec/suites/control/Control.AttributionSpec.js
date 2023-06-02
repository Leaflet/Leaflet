import {Map, Control, Layer, control as lControl} from 'leaflet';
import {createContainer, removeMapContainer} from '../SpecHelper.js';

describe('Control.Attribution', () => {
	let map, control, container, controlContainer;

	beforeEach(() => {
		container = container = createContainer();
		map = new Map(container);

		control = new Control.Attribution({
			prefix: 'prefix'
		}).addTo(map);
		map.setView([0, 0], 1);
		controlContainer = control.getContainer();
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	function dummyLayer() {
		const layer = new Layer();
		layer.onAdd = function () { };
		layer.onRemove = function () { };
		return layer;
	}

	it('contains just prefix if no attributions added', () => {
		expect(controlContainer.innerHTML).to.eql('prefix');
	});

	describe('#addAttribution', () => {
		it('adds one attribution correctly', () => {
			control.addAttribution('foo');
			expect(controlContainer.innerHTML).to.eql('prefix <span aria-hidden="true">|</span> foo');
		});

		it('adds no duplicate attributions', () => {
			control.addAttribution('foo');
			control.addAttribution('foo');
			expect(controlContainer.innerHTML).to.eql('prefix <span aria-hidden="true">|</span> foo');
		});

		it('adds several attributions listed with comma', () => {
			control.addAttribution('foo');
			control.addAttribution('bar');
			expect(controlContainer.innerHTML).to.eql('prefix <span aria-hidden="true">|</span> foo, bar');
		});
	});

	describe('#removeAttribution', () => {
		it('removes attribution correctly', () => {
			control.addAttribution('foo');
			control.addAttribution('bar');
			control.removeAttribution('foo');
			expect(controlContainer.innerHTML).to.eql('prefix <span aria-hidden="true">|</span> bar');
		});
		it('does nothing if removing attribution that was not present', () => {
			control.addAttribution('foo');
			control.addAttribution('baz');
			control.removeAttribution('bar');
			control.removeAttribution('baz');
			control.removeAttribution('baz');
			control.removeAttribution('');
			expect(controlContainer.innerHTML).to.eql('prefix <span aria-hidden="true">|</span> foo');
		});
	});

	describe('#setPrefix', () => {
		it('changes prefix', () => {
			control.setPrefix('bla');
			expect(controlContainer.innerHTML).to.eql('bla');
		});
	});

	describe('control.attribution factory', () => {
		it('creates Control.Attribution instance', () => {
			const options = {prefix: 'prefix'};
			expect(lControl.attribution(options)).to.eql(new Control.Attribution(options));
		});
	});

	describe('on layer add/remove', () => {
		it('changes text', () => {
			const fooLayer = dummyLayer();
			const barLayer = dummyLayer();
			const bazLayer = dummyLayer();
			fooLayer.getAttribution = function () { return 'foo'; };
			barLayer.getAttribution = function () { return 'bar'; };
			bazLayer.getAttribution = function () { return 'baz'; };

			expect(controlContainer.innerHTML).to.eql('prefix');
			map.addLayer(fooLayer);
			expect(controlContainer.innerHTML).to.eql('prefix <span aria-hidden="true">|</span> foo');
			map.addLayer(barLayer);
			expect(controlContainer.innerHTML).to.eql('prefix <span aria-hidden="true">|</span> foo, bar');
			map.addLayer(bazLayer);
			expect(controlContainer.innerHTML).to.eql('prefix <span aria-hidden="true">|</span> foo, bar, baz');

			map.removeLayer(fooLayer);
			expect(controlContainer.innerHTML).to.eql('prefix <span aria-hidden="true">|</span> bar, baz');
			map.removeLayer(barLayer);
			expect(controlContainer.innerHTML).to.eql('prefix <span aria-hidden="true">|</span> baz');
			map.removeLayer(bazLayer);
			expect(controlContainer.innerHTML).to.eql('prefix');
		});

		it('keeps count of duplicated attributions', () => {
			const fooLayer = dummyLayer();
			const fo2Layer = dummyLayer();
			const fo3Layer = dummyLayer();
			fooLayer.getAttribution = function () { return 'foo'; };
			fo2Layer.getAttribution = function () { return 'foo'; };
			fo3Layer.getAttribution = function () { return 'foo'; };

			expect(controlContainer.innerHTML).to.eql('prefix');
			map.addLayer(fooLayer);
			expect(controlContainer.innerHTML).to.eql('prefix <span aria-hidden="true">|</span> foo');
			map.addLayer(fo2Layer);
			expect(controlContainer.innerHTML).to.eql('prefix <span aria-hidden="true">|</span> foo');
			map.addLayer(fo3Layer);
			expect(controlContainer.innerHTML).to.eql('prefix <span aria-hidden="true">|</span> foo');

			map.removeLayer(fooLayer);
			expect(controlContainer.innerHTML).to.eql('prefix <span aria-hidden="true">|</span> foo');
			map.removeLayer(fo2Layer);
			expect(controlContainer.innerHTML).to.eql('prefix <span aria-hidden="true">|</span> foo');
			map.removeLayer(fo3Layer);
			expect(controlContainer.innerHTML).to.eql('prefix');
		});
	});
});
