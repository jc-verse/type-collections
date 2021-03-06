import type { U2I } from ".";

export {};

/**
 * Picks a random union member. In practice it will pick the last from a
 * homogenous union (based on some internal representation order), but you
 * shouldn't rely on its order.
 */
export type OneOf<U> = U2I<U extends U ? (x: U) => 0 : never> extends (
  x: infer L,
) => 0
  ? L
  : never;

export type IsNumLiteral<N> = [N] extends [number]
  ? number extends N
    ? false
    : true
  : false;

// TODO: remove in 4.7 with infer...extends
export type Is<T extends C, C> = T;

export type ArgsCompatible<A extends unknown[], E extends unknown[]> = {
  [K in keyof E & `${number}`]: K extends keyof A
    ? A[K] extends E[K]
      ? 1
      : number
    : number;
}[keyof E & `${number}`] extends 1
  ? true
  : false;
