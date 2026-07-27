# Fixture — wrong-process `electron` import

A `main` block importing `ipcRenderer`, a renderer-only module. The `lib` /
`types` split cannot see this — `electron.d.ts` is one monolithic declaration
whose module surface carries every process's API — so it is caught by the
generated per-process view that `tsconfig.main.json` maps the bare specifier
`electron` to. The harness MUST exit non-zero with `TS2305`.

```ts main complete
import { ipcRenderer } from "electron";

export function ping(): void {
  ipcRenderer.send("ping");
}
```
