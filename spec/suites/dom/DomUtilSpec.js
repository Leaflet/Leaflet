describe('DomUtil', function() {
	var el;
	
	beforeEach(function() {
		el = document.createElement('div');
		el.style.position = 'absolute';
		el.style.top = el.style.left = '-10000px';
		document.body.appendChild(el);
	});
	
	afterEach(function() {
		document.body.removeChild(el);
	});
	
	describe('#get', function() {
		it('should get element by id if the given argument is string', function() {
			el.id = 'testId';
			expect(L.DomUtil.get(el.id)).toBe(el);
		});
		
		it('should return the element if it is given as an argument', function() {
			expect(L.DomUtil.get(el)).toBe(el);
		});
	});
	
	describe('#addClass, #removeClass, #hasClass', function() {
		it('should has defined class for test element', function() {
			el.className = 'bar foo baz ';
			expect(L.DomUtil.hasClass(el, 'foo')).toBeTruthy();
			expect(L.DomUtil.hasClass(el, 'bar')).toBeTruthy();
			expect(L.DomUtil.hasClass(el, 'baz')).toBeTruthy();
			expect(L.DomUtil.hasClass(el, 'boo')).toBeFalsy();
		});
		
		it('should properly addClass and removeClass for element', function() {
			el.className = '';
			L.DomUtil.addClass(el, 'foo');
			
			expect(el.className).toEqual('foo');
			expect(L.DomUtil.hasClass(el, 'foo')).toBeTruthy();
			
			L.DomUtil.addClass(el, 'bar');
			expect(el.className).toEqual('foo bar');
			expect(L.DomUtil.hasClass(el, 'foo')).toBeTruthy();
			
			L.DomUtil.removeClass(el, 'foo');
			expect(el.className).toEqual('bar');
			expect(L.DomUtil.hasClass(el, 'foo')).toBeFalsy();
			
			el.className = 'foo bar barz';
			L.DomUtil.removeClass(el, 'bar');
			expect(el.className).toEqual('foo barz');
		})
	});
	
	describe('#setPosition', noSpecs);
	
	describe('#getStyle', noSpecs);
});