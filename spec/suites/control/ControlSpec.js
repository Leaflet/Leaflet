import {Control, DomUtil, LeafletMap, ZoomControl} from 'leaflet';
import sinon from 'sinon';
import {createContainer, removeMapContainer} from '../SpecHelper.js';

describe('Control', () => {
	function onAdd() {
		return DomUtil.create('div', 'leaflet-test-control');
	}

	let map,
	container,
	control;

	beforeEach(() => {
		container = createContainer();
		map = new LeafletMap(container);

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

	describe('#getEvents', () => {
		it('adds the returned map listeners with the control and removes them with it', () => {
			const onZoom = sinon.spy();
			const control = new Control();
			control.onAdd = onAdd;
			control.getEvents = () => ({zoomend: onZoom});

			control.addTo(map);
			map.setZoom(2, {animate: false});
			expect(onZoom.calledOnce).to.be.true;
			expect(onZoom.firstCall.thisValue).to.equal(control);

			control.remove();
			map.setZoom(3, {animate: false});
			expect(onZoom.calledOnce).to.be.true;
		});

		it('removes the listeners it added even if getEvents changes', () => {
			const onZoom = sinon.spy();
			const control = new Control();
			control.onAdd = onAdd;
			control.getEvents = () => ({zoomend: onZoom});

			control.addTo(map);
			control.getEvents = () => ({});
			control.remove();
			map.setZoom(2, {animate: false});
			expect(onZoom.called).to.be.false;
		});
	});

	it('zoom buttons click on Space', () => {
		const zoomIn = sinon.spy(map, 'zoomIn');
		map.zoomControl._zoomInButton.dispatchEvent(new KeyboardEvent('keydown', {key: ' ', bubbles: true}));
		expect(zoomIn.calledOnce).to.equal(true);
	});

	it('zoom control can be disabled and enabled while not on a map', () => {
		expect(() => new ZoomControl().disable().enable()).to.not.throw();

		const zoom = map.zoomControl.remove();
		zoom.disable();
		zoom.addTo(map);
		expect(zoom._zoomInButton.classList.contains('leaflet-disabled')).to.be.true;

		zoom.remove();
		zoom.enable();
		zoom.addTo(map);
		expect(zoom._zoomInButton.classList.contains('leaflet-disabled')).to.be.false;
	});
});
