import {DivIcon, DefaultIcon, LatLng, LayerGroup, LeafletMap, Marker, Point} from 'leaflet';
import sinon from 'sinon';
import UIEventSimulator from 'ui-event-simulator';
import {createContainer, removeMapContainer} from '../../SpecHelper.js';

describe('Marker', () => {
	let map,
	container,
	icon1,
	icon2;

	beforeEach(() => {
		container = createContainer();
		map = new LeafletMap(container);

		map.setView([0, 0], 0);
		icon1 = new DefaultIcon();
		icon2 = new DefaultIcon({
			iconUrl: `${icon1.options.iconUrl}?2`,
			shadowUrl: `${icon1.options.shadowUrl}?2`
		});
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	describe('#setIcon', () => {

		it('set the correct x and y size attributes', () => {
			const expectedX = 96;
			const expectedY = 100;
			const sizedIcon = new DefaultIcon({
				iconUrl: `${icon1.options.iconUrl}?3`,
				iconSize: [expectedX, expectedY]
			});

			const marker = new Marker([0, 0], {icon: sizedIcon});
			map.addLayer(marker);

			const icon = marker._icon;

			expect(icon.style.width).to.equal(`${expectedX}px`);
			expect(icon.style.height).to.equal(`${expectedY}px`);
		});

		it('set the correct x and y size attributes passing only one value', () => {
			const expectedXY = 96;
			const sizedIcon = new DefaultIcon({
				iconUrl: `${icon1.options.iconUrl}?3`,
				iconSize: expectedXY
			});

			const marker = new Marker([0, 0], {icon: sizedIcon});
			map.addLayer(marker);

			const icon = marker._icon;

			expect(icon.style.width).to.equal(`${expectedXY}px`);
			expect(icon.style.height).to.equal(`${expectedXY}px`);
		});

		it('set the correct x and y size attributes passing a Point instance', () => {
			const expectedXY = 96;
			const sizedIcon = new DefaultIcon({
				iconUrl: `${icon1.options.iconUrl}?3`,
				iconSize: new Point(expectedXY, expectedXY)
			});

			const marker = new Marker([0, 0], {icon: sizedIcon});
			map.addLayer(marker);

			const icon = marker._icon;

			expect(icon.style.width).to.equal(`${expectedXY}px`);
			expect(icon.style.height).to.equal(`${expectedXY}px`);
		});

		it('changes the icon to another image while re-using the IMG element', () => {
			const marker = new Marker([0, 0], {icon: icon1});
			map.addLayer(marker);

			const beforeIcon = marker._icon;
			marker.setIcon(icon2);
			const afterIcon = marker._icon;

			expect(beforeIcon).to.equal(afterIcon); // Check that the <IMG> element is re-used
			expect(afterIcon.src).to.contain(icon2._getIconUrl('icon'));
		});

		it('preserves draggability', () => {
			const marker = new Marker([0, 0], {icon: icon1});
			map.addLayer(marker);

			marker.dragging.disable();
			marker.setIcon(icon2);

			expect(marker.dragging.enabled()).to.be.false;

			marker.dragging.enable();

			marker.setIcon(icon1);

			expect(marker.dragging.enabled()).to.be.true;

			map.removeLayer(marker);
			map.addLayer(marker);

			expect(marker.dragging.enabled()).to.be.true;

			map.removeLayer(marker);
			// Dragging is still enabled, we should be able to disable it,
			// even if marker is off the map.
			expect(marker.dragging).to.equal(undefined);
			marker.options.draggable = false;
			map.addLayer(marker);

			map.removeLayer(marker);

			// We should also be able to enable dragging while off the map
			expect(marker.dragging).to.equal(undefined);
			marker.options.draggable = true;

			map.addLayer(marker);
			expect(marker.dragging.enabled()).to.be.true;
		});

		it('keeps the draggable class on the icon', () => {
			const marker = new Marker([0, 0], {icon: icon1, draggable: true});
			map.addLayer(marker);

			marker.setIcon(icon2);

			expect(marker._icon.classList.contains('leaflet-marker-draggable')).to.be.true;

			marker.dragging.disable();
			marker.setIcon(icon1);

			expect(marker._icon.classList.contains('leaflet-marker-draggable')).to.be.false;
		});

		it('changes the DivIcon to another DivIcon, while re-using the DIV element', () => {
			const marker = new Marker([0, 0], {icon: new DivIcon({html: 'Inner1Text'})});
			map.addLayer(marker);

			const beforeIcon = marker._icon;
			marker.setIcon(new DivIcon({html: 'Inner2Text'}));
			const afterIcon = marker._icon;

			expect(beforeIcon).to.equal(afterIcon); // Check that the <DIV> element is re-used
			expect(afterIcon.innerHTML).to.contain('Inner2Text');
		});

		it('removes text when changing to a blank DivIcon', () => {
			const marker = new Marker([0, 0], {icon: new DivIcon({html: 'Inner1Text'})});
			map.addLayer(marker);

			marker.setIcon(new DivIcon());

			expect(marker._icon.innerHTML).to.not.contain('Inner1Text');
		});

		it('changes a DivIcon to an image', () => {
			const marker = new Marker([0, 0], {icon: new DivIcon({html: 'Inner1Text'})});
			map.addLayer(marker);
			const oldIcon = marker._icon;

			marker.setIcon(icon1);

			expect(oldIcon).to.not.equal(marker._icon); // Check that the _icon is NOT re-used
			expect(oldIcon.parentNode).to.equal(null);

			expect(marker._icon.src).to.equal(DefaultIcon.defaultOptions.iconUrl);
			expect(marker._icon.parentNode).to.equal(map._panes.markerPane);
		});

		it('changes an image to a DivIcon', () => {
			const marker = new Marker([0, 0], {icon: icon1});
			map.addLayer(marker);
			const oldIcon = marker._icon;

			marker.setIcon(new DivIcon({html: 'Inner1Text'}));

			expect(oldIcon).to.not.equal(marker._icon); // Check that the _icon is NOT re-used
			expect(oldIcon.parentNode).to.equal(null);

			expect(marker._icon.innerHTML).to.contain('Inner1Text');
			expect(marker._icon.parentNode).to.equal(map._panes.markerPane);
		});

		it('reuses the icon/shadow when changing icon', () => {
			const marker = new Marker([0, 0], {icon: icon1});
			map.addLayer(marker);
			const oldIcon = marker._icon;
			const oldShadow = marker._shadow;

			marker.setIcon(icon2);

			expect(oldIcon).to.equal(marker._icon);
			expect(oldShadow).to.equal(marker._shadow);

			expect(marker._icon.parentNode).to.equal(map._panes.markerPane);
			expect(marker._shadow.parentNode).to.equal(map._panes.shadowPane);
		});

		it('sets the alt attribute to a default value when no alt text is passed', () => {
			const marker = new Marker([0, 0], {icon: icon1});
			map.addLayer(marker);
			const icon = marker._icon;
			expect(icon.hasAttribute('alt')).to.be.true;
			expect(icon.alt).to.equal('Marker');
		});

		it('doesn\'t set the alt attribute for DivIcons', () => {
			const marker = new Marker([0, 0], {icon: new DivIcon(), alt: 'test'});
			map.addLayer(marker);
			const icon = marker._icon;
			expect(icon.hasAttribute('alt')).to.be.false;
		});

		it('pan map to focus marker', () => {
			const marker = new Marker([70, 0], {icon: new DivIcon()});
			map.addLayer(marker);

			expect(() => {
				marker._icon.focus();
			}).to.not.throw();
		});

		it('pan map to focus marker with no iconSize', () => {
			const marker = new Marker([70, 0], {icon: new DivIcon({iconSize: null})});
			map.addLayer(marker);

			expect(() => {
				marker._panOnFocus();
			}).to.not.throw();
		});

		it('pans to fit the rendered icon on focus (#9253)', () => {
			const spy = sinon.spy(map, 'panInside');
			const getPadding = (icon) => {
				const marker = new Marker([70, 0], {icon}).addTo(map);
				marker._panOnFocus();
				const {paddingTopLeft, paddingBottomRight} = spy.lastCall.args[1];
				return [paddingTopLeft.x, paddingTopLeft.y, paddingBottomRight.x, paddingBottomRight.y];
			};
			const html = '<div style="width: 40px; height: 20px;"></div>';

			expect(getPadding(new DivIcon({className: '', iconSize: [20, 30], iconAnchor: [5, 10]}))).to.eql([5, 10, 15, 20]);
			expect(getPadding(new DivIcon({className: '', iconSize: [20, 30]}))).to.eql([10, 15, 10, 15]);
			expect(getPadding(new DivIcon({className: '', iconSize: 32}))).to.eql([16, 16, 16, 16]);
			expect(getPadding(new DivIcon({className: '', iconSize: 'auto', html}))).to.eql([0, 0, 40, 20]);
			expect(getPadding(new DivIcon({className: '', iconSize: [100, 'auto'], html}))).to.eql([50, 0, 50, 20]);

			spy.restore();
		});
	});

	describe('dragging', () => {
		it('keeps dragging switched off when the marker is removed and added again', () => {
			const marker = new Marker([0, 0], {icon: icon1, draggable: true});
			map.addLayer(marker);
			expect(marker.dragging.enabled()).to.be.true;

			marker.dragging.disable();
			map.removeLayer(marker);
			map.addLayer(marker);

			expect(marker.dragging.enabled()).to.be.false;
		});

		it('keeps dragging switched off when the layer group of the marker is toggled', () => {
			const marker = new Marker([0, 0], {icon: icon1, draggable: true}),
			group = new LayerGroup([marker]).addTo(map);

			marker.dragging.disable();
			map.removeLayer(group);
			map.addLayer(group);

			expect(marker.dragging.enabled()).to.be.false;
		});
	});

	describe('rotation', () => {
		it('rotates the icon around its anchor and hides the shadow', () => {
			const marker = new Marker([0, 0], {rotation: 45}).addTo(map);

			expect(marker._icon.style.transform.endsWith(' rotate(45deg)')).to.be.true;
			expect(marker._icon.style.transformOrigin).to.equal('12px 41px');
			expect(marker._shadow.style.display).to.equal('none');

			// so the shadow doesn't flicker as a rotating marker passes 0°
			marker.setRotation(0);
			expect(marker._shadow.style.display).to.equal('none');

			marker.setRotation(null);
			expect(marker._shadow.style.display).to.equal('');
		});

		it('keeps the rotation through setLatLng and zoom', () => {
			const marker = new Marker([0, 0], {rotation: 45}).addTo(map);

			marker.setLatLng([10, 10]);
			expect(marker._icon.style.transform).to.contain('rotate(45deg)');

			map.setZoom(2, {animate: false});
			expect(marker._icon.style.transform).to.contain('rotate(45deg)');
		});

		it('changes with setRotation', () => {
			const marker = new Marker([0, 0]).addTo(map);
			expect(marker._icon.style.transform).not.to.contain('rotate');

			expect(marker.setRotation(-90)).to.equal(marker);
			expect(marker.getRotation()).to.equal(-90);
			expect(marker._icon.style.transform).to.contain('rotate(-90deg)');

			marker.setRotation(null);
			expect(marker._icon.style.transform).not.to.contain('rotate');
		});

		it('rotates the popup and tooltip anchors', () => {
			const marker = new Marker([0, 0], {rotation: 90}).addTo(map);

			// [1, -34] and [16, -28] turned 90° clockwise
			expect(marker._getPopupAnchor().distanceTo([34, 1])).to.be.below(1e-9);
			expect(marker._getTooltipAnchor().distanceTo([28, 16])).to.be.below(1e-9);

			marker.setRotation(0);
			expect(marker._getPopupAnchor()).to.eql([1, -34]);
		});

		it('moves an open popup on setRotation', () => {
			const marker = new Marker([0, 0]).addTo(map).bindPopup('Hi').openPopup();
			const container = marker.getPopup()._container;
			const before = container.style.transform;

			marker.setRotation(90);
			expect(container.style.transform).not.to.equal(before);
		});

		it('can be set before the marker is added', () => {
			const marker = new Marker([0, 0]).setRotation(30).addTo(map);
			expect(marker._icon.style.transform).to.contain('rotate(30deg)');
		});
	});

	describe('#setLatLng', () => {
		it('fires a move event', () => {

			const marker = new Marker([0, 0], {icon: icon1});
			map.addLayer(marker);

			const beforeLatLng = marker._latlng;
			const afterLatLng = new LatLng(1, 2);

			let eventArgs = null;
			marker.on('move', (e) => {
				eventArgs = e;
			});

			marker.setLatLng(afterLatLng);

			expect(eventArgs).to.not.equal(null);
			expect(eventArgs.oldLatLng).to.equal(beforeLatLng);
			expect(eventArgs.latlng).to.equal(afterLatLng);
			expect(marker.getLatLng()).to.equal(afterLatLng);
		});
	});

	describe('keyboard', () => {
		it('is a focusable button when interactive', () => {
			const marker = new Marker([0, 0]).addTo(map);

			expect(marker._icon.tabIndex).to.equal(0);
			expect(marker._icon.getAttribute('role')).to.equal('button');
			expect(marker._icon.alt).to.equal('Marker');
		});

		it('is not a button when not interactive', () => {
			const marker = new Marker([0, 0], {interactive: false}).addTo(map);

			expect(marker._icon.tabIndex).to.equal(0);
			expect(marker._icon.hasAttribute('role')).to.be.false;
		});

		it('is not focusable with keyboard: false', () => {
			const marker = new Marker([0, 0], {keyboard: false}).addTo(map);

			expect(marker._icon.hasAttribute('tabindex')).to.be.false;
			expect(marker._icon.hasAttribute('role')).to.be.false;
		});

		it('fires click on Enter and Space', () => {
			const spy = sinon.spy();
			const mapSpy = sinon.spy();
			const marker = new Marker([10, 20]).addTo(map);
			marker.on('click', spy);
			map.on('click', mapSpy);

			UIEventSimulator.fire('keydown', marker._icon, {key: 'Enter'});
			UIEventSimulator.fire('keydown', marker._icon, {key: ' '});

			expect(spy.calledTwice).to.be.true;
			expect(spy.firstCall.args[0].latlng.equals(marker.getLatLng())).to.be.true;
			expect(mapSpy.called).to.be.false;
		});

		it('does not fire click on other or repeated keys', () => {
			const spy = sinon.spy();
			const marker = new Marker([0, 0]).addTo(map);
			marker.on('click', spy);

			UIEventSimulator.fire('keydown', marker._icon, {key: 'a'});
			UIEventSimulator.fire('keydown', marker._icon, {key: 'Enter', repeat: true});

			expect(spy.called).to.be.false;
		});

		it('fires click on Enter with DivIcon', () => {
			const spy = sinon.spy();
			const marker = new Marker([0, 0], {icon: new DivIcon()}).addTo(map);
			marker.on('click', spy);

			UIEventSimulator.fire('keydown', marker._icon, {key: 'Enter'});

			expect(spy.calledOnce).to.be.true;
		});
	});

	describe('events', () => {
		it('fires click event when clicked', () => {
			const spy = sinon.spy();

			const marker = new Marker([0, 0]).addTo(map);

			marker.on('click', spy);
			UIEventSimulator.fire('click', marker._icon);

			expect(spy.called).to.be.true;
		});

		it('fires click event when clicked with DivIcon', () => {
			const spy = sinon.spy();

			const marker = new Marker([0, 0], {icon: new DivIcon()}).addTo(map);

			marker.on('click', spy);
			UIEventSimulator.fire('click', marker._icon);

			expect(spy.called).to.be.true;
		});

		it('fires click event when clicked on DivIcon child element', () => {
			const spy = sinon.spy();

			const marker = new Marker([0, 0], {icon: new DivIcon({html: '<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" />'})}).addTo(map);

			marker.on('click', spy);

			UIEventSimulator.fire('click', marker._icon);
			expect(spy.called).to.be.true;

			UIEventSimulator.fire('click', marker._icon.querySelector('img'));
			expect(spy.calledTwice).to.be.true;
		});

		it('fires click event when clicked on DivIcon child element set using setIcon', () => {
			const spy = sinon.spy();

			const marker = new Marker([0, 0]).addTo(map);
			marker.setIcon(new DivIcon({html: '<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" />'}));

			marker.on('click', spy);

			UIEventSimulator.fire('click', marker._icon);
			expect(spy.called).to.be.true;

			UIEventSimulator.fire('click', marker._icon.querySelector('img'));
			expect(spy.calledTwice).to.be.true;
		});

		it('do not propagate click event', () => {
			const spy = sinon.spy();
			const spy2 = sinon.spy();
			const mapSpy = sinon.spy();
			const marker = new Marker([55.8, 37.6]);
			map.addLayer(marker);
			marker.on('click', spy);
			marker.on('click', spy2);
			map.on('click', mapSpy);
			UIEventSimulator.fire('click', marker._icon);
			expect(spy.called).to.be.true;
			expect(spy2.called).to.be.true;
			expect(mapSpy.called).not.to.be.true;
		});

		it('do not propagate dblclick event', () => {
			const spy = sinon.spy();
			const spy2 = sinon.spy();
			const mapSpy = sinon.spy();
			const marker = new Marker([55.8, 37.6]);
			map.addLayer(marker);
			marker.on('dblclick', spy);
			marker.on('dblclick', spy2);
			map.on('dblclick', mapSpy);
			UIEventSimulator.fire('dblclick', marker._icon);
			expect(spy.called).to.be.true;
			expect(spy2.called).to.be.true;
			expect(mapSpy.called).not.to.be.true;
		});

		it('do not catch event if it does not listen to it', (done) => {
			const marker = new Marker([55, 37]);
			map.addLayer(marker);
			marker.once('pointermove', (e) => {
				// It should be the marker coordinates
				expect(e.latlng.equals(marker.getLatLng())).to.be.equal(true);
			});
			UIEventSimulator.fire('pointermove', marker._icon);

			map.once('pointermove', (e) => {
				// It should be the pointer coordinates, not the marker ones
				expect(e.latlng.equals(marker.getLatLng())).to.be.equal(false);
				done();
			});
			UIEventSimulator.fire('pointermove', marker._icon);
		});
	});
});
