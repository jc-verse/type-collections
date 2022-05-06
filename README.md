# type-collections

Utility types that manipulate different kinds of type-level collections

## Installation

```bash
yarn add -D type-collections
```

## Usage

```ts
// We only offer types. You are recommended to use `import type`
import type { U2I } from "type-collections";

type A = U2I<{ a: 1 } & { b: 2 }>;
```

## APIs

- `U2I<U>`
- `U2T<U>`
- `T2U<T>`
- `U2P<U>`
- `Join<Arr, Sep?>`
- `Split<S, Sep?>`
- `FromEntries<KV>`
- `Entries<O>`
- `KeyUnion<O>`
- `Tuple<L, T?>`
- `Length<T>`
