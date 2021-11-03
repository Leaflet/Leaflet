import { Class } from "./Class";

export type EventMap = {
  [name: string]: LeafletEvent;
};

export interface LeafletEvent {
  type: string;
  target: any;
  sourceTarget: any;
  propagatedFrom: any;
  /**
   * @deprecated The same as {@link LeafletEvent.propagatedFrom propagatedFrom}.
   */
  layer: any;
}

export type defaultHandler = (event: LeafletEvent) => void;

export type EventMapToHandlerMap<E extends EventMap> = {
  [K in keyof E]: (event: E[K]) => void;
};

export class Evented<EVENTS extends EventMap = EventMap> extends Class {
  /**
   * Adds a set of type/listener pairs, e.g. {click: onClick, mousemove: onMouseMove}
   */
  on(eventMap: EventMapToHandlerMap<EVENTS>): this;
  on<E extends keyof EVENTS>(
    type: E,
    fn: (event: EVENTS[E]) => void,
    context?: any
  ): this;
  on(type: string, fn: defaultHandler, context?: any): this;

  /**
   * Removes a set of type/listener pairs.
   */
  off(eventMap: EventMapToHandlerMap<EVENTS>): this;
  /**
   * Removes a previously added listener function. If no function is specified,
   * it will remove all the listeners of that particular event from the object.
   * Note that if you passed a custom context to on, you must pass the same context
   * to off in order to remove the listener.
   */
  off<E extends keyof EVENTS>(
    type: E,
    fn: (event: EVENTS[E]) => void,
    context?: any
  ): this;
  off(type: string, fn: defaultHandler, context?: any): this;
  /**
   * Removes all listeners to all events on the object.
   */
  off(): this;

  /**
   * Fires an event of the specified type. You can optionally provide a data
   * object — the first argument of the listener function will contain its properties.
   * The event might can optionally be propagated to event parents.
   */
  fire<E extends keyof EVENTS>(
    type: E,
    data?: Omit<EVENTS[E], "type" | "target" | "sourceTarget">,
    propagate?: boolean
  ): this;
  /**
   * Fires an event of the specified type. You can optionally provide a data
   * object — the first argument of the listener function will contain its properties.
   * The event might can optionally be propagated to event parents.
   */
  fire(type: string, data?: any, propagate?: boolean): this;

  /**
   * Returns true if a particular event type has any listeners attached to it.
   */
  listens<E extends keyof EVENTS>(type: E): boolean;
  listens(type: string): boolean;

  /**
   * Behaves as on(...), except the listener will only get fired once and then removed.
   */
  once(eventMap: EventMapToHandlerMap<EVENTS>): this;
  once<E extends keyof EVENTS>(
    type: E,
    fn: (event: EVENTS[E]) => void,
    context?: any
  ): this;
  once(type: string, fn: defaultHandler, context?: any): this;

  /**
   * Adds an event parent - an Evented that will receive propagated events
   */
  addEventParent(obj: Evented): this;

  /**
   * Removes an event parent, so it will stop receiving propagated events
   */
  removeEventParent(obj: Evented): this;

  /**
   * Alias for on(...)
   *
   * Adds a listener function (fn) to a particular event type of the object.
   * You can optionally specify the context of the listener (object the this
   * keyword will point to). You can also pass several space-separated types
   * (e.g. 'click dblclick').
   */
  addEventListener(eventMap: EventMapToHandlerMap<EVENTS>): this;
  addEventListener<E extends keyof EVENTS>(
    type: E,
    fn: (event: EVENTS[E]) => void,
    context?: any
  ): this;
  addEventListener(type: string, fn: defaultHandler, context?: any): this;

  /**
   * Alias for off(...)
   *
   * Removes a previously added listener function. If no function is specified,
   * it will remove all the listeners of that particular event from the object.
   * Note that if you passed a custom context to on, you must pass the same context
   * to off in order to remove the listener.
   */
  removeEventListener<E extends keyof EVENTS>(
    type: E,
    fn: (event: EVENTS[E]) => void,
    context?: any
  ): this;
  removeEventListener(eventMap: EventMapToHandlerMap<EVENTS>): this;
  removeEventListener(type: string, fn: defaultHandler, context?: any): this;
  /**
   * Removes all listeners to all events on the object.
   */
  removeEventListener(): this;

  /**
   * Alias for off()
   *
   * Removes all listeners to all events on the object.
   */
  clearAllEventListeners(): this;

  /**
   * Alias for once(...)
   *
   * Behaves as on(...), except the listener will only get fired once and then removed.
   */
  once(eventMap: EventMapToHandlerMap<EVENTS>): this;
  once<E extends keyof EVENTS>(
    type: E,
    fn: (event: EVENTS[E]) => void,
    context?: any
  ): this;
  once(type: string, fn: defaultHandler, context?: any): this;
  /**
   * Alias for fire(...)
   *
   * Fires an event of the specified type. You can optionally provide a data
   * object — the first argument of the listener function will contain its properties.
   * The event might can optionally be propagated to event parents.
   */
  fireEvent<E extends keyof EVENTS>(
    type: E,
    data?: Omit<EVENTS[E], "type" | "target" | "sourceTarget">,
    propagate?: boolean
  ): this;
  fireEvent(type: string, data?: any, propagate?: boolean): this;

  /**
   * Alias for listens(...)
   *
   * Returns true if a particular event type has any listeners attached to it.
   */
  hasEventListeners<E extends keyof EVENTS>(type: E): boolean;
  hasEventListeners(type: string): boolean;
}
