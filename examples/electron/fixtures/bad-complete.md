# Fixture — bad complete block

A correctly tagged `main` block with a REAL type error and no
`@ts-expect-error` marker: `app.getVersion()` returns a string, and a string is
not an arithmetic operand. The harness MUST exit non-zero on this file (a broken
taught fact must fail the gate).

```ts main complete
import { app } from "electron";

export function versionTwice(): number {
  return app.getVersion() * 2;
}
```
