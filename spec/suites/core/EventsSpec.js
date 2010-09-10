describe('Events', function() {
	var Klass;
	
	beforeEach(function() {
		Klass = L.Class.extend({
			includes: L.Mixin.Events
		});
	});
	
	describe('#fireEvent', function() {
		
		it('should fire all listeners added through #addEventListener', function() {
			var obj = new Klass(),
				spy = jasmine.createSpy(),
				spy2 = jasmine.createSpy(),
				spy3 = jasmine.createSpy();
			
			obj.addEventListener('test', spy);
			obj.addEventListener('test', spy2);
			obj.addEventListener('other', spy3);
			
			expect(spy).not.toHaveBeenCalled();
			expect(spy2).not.toHaveBeenCalled();
			expect(spy3).not.toHaveBeenCalled();
			
			obj.fireEvent('test');
			
			expect(spy).toHaveBeenCalled();
			expect(spy2).toHaveBeenCalled();
			expect(spy3).not.toHaveBeenCalled();
		});

		it('should provide event object to listeners and execute them in the right context', function() {
			var obj = new Klass(),
				obj2 = new Klass(),
				foo = {};
			
			function listener1(e) {
				expect(e.type).toEqual('test');
				expect(e.target).toEqual(obj);
				expect(this).toEqual(obj);
				expect(e.bar).toEqual(3);
			};
			
			function listener2(e) {
				expect(e.target).toEqual(obj2);
				expect(this).toEqual(foo);
			};
			
			obj.addEventListener('test', listener1);
			obj2.addEventListener('test', listener2, foo);
			
			obj.fireEvent('test', {bar: 3});
		});
		
		it('should not call listeners removed through #removeEventListener', function() {
			var obj = new Klass(),
				spy = jasmine.createSpy();
			
			obj.addEventListener('test', spy);
			obj.removeEventListener('test', spy);
			
			obj.fireEvent('test');
			
			expect(spy).not.toHaveBeenCalled();
		});
	});
	
	describe('#on, #off & #fire', function() {
		
		it('should work like #addEventListener && #removeEventListener', function() {
			var obj = new Klass(),
				spy = jasmine.createSpy();
			
			obj.on('test', spy);
			obj.fire('test');
			
			expect(spy).toHaveBeenCalled();
			
			obj.off('test', spy);
			obj.fireEvent('test');
			
			expect(spy.callCount).toBeLessThan(2);
		});
		
		it('should not override existing methods with the same name', function() {
			var spy1 = jasmine.createSpy(),
				spy2 = jasmine.createSpy(),
				spy3 = jasmine.createSpy();
			
			var Klass2 = L.Class.extend({
				includes: L.Mixin.Events,
				on: spy1,
				off: spy2,
				fire: spy3
			});
			
			var obj = new Klass2();
			
			obj.on();
			expect(spy1).toHaveBeenCalled();
			
			obj.off();
			expect(spy2).toHaveBeenCalled();
			
			obj.fire();
			expect(spy3).toHaveBeenCalled();
		});
	});
});