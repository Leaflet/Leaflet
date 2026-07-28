import {LeafletMap, ZoomControl} from 'leaflet';

describe('ZoomControl', () => {
	let container, map;

	beforeEach(() => {
		container = document.createElement('div');
		container.style.width = '400px';
		container.style.height = '400px';
		document.body.appendChild(container);
		map = new LeafletMap(container, {center: [0, 0], zoom: 5, zoomControl: false});
	});

	afterEach(() => {
		map.remove();
		document.body.removeChild(container);
	});

	it('is added to the map by default', () => {
		const mapWithZoom = new LeafletMap(document.createElement('div'), {
			center: [0, 0], zoom: 5
		});
		expect(mapWithZoom.zoomControl).to.be.an.instanceOf(ZoomControl);
		mapWithZoom.remove();
	});

	it('is not added when zoomControl option is false', () => {
		expect(map.zoomControl).to.be.undefined;
	});

	it('can be added and removed', () => {
		const control = new ZoomControl();
		control.addTo(map);
		expect(container.querySelector('.leaflet-control-zoom')).to.be.ok;
		control.remove();
		expect(container.querySelector('.leaflet-control-zoom')).to.be.null;
	});

	it('has zoom in and zoom out buttons', () => {
		const control = new ZoomControl().addTo(map);
		const zoomIn = container.querySelector('.leaflet-control-zoom-in');
		const zoomOut = container.querySelector('.leaflet-control-zoom-out');
		expect(zoomIn).to.be.ok;
		expect(zoomOut).to.be.ok;
		control.remove();
	});

	it('buttons have accessible role and aria-label', () => {
		const control = new ZoomControl().addTo(map);
		const zoomIn = container.querySelector('.leaflet-control-zoom-in');
		const zoomOut = container.querySelector('.leaflet-control-zoom-out');
		expect(zoomIn.getAttribute('role')).to.equal('button');
		expect(zoomOut.getAttribute('role')).to.equal('button');
		expect(zoomIn.getAttribute('aria-label')).to.equal('Zoom in');
		expect(zoomOut.getAttribute('aria-label')).to.equal('Zoom out');
		control.remove();
	});

	it('respects custom zoomInText and zoomOutText', () => {
		const control = new ZoomControl({
			zoomInText: 'IN',
			zoomOutText: 'OUT'
		}).addTo(map);
		const zoomIn = container.querySelector('.leaflet-control-zoom-in');
		const zoomOut = container.querySelector('.leaflet-control-zoom-out');
		expect(zoomIn.innerHTML).to.equal('IN');
		expect(zoomOut.innerHTML).to.equal('OUT');
		control.remove();
	});

	it('respects custom zoomInTitle and zoomOutTitle', () => {
		const control = new ZoomControl({
			zoomInTitle: 'Make bigger',
			zoomOutTitle: 'Make smaller'
		}).addTo(map);
		const zoomIn = container.querySelector('.leaflet-control-zoom-in');
		const zoomOut = container.querySelector('.leaflet-control-zoom-out');
		expect(zoomIn.title).to.equal('Make bigger');
		expect(zoomOut.title).to.equal('Make smaller');
		expect(zoomIn.getAttribute('aria-label')).to.equal('Make bigger');
		expect(zoomOut.getAttribute('aria-label')).to.equal('Make smaller');
		control.remove();
	});

	it('disables zoom out at min zoom', () => {
		map.setZoom(map.getMinZoom());
		const control = new ZoomControl().addTo(map);
		const zoomOut = container.querySelector('.leaflet-control-zoom-out');
		expect(zoomOut.classList.contains('leaflet-disabled')).to.be.true;
		expect(zoomOut.getAttribute('aria-disabled')).to.equal('true');
		control.remove();
	});

	it('disables zoom in at max zoom', () => {
		map.setZoom(map.getMaxZoom());
		const control = new ZoomControl().addTo(map);
		const zoomIn = container.querySelector('.leaflet-control-zoom-in');
		expect(zoomIn.classList.contains('leaflet-disabled')).to.be.true;
		expect(zoomIn.getAttribute('aria-disabled')).to.equal('true');
		control.remove();
	});

	it('updates disabled state on zoomend', (done) => {
		const control = new ZoomControl().addTo(map);
		const zoomOut = container.querySelector('.leaflet-control-zoom-out');
		expect(zoomOut.classList.contains('leaflet-disabled')).to.be.false;

		map.once('zoomend', () => {
			expect(zoomOut.classList.contains('leaflet-disabled')).to.be.true;
			control.remove();
			done();
		});
		map.setZoom(map.getMinZoom());
	});

	it('disable() disables both buttons', () => {
		const control = new ZoomControl().addTo(map);
		control.disable();
		const zoomIn = container.querySelector('.leaflet-control-zoom-in');
		const zoomOut = container.querySelector('.leaflet-control-zoom-out');
		expect(zoomIn.classList.contains('leaflet-disabled')).to.be.true;
		expect(zoomOut.classList.contains('leaflet-disabled')).to.be.true;
		control.remove();
	});

	it('enable() re-enables buttons', () => {
		const control = new ZoomControl().addTo(map);
		control.disable();
		control.enable();
		const zoomIn = container.querySelector('.leaflet-control-zoom-in');
		const zoomOut = container.querySelector('.leaflet-control-zoom-out');
		expect(zoomIn.classList.contains('leaflet-disabled')).to.be.false;
		expect(zoomOut.classList.contains('leaflet-disabled')).to.be.false;
		control.remove();
	});

	it('respects position option', () => {
		const control = new ZoomControl({position: 'bottomright'}).addTo(map);
		const bottomRight = container.querySelector('.leaflet-bottom.leaflet-right');
		expect(bottomRight.querySelector('.leaflet-control-zoom')).to.be.ok;
		control.remove();
	});
});
