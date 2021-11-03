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
}

export function scale(options?: ScaleOptions): Scale;
