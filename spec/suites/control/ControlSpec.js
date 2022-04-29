describe("Control", function () {
	function onAdd() {
		return L.DomUtil.create('div', 'leaflet-test-control');
	}

	var map,
	    container,
	    control;

	beforeEach(function () {
		container = container = createContainer();
		map = L.map(container);

		map.setView([0, 0], 1);
		control = new L.Control();
		control.onAdd = onAdd;
		control.addTo(map);
	});

	afterEach(function () {
		removeMapContainer(map, container);
	});

	describe("#addTo", function () {
		it("adds the container to the map", function () {
			expect(map.getContainer().querySelector('.leaflet-test-control')).to.equal(control.getContainer());
		});

		it("removes the control from any existing map", function () {
			control.addTo(map);
			expect(map.getContainer().querySelectorAll('.leaflet-test-control').length).to.equal(1);
			expect(map.getContainer().querySelector('.leaflet-test-control')).to.equal(control.getContainer());
		});
	});

	describe("#remove", function () {
		it("removes the container from the map", function () {
			control.remove();
			expect(map.getContainer().querySelector('.leaflet-test-control')).to.equal(null);
		});

		it("calls onRemove if defined", function () {
			control.onRemove = sinon.spy();
			control.remove();
			expect(control.onRemove.called).to.be(true);
		});

		it("is a no-op if the control has not been added", function () {
			var control = new L.Control();
			expect(control.remove()).to.equal(control);
		});
	});
});
