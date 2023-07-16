import {Map, Control} from 'leaflet';

describe('Control.Scale', () => {
	it('can be added to an unloaded map', () => {
		const map = new Map(document.createElement('div'));
		new Control.Scale().addTo(map);
	});
});
