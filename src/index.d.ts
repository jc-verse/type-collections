import type { OneOf, IsNumLiteral } from "./utils";

/**
 * Union to intersection.
 *
 * ```ts
 * type A = Equal<U2I<{ a: 1 } | { b: 2 }>, { a: 1 } & { b: 2 }>;
 * type B = Equal<U2I<boolean>,             never              >;
 * type C = Equal<U2I<unknown>,             never              >; // Special!
 * type D = Equal<U2I<never>,               unknown            >; // Special!
 * ```
 *
 * Note that `unknown` and `never` are special-cased, because the invariant is:
 * `U2I<A | B>` <=> `U2I<A> & U2I<B>`.
 *
 * Note also that your union may already be collapsed before it can be converted
 * to a tuple. So `U2I<"b" | string>` is `string`.
 *
 * The returned type will always be assignable to the input `U` (TS cannot prove
 * this on its own in a generic context).
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
 * Union to tuple.
 *
 * ```ts
 * type Examples = [
 *   Equal<U2T<{ a: 1 } | { b: 2 }>, [{ a: 1 }, { b: 2 }]>,
 *   Equal<U2T<boolean>,             [false, true]       >,
 *   Equal<U2T<1 | string>,          [string, 1]         >, // Beware of order!
 *   Equal<U2T<unknown>,             [unknown]           >,
 *   Equal<U2T<never>,               []                  >,
 * ];
 * ```
 *
 * This will turn the unordered union into an ordered collection. If the union
 * is homogeneous, you should expect the order to be preserved; but otherwise,
 * it will be ordered according to the internal representation of the type. Do
 * not take the actual ordering too seriously.
 *
 * Note also that your union may already be collapsed before it can be converted
 * to a tuple. So `U2T<"b" | string>` is `[string]`.
 */
export type U2T<U> = _U2T<U, OneOf<U>>;

/**
 * Takes a list of key-value pairs, and returns an object type, similar to
 * `Object.fromEntries`. Inverse of {@link Entries}.
 *
 * ```ts
 * type Examples = [
 *   Equal<FromEntries<[["a", 1], ["b", 2]]>, { a: 1; b: 2 }      >,
 *   Equal<FromEntries<[[0, "a"], [1, "b"]]>, { 0: "a"; 1: "b" }  >,
 *   Equal<FromEntries<[[string, "a"]]>,      { [x: string]: "a" }>,
 *   Equal<FromEntries<[["a", 1], ["a", 2]]>, { a: 1 | 2 }        >,
 *   Equal<FromEntries<[]>,                   {}                  >,
 * ];
 * ```
 *
 * Note: it is possible to produce malformed types, e.g. `FromEntries<[["a", 1],
 * [string, 3]]>` will produce `{ a: 1; [x: string]: 3 }`, which no value is
 * assignable to.
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
 * ```ts
 * type Examples = [
 *   Equal<Entries<{ a: 1; b: 1 }>,       [["a", 1], ["b", 1]]          >,
 *   Equal<Entries<{ 0: "a"; 1: "b" }>,   [[0, "a"], [1, "b"]]          >,
 *   Equal<Entries<{ [x: string]: "a" }>, [[string, "a"]]               >,
 *   Equal<Entries<[string, number]>,     [["0", string], ["1", number]]>,
 *   Equal<Entries<string[]>,             [number, string][]            >,
 * ];
 * ```
 *
 * You shouldn't rely on the actual ordering of the entries list, because it
 * uses the TS internal representation of the object type.
 */
export type Entries<O extends object> = O extends unknown[]
  ? { [K in keyof O]: [K, O[K]] }
  : U2T<{ [K in keyof O]: [K, O[K]] }[keyof O]>;

/**
 * Takes an indexable object, and returns its keys as a union.
 *
 * ```ts
 * type Examples = [
 *   Equal<KeyUnion<{ a: 1; b: 2 }>,      "a" | "b">,
 *   Equal<KeyUnion<{ a: 1 } | { b: 2 }>, "a" | "b">,
 *   Equal<KeyUnion<[number, string]>,    "0" | "1">,
 *   Equal<KeyUnion<string[]>,            number   >,
 *   Equal<KeyUnion<[]>,                  never    >,
 * ];
 * ```
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
 * `L` seems to be `1000` (recursion limit).
 *
 * ```ts
 * type A = Equal<Tuple<2, number>, [number, number]              >;
 * type B = Equal<Tuple<3>,         [unknown, unknown, unknown]   >;
 * type B = Equal<Tuple<1 | 2>,     [unknown] | [unknown, unknown]>;
 * type C = Equal<Tuple<number>,    unknown[]                     >;
 * ```
 */
export type Tuple<L extends number, T = unknown> = number extends L
  ? T[]
  : _Tuple<L, T, []>;

export type Length<T extends unknown[]> = T["length"];
