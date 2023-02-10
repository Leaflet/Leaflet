export {Renderer} from './Renderer.js';
export {Canvas, canvas} from './Canvas.js';
import {SVG, create, pointsToPath, svg} from './SVG.js';
SVG.create = create;
SVG.pointsToPath = pointsToPath;
export {SVG, svg};
import './Renderer.getRenderer.js';	// This is a bit of a hack, but needed because circular dependencies

export {Path} from './Path.js';
export {CircleMarker, circleMarker} from './CircleMarker.js';
export {Circle, circle} from './Circle.js';
export {Polyline, polyline} from './Polyline.js';
export {Polygon, polygon} from './Polygon.js';
export {Rectangle, rectangle} from './Rectangle.js';
