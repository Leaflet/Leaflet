describe("Control.Attribution", function () {

	var map, control, container;

	beforeEach(function () {
		map = L.map(document.createElement('div'));
		control = new L.Control.Attribution({
			prefix: 'prefix'
		}).addTo(map);
		container = control.getContainer();
	});

	it("contains just prefix if no attributions added", function () {
		expect(container.innerHTML).to.eql('prefix');
	});

	describe('#addAttribution', function () {
		it('adds one attribution correctly', function () {
			control.addAttribution('foo');
			expect(container.innerHTML).to.eql('prefix | foo');
		});

		it('adds no duplicate attributions', function () {
			control.addAttribution('foo');
			control.addAttribution('foo');
			expect(container.innerHTML).to.eql('prefix | foo');
		});

		it('adds several attributions listed with comma', function () {
			control.addAttribution('foo');
			control.addAttribution('bar');
			expect(container.innerHTML).to.eql('prefix | foo, bar');
		});
	});

	describe('#removeAttribution', function () {
		it('removes attribution correctly', function () {
			control.addAttribution('foo');
			control.addAttribution('bar');
			control.removeAttribution('foo');
			expect(container.innerHTML).to.eql('prefix | bar');
		});
		it('does nothing if removing attribution that was not present', function () {
			control.addAttribution('foo');
			control.addAttribution('baz');
			control.removeAttribution('bar');
			control.removeAttribution('baz');
			control.removeAttribution('baz');
			control.removeAttribution('');
			expect(container.innerHTML).to.eql('prefix | foo');
		});
	});

	describe('#setPrefix', function () {
		it('changes prefix', function () {
			control.setPrefix('bla');
			expect(container.innerHTML).to.eql('bla');
		});
	});

	describe('control.attribution factory', function () {
		it('creates Control.Attribution instance', function () {
			var options = {prefix: 'prefix'};
			expect(L.control.attribution(options)).to.eql(new L.Control.Attribution(options));
		});
	});

});
