import { SVGOverlay as SVGOverlayInternal } from './SVGOverlay'

export class SVGOverlay extends SVGOverlayInternal {
  constructor(svgElement, bounds, options) {
    super(svgElement, bounds, options);
  }
}

export function svgOverlay() {
  return new SVGOverlay();
}
