describe('LatLng', function() {
	describe('constructor', function() {
		it("should set lat and lng", function() {
			var a = new L.LatLng(25, 74);
			expect(a.lat).toEqual(25);
			expect(a.lng).toEqual(74);
	
			var a = new L.LatLng(-25, -74);
			expect(a.lat).toEqual(-25);
			expect(a.lng).toEqual(-74);
		});
		
		it("should clamp latitude to lie between -90 and 90", function() {
			var a = new L.LatLng(150, 0).lat;
			expect(a).toEqual(90);
			
			var b = new L.LatLng(-230, 0).lat;
			expect(b).toEqual(-90);
		});
		
		it("should clamp longitude to lie between -180 and 180", function() {
			var a = new L.LatLng(0, 190).lng;
			expect(a).toEqual(-170);

			var b = new L.LatLng(0, 360).lng;
			expect(b).toEqual(0);
			
			var c = new L.LatLng(0, 380).lng;
			expect(c).toEqual(20);
	
			var d = new L.LatLng(0, -190).lng;
			expect(d).toEqual(170);
	
			var e = new L.LatLng(0, -360).lng;
			expect(e).toEqual(0);
	
			var f = new L.LatLng(0, -380).lng;
			expect(f).toEqual(-20);

			var g = new L.LatLng(0, 90).lng;
			expect(g).toEqual(90);

			var h = new L.LatLng(0, 180).lng;
			expect(h).toEqual(180);
	 });
		
		it("should not clamp latitude and longitude if unbounded flag set to true", function() {
			var a = new L.LatLng(150, 0, true).lat;
			expect(a).toEqual(150);
			
			var b = new L.LatLng(-230, 0, true).lat;
			expect(b).toEqual(-230);
	
			var c = new L.LatLng(0, 250, true).lng;
			expect(c).toEqual(250);
	
			var d = new L.LatLng(0, -190, true).lng;
			expect(d).toEqual(-190);
		});
	});
	
	describe('#equals', function() {
		it("should return true if compared objects are equal within a certain margin", function() {
			var a = new L.LatLng(10, 20);
			var b = new L.LatLng(10 + 1.0E-10, 20 - 1.0E-10);
			expect(a.equals(b)).toBe(true);
		});
		
		it("should return false if compared objects are not equal within a certain margin", function() {
			var a = new L.LatLng(10, 20);
			var b = new L.LatLng(10, 23.3);
			expect(a.equals(b)).toBe(false);
		});
	});

    describe('L#latLng', function() {

        // Extend this to check new L.LatLng() too? How?
        var checkLatLng = function(args, expectedLat, expectedLng) {
            // check new L.LatLng(a,b,c)
            var result = L.latLng.apply(this, args);
            expect(result.lat).toEqual(expectedLat);
            expect(result.lng).toEqual(expectedLng);

            // check L.latLng([a,b,c])
            result = L.latLng.apply(this, [args]);
            expect(result.lat).toEqual(expectedLat);
            expect(result.lng).toEqual(expectedLng);
        }

        it("should clamp latitude to lie between -90 and 90", function() {
            checkLatLng([ 150, 0],  90, 0);
            checkLatLng([-230, 0], -90, 0);
        });

        it("should clamp longitude to lie between -180 and 180", function() {
            checkLatLng([0, 190], 0, -170);
            checkLatLng([0, 360], 0, 0);
            checkLatLng([0, 380], 0, 20);
            checkLatLng([0, -190], 0, 170);
            checkLatLng([0, -360], 0, 0);
            checkLatLng([0, -380], 0, -20);
            checkLatLng([0, 90], 0, 90);
            checkLatLng([0, 180], 0, 180);
        });

        it("should not clamp latitude and longitude if unbounded flag set to true", function () {
            checkLatLng([ 150,    0, true],  150,    0);
            checkLatLng([-230,    0, true], -230,    0);
            checkLatLng([   0,  250, true],    0,  250);
            checkLatLng([   0, -190, true],    0, -190);
        });

    });
});

