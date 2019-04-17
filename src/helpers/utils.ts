/** Helper type for single arg function */
export type Func<A, B> = (a: A) => B;
export type FuncN<A extends any[], B> = (...args: A) => B;

/**
 * Compose 1 to n functions.
 * @param func first function
 * @param funcs additional functions
 */
export function compose<
  F1 extends Func<any, any>,
  FN extends Array<Func<any, any>>,
  R extends FN extends []
    ? F1
    : FN extends [Func<infer A, any>]
    ? (a: A) => ReturnType<F1>
    : FN extends [any, Func<infer A, any>]
    ? (a: A) => ReturnType<F1>
    : FN extends [any, any, Func<infer A, any>]
    ? (a: A) => ReturnType<F1>
    : FN extends [any, any, any, Func<infer A, any>]
    ? (a: A) => ReturnType<F1>
    : FN extends [any, any, any, any, Func<infer A, any>]
    ? (a: A) => ReturnType<F1>
    : Func<any, ReturnType<F1>> // Doubtful we'd ever want to pipe this many functions, but in the off chance someone does, we can still infer the return type
>(func: F1, ...funcs: FN): R {
  const allFuncs = [func, ...funcs];
  return function composed(raw: any) {
    return allFuncs.reduceRight((memo, func) => func(memo), raw);
  } as R;
}

/**
 * Tap return value. Useful in compose chain.
 * @param cb {A} function returning its input value
 */
export function tap<A>(cb: Func<A, void>): Func<A, A> {
  return (a: A) => {
    cb(a);
    return a;
  };
}

export type AddedRemoved = {
  added: number;
  removed: number;
};

export function trackAddedRemoved(mutations: MutationRecord[]): AddedRemoved {
  return mutations.reduce(
    (acc, { addedNodes, removedNodes }) => ({
      added: acc.added + addedNodes.length,
      removed: acc.removed + removedNodes.length
    }),
    { added: 0, removed: 0 }
  );
}

export function observeDOMNode(
  node: Node,
  callback: MutationCallback,
  options?: MutationObserverInit
) {
  const mutationObserver = new MutationObserver(callback);
  mutationObserver.observe(node, options);
  return mutationObserver;
}
