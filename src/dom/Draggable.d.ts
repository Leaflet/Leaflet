import { Evented } from "../core/Events";

/**
 * A class for making DOM elements draggable (including touch support).
 * Used internally for map and marker dragging. Only works for elements
 * that were positioned with [`L.DomUtil.setPosition`](#domutil-setposition).
 */

export class Draggable extends Evented {
  constructor(
    element: HTMLElement,
    dragStartTarget?: HTMLElement,
    preventOutline?: boolean
  );

  enable(): void;

  disable(): void;

  finishDrag(): void;
}
