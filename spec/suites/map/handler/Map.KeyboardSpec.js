describe("Map.Keyboard", () => {
	var KEYCODE_LOWERCASE_A = 65;
	var KEYCODE_ARROW_LEFT = 37;
	var KEYCODE_ARROW_UP = 38;
	var KEYCODE_ARROW_RIGHT = 39;
	var KEYCODE_ARROW_DOWN = 40;
	var KEYCODE_PLUS = 171;
	var KEYCODE_MINUS = 173;
	var KEYCODE_ESC = 27;

	var map, container;

	beforeEach(() => {
		container = createContainer();
		map = L.map(container, {
			zoomAnimation: false	// If true, the test has to wait extra 250msec
		});

		// make keyboard-caused panning instant to cut down on test running time
		map.panBy = function (offset) { return L.Map.prototype.panBy.call(this, offset, {animate: false}); };

		map.setView([0, 0], 5);

		// Keyboard functionality expects the map to be focused (clicked or cycle-tabbed)
		// However this can only happen with trusted events (non-synthetic), so
		// this bit has to be faked.
		map.keyboard._onFocus();
	});

	afterEach(() => {
		removeMapContainer(map, container);
	});

	describe("arrow keys", () => {
		it("move the map north", () => {
			happen.keydown(document,  {keyCode: KEYCODE_ARROW_UP});
			happen.keypress(document, {keyCode: KEYCODE_ARROW_UP});
			happen.keyup(document,    {keyCode: KEYCODE_ARROW_UP});

			expect(map.getCenter().lat).to.be.greaterThan(0);
		});

		it("move the map south", () => {
			happen.keydown(document,  {keyCode: KEYCODE_ARROW_DOWN});
			happen.keypress(document, {keyCode: KEYCODE_ARROW_DOWN});
			happen.keyup(document,    {keyCode: KEYCODE_ARROW_DOWN});

			expect(map.getCenter().lat).to.be.lessThan(0);
		});

		it("move the map west", () => {
			happen.keydown(document,  {keyCode: KEYCODE_ARROW_LEFT});
			happen.keypress(document, {keyCode: KEYCODE_ARROW_LEFT});
			happen.keyup(document,    {keyCode: KEYCODE_ARROW_LEFT});

			expect(map.getCenter().lng).to.be.lessThan(0);
		});

		it("move the map east", () => {
			happen.keydown(document,  {keyCode: KEYCODE_ARROW_RIGHT});
			happen.keypress(document, {keyCode: KEYCODE_ARROW_RIGHT});
			happen.keyup(document,    {keyCode: KEYCODE_ARROW_RIGHT});

			expect(map.getCenter().lng).to.be.greaterThan(0);
		});
	});

	describe("plus/minus keys", () => {
		it("zoom in", () => {
			happen.keydown(document,  {keyCode: KEYCODE_PLUS});
			happen.keypress(document, {keyCode: KEYCODE_PLUS});
			happen.keyup(document,    {keyCode: KEYCODE_PLUS});

			expect(map.getZoom()).to.be.greaterThan(5);
		});

		it("zoom out", () => {
			happen.keydown(document,  {keyCode: KEYCODE_MINUS});
			happen.keypress(document, {keyCode: KEYCODE_MINUS});
			happen.keyup(document,    {keyCode: KEYCODE_MINUS});

			expect(map.getZoom()).to.be.lessThan(5);
		});
	});

	describe("does not move the map if disabled", () => {
		it("no zoom in", () => {

			map.keyboard.disable();

			happen.keydown(document,  {keyCode: KEYCODE_PLUS});
			happen.keypress(document, {keyCode: KEYCODE_PLUS});
			happen.keyup(document,    {keyCode: KEYCODE_PLUS});

			expect(map.getZoom()).to.eql(5);
		});

		it("no move north", () => {

			map.keyboard.disable();

			happen.keydown(document,  {keyCode: KEYCODE_ARROW_UP});
			happen.keypress(document, {keyCode: KEYCODE_ARROW_UP});
			happen.keyup(document,    {keyCode: KEYCODE_ARROW_UP});

			expect(map.getCenter().lat).to.eql(0);
		});
	});


	describe("popup closing", () => {
		it("closes a popup when pressing escape", () => {

			var popup = L.popup().setLatLng([0, 0]).setContent('Null Island');
			map.openPopup(popup);

			expect(popup.isOpen()).to.be(true);

			happen.keydown(document,  {keyCode: KEYCODE_ESC});
			happen.keyup(document,    {keyCode: KEYCODE_ESC});

			expect(popup.isOpen()).to.be(false);
		});
	});

	describe("popup closing disabled", () => {
		it("close of popup when pressing escape disabled via options", () => {

			var popup = L.popup({closeOnEscapeKey: false}).setLatLng([0, 0]).setContent('Null Island');
			map.openPopup(popup);

			expect(popup.isOpen()).to.be(true);

			happen.keydown(document,  {keyCode: KEYCODE_ESC});
			happen.keyup(document,    {keyCode: KEYCODE_ESC});

			expect(popup.isOpen()).to.be(true);
		});
	});

	describe("keys events binding", () => {
		it("keypress", (done) => {
			var keyDownSpy = sinon.spy();
			var keyPressSpy = sinon.spy();
			var keyUpSpy = sinon.spy();

			map.on('keypress', keyPressSpy);
			happen.keypress(container, {keyCode: KEYCODE_LOWERCASE_A});

			setTimeout(() => {
				expect(keyDownSpy.called).to.be(false);
				expect(keyPressSpy.called).to.be.ok();
				expect(keyUpSpy.called).to.be(false);
				done();
			}, 50);
		});

		it("keydown", (done) => {
			var keyDownSpy = sinon.spy();
			var keyPressSpy = sinon.spy();
			var keyUpSpy = sinon.spy();

			map.on('keydown', keyDownSpy);
			happen.keydown(container, {keyCode: KEYCODE_LOWERCASE_A});

			setTimeout(() => {
				expect(keyDownSpy.called).to.be.ok();
				expect(keyPressSpy.called).to.be(false);
				expect(keyUpSpy.called).to.be(false);
				done();
			}, 50);
		});

		it("keyup", (done) => {
			var keyDownSpy = sinon.spy();
			var keyPressSpy = sinon.spy();
			var keyUpSpy = sinon.spy();

			map.on('keyup', keyUpSpy);
			happen.keyup(container, {keyCode: KEYCODE_LOWERCASE_A});

			setTimeout(() => {
				expect(keyDownSpy.called).to.be(false);
				expect(keyPressSpy.called).to.be(false);
				expect(keyUpSpy.called).to.be.ok();
				done();
			}, 50);
		});
	});
});
