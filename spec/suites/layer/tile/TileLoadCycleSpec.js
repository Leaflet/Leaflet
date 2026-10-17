import {expect} from 'chai';
import {LeafletMap, TileLayer} from 'leaflet';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('tile loading during zoom-out', () => {
	let container, map;

	beforeEach(() => {
		container = createContainer('800px', '600px');
		map = new LeafletMap(container, {fadeAnimation: false, zoomAnimation: true}).setView([0, 0], 3);
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	it('finishes one loading cycle when the zoom-out button is clicked', () => {
		const image = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="blue"/></svg>')}`;
		const layer = new TileLayer(image, {keepPreviousTiles: 0});
		return new Promise((resolve) => {
			layer.once('load', resolve).addTo(map);
		}).then(() => new Promise((resolve, reject) => {
			let loading = 0;
			layer.on('loading', () => { loading++; });
			function finish() {
				if (map.getZoom() !== 2 || map._animatingZoom || layer.isLoading()) { return; }
				map.off('moveend', finish);
				layer.off('load', finish);
				try {
					expect(loading).to.equal(1);
					resolve();
				} catch (error) {
					reject(error);
				}
			}
			map.on('moveend', finish);
			layer.on('load', finish);
			container.querySelector('.leaflet-control-zoom-out').click();
		}));
	});
});
