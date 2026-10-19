import {expect} from 'chai';
import {Browser, GridLayer, LatLng, LeafletMap} from 'leaflet';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('GridLayer motion defaults', () => {
	it('updates during panning unless reduced motion is requested', () => {
		const grid = new GridLayer();
		expect(grid.options.updateWhenIdle).to.equal(Browser.reducedMotion);
		expect(Boolean(grid.getEvents().move)).to.equal(!Browser.reducedMotion);
	});

	it('loads newly exposed tiles during movement according to the motion preference', () => {
		const container = createContainer('800px', '600px');
		const map = new LeafletMap(container).setView([0, 0], 11);
		try {
			const grid = new GridLayer().addTo(map);
			const count = Object.keys(grid._tiles).length;
			map._move(new LatLng(1, 1), 11);
			expect(Object.keys(grid._tiles).length > count).to.equal(!Browser.reducedMotion);
			map.fire('moveend');
			expect(Object.keys(grid._tiles).length > count).to.be.true;
		} finally {
			removeMapContainer(map, container);
		}
	});
});
