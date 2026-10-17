import {expect} from 'chai';
import {DomUtil, GridLayer, LeafletMap, Point} from 'leaflet';
import Hand from 'prosthetic-hand';
import {createContainer, removeMapContainer} from '../SpecHelper.js';

describe('worldCopyJump', () => {
	let container, map, grid;

	function addGrid(options) {
		grid = new GridLayer(options);
		return grid.addTo(map);
	}

	function tileAt(x, y) {
		return Object.entries(grid._tiles).find(([, tile]) => {
			const rect = tile.el.getBoundingClientRect();
			return rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom;
		});
	}

	function dragBy(dx) {
		const hand = new Hand({timing: 'fastframe'});
		const pointer = hand.growFinger('pointer');
		pointer.moveTo(200, 200, 0).down().moveBy(Math.sign(dx) * 5, 0, 20).moveBy(dx - (Math.sign(dx) * 5), 0, 500).up();
		return hand;
	}

	beforeEach(() => {
		container = createContainer();
		map = new LeafletMap(container, {
			dragging: true,
			inertia: false,
			fadeAnimation: false,
			zoomAnimation: false,
			worldCopyJump: true
		});
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	describe('dragging across the antimeridian', () => {
		it('keeps the tiles it already has instead of rebuilding the grid', (done) => {
			map.setView([0, 178], 5);
			addGrid();

			const [keyBefore, tileBefore] = tileAt(200, 200),
			worldColumns = map.getPixelWorldBounds().getSize().x / grid.getTileSize().x,
			jumps = [];
			map.on('worldcopyjump', e => jumps.push(e.worlds));

			dragBy(-160).addEventListener('stop', () => {
				expect(map.getCenter().lng, 'centre did not wrap').to.be.below(0);

				const found = tileAt(40, 200);
				expect(found, 'the tile that was at the centre is gone').to.not.be.undefined;

				const [keyAfter, tileAfter] = found;
				expect(tileAfter.el, 'tile was rebuilt rather than kept').to.equal(tileBefore.el);
				expect(+keyAfter.split(':')[0]).to.equal(+keyBefore.split(':')[0] - worldColumns);
				expect(jumps).to.eql([1]);
				done();
			});
		});

		it('wraps the other way round too', (done) => {
			map.setView([0, -178], 5);
			addGrid();

			const jumps = [];
			map.on('worldcopyjump', e => jumps.push(e.worlds));

			dragBy(160).addEventListener('stop', () => {
				expect(map.getCenter().lng).to.be.above(0);
				expect(jumps).to.eql([-1]);
				done();
			});
		});
	});

	describe('panning across the antimeridian', () => {
		it('wraps the centre back into the world when the pan animation ends', (done) => {
			map.setView([0, 178], 5);
			addGrid();

			const tileBefore = tileAt(200, 200)[1].el;

			map.once('moveend', () => {
				expect(map.getCenter().lng).to.be.below(-170);
				expect(tileAt(40, 200)[1].el, 'tile was rebuilt rather than kept').to.equal(tileBefore);
				done();
			});
			map.panBy([160, 0]);
		});

		it('wraps the centre after a pan with animation turned off', () => {
			map.setView([0, 178], 5);
			addGrid();

			map.panBy([160, 0], {animate: false});

			expect(map.getCenter().lng).to.be.below(-170);
		});

		it('wraps the centre after a pan larger than the map', () => {
			map.setView([0, 178], 5);
			addGrid();

			map.panBy([600, 0], {animate: false});

			expect(map.getCenter().lng).to.be.within(-160, -150);
		});
	});

	describe('GridLayer', () => {
		it('shifts held-over tiles by their own zoom level\'s worth of columns', () => {
			map.setView([0, 178], 5);
			addGrid();

			// a pinch zoom or flyTo keeps the tiles of the zoom level it came from
			// while the new ones load, so the grid can be holding two levels at once
			const heldOver = {coords: new Point(3, 4), el: document.createElement('div')};
			heldOver.coords.z = 3;
			DomUtil.setPosition(heldOver.el, new Point(100, 200));
			grid._tiles['3:4:3'] = heldOver;

			const [keyBefore] = tileAt(200, 200),
			tileSize = grid.getTileSize().x;

			map._fireWorldCopyJump(map.getPixelWorldBounds().getSize().x);

			// one world is 2^5 columns at zoom 5, but only 2^3 at zoom 3
			expect(grid._tiles[`${+keyBefore.split(':')[0] - 32}:${keyBefore.split(':')[1]}:5`]).to.not.be.undefined;
			expect(heldOver.coords.x).to.equal(3 - 8);
			expect(DomUtil.getPosition(heldOver.el)).to.eql(new Point(100 - (8 * tileSize), 200));
		});

		it('does not rebase tiles in a noWrap layer', () => {
			map.setView([0, 178], 5);
			addGrid({noWrap: true});

			const keys = Object.keys(grid._tiles).sort();

			map._fireWorldCopyJump(map.getPixelWorldBounds().getSize().x);

			expect(Object.keys(grid._tiles).sort()).to.eql(keys);
		});
	});
});
