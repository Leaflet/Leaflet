import {LeafletMap, ScaleControl} from 'leaflet';

describe('ScaleControl', () => {
	it('can be added to an unloaded map', () => {
		const map = new LeafletMap(document.createElement('div'));
		new ScaleControl().addTo(map);
	});

	it('rounds distances under 1 m down instead of up to 1 m', () => {
		const scale = new ScaleControl({maxWidth: 100, imperial: false});
		scale.onAdd(new LeafletMap(document.createElement('div')));

		for (const [maxMeters, label] of [[0.35, '0.3 m'], [0.07, '0.05 m'], [0.0025, '0.002 m'], [0.999, '0.5 m']]) {
			scale._updateScales(maxMeters);
			expect(scale._mScale.textContent).to.equal(label);
			expect(parseInt(scale._mScale.style.width, 10)).to.be.at.most(100);
		}
	});

	it('keeps rounding distances of 1 m and more as before', () => {
		const scale = new ScaleControl();

		expect([1, 1.5, 2.9, 4, 7, 12, 350, 999, 1000, 4800].map(n => scale._getRoundNum(n)))
			.to.eql([1, 1, 2, 3, 5, 10, 300, 500, 1000, 3000]);
	});
});
