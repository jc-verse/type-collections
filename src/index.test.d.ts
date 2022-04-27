import type { U2I, U2T, FromEntries, Entries, KeyUnion, Tuple } from ".";
import type { Expect, Equal, NotEqual } from "@type-challenges/utils";

type U2ITests = [
  Expect<
    Equal<U2I<{ a: number } | { b: string }>, { a: number } & { b: string }>
  >,
  Expect<
    Equal<U2I<{ a: number } & { b: string }>, { a: number } & { b: string }>
  >,
  Expect<Equal<U2I<{ a: number; b: string }>, { a: number; b: string }>>,
  // type-challenges doesn't think they are equal, but it's a good thing
  Expect<
    NotEqual<U2I<{ a: number; b: string }>, { a: number } & { b: string }>
  >,
  Expect<Equal<U2I<number>, number>>,
  Expect<Equal<U2I<boolean>, never>>,
  Expect<Equal<U2I<"b" | string>, string>>,
  Expect<Equal<U2I<`a ${"b" | string}`>, `a ${string}`>>,
  Expect<Equal<U2I<unknown>, never>>,
  Expect<Equal<U2I<never>, unknown>>,
];

type U2TTests = [
  Expect<
    Equal<U2T<{ a: number } | { b: string }>, [{ a: number }, { b: string }]>
  >,
  Expect<
    Equal<U2T<{ a: number } & { b: string }>, [{ a: number } & { b: string }]>
  >,
  Expect<Equal<U2T<{ a: number; b: string }>, [{ a: number; b: string }]>>,
  Expect<
    NotEqual<U2T<{ a: number; b: string }>, [{ a: number } & { b: string }]>
  >,
  Expect<Equal<U2T<number>, [number]>>,
  Expect<Equal<U2T<boolean>, [false, true]>>,
  Expect<Equal<U2T<"b" | string>, [string]>>,
  Expect<Equal<U2T<`a ${"b" | string}`>, [`a ${string}`]>>,
  Expect<Equal<U2T<unknown>, [unknown]>>,
  Expect<Equal<U2T<never>, []>>,
];

type FromEntriesTests = [
  Expect<Equal<FromEntries<[["a", 1], ["b", 2]]>, { a: 1; b: 2 }>>,
  Expect<Equal<FromEntries<[[0, "a"], [1, "b"]]>, { 0: "a"; 1: "b" }>>,
  Expect<Equal<FromEntries<[[string, "a"]]>, { [x: string]: "a" }>>,
  Expect<Equal<FromEntries<[["a", 1], ["a", 2]]>, { a: 1 | 2 }>>,
  Expect<
    Equal<FromEntries<[["a", 1], ["b", 2], ["a", 2]]>, { a: 1 | 2; b: 2 }>
  >,
  Expect<Equal<FromEntries<[["a", 1], ["b" | "c", 3]]>, { a: 1; b: 3; c: 3 }>>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  Expect<Equal<FromEntries<[]>, {}>>,
];

type EntriesTests = [
  Expect<Equal<Entries<{ a: 1; b: 1 }>, [["a", 1], ["b", 1]]>>,
  Expect<Equal<Entries<{ 0: "a"; foo: "bar" }>, [[0, "a"], ["foo", "bar"]]>>,
  Expect<Equal<Entries<{ 0: "a"; 1: "b" }>, [[0, "a"], [1, "b"]]>>,
  Expect<Equal<Entries<{ [x: string]: "a" }>, [[string, "a"]]>>,
  Expect<Equal<Entries<[string, number]>, [["0", string], ["1", number]]>>,
  Expect<Equal<Entries<string[]>, [number, string][]>>,
  Expect<Equal<Entries<{ a: 1 } | { b: 2 }>, [["a", 1]] | [["b", 2]]>>,
  Expect<Equal<Entries<{ a: 1 } | [string]>, [["a", 1]] | [["0", string]]>>,
  Expect<
    Equal<
      Entries<[string] | [number, number]>,
      [["0", string]] | [["0", number], ["1", number]]
    >
  >,
  // TODO looks wrong to me
  Expect<
    Equal<Entries<[string, ...string[]]>, [["0", string], ...["1", string][]]>
  >,
  Expect<Equal<Entries<{ a: 1 | 2 }>, [["a", 1 | 2]]>>,
  Expect<Equal<Entries<never>, never>>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  Expect<Equal<Entries<{}>, []>>,
];

type KeyUnionTests = [
  Expect<Equal<KeyUnion<{ a: 1; b: 2 }>, "a" | "b">>,
  Expect<Equal<KeyUnion<Record<string, string>>, string>>,
  Expect<Equal<KeyUnion<[number, string]>, "0" | "1">>,
  Expect<Equal<KeyUnion<[string, string, ...string[]]>, number>>,
  Expect<Equal<KeyUnion<string[]>, number>>,
  Expect<Equal<KeyUnion<{ a: 1 } | { b: 2 }>, "a" | "b">>,
  Expect<Equal<KeyUnion<[]>, never>>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  Expect<Equal<KeyUnion<{}>, never>>,
];

type TupleTests = [
  Expect<Equal<Tuple<2, number>, [number, number]>>,
  Expect<Equal<Tuple<3>, [unknown, unknown, unknown]>>,
  Expect<Equal<Tuple<1 | 2>, [unknown] | [unknown, unknown]>>,
  Expect<Equal<Tuple<number>, unknown[]>>,
];
