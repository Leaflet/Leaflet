import {transformation, point} from 'leaflet';

describe('Transformation', () => {
	let t, p;

	beforeEach(() => {
		t = transformation(1, 2, 3, 4);
		p = point(10, 20);
	});

	describe('#transform', () => {
		it('performs a transformation', () => {
			const p2 = t.transform(p, 2);
			expect(p2).to.eql(point(24, 128));
		});

		it('assumes a scale of 1 if not specified', () => {
			const p2 = t.transform(p);
			expect(p2).to.eql(point(12, 64));
		});
	});

	describe('#untransform', () => {
		it('performs a reverse transformation', () => {
			const p2 = t.transform(p, 2);
			const p3 = t.untransform(p2, 2);
			expect(p3).to.eql(p);
		});

		it('assumes a scale of 1 if not specified', () => {
			expect(t.untransform(point(12, 64))).to.eql(point(10, 20));
		});
	});

	describe('#constructor', () => {
		it('allows an array property for a', () => {
			const t2 = transformation([1, 2, 3, 4]);
			expect(t._a).to.eql(t2._a);
			expect(t._b).to.eql(t2._b);
			expect(t._c).to.eql(t2._c);
			expect(t._d).to.eql(t2._d);
		});
	});
});
