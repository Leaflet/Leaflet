describe('LatLngBounds', function () {
    describe('getCenter()', function () {
        it("lies between southWest and northEast", function() {
            var southWest = new L.LatLng(-10, -20);
            var northEast = new L.LatLng(10, 20);
            var center = L.latLngBounds(southWest, northEast).getCenter();
            expect(center.lat).toEqual(0);
            expect(center.lng).toEqual(0);

        });

        it("chooses the center that is nearer to (0,0)", function() {
            var southWest = new L.LatLng(10, -170);
            var northEast = new L.LatLng(20, 170);
            /* There are two centers possible: one in the Pacific near the date line at (15, 180)
                and another one at (15, 0).
             */
            var center = L.latLngBounds(southWest, northEast).getCenter();
            expect(center.lat).toEqual(15);
            expect(center.lng).toEqual(0);
        });

        it("does not clamp latitude and longitude if unbounded flag is true", function() {
            var southWest = new L.LatLng(10, 1000, true);
            var northEast = new L.LatLng(20, 2000, true);
            var center = L.latLngBounds(southWest, northEast).getCenter(true);
            expect(center.lat).toEqual(15);
            expect(center.lng).toEqual(1500);
        });

    });
});