import { Class } from "../core/Class";
import { Map } from "../map/Map";

export type ControlPosition =
  | "topleft"
  | "topright"
  | "bottomleft"
  | "bottomright";

export interface ControlOptions {
  position?: ControlPosition | undefined;
}

export abstract class Control extends Class {
  constructor(options?: ControlOptions);
  getPosition(): ControlPosition;
  setPosition(position: ControlPosition): this;
  getContainer(): HTMLElement | undefined;
  addTo(map: Map): this;
  remove(): this;

  // Extension methods
  abstract onAdd(map: Map): HTMLElement;
  abstract onRemove(map: Map): void;

  options: ControlOptions;
}
