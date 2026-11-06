import {LeafletMap, SVGOverlay} from 'leaflet';
import {createContainer, removeMapContainer} from '../SpecHelper.js';

describe('SVGOverlay', () => {
	let container, map, svg;
	const bounds = [[40.712216, -74.22655], [40.773941, -74.12544]];

	beforeEach(() => {
		container = createContainer();
		map = new LeafletMap(container);
		map.setView([55.8, 37.6], 6);
		svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	it('uses the supplied element', () => {
		const overlay = new SVGOverlay(svg, bounds).addTo(map);
		expect(overlay.getElement()).to.equal(svg);
		expect(svg.parentNode).to.equal(map.getPane('overlayPane'));
	});

	describe('#setZIndex', () => {
		it('uses the z-index specified in options', () => {
			const overlay = new SVGOverlay(svg, bounds, {zIndex: 20}).addTo(map);
			expect(svg.style.zIndex).to.equal('20');

			overlay.setZIndex(30);
			expect(svg.style.zIndex).to.equal('30');
		});

		it('sets the z-index when added to the map', () => {
			new SVGOverlay(svg, bounds).setZIndex(10).addTo(map);
			expect(svg.style.zIndex).to.equal('10');
		});
	});
});
