type doubleHandlers = {
  dblclick: Function;
  simDblclick: Function;
};
export function addDoubleTapListener(
  obj: HTMLElement,
  handler: (e: MouseEvent) => void
): doubleHandlers;

export function removeDoubleTapListener(
  obj: HTMLElement,
  handlers: doubleHandlers
): void;
