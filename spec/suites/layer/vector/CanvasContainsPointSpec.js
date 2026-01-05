describe('Canvas _containsPoint', () => {
	let map, container;

	beforeEach(() => {
		container = document.createElement('div');
		container.style.width = '400px';
		container.style.height = '400px';
		document.body.appendChild(container);

		map = new L.Map(container, {
			center: [0, 0],
			zoom: 5,
			preferCanvas: true
		});
	});

	afterEach(() => {
		map.remove();
		document.body.removeChild(container);
	});

	it('detects point inside polygon', () => {
		const polygon = new L.Polygon([
			[0, 0],
			[0, 10],
			[10, 10],
			[10, 0]
		]).addTo(map);

		const renderer = polygon._renderer;
		const layerPoint = map.latLngToLayerPoint([5, 5]);

		expect(renderer._containsPoint(polygon, layerPoint)).toBe(true);
	});

	it('does not detect point outside polygon', () => {
		const polygon = new L.Polygon([
			[0, 0],
			[0, 10],
			[10, 10],
			[10, 0]
		]).addTo(map);

		const renderer = polygon._renderer;
		const layerPoint = map.latLngToLayerPoint([20, 20]);

		expect(renderer._containsPoint(polygon, layerPoint)).toBe(false);
	});

	it('does not detect point inside polygon hole', () => {
		const polygon = new L.Polygon([
			[
				[0, 0],
				[0, 10],
				[10, 10],
				[10, 0]
			],
			[
				[3, 3],
				[3, 7],
				[7, 7],
				[7, 3]
			]
		]).addTo(map);

		const renderer = polygon._renderer;
		const layerPoint = map.latLngToLayerPoint([5, 5]);

		expect(renderer._containsPoint(polygon, layerPoint)).toBe(false);
	});
});
