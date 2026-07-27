# Fixture — untagged `ts` fence

The block below carries **no process word**. Its content is deliberately valid
TypeScript that would compile clean in the `main` pass, so the run cannot fail
for any reason other than the missing tag: the harness MUST exit non-zero with
`FAIL[untagged-process]`, never with the zero-blocks fail-closed message and
never with a compile error.

An untagged block is a hard error rather than a default. A default would route
it into one pass and certify it against a boundary its author never chose —
which is the single-config false pass the whole harness exists to prevent.

```ts complete
import { app } from "electron";

export function version(): string {
  return app.getVersion();
}
```
