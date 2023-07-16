import {Bounds, point, LineUtil, latLng, Map, polyline} from 'leaflet';

describe('LineUtil', () => {
	describe('#clipSegment', () => {
		let bounds;

		beforeEach(() => {
			bounds = new Bounds([5, 0], [15, 10]);
		});

		it('clips a segment by bounds', () => {
			const a = point(0, 0);
			const b = point(15, 15);

			const segment = LineUtil.clipSegment(a, b, bounds);

			expect(segment[0]).to.eql(point(5, 5));
			expect(segment[1]).to.eql(point(10, 10));

			const c = point(5, -5);
			const d = point(20, 10);

			const segment2 = LineUtil.clipSegment(c, d, bounds);

			expect(segment2[0]).to.eql(point(10, 0));
			expect(segment2[1]).to.eql(point(15, 5));
		});

		it('uses last bit code and reject segments out of bounds', () => {
			const a = point(15, 15);
			const b = point(25, 20);
			const segment = LineUtil.clipSegment(a, b, bounds, true);

			expect(segment).to.be.false;
		});

		it('can round numbers in clipped bounds', () => {
			const a = point(4, 5);
			const b = point(8, 6);

			const segment1 = LineUtil.clipSegment(a, b, bounds);

			expect(segment1[0]).to.eql(point(5, 5.25));
			expect(segment1[1]).to.eql(b);

			const segment2 = LineUtil.clipSegment(a, b, bounds, false, true);

			expect(segment2[0]).to.eql(point(5, 5));
			expect(segment2[1]).to.eql(b);
		});
	});

	describe('#pointToSegmentDistance & #closestPointOnSegment', () => {
		const p1 = point(0, 10);
		const p2 = point(10, 0);
		const p = point(0, 0);

		it('calculates distance from point to segment', () => {
			expect(LineUtil.pointToSegmentDistance(p, p1, p2)).to.eql(Math.sqrt(200) / 2);
		});

		it('calculates point closest to segment', () => {
			expect(LineUtil.closestPointOnSegment(p, p1, p2)).to.eql(point(5, 5));
		});
	});

	describe('#simplify', () => {
		it('simplifies polylines according to tolerance', () => {
			const points = [
				point(0, 0),
				point(0.01, 0),
				point(0.5, 0.01),
				point(0.7, 0),
				point(1, 0),
				point(1.999, 0.999),
				point(2, 1)
			];

			const simplified = LineUtil.simplify(points, 0.1);

			expect(simplified).to.eql([
				point(0, 0),
				point(1, 0),
				point(2, 1)
			]);
		});
	});

	describe('#isFlat', () => {
		it('should return true for an array of LatLngs', () => {
			expect(LineUtil.isFlat([latLng([0, 0])])).to.be.true;
		});

		it('should return true for an array of LatLngs arrays', () => {
			expect(LineUtil.isFlat([[0, 0]])).to.be.true;
		});

		it('should return true for an empty array', () => {
			expect(LineUtil.isFlat([])).to.be.true;
		});

		it('should return false for a nested array of LatLngs', () => {
			expect(LineUtil.isFlat([[latLng([0, 0])]])).to.be.false;
		});

		it('should return false for a nested empty array', () => {
			expect(LineUtil.isFlat([[]])).to.be.false;
		});
	});

	describe('#polylineCenter', () => {
		let map, crs, zoom;
		beforeEach(() => {
			map = new Map(document.createElement('div'), {center: [55.8, 37.6], zoom: 6, zoomAnimation: false});
			crs = map.options.crs;
		});

		afterEach(() => {
			map.remove();
		});

		// More tests in PolylineSpec

		it('computes center of line', () => {
			const latlngs = [[80, 0], [80, 90]];
			const center = LineUtil.polylineCenter(latlngs, crs);
			expect(center).to.be.nearLatLng([80, 45]);
		});

		it('computes center of a small line', () => {
			const latlngs = [[50.49898323576035, 30.509834789772036], [50.49998323576035, 30.509834789772036], [50.49998323576035, 30.509939789772037], [50.49898323576035, 30.509939789772037]];
			const layer = polyline(latlngs).addTo(map);
			expect(layer.getCenter()).to.be.nearLatLng([50.49998323576035, 30.50989603626345]);
		});

		it('throws error if latlngs not passed', () => {
			expect(() => {
				LineUtil.polylineCenter(null, crs);
			}).to.throw('latlngs not passed');
		});

		it('throws error if latlng array is empty', () => {
			expect(() => {
				LineUtil.polylineCenter([], crs);
			}).to.throw('latlngs not passed');
		});


		it('throws error if latlngs not passed', () => {
			expect(() => {
				LineUtil.polylineCenter(null, crs, zoom);
			}).to.throw('latlngs not passed');
		});

		it('throws error if latlng array is empty', () => {
			expect(() => {
				LineUtil.polylineCenter([], crs, zoom);
			}).to.throw('latlngs not passed');
		});

		it('shows warning if latlngs is not flat', () => {
			const latlngs = [
				[[80, 0], [80, 90]]
			];
			const spy = sinon.spy(console, 'warn');
			const center = LineUtil.polylineCenter(latlngs, crs);
			console.warn.restore();
			expect(spy.calledOnce).to.be.true;
			expect(center).to.be.nearLatLng([80, 45]);
		});

		it('iterates only over the array values', () => {
			// eslint-disable-next-line
			Array.prototype.foo = 'ABC';
			const latlngs = [
				[[80, 0], [80, 90]]
			];
			const center = LineUtil.polylineCenter(latlngs, crs);
			expect(center).to.be.nearLatLng([80, 45]);
		});
	});
});
