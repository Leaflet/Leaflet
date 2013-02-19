describe('DomEvent', function() {
	var el;

	function simulateClick(el) {
		if (document.createEvent) {
			var e = document.createEvent('MouseEvents');
			e.initMouseEvent('click', true, true, window, 
					0, 0, 0, 0, 0, false, false, false, false, 0, null);
			return el.dispatchEvent(e);
		} else if (el.fireEvent) {
			return el.fireEvent('onclick');
		}
	}
	
	beforeEach(function() {
		el = document.createElement('div');
		el.style.position = 'absolute';
		el.style.top = el.style.left = '-10000px';
		document.body.appendChild(el);
	});
	
	afterEach(function() {
		document.body.removeChild(el);
	});
	
	describe('#addListener', function() {
		it('adds a listener and calls it on event', function() {
			var listener1 = jasmine.createSpy('listener1'), 
				listener2 = jasmine.createSpy('listener2');
		
			L.DomEvent.addListener(el, 'click', listener1);
			L.DomEvent.addListener(el, 'click', listener2);
			
			simulateClick(el);
			
			expect(listener1).toHaveBeenCalled();
			expect(listener2).toHaveBeenCalled();
		});
		
		it('binds "this" to the given context', function() {
			var obj = {foo: 'bar'},
				result;
			
			L.DomEvent.addListener(el, 'click', function() {
				result = this;
			}, obj);
			
			simulateClick(el);
			
			expect(result).toEqual(obj);
		});
		
		it('passes an event object to the listener', function() {
			var type;
			
			L.DomEvent.addListener(el, 'click', function(e) {
				type = e && e.type;
			});
			simulateClick(el);
			
			expect(type).toEqual('click');
		});
	});
	
	describe('#removeListener', function() {
		it('removes a previously added listener', function() {
			var listener = jasmine.createSpy('listener');
			
			L.DomEvent.addListener(el, 'click', listener);
			L.DomEvent.removeListener(el, 'click', listener);
			
			simulateClick(el);
			
			expect(listener).not.toHaveBeenCalled();
		});
	});
	
	describe('#stopPropagation', function() {
		it('stops propagation of the given event', function() {
			var child = document.createElement('div'),
				listener = jasmine.createSpy('listener');
			
			el.appendChild(child);
			
			L.DomEvent.addListener(child, 'click', L.DomEvent.stopPropagation);
			L.DomEvent.addListener(el, 'click', listener);
			
			simulateClick(child);
			
			expect(listener).not.toHaveBeenCalled();
			
			el.removeChild(child);
		});
	});
	describe('#preventDefault', function() {
		it('prevents the default action of event', function() {
			L.DomEvent.addListener(el, 'click', L.DomEvent.preventDefault);

			expect(simulateClick(el)).toBe(false);
		});
	});
});