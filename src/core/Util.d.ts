export const extend: typeof Object.assign
export const create: typeof Object.create
export function bind(fn: (...args: any[]) => void, ...obj: any[]): () => void;
export function stamp(obj: any): number;
export function throttle(
  fn: () => void,
  time: number,
  context: any
): () => void;
export function wrapNum(
  num: number,
  range: number[],
  includeMax?: boolean
): number;
export function falseFn(): false;
export function formatNum(num: number, digits?: number): number;
export function trim(str: string): string;
export function splitWords(str: string): string[];
export function setOptions(obj: any, options: any): any;
export function getParamString(
  obj: any,
  existingUrl?: string,
  uppercase?: boolean
): string;
export function template(str: string, data: any): string;
export const isArray: typeof Array.isArray;
export function indexOf(array: any[], el: any): number;
export function requestAnimFrame(
  fn: (timestamp: number) => void,
  context?: any,
  immediate?: boolean
): number;
export function cancelAnimFrame(id: number): void;

export let lastId: number;
export let emptyImageUrl: string;
