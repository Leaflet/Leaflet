describe("Class", function() {
	
	describe("#extend", function() {
		var Klass;
		
		it("should create a class with the given constructor & properties", function() {
			var constructor = jasmine.createSpy('constructor'),
				method = jasmine.createSpy('method');
			
			Klass = L.Class.extend({
				initialize: constructor,
				foo: 5,
				bar: method
			});
			
			var a = new Klass();
			
			expect(constructor).toHaveBeenCalled();
			expect(a.foo).toEqual(5);
			
			a.bar();
			
			expect(method).toHaveBeenCalled();
		});
		
	});
});