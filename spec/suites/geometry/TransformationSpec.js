describe("Transformation", function() {
	var t, p;
	
	beforeEach(function() {
		t = new L.Transformation(1, 2, 3, 4);
		p = new L.Point(10, 20);
	});
	
	it("#transform should perform a transformation", function() {
		var p2 = t.transform(p);
		expect(p2).toEqual(new L.Point(12, 64));
	});
	
	it("#untransform should perform a reverse transformation", function() {
		var p2 = t.transform(p);
		var p3 = t.untransform(p2);
		expect(p3).toEqual(p);
	});
});