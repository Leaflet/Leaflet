import {LeafletMap, ScaleControl} from 'leaflet';

describe('ScaleControl', () => {
	it('can be added to an unloaded map', () => {
		const map = new LeafletMap(document.createElement('div'));
		new ScaleControl().addTo(map);
	});
});
