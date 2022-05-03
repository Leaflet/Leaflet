import { Map } from "../map/Map";
import { ControlOptions, Control } from "./Control";

export interface ZoomOptions extends ControlOptions {
  zoomInText?: string | undefined;
  zoomInTitle?: string | undefined;
  zoomOutText?: string | undefined;
  zoomOutTitle?: string | undefined;
}

export class Zoom extends Control {
  constructor(options?: ZoomOptions);
  options: ZoomOptions;
  onAdd(map: Map): HTMLElement;
  onRemove(map: Map): void;
}

export function zoom(options?: ZoomOptions): Zoom;
