describe("Map", function () {
    var map;
    beforeEach(function () {
        var c = document.createElement('div');
        c.style.width = '400px';
        c.style.height = '400px';
        map = new L.Map(c);
        map.setView(new L.LatLng(55.8, 37.6), 6);
    });
    describe('#_handleGeolocationResponse', function () {
        it('should pass all geolocation values to the locationfound event', function () {
            var pos = {
                coords: {
                    latitude: 45.123,
                    longitude: -111.123,
                    altitude: 4500,
                    accuracy: 50,
                    altitudeAccuracy: 60,
                    heading: 90,
                    speed: 25
                },
                timestamp: 1349182475367
            };
            var ll = new L.LatLng(pos.coords.latitude, pos.coords.longitude);
            spyOn(map, 'fire');
            map._locationOptions = {setView: false};

            map._handleGeolocationResponse(pos);

            var arg = map.fire.mostRecentCall.args[1];
            expect(arg.latlng).toEqual(ll);
            expect(arg.accuracy).toEqual(pos.coords.accuracy);
            expect(arg.altitude).toEqual(pos.coords.altitude);
            expect(arg.altitudeAccuracy).toEqual(pos.coords.altitudeAccuracy);
            expect(arg.heading).toEqual(pos.coords.heading);
            expect(arg.speed).toEqual(pos.coords.speed);
            expect(arg.timestamp).toEqual(pos.timestamp);
        });
    });
});