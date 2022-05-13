import type {
  U2I,
  U2T,
  T2U,
  U2P,
  Join,
  Split,
  FromEntries,
  Entries,
  KeyUnion,
  Tuple,
  Length,
  XPath,
} from ".";
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
  Expect<Equal<U2T<unknown>, [unknown]>>,
  Expect<Equal<U2T<never>, []>>,
];

type T2UTests = [
  Expect<Equal<T2U<["a", "b"]>, "a" | "b">>,
  Expect<Equal<T2U<string[]>, string>>,
  Expect<Equal<T2U<never>, never>>,
  Expect<Equal<T2U<[]>, never>>,
];

type U2PTests = [
  Expect<Equal<U2P<boolean>, [true, false] | [false, true]>>,
  Expect<
    Equal<
      U2P<"a" | "b" | "c">,
      | ["a", "b", "c"]
      | ["a", "c", "b"]
      | ["b", "a", "c"]
      | ["b", "c", "a"]
      | ["c", "a", "b"]
      | ["c", "b", "a"]
    >
  >,
  Expect<Equal<U2P<string>, [string]>>,
  Expect<Equal<U2P<unknown>, [unknown]>>,
  Expect<Equal<U2P<never>, []>>,
];

type JoinTests = [
  Expect<Equal<Join<[1, 2, 3]>, "123">>,
  Expect<Equal<Join<[1, 2, 3], ",">, "1,2,3">>,
  Expect<Equal<Join<[1, 2] | [3, 4], ",">, "1,2" | "3,4">>,
  Expect<Equal<Join<[string, number], ",">, `${string},${number}`>>,
  Expect<Equal<Join<[number, ...number[]], ",">, `${number}`>>,
  Expect<Equal<Join<string[], ",">, "">>,
  Expect<Equal<Join<[], ",">, "">>,
  Expect<Equal<Join<never, ",">, never>>,
];

type SplitTests = [
  Expect<Equal<Split<"1,2,3">, ["1", "2", "3"]>>,
  Expect<Equal<Split<"123", "">, ["1", "2", "3"]>>,
  Expect<Equal<Split<"", "">, []>>,
  Expect<Equal<Split<"1234">, ["1234"]>>,
  Expect<Equal<Split<"1,2" | "3,4">, ["1", "2"] | ["3", "4"]>>,
  Expect<Equal<Split<",,,">, ["", "", "", ""]>>,
  Expect<Equal<Split<"123", 2>, ["1", "3"]>>,
  Expect<Equal<Split<never>, never>>,
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

type LengthTests = [
  Expect<Equal<Length<[string, number]>, 2>>,
  Expect<Equal<Length<string[]>, number>>,
];

type XPathTests = [
  Expect<Equal<XPath<{ a: 1; b: 2 }, "a">, 1>>,
  Expect<Equal<XPath<{ a: { b: 3 }; b: 2 }, "a.b">, 3>>,
  Expect<Equal<XPath<{ a: { b: [0, 1] }; b: 2 }, "a.b">, [0, 1]>>,
  Expect<Equal<XPath<[0, 1], "1">, 1>>,
  Expect<Equal<XPath<{ a: [0, 1]; b: 2 }, "a.1">, 1>>,
  Expect<Equal<XPath<{ a: [0, { c: 3 }]; b: 2 }, "a.1.c">, 3>>,
  Expect<Equal<XPath<{ a: [0, { c: 3 }]; b: 2 }, "">, never>>,
  Expect<Equal<XPath<{ a: [0, { c: 3 }]; b: 2 }, "c">, never>>,
  Expect<Equal<XPath<{ a: [0, { c: 3 }]; b: 2 }, "a.2">, never>>,
  Expect<Equal<XPath<Record<string, boolean>, string>, boolean>>,
  Expect<
    Equal<XPath<Record<number, boolean> & Record<string, Date>, string>, Date>
  >,

  Expect<Equal<XPath<{ a: 1; b: 2 }, ["a"]>, 1>>,
  Expect<Equal<XPath<{ a: { b: 3 }; b: 2 }, ["a", "b"]>, 3>>,
  Expect<Equal<XPath<{ a: { b: [0, 1] }; b: 2 }, ["a", "b"]>, [0, 1]>>,
  Expect<Equal<XPath<[0, 1], [1]>, 1>>,
  Expect<Equal<XPath<{ a: [0, 1]; b: 2 }, ["a", 1]>, 1>>,
  Expect<Equal<XPath<{ a: [0, { c: 3 }]; b: 2 }, ["a", 1, "c"]>, 3>>,
  Expect<Equal<XPath<{ a: [0, { c: 3 }]; b: 2 }, [""]>, never>>,
  Expect<Equal<XPath<{ a: [0, { c: 3 }]; b: 2 }, ["c"]>, never>>,
  Expect<Equal<XPath<{ a: [0, { c: 3 }]; b: 2 }, ["a", 2]>, never>>,
  Expect<Equal<XPath<Record<string, boolean>, [string]>, boolean>>,
  // FIXME
  Expect<
    Equal<XPath<Record<number, boolean> & Record<string, Date>, [number]>, Date>
  >,
];
