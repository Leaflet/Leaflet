describe("Control", function () {
	var map;

	beforeEach(function () {
		map = L.map(document.createElement('div'));
	});

	function onAdd() {
		return L.DomUtil.create('div', 'leaflet-test-control');
	}

	describe("#addTo", function () {
		it("adds the container to the map", function () {
			var control = new L.Control();
			control.onAdd = onAdd;
			control.addTo(map);
			expect(map.getContainer().querySelector('.leaflet-test-control')).to.equal(control.getContainer());
		});

		it("removes the control from any existing map", function () {
			var control = new L.Control();
			control.onAdd = onAdd;
			control.addTo(map);
			control.addTo(map);
			expect(map.getContainer().querySelectorAll('.leaflet-test-control').length).to.equal(1);
			expect(map.getContainer().querySelector('.leaflet-test-control')).to.equal(control.getContainer());
		});
	});

	describe("#remove", function () {
		it("removes the container from the map", function () {
			var control = new L.Control();
			control.onAdd = onAdd;
			control.addTo(map).remove();
			expect(map.getContainer().querySelector('.leaflet-test-control')).to.equal(null);
		});

		it("calls onRemove if defined", function () {
			var control = new L.Control();
			control.onAdd = onAdd;
			control.onRemove = sinon.spy();
			control.addTo(map).remove();
			expect(control.onRemove.called).to.be(true);
		});

		it("is a no-op if the control has not been added", function () {
			var control = new L.Control();
			expect(control.remove()).to.equal(control);
		});
	});
});
