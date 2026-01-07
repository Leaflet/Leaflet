import {expect} from 'chai';
import {LeafletMap, Circle} from 'leaflet';
import {createContainer, removeMapContainer} from '../SpecHelper.js';

describe('Renderer', () => {
	let container, map;

	beforeEach(() => {
		container = container = createContainer();
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	describe('preferCanvas', () => {
		it('when false → there\'s a SVG in a map pane', () => {
			map = new LeafletMap(container, {preferCanvas: false});
			map.setView([55.8, 37.6], 6);

			new Circle([55.8, 37.6]).addTo(map);

			expect(container.querySelector('.leaflet-pane svg path')).to.be.instanceOf(SVGPathElement);
			expect(container.querySelector('.leaflet-pane canvas')).to.be.null;
		});

		it('when true → there\'s a canvas in a map pane', () => {
			map = new LeafletMap(container, {preferCanvas: true});
			map.setView([55.8, 37.6], 6);

			new Circle([55.8, 37.6]).addTo(map);

			expect(container.querySelector('.leaflet-pane svg path')).to.be.null;
			expect(container.querySelector('.leaflet-pane canvas')).to.be.instanceOf(HTMLCanvasElement);
		});
	});
});
