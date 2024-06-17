
// @namespace SVG; @section
// There are several static functions which can be called without instantiating L.SVG:

// @function create(name: String): SVGElement
// Returns a instance of [SVGElement](https://developer.mozilla.org/docs/Web/API/SVGElement),
// corresponding to the class name passed. For example, using 'line' will return
// an instance of [SVGLineElement](https://developer.mozilla.org/docs/Web/API/SVGLineElement).
export function svgCreate(name) {
	return document.createElementNS('http://www.w3.org/2000/svg', name);
}

// @function pointsToPath(rings: Point[], closed: Boolean): String
// Generates a SVG path string for multiple rings, with each ring turning
// into "M..L..L.." instructions
export function pointsToPath(rings, closed) {
	let str = '',
	i, j, len, len2, points, p;

	for (i = 0, len = rings.length; i < len; i++) {
		points = rings[i];

		for (j = 0, len2 = points.length; j < len2; j++) {
			p = points[j];
			str += `${(j ? 'L' : 'M') + p.x} ${p.y}`;
		}

		// closes the ring for polygons
		str += closed ? 'z' : '';
	}

	// SVG complains about empty path strings
	return str || 'M0 0';
}

// @function pointsToCurvedPath(rings: Point[], closed: Boolean, smoothing: number): String
// Generates a curved SVG path string (using Bézier curves) for multiple rings, with each ring turning
// into "M..C..C.." instructions
export function pointsToCurvedPath(rings, closed, smoothing = 0.1) {
	let path = '';
	for (let i = 0; i < rings.length; i++) {
		const points = rings[i];

		const cmds = curvedPathCommands(points, closed, smoothing);
		path += commandsToPath(cmds);
	}
	return path;
}

// @function curvedPathCommands(rings: Point[], closed: Boolean, smoothing: number): Command
// Generates a curved SVG path commands (using Bézier curves) for multiple rings, with each ring turning
// into `{type: 'C', values: [..]}` commands
export function curvedPathCommands(points, closed, smoothing = 0.1) {
	// append first 2 points for closed paths
	if (closed) {
		points = points.concat(points.slice(0, 2));
	}

	// Properties of a line
	const line = (a, b) => {
		const lengthX = b.x - a.x;
		const lengthY = b.y - a.y;
		return {
			length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
			angle: Math.atan2(lengthY, lengthX)
		};
	};

	// Position of a control point
	const controlPoint = (current, previous, next, reverse) => {
		const p = previous || current;
		const n = next || current;
		const o = line(p, n);

		const angle = o.angle + (reverse ? Math.PI : 0);
		const length = o.length * smoothing;

		const x = current.x + Math.cos(angle) * length;
		const y = current.y + Math.sin(angle) * length;
		return {x, y};
	};

	let cmds = [];
	cmds.push({type: 'M', values: [points[0].x, points[0].y]});

	for (let i = 1; i < points.length; i++) {
		const point = points[i];
		const cp1 = controlPoint(points[i - 1], points[i - 2], point);
		const cp2 = controlPoint(point, points[i - 1], points[i + 1], true);
		const command = {
			type: 'C',
			values: [cp1.x, cp1.y, cp2.x, cp2.y, point.x, point.y]
		};

		cmds.push(command);
	}

	// copy last commands 1st control point to first curveTo
	if (closed) {
		const comLast = cmds[cmds.length - 1];
		const valuesLastC = comLast.values;
		const valuesFirstC = cmds[1].values;

		cmds[1] = {
			type: 'C',
			values: [valuesLastC[0], valuesLastC[1], valuesFirstC.slice(2)].flat()
		};
		// delete last curveto
		cmds = cmds.slice(0, cmds.length - 1);
	}

	return cmds;
}

function commandsToPath(commands, decimals = 3) {
	return commands
		.map(com => `${com.type}${com.values.map(value => +value.toFixed(decimals)).join(' ')}`)
		.join(' ');
}
