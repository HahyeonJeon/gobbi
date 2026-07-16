# Fixture — good complete block

A self-contained `complete` block that type-checks clean. The harness MUST
exit 0 on this file.

```ts complete
export function double(n: number): number {
  return n * 2;
}
```
