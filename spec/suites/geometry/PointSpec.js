describe("Point", function() {
	
	describe('constructor', function() {
		
		it("should create a point with the given x and y", function() {
			var p = new L.Point(1.5, 2.5);
			expect(p.x).toEqual(1.5);
			expect(p.y).toEqual(2.5);
		});
		
		it("should round the given x and y if the third argument is true", function() {
			var p = new L.Point(1.3, 2.7, true);
			expect(p.x).toEqual(1);
			expect(p.y).toEqual(3);
		});
	});
	
	describe('#subtract', function() {
		it('should subtract the given point from this one', function() {
			var a = new L.Point(50, 30),
				b = new L.Point(20, 10);
			expect(a.subtract(b)).toEqual(new L.Point(30, 20));
		});
	});
	
	describe('#add', function() {
		it('should add the given point to this one', function() {
			expect(new L.Point(50, 30).add(new L.Point(20, 10))).toEqual(new L.Point(70, 40));
		});
	});
	
	describe('#divideBy', function() {
		it('should divide this point by the given amount', function() {
			expect(new L.Point(50, 30).divideBy(5)).toEqual(new L.Point(10, 6));
		});
	});
	
	describe('#multiplyBy', function() {
		it('should multiply this point by the given amount', function() {
			expect(new L.Point(50, 30).multiplyBy(2)).toEqual(new L.Point(100, 60));
		});
	});
	
	describe('#distanceTo', noSpecs);
});