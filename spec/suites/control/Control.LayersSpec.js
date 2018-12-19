describe("Control.Layers", function () {
	var map;

	beforeEach(function () {
		map = L.map(document.createElement('div'));
	});
	afterEach(function () {
		map.remove();
	});

	describe("baselayerchange event", function () {
		beforeEach(function () {
			map.setView([0, 0], 14);
		});

		it("is fired on input that changes the base layer", function () {
			var baseLayers = {"Layer 1": L.tileLayer(''), "Layer 2": L.tileLayer('')},
			    layers = L.control.layers(baseLayers).addTo(map),
			    spy = sinon.spy();

			map.on('baselayerchange', spy);
			happen.click(layers._baseLayersList.getElementsByTagName("input")[0]);
			expect(spy.called).to.be.ok();
			expect(spy.args[0][0].name).to.be("Layer 1");
			expect(spy.args[0][0].layer).to.be(baseLayers["Layer 1"]);
			happen.click(layers._baseLayersList.getElementsByTagName("input")[1]);
			expect(spy.calledTwice).to.be.ok();
			expect(spy.args[1][0].name).to.be("Layer 2");
			expect(spy.args[1][0].layer).to.be(baseLayers["Layer 2"]);
		});

		it("works after removing and readding the Control.Layers to the map", function () {
			var baseLayers = {"Layer 1": L.tileLayer(''), "Layer 2": L.tileLayer('')},
			    layers = L.control.layers(baseLayers).addTo(map),
			    spy = sinon.spy();

			map.on('baselayerchange', spy);

			map.removeControl(layers);
			map.addControl(layers);

			happen.click(layers._baseLayersList.getElementsByTagName("input")[0]);
			expect(spy.called).to.be.ok();
			expect(spy.args[0][0].name).to.be("Layer 1");
			expect(spy.args[0][0].layer).to.be(baseLayers["Layer 1"]);
			happen.click(layers._baseLayersList.getElementsByTagName("input")[1]);
			expect(spy.calledTwice).to.be.ok();
			expect(spy.args[1][0].name).to.be("Layer 2");
			expect(spy.args[1][0].layer).to.be(baseLayers["Layer 2"]);
		});

		it("is not fired on input that doesn't change the base layer", function () {
			var overlays = {"Marker 1": L.marker([0, 0]), "Marker 2": L.marker([0, 0])},
			    layers = L.control.layers({}, overlays).addTo(map),
			    spy = sinon.spy();

			map.on('baselayerchange', spy);
			happen.click(layers._overlaysList.getElementsByTagName("input")[0]);

			expect(spy.called).to.not.be.ok();
		});
	});

	describe("updates", function () {
		beforeEach(function () {
			map.setView([0, 0], 14);
		});

		it("when an included layer is added or removed from the map", function () {
			var baseLayer = L.tileLayer(),
			    overlay = L.marker([0, 0]),
			    layers = L.control.layers({"Base": baseLayer}, {"Overlay": overlay}).addTo(map);

			var spy = sinon.spy(layers, '_update');

			map.addLayer(overlay);
			map.removeLayer(overlay);

			expect(spy.called).to.be.ok();
			expect(spy.callCount).to.eql(2);
		});

		it("when an included layer is added or removed from the map, it's (un)checked", function () {
			document.body.appendChild(map._container);
			var baseLayer = L.tileLayer(),
			    overlay = L.marker([0, 0]),
			    layers = L.control.layers({"Baselayer": baseLayer}, {"Overlay": overlay}).addTo(map);

			function isChecked() {
				return !!(map._container.querySelector('.leaflet-control-layers-overlays input').checked);
			}

			expect(isChecked()).to.not.be.ok();
			map.addLayer(overlay);
			expect(isChecked()).to.be.ok();
			map.removeLayer(overlay);
			expect(isChecked()).to.not.be.ok();
		});

		it("not when a non-included layer is added or removed", function () {
			var baseLayer = L.tileLayer(),
			    overlay = L.marker([0, 0]),
			    layers = L.control.layers({"Base": baseLayer}).addTo(map);

			var spy = sinon.spy(layers, '_update');

			map.addLayer(overlay);
			map.removeLayer(overlay);

			expect(spy.called).to.not.be.ok();
		});

		it("updates when an included layer is removed from the control", function () {
			document.body.appendChild(map._container);
			var baseLayer = L.tileLayer(),
			    overlay = L.marker([0, 0]),
			    layers = L.control.layers({"Base": baseLayer}, {"Overlay": overlay}).addTo(map);

			layers.removeLayer(overlay);
			expect(map._container.querySelector('.leaflet-control-layers-overlays').children.length)
				.to.be.equal(0);
		});

		it('silently returns when trying to remove a non-existing layer from the control', function () {
			var layers = L.control.layers({'base': L.tileLayer()}).addTo(map);

			expect(function () {
				layers.removeLayer(L.marker([0, 0]));
			}).to.not.throwException();

			expect(layers._layers.length).to.be.equal(1);
		});

		it("having repeated layers works as expected", function () {
			document.body.appendChild(map._container);
			var layerA = L.tileLayer(''), layerB = L.tileLayer(''),
			    baseLayers = {"Layer 1": layerA, "Layer 2": layerB, "Layer 3": layerA},
			    layers = L.control.layers(baseLayers).addTo(map);

			function checkInputs(idx) {
				var inputs = map._container.querySelectorAll('.leaflet-control-layers-base input');
				for (var i = 0; i < inputs.length; i++) {
					expect(inputs[i].checked === (idx === i)).to.be.ok();
				}
			}

			happen.click(layers._baseLayersList.getElementsByTagName("input")[1]);
			checkInputs(1);
			expect(map._layers[L.Util.stamp(layerB)]).to.be.equal(layerB);
			expect(map._layers[L.Util.stamp(layerA)]).to.be.equal(undefined);
			happen.click(layers._baseLayersList.getElementsByTagName("input")[0]);
			checkInputs(0);
			expect(map._layers[L.Util.stamp(layerA)]).to.be.equal(layerA);
			expect(map._layers[L.Util.stamp(layerB)]).to.be.equal(undefined);
			happen.click(layers._baseLayersList.getElementsByTagName("input")[2]);
			checkInputs(2);
			expect(map._layers[L.Util.stamp(layerA)]).to.be.equal(layerA);
			expect(map._layers[L.Util.stamp(layerB)]).to.be.equal(undefined);
		});
	});

	describe("is removed cleanly", function () {
		beforeEach(function () {
			map.setView([0, 0], 14);
		});

		it("and layers in the control can still be removed", function () {
			var baseLayer = L.tileLayer('').addTo(map);
			var layersCtrl = L.control.layers({'Base': baseLayer}).addTo(map);
			map.removeControl(layersCtrl);

			expect(function () {
				map.removeLayer(baseLayer);
			}).to.not.throwException();
		});

		it("and layers in the control can still be removed when added after removing control from map", function () {
			var baseLayer = L.tileLayer('').addTo(map);
			var layersCtrl = L.control.layers().addTo(map);
			map.removeControl(layersCtrl);
			layersCtrl.addBaseLayer(baseLayer, 'Base');

			expect(function () {
				map.removeLayer(baseLayer);
			}).to.not.throwException();
		});
	});

	describe("is created with an expand link", function ()  {
		it("when collapsed", function () {
			var layersCtrl = L.control.layers(null, null, {collapsed: true}).addTo(map);
			expect(map._container.querySelector('.leaflet-control-layers-toggle')).to.be.ok();
		});

		it("when not collapsed", function () {
			var layersCtrl = L.control.layers(null, null, {collapsed: false}).addTo(map);
			expect(map._container.querySelector('.leaflet-control-layers-toggle')).to.be.ok();
		});
	});

	describe("collapse when collapsed: true", function () {
		it('expands when mouse is over', function () {
			var layersCtrl = L.control.layers(null, null, {collapsed: true}).addTo(map);
			happen.once(layersCtrl._container, {type:'mouseover'});
			expect(map._container.querySelector('.leaflet-control-layers-expanded')).to.be.ok();
		});
		it('collapses when mouse is out', function () {
			var layersCtrl = L.control.layers(null, null, {collapsed: true}).addTo(map);
			happen.once(layersCtrl._container, {type:'mouseover'});
			happen.once(layersCtrl._container, {type:'mouseout'});
			expect(map._container.querySelector('.leaflet-control-layers-expanded')).to.not.be.ok();
		});
		it('collapses when map is clicked', function () {
			var layersCtrl = L.control.layers(null, null, {collapsed: true}).addTo(map);
			map.setView([0, 0], 0);
			happen.once(layersCtrl._container, {type:'mouseover'});
			expect(map._container.querySelector('.leaflet-control-layers-expanded')).to.be.ok();
			happen.click(map._container);
			expect(map._container.querySelector('.leaflet-control-layers-expanded')).to.not.be.ok();
		});
	});

	describe("does not collapse when collapsed: false", function () {
		it('does not collapse when mouse enters or leaves', function () {
			var layersCtrl = L.control.layers(null, null, {collapsed: false}).addTo(map);
			expect(map._container.querySelector('.leaflet-control-layers-expanded')).to.be.ok();
			happen.once(layersCtrl._container, {type:'mouseover'});
			expect(map._container.querySelector('.leaflet-control-layers-expanded')).to.be.ok();
			happen.once(layersCtrl._container, {type:'mouseout'});
			expect(map._container.querySelector('.leaflet-control-layers-expanded')).to.be.ok();
		});
		it('does not collapse when map is clicked', function () {
			var layersCtrl = L.control.layers(null, null, {collapsed: false}).addTo(map);
			map.setView([0, 0], 0);
			expect(map._container.querySelector('.leaflet-control-layers-expanded')).to.be.ok();
			happen.click(map._container);
			expect(map._container.querySelector('.leaflet-control-layers-expanded')).to.be.ok();
		});
		it('is scrollable if necessary when added on map', function () {
			var layersCtrl = L.control.layers(null, null, {collapsed: false}),
			    div = document.createElement('div'),
			    i = 0;

			// Need to create a DIV with specified height and insert it into DOM, so that the browser
			// gives it an actual size.
			map.remove();
			div.style.height = div.style.width = '200px';
			document.body.appendChild(div);
			map = L.map(div);

			for (; i < 20; i += 1) {
				// Default text size: 12px => 12 * 20 = 240px height (not even considering padding/margin).
				layersCtrl.addOverlay(L.marker([0, 0]), i);
			}

			layersCtrl.addTo(map);

			expect(div.clientHeight).to.be.greaterThan(0); // Make sure first that the map container has a height, otherwise this test is useless.
			expect(div.clientHeight).to.be.greaterThan(layersCtrl._container.clientHeight);
			expect(layersCtrl._form.classList.contains('leaflet-control-layers-scrollbar')).to.be(true);
		});
		it('becomes scrollable if necessary when too many layers are added while it is already on map', function () {
			var layersCtrl = L.control.layers(null, null, {collapsed: false}),
			    div = document.createElement('div'),
			    i = 0;

			// Need to create a DIV with specified height and insert it into DOM, so that the browser
			// gives it an actual size.
			map.remove();
			div.style.height = div.style.width = '200px';
			document.body.appendChild(div);
			map = L.map(div);

			layersCtrl.addTo(map);
			expect(layersCtrl._form.classList.contains('leaflet-control-layers-scrollbar')).to.be(false);

			for (; i < 20; i += 1) {
				// Default text size: 12px => 12 * 20 = 240px height (not even considering padding/margin).
				layersCtrl.addOverlay(L.marker([0, 0]), i);
			}

			expect(div.clientHeight).to.be.greaterThan(layersCtrl._container.clientHeight);
			expect(layersCtrl._form.classList.contains('leaflet-control-layers-scrollbar')).to.be(true);
		});
	});

	describe("sortLayers", function () {
		beforeEach(function () {
			map.setView([0, 0], 14);
		});

		it("keeps original order by default", function () {
			var baseLayerOne = L.tileLayer('').addTo(map);
			var baseLayerTwo = L.tileLayer('').addTo(map);
			var markerC = L.marker([0, 2]).addTo(map);
			var markerB = L.marker([0, 1]).addTo(map);
			var markerA = L.marker([0, 0]).addTo(map);

			var layersCtrl = L.control.layers({
				'Base One': baseLayerOne,
				'Base Two': baseLayerTwo
			}, {
				'Marker C': markerC,
				'Marker B': markerB,
				'Marker A': markerA
			}).addTo(map);

			var elems = map.getContainer().querySelectorAll('div.leaflet-control-layers label span');
			expect(elems[0].innerHTML.trim()).to.be.equal('Base One');
			expect(elems[1].innerHTML.trim()).to.be.equal('Base Two');
			expect(elems[2].innerHTML.trim()).to.be.equal('Marker C');
			expect(elems[3].innerHTML.trim()).to.be.equal('Marker B');
			expect(elems[4].innerHTML.trim()).to.be.equal('Marker A');
		});

		it("sorts alphabetically if no function is specified", function () {
			var baseLayerOne = L.tileLayer('').addTo(map);
			var baseLayerTwo = L.tileLayer('').addTo(map);
			var markerA = L.marker([0, 0]).addTo(map);
			var markerB = L.marker([0, 1]).addTo(map);
			var markerC = L.marker([0, 2]).addTo(map);

			var layersCtrl = L.control.layers({
				'Base Two': baseLayerTwo,
				'Base One': baseLayerOne
			}, {
				'Marker A': markerA,
				'Marker C': markerC,
				'Marker B': markerB
			}, {
				sortLayers: true
			}).addTo(map);

			var elems = map.getContainer().querySelectorAll('div.leaflet-control-layers label span');
			expect(elems[0].innerHTML.trim()).to.be.equal('Base One');
			expect(elems[1].innerHTML.trim()).to.be.equal('Base Two');
			expect(elems[2].innerHTML.trim()).to.be.equal('Marker A');
			expect(elems[3].innerHTML.trim()).to.be.equal('Marker B');
			expect(elems[4].innerHTML.trim()).to.be.equal('Marker C');
		});

		it("uses the compare function to sort layers", function () {
			var baseLayerOne = L.tileLayer('', {customOption: 999}).addTo(map);
			var baseLayerTwo = L.tileLayer('', {customOption: 998}).addTo(map);
			var markerA = L.marker([0, 0], {customOption: 102}).addTo(map);
			var markerB = L.marker([0, 1], {customOption: 100}).addTo(map);
			var markerC = L.marker([0, 2], {customOption: 101}).addTo(map);

			var layersCtrl = L.control.layers({
				'Base One': baseLayerOne,
				'Base Two': baseLayerTwo
			}, {
				'Marker A': markerA,
				'Marker B': markerB,
				'Marker C': markerC
			}, {
				sortLayers: true,
				sortFunction: function (a, b) { return a.options.customOption - b.options.customOption; }
			}).addTo(map);

			var elems = map.getContainer().querySelectorAll('div.leaflet-control-layers label span');
			expect(elems[0].innerHTML.trim()).to.be.equal('Base Two');
			expect(elems[1].innerHTML.trim()).to.be.equal('Base One');
			expect(elems[2].innerHTML.trim()).to.be.equal('Marker B');
			expect(elems[3].innerHTML.trim()).to.be.equal('Marker C');
			expect(elems[4].innerHTML.trim()).to.be.equal('Marker A');
		});
	});

});
