import { LeafletEvent } from "../core/Events";
import { LeafletMouseEvent, LeafletKeyboardEvent, Point } from "../Leaflet";

namespace DomEvent {
    export type EventHandlerFn = (event: Event) => void;

    export type PropagableEvent = LeafletMouseEvent |
        LeafletKeyboardEvent |
        LeafletEvent |
        Event;

    export function on(
        el: HTMLElement,
        types: string,
        fn: EventHandlerFn,
        context?: any
    ): typeof DomEvent;

    export function on(
        el: HTMLElement,
        eventMap: { [eventName: string]: EventHandlerFn; },
        context?: any
    ): typeof DomEvent;

    export function off(
        el: HTMLElement,
        types: string,
        fn: EventHandlerFn,
        context?: any
    ): typeof DomEvent;

    export function off(
        el: HTMLElement,
        eventMap: { [eventName: string]: EventHandlerFn; },
        context?: any
    ): typeof DomEvent;

    export function stopPropagation(ev: PropagableEvent): typeof DomEvent;

    export function disableScrollPropagation(el: HTMLElement): typeof DomEvent;

    export function disableClickPropagation(el: HTMLElement): typeof DomEvent;

    export function preventDefault(ev: Event): typeof DomEvent;

    export function stop(ev: PropagableEvent): typeof DomEvent;

    export function getMousePosition(ev: MouseEvent, container?: HTMLElement): Point;

    export function getWheelDelta(ev: Event): number;

    export function addListener(
        el: HTMLElement,
        types: string,
        fn: EventHandlerFn,
        context?: any
    ): typeof DomEvent;

    export function addListener(
        el: HTMLElement,
        eventMap: { [eventName: string]: EventHandlerFn; },
        context?: any
    ): typeof DomEvent;

    export function removeListener(
        el: HTMLElement,
        types: string,
        fn: EventHandlerFn,
        context?: any
    ): typeof DomEvent;

    export function removeListener(
        el: HTMLElement,
        eventMap: { [eventName: string]: EventHandlerFn; },
        context?: any
    ): typeof DomEvent;
}

export = DomEvent