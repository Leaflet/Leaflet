describe("Map.Keyboard", function () {

	var map, container;

	beforeEach(function () {
		container = document.createElement('div');
		container.style.width = container.style.height = '600px';
		container.style.top = container.style.left = 0;
		container.style.position = 'absolute';
		document.body.appendChild(container);
		map = L.map(container, {
			zoomAnimation: false	// If true, the test has to wait extra 250msec
		});

		map.setView([0, 0], 5);

		// Keyboard functionality expects the map to be focused (clicked or cycle-tabbed)
		// However this can only happen with trusted events (non-synthetic), so
		// this bit has to be faked.
		map.keyboard._onFocus();
	});

	afterEach(function () {
		map.remove();
		document.body.removeChild(container);
	});

	describe("cursor keys", function () {
		it("move the map north", function (done) {

			happen.keydown(document,  {keyCode: 38});	// 38 = cursor up
			happen.keypress(document, {keyCode: 38});
			happen.keyup(document,    {keyCode: 38});

			setTimeout(function () {
				expect(map.getCenter().lat).to.be.greaterThan(0);
				done();
			}, 300);
		});

		it("move the map south", function (done) {

			happen.keydown(document,  {keyCode: 40});	// 40 = cursor down
			happen.keypress(document, {keyCode: 40});
			happen.keyup(document,    {keyCode: 40});

			setTimeout(function () {
				expect(map.getCenter().lat).to.be.lessThan(0);
				done();
			}, 300);
		});

		it("move the map west", function (done) {

			happen.keydown(document,  {keyCode: 37});	// 37 = cursor left
			happen.keypress(document, {keyCode: 37});
			happen.keyup(document,    {keyCode: 37});

			setTimeout(function () {
				expect(map.getCenter().lng).to.be.lessThan(0);
				done();
			}, 300);
		});

		it("move the map east", function (done) {

			happen.keydown(document,  {keyCode: 39});	// 39 = cursor right
			happen.keypress(document, {keyCode: 39});
			happen.keyup(document,    {keyCode: 39});

			setTimeout(function () {
				expect(map.getCenter().lng).to.be.greaterThan(0);
				done();
			}, 300);
		});
	});

	describe("plus/minus keys", function () {
		it("zoom in", function (done) {

			happen.keydown(document,  {keyCode: 171});	// 171 = +
			happen.keypress(document, {keyCode: 171});
			happen.keyup(document,    {keyCode: 171});

			setTimeout(function () {
				expect(map.getZoom()).to.be.greaterThan(5);
				done();
			}, 300);
		});

		it("zoom out", function (done) {

			happen.keydown(document,  {keyCode: 173});	// 173 = - (in firefox)
			happen.keypress(document, {keyCode: 173});
			happen.keyup(document,    {keyCode: 173});

			setTimeout(function () {
				expect(map.getZoom()).to.be.lessThan(5);
				done();
			}, 300);
		});
	});

	describe("does not move the map if disabled", function () {
		it("no zoom in", function (done) {

			map.keyboard.disable();

			happen.keydown(document,  {keyCode: 171});	// 171 = +
			happen.keypress(document, {keyCode: 171});
			happen.keyup(document,    {keyCode: 171});

			setTimeout(function () {
				expect(map.getZoom()).to.eql(5);
				done();
			}, 300);
		});

		it("no move north", function (done) {

			map.keyboard.disable();

			happen.keydown(document,  {keyCode: 38});	// 38 = cursor up
			happen.keypress(document, {keyCode: 38});
			happen.keyup(document,    {keyCode: 38});

			setTimeout(function () {
				expect(map.getCenter().lat).to.eql(0);
				done();
			}, 300);
		});
	});


	describe("popup closing", function () {
		it("closes a popup when pressing escape", function () {

			var popup = L.popup().setLatLng([0, 0]).setContent('Null Island');
			map.openPopup(popup);

			expect(popup.isOpen()).to.be(true);

			happen.keydown(document,  {keyCode: 27});	// 27 = Esc
			// happen.keypress(document, {keyCode: 27});
			happen.keyup(document,    {keyCode: 27});

			expect(popup.isOpen()).to.be(false);
		});
	});

	describe("popup closing disabled", function () {
		it("close of popup when pressing escape disabled via options", function () {

			var popup = L.popup({closeOnEscapeKey: false}).setLatLng([0, 0]).setContent('Null Island');
			map.openPopup(popup);

			expect(popup.isOpen()).to.be(true);

			happen.keydown(document,  {keyCode: 27});
			happen.keyup(document,    {keyCode: 27});

			expect(popup.isOpen()).to.be(true);
		});
	});

});
