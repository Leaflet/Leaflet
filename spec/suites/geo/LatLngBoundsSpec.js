describe('LatLngBounds', function(){
    describe('#contains', function() {
        it('should contain bound2', function() {
            var bound1 = new L.LatLngBounds( new L.LatLng(0,0),
                new L.LatLng(90,90) );

            var bound2 = new L.LatLngBounds( new L.LatLng(1,1),
                new L.LatLng(89,89) );

            expect( bound1.contains(bound2)).toBe(true);

            bound1 = new L.LatLngBounds( new L.LatLng(0,0),
                new L.LatLng(90,90));

            bound2 = new L.LatLngBounds( new L.LatLng(0,0),
                new L.LatLng(90,90));

            expect( bound1.contains(bound2)).toBe(true);
            expect( bound2.contains(bound1)).toBe(true);


            bound1 = new L.LatLngBounds( new L.LatLng(0,0),
                new L.LatLng(90,90));

            bound2 = new L.LatLngBounds( new L.LatLng(0,0),
                new L.LatLng(91,91))

            expect( bound1.contains(bound2)).toBe(false);
            expect( bound2.contains(bound1)).toBe(true);

            bound1 = new L.LatLngBounds( new L.LatLng(0,0),
                new L.LatLng(1,1));

            bound2 = new L.LatLngBounds( new L.LatLng(5,5),
                new L.LatLng(10,10));
            expect( bound1.contains( bound2)).toBe(false);
            expect( bound2.contains(bound1)).toBe(false);
        });
    });

    describe('#equals', function() {
        it('should be equal', function() {

            var bound1 = new L.LatLngBounds( new L.LatLng(0,0),
                new L.LatLng(90, 90));

            var bound2 = new L.LatLngBounds( new L.LatLng(0,0 ),
                new L.LatLng(90,90));
            expect( bound1.equals( bound2)).toBe(true);
            expect( bound2.equals(bound1)).toBe(true);
        });

        it('should not be equal', function() {

            var bound1 = new L.LatLngBounds( new L.LatLng(1,1),
                new L.LatLng(91, 91));

            var bound2 = new L.LatLngBounds( new L.LatLng(0,0 ),
                new L.LatLng(90,90));
            expect( bound1.equals( bound2)).toBe(false);
            expect( bound2.equals(bound1)).toBe(false);
        });
    });

    describe('#intersects', function() {
        it('should intersect each other', function() {
            var bound1 = new L.LatLngBounds( new L.LatLng(0,0),
                new L.LatLng(90, 90));

            var bound2 = new L.LatLngBounds( new L.LatLng(0,0 ),
                new L.LatLng(90,90));
            expect( bound1.intersects(bound2)).toBe(true);
            expect( bound2.intersects(bound1)).toBe(true);

            bound1 = new L.LatLngBounds( new L.LatLng(0,0),
                new L.LatLng(10,10));

            bound2 = new L.LatLngBounds( new L.LatLng(10,10),
                new L.LatLng(15,15));
            expect( bound1.intersects(bound2)).toBe(true);
            expect( bound2.intersects(bound1)).toBe(true);


            bound2 = new L.LatLngBounds( new L.LatLng(5, 5),
                new L.LatLng(11,11));
            expect(bound1.intersects(bound2)).toBe(true);
            expect(bound2.intersects(bound1)).toBe(true);
        });

        it('should not intersect', function() {
            var bound1 = new L.LatLngBounds( new L.LatLng(0,0),
                new L.LatLng(1, 1));

            var bound2 = new L.LatLngBounds( new L.LatLng(2,2 ),
                new L.LatLng(3,3));
            expect( bound1.intersects(bound2)).toBe(false);
            expect( bound2.intersects(bound1)).toBe(false);
        });
    });

    describe('#extend', function() {
        it('should extend 2nd bound', function() {
            var bound1 = new L.LatLngBounds( new L.LatLng(0,0),
                new L.LatLng(1,1));

            var bound2 = new L.LatLngBounds( new L.LatLng(0,0),
                new L.LatLng(5,5));
            bound1.extend(bound2);
            var extendedBounds = new L.LatLngBounds( new L.LatLng(0,0),
                new L.LatLng(5,5));
            expect(bound1.equals(extendedBounds)).toBe(true);


            bound2 = new L.LatLngBounds( new L.LatLng(-10,-10),
                new L.LatLng(10,10));
            extendedBounds = new L.LatLngBounds( new L.LatLng(-10,-10),
                new L.LatLng(10,10));
            bound1.extend(bound2);
            expect(bound1.equals(extendedBounds)).toBe(true);
            expect(bound1.equals(bound2)).toBe(true);
        });
    });

    describe('#pad', function() {
        var bound1;

        beforeEach(function() {
            bound1 = new L.LatLngBounds( new L.LatLng(0,0),
                new L.LatLng(10,10));
        });

        it('should pad bounds by 10%', function() {
            var paddedBound = bound1.pad(0.1);
            expect( paddedBound.equals(
                new L.LatLngBounds( new L.LatLng(-1,-1),
                    new L.LatLng(11,11))))
                .toBe(true);
        });

        it('should not pad bounds, 0% buffer ratio', function() {
            var paddedBound = bound1.pad(0);
            expect( paddedBound.equals(
                new L.LatLngBounds( new L.LatLng(0,0),
                    new L.LatLng(10,10))))
                .toBe(true);
        });

        it('should shrink bound, given -ve ratio', function() {
            var paddedBound = bound1.pad(-0.1);
            expect( paddedBound.equals( new L.LatLngBounds( new L.LatLng(1,1),
                new L.LatLng(9,9) )))
                .toBe(true);
        });

        it('should pad bounds by 100% (extend 2x)', function() {
            var paddedBound = bound1.pad(1);
            expect( paddedBound.equals( new L.LatLngBounds( new L.LatLng(-10,-10),
                new L.LatLng(20,20))))
                .toBe(true);
        });

        it('should pad bounds by 200% (extend 3x)', function() {
            var paddedBound = bound1.pad(2);
            expect(paddedBound.equals( new L.LatLngBounds( new L.LatLng(-20,-20),                                                            new L.LatLng(30,30))))
                .toBe(true);
        })
    });
});