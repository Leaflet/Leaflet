describe("Control", function () {
	function onAdd() {
		return L.DomUtil.create('div', 'leaflet-test-control');
	}

	var map,
	    container,
	    control;

	beforeEach(function () {
		container = document.createElement('div');
		document.body.appendChild(container);
		map = L.map(container).setView([0, 0], 1);
		control = new L.Control();
		control.onAdd = onAdd;
		control.addTo(map);
	});

	afterEach(function () {
		map.remove();
		document.body.removeChild(container);
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

	describe("DOM events bubbling:", function () {
		it("click is not propagated to map", function () {
			var spy = sinon.spy();
			map.on('click', spy); // disableClickPropagation
			L.DomEvent.on(container, 'mousedown touchstart dblclick', spy);
			happen.click(control._container);
			happen.dblclick(control._container);
			happen.mousedown(control._container);
			happen.mouseup(control._container);
			happen.touchstart(control._container, {touches:[]});
			expect(spy.called).to.not.be.ok();
		});

		it("scroll is not propagated to map", function () {
			var control = new L.Control();
			control.onAdd = onAdd;
			control.addTo(map);
			var spy = sinon.spy();
			L.DomEvent.on(container, 'wheel', spy); // disableScrollPropagation
			happen.once(control._container, {type: 'wheel', detail: -100});
			expect(spy.called).to.not.be.ok();
		});
	});
});
