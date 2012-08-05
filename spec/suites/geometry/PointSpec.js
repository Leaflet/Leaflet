describe('Point', function() {

    describe('constructor', function() {

        it('should create a point with given x & y', function() {
            var p = new L.Point(1.5, 2.5);
            expect(p.x).toEqual(1.5);
            expect(p.y).toEqual(2.5);
        });

        it('should round give x & y if third argument is true', function() {
            var p = new L.Point(1.3, 2.7, true);
            expect(p.x).toEqual(1);
            expect(p.y).toEqual(3);
        });
    });

    describe('#subtract', function() {
        it('should subtract given point', function(){
            var a = new L.Point(50,30),
                b = new L.Point(20,10);

            expect(a.subtract(b))
                .toEqual( new L.Point(30,20) );
        });
    });

    describe('#divideBy', function() {
        it('should divide this point by given amount', function() {
            expect( new L.Point(50,30).divideBy(5))
                .toEqual( new L.Point(10,6));
        });
    });

    describe('#multiplyBy', function() {
        it('should multiply this point by given amount', function() {
            expect( new L.Point(50,30).multiplyBy(2))
                .toEqual( new L.Point(100,60));
        });
    });

    describe('#clone', function() {
        it('should clone point', function() {
            expect( new L.Point(10,20).clone() )
                .toEqual( new L.Point(10,20));
        });
    });

    describe('#distanceTo', function() {
        it('should calc correct distance', function() {
            expect( new L.Point(0,0)
                .distanceTo( new L.Point(10,10)) )
                .toEqual(14.142135623730951);


        });
    });
})