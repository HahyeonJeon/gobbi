# Fixture — bad complete block

A `complete` block with a REAL type error and NO `@ts-expect-error` marker: the
right-hand operand of `*` is a string. The harness MUST exit non-zero on this
file (a broken taught fact must fail the gate).

```ts complete
export function double(n: number): number {
  return n * "2";
}
```
