describe("Control.Attribution", function () {
	var map, control, container, controlContainer;

	beforeEach(function () {
		container = container = createContainer();
		map = L.map(container);

		control = new L.Control.Attribution({
			prefix: 'prefix'
		}).addTo(map);
		map.setView([0, 0], 1);
		controlContainer = control.getContainer();
	});

	afterEach(function () {
		removeMapContainer(map, container);
	});

	function dummyLayer() {
		var layer = new L.Layer();
		layer.onAdd = function () { };
		layer.onRemove = function () { };
		return layer;
	}

	it("contains just prefix if no attributions added", function () {
		expect(controlContainer.innerHTML).to.eql('prefix');
	});

	describe('#addAttribution', function () {
		it('adds one attribution correctly', function () {
			control.addAttribution('foo');
			expect(controlContainer.innerHTML).to.eql('prefix <span aria-hidden="true">|</span> foo');
		});

		it('adds no duplicate attributions', function () {
			control.addAttribution('foo');
			control.addAttribution('foo');
			expect(controlContainer.innerHTML).to.eql('prefix <span aria-hidden="true">|</span> foo');
		});

		it('adds several attributions listed with comma', function () {
			control.addAttribution('foo');
			control.addAttribution('bar');
			expect(controlContainer.innerHTML).to.eql('prefix <span aria-hidden="true">|</span> foo, bar');
		});
	});

	describe('#removeAttribution', function () {
		it('removes attribution correctly', function () {
			control.addAttribution('foo');
			control.addAttribution('bar');
			control.removeAttribution('foo');
			expect(controlContainer.innerHTML).to.eql('prefix <span aria-hidden="true">|</span> bar');
		});
		it('does nothing if removing attribution that was not present', function () {
			control.addAttribution('foo');
			control.addAttribution('baz');
			control.removeAttribution('bar');
			control.removeAttribution('baz');
			control.removeAttribution('baz');
			control.removeAttribution('');
			expect(controlContainer.innerHTML).to.eql('prefix <span aria-hidden="true">|</span> foo');
		});
	});

	describe('#setPrefix', function () {
		it('changes prefix', function () {
			control.setPrefix('bla');
			expect(controlContainer.innerHTML).to.eql('bla');
		});
	});

	describe('control.attribution factory', function () {
		it('creates Control.Attribution instance', function () {
			var options = {prefix: 'prefix'};
			expect(L.control.attribution(options)).to.eql(new L.Control.Attribution(options));
		});
	});

	describe('on layer add/remove', function () {
		it('changes text', function () {
			var fooLayer = dummyLayer();
			var barLayer = dummyLayer();
			var bazLayer = dummyLayer();
			fooLayer.getAttribution = function () { return 'foo'; };
			barLayer.getAttribution = function () { return 'bar'; };
			bazLayer.getAttribution = function () { return 'baz'; };

			expect(controlContainer.innerHTML).to.eql('prefix');
			map.addLayer(fooLayer);
			expect(controlContainer.innerHTML).to.eql('prefix <span aria-hidden="true">|</span> foo');
			map.addLayer(barLayer);
			expect(controlContainer.innerHTML).to.eql('prefix <span aria-hidden="true">|</span> foo, bar');
			map.addLayer(bazLayer);
			expect(controlContainer.innerHTML).to.eql('prefix <span aria-hidden="true">|</span> foo, bar, baz');

			map.removeLayer(fooLayer);
			expect(controlContainer.innerHTML).to.eql('prefix <span aria-hidden="true">|</span> bar, baz');
			map.removeLayer(barLayer);
			expect(controlContainer.innerHTML).to.eql('prefix <span aria-hidden="true">|</span> baz');
			map.removeLayer(bazLayer);
			expect(controlContainer.innerHTML).to.eql('prefix');
		});

		it('keeps count of duplicated attributions', function () {
			var fooLayer = dummyLayer();
			var fo2Layer = dummyLayer();
			var fo3Layer = dummyLayer();
			fooLayer.getAttribution = function () { return 'foo'; };
			fo2Layer.getAttribution = function () { return 'foo'; };
			fo3Layer.getAttribution = function () { return 'foo'; };

			expect(controlContainer.innerHTML).to.eql('prefix');
			map.addLayer(fooLayer);
			expect(controlContainer.innerHTML).to.eql('prefix <span aria-hidden="true">|</span> foo');
			map.addLayer(fo2Layer);
			expect(controlContainer.innerHTML).to.eql('prefix <span aria-hidden="true">|</span> foo');
			map.addLayer(fo3Layer);
			expect(controlContainer.innerHTML).to.eql('prefix <span aria-hidden="true">|</span> foo');

			map.removeLayer(fooLayer);
			expect(controlContainer.innerHTML).to.eql('prefix <span aria-hidden="true">|</span> foo');
			map.removeLayer(fo2Layer);
			expect(controlContainer.innerHTML).to.eql('prefix <span aria-hidden="true">|</span> foo');
			map.removeLayer(fo3Layer);
			expect(controlContainer.innerHTML).to.eql('prefix');
		});
	});
});
