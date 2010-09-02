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
});