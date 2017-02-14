export {Renderer} from './Renderer';
export {Canvas, canvas} from './Canvas';
import {SVG, create, pointsToPath, svg} from './SVG';
SVG.create = create;
SVG.pointsToPath = pointsToPath;
export {SVG, svg};
import './Renderer.getRenderer';	// This is a bit of a hack, but needed because circular dependencies

export {Path} from './Path';
export {CircleMarker, circleMarker} from './CircleMarker';
export {Circle, circle} from './Circle';
export {Polyline, polyline} from './Polyline';
export {Polygon, polygon} from './Polygon';
export {Rectangle, rectangle} from './Rectangle';
