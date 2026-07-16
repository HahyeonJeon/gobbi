# Fixture — every category

Proves the harness handles `prelude` + `partial` linkage, the self-verifying
`expect-error` category, the `type-level` category (asserted via
`@ts-expect-error`, no expect-type / tsd dependency), and the relaxed
unused-locals rule (values declared only to show a type). The harness MUST
exit 0 on this file.

A shared prelude and a partial that uses it (compiled together):

```ts prelude key=shapes
interface Point {
  readonly x: number;
  readonly y: number;
}
```

```ts partial key=shapes
const origin: Point = { x: 0, y: 0 };
```

An `expect-error` block — the bad line is preceded by `@ts-expect-error`, so it
type-checks clean IFF the error is genuinely present:

```ts expect-error
// @ts-expect-error a string is not assignable to number
const count: number = "three";
```

A `type-level` block — the type identity is asserted with `@ts-expect-error`:

```ts type-level
type Equals<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

const same: Equals<string, string> = true;

// @ts-expect-error string and number are not the same type
const different: Equals<string, number> = true;
```
