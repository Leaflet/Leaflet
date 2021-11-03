import { Control as _Control } from "./Control";
import { Layers, layers } from "./Control.Layers";
import { Zoom, zoom } from "./Control.Zoom";
import { Scale, scale } from "./Control.Scale";
import { Attribution, attribution } from "./Control.Attribution";

export namespace control {
  export { zoom, scale, attribution, layers };
}

// TODO:
export abstract class Control extends _Control {}
export namespace Control {
  export { Layers, Zoom, Scale, Attribution };
}
