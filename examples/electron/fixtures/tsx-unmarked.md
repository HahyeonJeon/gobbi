# Fixture — `tsx` fence without the `uncompiled` token

The `main` block below is correct and compiles clean, so the run has real units
and the failure cannot be the zero-blocks guard. The `tsx` block carries no
`uncompiled` token: the harness MUST exit non-zero with `FAIL[tsx-unmarked]`.

The origin extractor dropped every non-`ts` fence before recording it, so a
`tsx` block simply vanished — unverified and, worse, uncounted.

```ts main complete
import { app } from "electron";

export function version(): string {
  return app.getVersion();
}
```

```tsx
export function OpenButton({ url }: { readonly url: string }) {
  return <button onClick={() => window.api.openExternal(url)}>Open</button>;
}
```
