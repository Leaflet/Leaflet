import {DomUtil, Map, Control} from 'leaflet';
import {createContainer, removeMapContainer} from '../SpecHelper.js';

describe('Control', () => {
	function onAdd() {
		return DomUtil.create('div', 'leaflet-test-control');
	}

	let map,
	    container,
	    control;

	beforeEach(() => {
		container = container = createContainer();
		map = new Map(container);

		map.setView([0, 0], 1);
		control = new Control();
		control.onAdd = onAdd;
		control.addTo(map);
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	describe('#addTo', () => {
		it('adds the container to the map', () => {
			expect(map.getContainer().querySelector('.leaflet-test-control')).to.equal(control.getContainer());
		});

		it('removes the control from any existing map', () => {
			control.addTo(map);
			expect(map.getContainer().querySelectorAll('.leaflet-test-control').length).to.equal(1);
			expect(map.getContainer().querySelector('.leaflet-test-control')).to.equal(control.getContainer());
		});
	});

	describe('#remove', () => {
		it('removes the container from the map', () => {
			control.remove();
			expect(map.getContainer().querySelector('.leaflet-test-control')).to.equal(null);
		});

		it('calls onRemove if defined', () => {
			control.onRemove = sinon.spy();
			control.remove();
			expect(control.onRemove.called).to.be.true;
		});

		it('is a no-op if the control has not been added', () => {
			const control = new Control();
			expect(control.remove()).to.equal(control);
		});
	});
});
