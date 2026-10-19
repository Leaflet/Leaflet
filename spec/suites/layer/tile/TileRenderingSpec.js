import {expect} from 'chai';
import {GridLayer, LeafletMap} from 'leaflet';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('tile rendering during animated zoom', () => {
	let container, map;

	beforeEach(() => {
		container = createContainer('800px', '600px');
		map = new LeafletMap(container, {zoomAnimation: true});
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	[
		[11, 14, {}, 14],
		[14, 11, {}, 11],
		[11, 14, {maxNativeZoom: 13}, 13],
		[14, 11, {minNativeZoom: 12}, 12]
	].forEach(([start, target, options, tileZoom]) => {
		it(`loads target tiles before the map advances from ${start} to ${target} (tile zoom ${tileZoom})`, () => {
			map.setView([0, 0], start);
			const grid = new GridLayer(options).addTo(map);
			let checked = false;
			map.on('zoomanim', () => {
				expect(map.getZoom()).to.equal(start);
				expect(grid._tileZoom).to.equal(tileZoom);
				expect(Object.values(grid._tiles).some(tile => tile.coords.z === tileZoom)).to.be.true;
				checked = true;
			});

			map._animateZoom(map.getCenter(), target, true);
			expect(checked).to.be.true;
		});
	});


	[13, 11, 13.4].forEach((target) => {
		it(`requests the whole destination viewport when zooming out to ${target}`, () => {
			map.setView([0, 0], 14);
			const grid = new GridLayer().addTo(map);
			let checked = false;
			map.on('zoomanim', (event) => {
				const scale = map.getZoomScale(target, grid._tileZoom);
				expect(grid._getTiledPixelBounds(event.center).getSize()).to.near(map.getSize().divideBy(scale));
				checked = true;
			});

			map._animateZoom(map.getCenter(), target, true);
			expect(checked).to.be.true;
		});
	});
});
