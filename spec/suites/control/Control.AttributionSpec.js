describe("Control.Attribution", function () {

	var map, control, container;

	beforeEach(function () {
		map = L.map(document.createElement('div'));
		control = new L.Control.Attribution({
			prefix: 'prefix'
		}).addTo(map);
		container = control.getContainer();
	});

	it("should contain just prefix if no attributions added", function () {
		expect(container.innerHTML).toEqual('prefix');
	});

	describe('#addAttribution', function () {
		it('should add one attribution correctly', function () {
			control.addAttribution('foo');
			expect(container.innerHTML).toEqual('prefix | foo');
		});

		it('should not add duplicate attributions', function () {
			control.addAttribution('foo');
			control.addAttribution('foo');
			expect(container.innerHTML).toEqual('prefix | foo');
		});

		it('should add several attributions listed with comma', function () {
			control.addAttribution('foo');
			control.addAttribution('bar');
			expect(container.innerHTML).toEqual('prefix | foo, bar');
		});
	});

	describe('#removeAttribution', function () {
		it('should remove attribution correctly', function () {
			control.addAttribution('foo');
			control.addAttribution('bar');
			control.removeAttribution('foo');
			expect(container.innerHTML).toEqual('prefix | bar');
		});
		it('should do nothing if removing attribution that was not present', function () {
			control.addAttribution('foo');
			control.addAttribution('baz');
			control.removeAttribution('bar');
			control.removeAttribution('baz');
			control.removeAttribution('baz');
			control.removeAttribution('');
			expect(container.innerHTML).toEqual('prefix | foo');
		});
	});

	describe('#setPrefix', function () {
		it('should change prefix', function () {
			control.setPrefix('bla');
			expect(container.innerHTML).toEqual('bla');
		});
	});

	describe('control.attribution factory', function () {
		it('should create Control.Attribution instance', function () {
			var options = {prefix: 'prefix'};
			expect(L.control.attribution(options)).toEqual(new L.Control.Attribution(options));
		});
	});

});
