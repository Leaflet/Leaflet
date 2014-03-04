describe("Map.Drag", function () {
	describe("#addHook", function () {
		it("calls the map with dragging enabled", function () {
			var container = document.createElement('div'),
				map = new L.Map(container, {
					dragging: true
				});

			expect(map.dragging.enabled()).to.be(true);
			map.setView([0, 0], 0);
			expect(map.dragging.enabled()).to.be(true);
		});
		it("calls the map with dragging and worldCopyJump enabled", function () {
			var container = document.createElement('div'),
				map = new L.Map(container, {
					dragging: true,
					worldCopyJump: true
				});

			expect(map.dragging.enabled()).to.be(true);
			map.setView([0, 0], 0);
			expect(map.dragging.enabled()).to.be(true);
		});
		it("calls the map with dragging disabled and worldCopyJump enabled; " +
				"enables dragging after setting center and zoom", function () {
			var container = document.createElement('div'),
				map = new L.Map(container, {
					dragging: false,
					worldCopyJump: true
				});

			expect(map.dragging.enabled()).to.be(false);
			map.setView([0, 0], 0);
			map.dragging.enable();
			expect(map.dragging.enabled()).to.be(true);
		});
	});
});
