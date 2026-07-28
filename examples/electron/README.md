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
fence-tagging violation; `5` a canonical skill declaration or behavior-register
drift.

When an input directory resolves to the canonical `skills/electron/` source,
the runner first calls `check-skill-consistency.mjs`. The gate derives scenario
and checklist identifiers from the current source, checks the totals a cold
reader sees, derives declared and row-definition scenario-to-check edges, and
compares those edge sets exactly in both directions. Missing, orphaned, stale,
malformed, asymmetric, and equal-cardinality substituted relationships fail
before the gate follows the macOS-notification register qualifier to
`windows-native.md`. It can also be run directly:

```sh
bun check-skill-consistency.mjs ../../.gobbi/projects/gobbi/skills/electron
```

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
| `TS2305` | an example imports an Electron member absent from its process view |

`TS2305` needs more than the `lib` / `types` split: `electron.d.ts` is one
monolithic declaration carrying every process's API. `generate-electron-views.mjs`
derives three scoped namespace views at install time, preserving both values and
types, and each tsconfig maps the bare specifier `electron` to its own view via
`paths`. The fixture set proves both directions: wrong-process values raise
`TS2305`, while correct process-local `import type` statements compile.

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

The extractor classifies every opening fence and writes a by-language census to
its manifest. The runner fails unless both equations hold:

```text
compiled/extracted ts fences + counted tsx-uncompiled fences = eligible-code fences
eligible-code fences + allowlisted-non-code fences = all fences
```

The emitted compilation-unit count stays separate. A keyed `prelude` and
`partial` are two `ts` fences that intentionally form one unit, so unit count is
not the eligible-fence denominator.

`extract-blocks.mjs` is a copy of `examples/typescript/extract-blocks.mjs`; its
header names the origin and all six deltas.

## Fixtures

`fixtures/` proves the harness is self-failing. Five exercise type content;
five exercise extraction, tagging, and fail-closed behavior. Each is scored on
**its own** exit code or message — a fixture that goes red for the wrong reason
is a false pass.

| Fixture | Expected |
|---|---|
| `good-complete.md` | exit 0 |
| `correct-type-import.md` | exit 0 — main and preload keep process-local and Common-only type exports |
| `categories.md` | exit 0 — every category, all three processes, one `tsx uncompiled` |
| `bad-complete.md` | `TS2362` |
| `empty.md` | exit 3, fail-closed |
| `mixed-process.md` | `TS2584` in the main pass, `TS2591` in the renderer pass |
| `wrong-process-import.md` | `TS2305` |
| `untagged-fence.md` | `FAIL[untagged-process]` |
| `tsx-unmarked.md` | `FAIL[tsx-unmarked]` |
| `keyless-linkage.md` | `FAIL[keyless-linkage]` ×2 and `FAIL[unsupported-language]` |
