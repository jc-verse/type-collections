import type { OneOf, IsNumLiteral, Is } from "./utils";

// Important to make this file a module
export {};

/**
 * Union to intersection.
 *
 * - **Note 1** `unknown` and `never` are special-cased (`U2I<never>` is
 *   `unknown`, vice versa), because the invariant is: `U2I<A | B>` <=>
 *   `U2I<A> & U2I<B>`.
 * - **Note 2** Your union may already be collapsed before it can be converted
 *   to a tuple. So `U2I<"b" | string>` is `string`.
 * - **Note 3** The returned type will always be assignable to the input `U` (TS
 *   cannot prove this on its own in a generic context).
 */
export type U2I<U> = [U] extends [never]
  ? unknown
  : unknown extends U
  ? never
  : (U extends U ? (arg: U) => 0 : never) extends (arg: infer I) => 0
  ? I extends U
    ? I
    : never
  : never;

type _U2T<U, L> = [U] extends [never] ? [] : [...U2T<Exclude<U, L>>, L];
/**
 * Union to tuple. Inverse of {@link T2U}.
 *
 * - **Note 1** This will turn the unordered union into an ordered collection.
 *   If the union is homogeneous, you should expect the order to be preserved;
 *   but otherwise, it will be ordered according to the internal representation
 *   of the type. Do not take the actual ordering too seriously.
 * - **Note 2** Your union may already be collapsed before it can be converted
 *   to a tuple. So `U2T<"b" | string>` is `[string]`.
 */
export type U2T<U> = _U2T<U, OneOf<U>>;

/**
 * Tuple to union. Inverse of {@link U2T}.
 */
export type T2U<T extends unknown[]> = T[number];

type _U2P<U, R> = [U] extends [never]
  ? []
  : U extends U
  ? [U, ...U2P<Exclude<R, U>>]
  : never;
/**
 * Union to permutation. Very similar to {@link U2T}, but it generates all
 * possible permutations, so it's not order-sensitive.
 */
export type U2P<U> = _U2P<U, U>;

type TemplateVal = string | number | bigint | boolean | null | undefined;

/**
 * Takes an array, and joins them into a single string separated by `Sep`,
 * similar to `Array#join`. Inverse of {@link Split}.
 */
export type Join<
  Arr extends TemplateVal[],
  Sep extends TemplateVal = "",
> = Arr extends [Is<infer F, TemplateVal>, ...infer R]
  ? R extends [TemplateVal, ...TemplateVal[]]
    ? `${F}${Sep}${Join<R, Sep>}`
    : `${F}`
  : "";

/**
 * Takes a string, and returns a list of strings split at `Sep`. The `Sep`
 * themselves are not included, similar to `String#split`. Inverse of
 * {@link Join}.
 */
export type Split<
  S extends string,
  Sep extends TemplateVal = ",",
> = S extends ""
  ? Sep extends ""
    ? []
    : [S]
  : S extends `${infer F}${Sep}${infer R}`
  ? [F, ...Split<R, Sep>]
  : [S];

/**
 * Takes a list of key-value pairs, and returns an object type, similar to
 * `Object.fromEntries`. Inverse of {@link Entries}.
 *
 * - **Note 1** It is possible to produce malformed types, e.g.
 * `FromEntries<[["a", 1], [string, 3]]>` will produce
 * `{ a: 1; [x: string]: 3 }`, which no value is assignable to.
 */
export type FromEntries<KV extends [PropertyKey, unknown][]> = {
  [K in keyof KV as KV[K] extends [PropertyKey, unknown]
    ? KV[K][0]
    : never]: K extends string
    ? KV[K] extends unknown[]
      ? KV[K][1]
      : never
    : never;
};

/**
 * Takes an indexable object, and returns its key-value pairs as a list, similar
 * to `Object.entries`. Inverse of {@link FromEntries}.
 *
 * - **Note 1** You shouldn't rely on the actual ordering of the entries list,
 * because it uses the TS internal representation of the object type.
 */
export type Entries<O extends object> = O extends unknown[]
  ? { [K in keyof O]: [K, O[K]] }
  : U2T<{ [K in keyof O]: [K, O[K]] }[keyof O]>;

/**
 * Takes an indexable object, and returns its keys as a union.
 */
export type KeyUnion<O extends object> = O extends unknown[]
  ? IsNumLiteral<O["length"]> extends true
    ? Extract<keyof O, `${number}`>
    : number
  : keyof O;

// TODO: maybe Entries<O>[number] extends infer U ? U extends unknown[] ? U[0]
// : never : never; would work as well?

type _Tuple<
  L extends number,
  T,
  Tup extends unknown[],
> = L extends Tup["length"] ? Tup : _Tuple<L, T, [...Tup, T]>;
/**
 * Creates a tuple with length `L`, filled with a given type. The upper bound of
 * `L` seems to be `1000` (recursion limit). Inverse of {@link Length}.
 */
export type Tuple<L extends number, T = unknown> = number extends L
  ? T[]
  : _Tuple<L, T, []>;

/**
 * Gets the length of an array/tuple. Inverse of {@link Tuple}.
 */
export type Length<T extends unknown[]> = T["length"];

type XPathTuple<O, K extends (string | number)[]> = K extends []
  ? O
  : K extends [
      Is<infer F, string | number>,
      ...Is<infer R, (string | number)[]>,
    ]
  ? F extends keyof O
    ? XPathTuple<O[F], R>
    : never
  : never;

type XPathString<O, K extends string> = K extends `${infer F}.${infer R}`
  ? F extends keyof O
    ? XPathString<O[F], R>
    : never
  : K extends keyof O
  ? O[K]
  : never;

export type XPath<O, K extends (string | number)[] | string> = K extends string
  ? XPathString<O, K>
  : K extends (string | number)[]
  ? XPathTuple<O, K>
  : never;
