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
	
	describe('#setPosition', noSpecs);
	
	describe('#getStyle', noSpecs);
});