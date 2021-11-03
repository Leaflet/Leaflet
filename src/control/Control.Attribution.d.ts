import { ControlOptions, Control } from "./Control";

export interface AttributionOptions extends ControlOptions {
  prefix?: string | boolean | undefined;
}

export class Attribution extends Control {
  constructor(options?: AttributionOptions);
  setPrefix(prefix: string | false): this;
  addAttribution(text: string): this;
  removeAttribution(text: string): this;
  options: AttributionOptions;
}

export function attribution(options?: AttributionOptions): Attribution;
