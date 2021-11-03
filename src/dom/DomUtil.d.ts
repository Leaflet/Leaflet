import { Point } from "../Leaflet";

/**
 * Get Element by its ID or with the given HTML-Element
 */
export function get(element: string | HTMLElement): HTMLElement | null;
export function getStyle(el: HTMLElement, styleAttrib: string): string | null;
/**
 * Creates an HTML element with `tagName`, sets its class to `className`, and optionally appends it to `container` element.
 * @param tagName The name of the tag to create (for example: `div` or `canvas`).
 * @param className The class to set on the created element.
 * @param container The container to append the created element to.
 */
export function create<T extends keyof HTMLElementTagNameMap>(
  tagName: T,
  className?: string,
  container?: HTMLElement
): HTMLElementTagNameMap[T];
export function create(
  tagName: string,
  className?: string,
  container?: HTMLElement
): HTMLElement;
export function remove(el: HTMLElement): void;
export function empty(el: HTMLElement): void;
export function toFront(el: HTMLElement): void;
export function toBack(el: HTMLElement): void;
export function hasClass(el: HTMLElement, name: string): boolean;
export function addClass(el: HTMLElement, name: string): void;
export function removeClass(el: HTMLElement, name: string): void;
export function setClass(el: HTMLElement, name: string): void;
export function getClass(el: HTMLElement): string;
export function setOpacity(el: HTMLElement, opacity: number): void;
export function testProp(props: string[]): string | false;
export function setTransform(
  el: HTMLElement,
  offset: Point,
  scale?: number
): void;
export function setPosition(el: HTMLElement, position: Point): void;
export function getPosition(el: HTMLElement): Point;
export function disableTextSelection(): void;
export function enableTextSelection(): void;
export function disableImageDrag(): void;
export function enableImageDrag(): void;
export function preventOutline(el: HTMLElement): void;
export function restoreOutline(): void;

export let TRANSFORM: string;
export let TRANSITION: string;
export let TRANSITION_END: string;
