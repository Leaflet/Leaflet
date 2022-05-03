import { ControlOptions, Control } from "./Control";
import { Map } from "../map/Map";

export interface AttributionOptions extends ControlOptions {
  prefix?: string | boolean | undefined;
}

export class Attribution extends Control {
  constructor(options?: AttributionOptions);
  setPrefix(prefix: string | false): this;
  addAttribution(text: string): this;
  removeAttribution(text: string): this;
  options: AttributionOptions;
  onAdd(map: Map): HTMLElement;
  onRemove(map: Map): void;
}

export function attribution(options?: AttributionOptions): Attribution;
