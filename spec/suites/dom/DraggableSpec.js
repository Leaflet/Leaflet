import {Draggable} from 'leaflet';

describe('Draggable', () => {
	it('throws on the removed preventOutline argument', () => {
		const el = document.createElement('div');
		expect(() => new Draggable(el, el, true)).to.throw('the preventOutline argument is removed');
		expect(() => new Draggable(el, el, {clickTolerance: 5})).not.to.throw();
	});
});
