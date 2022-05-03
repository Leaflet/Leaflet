import { Map } from "../map/Map";
import { ControlOptions, Control } from "./Control";

export interface ScaleOptions extends ControlOptions {
  maxWidth?: number | undefined;
  metric?: boolean | undefined;
  imperial?: boolean | undefined;
  updateWhenIdle?: boolean | undefined;
}

export class Scale extends Control {
  constructor(options?: ScaleOptions);
  options: ScaleOptions;
  onAdd(map: Map): HTMLElement;
  onRemove(map: Map): void;
}

export function scale(options?: ScaleOptions): Scale;
