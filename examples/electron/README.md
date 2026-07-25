# `electron` example-verification harness

Extracts every fenced `ts` block from a markdown file or directory and
type-checks it **once per process target** — `main`, `preload`, `renderer` —
each against its own tsconfig. A taught Electron fact is proven to compile in
the process it claims to belong to, not merely somewhere.

## Prerequisite

`node_modules/` is not committed, and `generated/` is derived from it. Install
before the first run:

```sh
bun install
```

Install is small: `electron@43.2.0` downloads no binary (it declares no
`scripts` key), so it costs ~1.2 MB and a second or two — only its typings are
used here.

## Run

```sh
bash run-examples.sh <markdown-file-or-dir> [more...]
```

Exit codes: `0` clean; `2` toolchain/IO error, an orphan partial, or a unit that
failed to type-check; `3` fail-closed (zero `ts` blocks, or zero units); `4` a
fence-tagging violation.

## Why three passes

A single combined tsconfig is a **false-pass harness**. With
`lib:["ES2023","DOM"]` and `types:["node"]`, a main-process example touching
`document` and a renderer touching `process` both compile clean — exactly the
boundary violations the skill exists to prevent. Split per process, three guard
signals fire instead:

| Signal | Fires when |
|---|---|
| `TS2584` | a `main` example touches a DOM global |
| `TS2591` | a `renderer` example touches a Node global |
| `TS2305` | any example imports an `electron` module its process cannot reach |

`TS2305` needs more than the `lib` / `types` split: `electron.d.ts` is one
monolithic declaration carrying every process's API. `generate-electron-views.mjs`
derives three scoped views of it at install time, and each tsconfig maps the bare
specifier `electron` to its own view via `paths`.

## Fence tagging

Every `ts` fence carries **one process word** — there is no default, because a
default would certify a block against a boundary its author never chose:

````text
```ts main complete```
```ts preload prelude key=NAME```
```ts renderer expect-error```
````

Categories are `complete` (default), `partial`, `prelude`, `expect-error` and
`type-level`. `prelude` / `partial` linkage is keyed by **(process, key)** and
`key=` is required on both ends. A `tsx` fence must carry the token `uncompiled`
(no JSX runtime is installed here); those blocks are counted, never compiled. Any
other fence language is an error unless it is `text`, `yaml`, `json`, `sh` or
`console`.

`extract-blocks.mjs` is a copy of `examples/typescript/extract-blocks.mjs`; its
header names the origin and all six deltas.

## Fixtures

`fixtures/` proves the harness is self-failing. Four must pass or fail on
content; five must fail on the tagging contract. Each is scored on **its own**
error code or message — a fixture that goes red for the wrong reason is a false
pass.

| Fixture | Expected |
|---|---|
| `good-complete.md` | exit 0 |
| `categories.md` | exit 0 — every category, all three processes, one `tsx uncompiled` |
| `bad-complete.md` | `TS2362` |
| `empty.md` | exit 3, fail-closed |
| `mixed-process.md` | `TS2584` in the main pass, `TS2591` in the renderer pass |
| `wrong-process-import.md` | `TS2305` |
| `untagged-fence.md` | `FAIL[untagged-process]` |
| `tsx-unmarked.md` | `FAIL[tsx-unmarked]` |
| `keyless-linkage.md` | `FAIL[keyless-linkage]` ×2 and `FAIL[unsupported-language]` |
