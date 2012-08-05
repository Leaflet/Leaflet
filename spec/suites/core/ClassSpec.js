describe("Class", function() {

    describe("#extend", function() {
        var Klass,
            constructor,
            method;

        beforeEach(function() {
            constructor = jasmine.createSpy("Klass constructor");
            method = jasmine.createSpy("Klass#bar method");

            Klass = L.Class.extend({
                statics: {bla:1},
                includes: {mixin: true},

                initialize: constructor,
                foo: 5,
                bar: method
            })
        });

        it("should create a class with given constructor & properties", function() {
            var a = new Klass();
            expect(constructor).toHaveBeenCalled();
            expect(a.foo).toEqual(5);
            a.bar();
            expect(method).toHaveBeenCalled();
        });

        it('should inherit parent classes constructor & properties', function() {
            var Klass2 = Klass.extend( {baz:2} );
            var b = new Klass2();

            expect(b instanceof Klass).toBeTruthy();
            expect(b instanceof Klass2).toBeTruthy();

            expect(constructor).toHaveBeenCalled();
            expect(b.baz).toEqual(2);

            b.bar();
            expect(method).toHaveBeenCalled();
        });

        it('should support static props', function() {
            expect(Klass.bla).toEqual(1);
        });

        it('should inherit parent static props', function() {
            var Klass2 = Klass.extend( {} );
            expect(Klass2.bla).toEqual(1);
        });

        it('should override parent static props', function() {
            var Klass2 = Klass.extend( {statics: {bla:2}} );
            expect(Klass2.bla).toEqual(2);
        });

        it('should include given mixin', function() {
            var a = new Klass();
            expect(a.mixin).toBeTruthy();
        });


        it('should include multiple mixins', function() {
            var Klass2 = L.Class.extend({
                includes: [ {mixin: true}, {mixin2: true}]
            })

            var a = new Klass2();

            expect(a.mixin).toBeTruthy();
            expect(a.mixin2).toBeTruthy();
        });

        it('should include function mixins', function() {
            var Klass2 = L.Class.extend( {
                includes: { mixinFn2:
                    function() { return 123; }
                }
            })

            var a = new Klass2();
            expect(a.mixinFn2()).toEqual(123);
        });


        it('should execute parents mixins/functions', function() {
            var Klass2 = L.Class.extend( {
                includes: { mixinFn2:
                    function() { return 123; }
                }
            })

            var a = new Klass2();
            expect(a.mixinFn2()).toEqual(123);

            var Klass3 = Klass2.extend( {
                includes: { mixinFn3:
                    function() {return 222;}
                }
            });
            var b = new Klass3();
            expect(b.mixinFn3()).toEqual(222);
            expect(b.mixinFn2()).toEqual(123);


            var Klass4 = Klass3.extend( {
                includes: { mixinFn4:
                    function() {return 333;}
                }
            });
            var c = new Klass4();
            expect(c.mixinFn4()).toEqual(333);
            expect(c.mixinFn3()).toEqual(222);
            expect(c.mixinFn2()).toEqual(123);

        });

        it('should execute its own constructor (not parents)', function() {
            var klass2constructor = jasmine.createSpy('Klass2#constructor');
            var Klass2 = Klass.extend( {
                initialize: klass2constructor
            });

            var klass2 = new Klass2();
            expect(klass2constructor).toHaveBeenCalled();
            expect(constructor).not.toHaveBeenCalled();

            var klass3constructor = jasmine.createSpy('Kass3#constructor');
            var Klass3 = Klass2.extend( {
                initialize: klass3constructor
            });
            var klass3 = new Klass3();
            expect(klass3constructor).toHaveBeenCalled();
        });


        it('should merge options instead of replacing them', function() {
            var KlassWithOptions1 = L.Class.extend({
                options: {
                    foo1: 1,
                    foo2: 2
                }
            });
            var KlassWithOptions2 = KlassWithOptions1.extend({
                options: {
                    foo2: 3,
                    foo3: 4
                }
            });

            var a = new KlassWithOptions2();

            expect(a.options).toEqual({
                foo1: 1,
                foo2: 3,
                foo3: 4
            });
        });


    })
});
