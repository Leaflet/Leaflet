type instanceOfConstructor<T> = T extends { new (...args: any[]): infer V }
  ? V
  : T;

export class Class {
  static extend<
    Base extends typeof Class,
    P extends Record<string, Function | number | string>
  >(
    this: Base,
    props: P
  ): { new (...args: any[]): instanceOfConstructor<Base> & P } & Base;

  static include<Base extends typeof Class>(this: Base, props: any): Base;
  static mergeOptions<Base extends typeof Class>(this: Base, props: any): Base;

  static addInitHook<Base extends typeof Class>(
    this: Base,
    initHookFn: () => void
  ): Base;
  static addInitHook<Base extends typeof Class>(
    this: Base,
    methodName: string,
    ...args: any[]
  ): Base;
}
