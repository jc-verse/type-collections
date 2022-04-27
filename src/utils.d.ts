import type { U2I } from ".";

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
