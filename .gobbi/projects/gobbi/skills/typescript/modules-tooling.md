# TypeScript — Modules and Tooling

**Ownership** — the no-`python`-analog tooling doc: ESM and `verbatimModuleSyntax`, `moduleResolution`, and
the import-extension fork; the strict semantic base plus thin overlays (library / app / runtime); the
`typescript-eslint` typed-lint layer (with the TS 7.0 side-by-side 6.x-API note); the Prettier / Biome choice;
build via `tsc` vs a bundler; and compiler performance (project references, `incremental`, `skipLibCheck`).

**Split criterion** — skill-writing P3 (b): a lookup reference — the tsconfig flag set, the resolution modes,
and the lint config are consulted by decision, not read narratively.

This doc **deepens, and does not restate,** the SKILL.md modules/tooling Rules (compile under a maximal-strict
`tsconfig`; ESM with `verbatimModuleSyntax`; pick the import extension by consumption mode; keep syntax
erasable) and Principle 7 (*type-erase cleanly*). The parent P2 router sends a reader here when a change
touches the tsconfig flag set and overlays, `moduleResolution`, the import-extension fork, the typed lint, or
the build. SKILL.md states each as a one-line invariant; this doc owns the mechanics behind them — the full
flag accounting, why `nodenext` beats `bundler`, how the two import-extension modes resolve, and the tool
layers `tsc` alone does not cover.

Most blocks below are configuration — a `tsconfig`, a `package.json`, an ESLint config — shown in `jsonc` /
`json` / `js` for their shape; a config object is not TypeScript and is not compiled. The few fenced `ts`
blocks are taught facts that type-check under the skill's maximal-strict examples baseline (TS 5.9 floor).

## Contents

1. [The strict base: 17 always-on flags](#1-the-strict-base-17-always-on-flags)
2. [Thin overlays: library, app, runtime](#2-thin-overlays-library-app-runtime)
3. [ESM, `moduleResolution: nodenext`, and `verbatimModuleSyntax`](#3-esm-moduleresolution-nodenext-and-verbatimmodulesyntax)
4. [The import-extension fork](#4-the-import-extension-fork)
5. [Erasable syntax: `isolatedModules`, `isolatedDeclarations`, `erasableSyntaxOnly`](#5-erasable-syntax-isolatedmodules-isolateddeclarations-erasablesyntaxonly)
6. [Typed lint: `typescript-eslint`](#6-typed-lint-typescript-eslint)
7. [Formatting: Prettier or Biome](#7-formatting-prettier-or-biome)
8. [Build: `tsc` vs a bundler](#8-build-tsc-vs-a-bundler)
9. [Compiler performance](#9-compiler-performance)

---

## 1. The strict base: 17 always-on flags

Every artifact extends one strict base — the 14-flag `@tsconfig/strictest` preset plus three flags that
post-date it. This is the maximal-strict floor SKILL.md's first Rule names; the config below is the whole of
it, each flag written once.

```jsonc
// tsconfig.base.json — the 17 always-on flags. Extend it; never weaken it.
{
  "compilerOptions": {
    // @tsconfig/strictest (14)
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "allowUnreachableCode": false,
    "allowUnusedLabels": false,
    "isolatedModules": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    // added atop the preset (3)
    "verbatimModuleSyntax": true,
    "noUncheckedSideEffectImports": true,
    "erasableSyntaxOnly": true
  }
}
```

Three flags carry most of the weight:

- **`strict`** is an umbrella that turns on nine checks, including `strictNullChecks`, `noImplicitAny`, and
  `useUnknownInCatchVariables` (a caught error is typed `unknown`, not `any`). Treat `strict: false` as
  off-standard.
- **`noUncheckedIndexedAccess`** is the highest-value flag `strict` omits: `arr[i]` and `rec[key]` become
  `T | undefined`, so an out-of-range read is a compile error, not a runtime `undefined`. It sits outside
  `strict` because it is noisy on code that indexes inside a checked loop.
- **`exactOptionalPropertyTypes`** is the noisiest: with it, `{ x?: number }` accepts a MISSING `x` but rejects
  an explicit `x: undefined` — the two stop meaning the same thing. Live with it by choosing deliberately —
  `x?: number` for "may be absent," `x: number | undefined` for "must be present, may be undefined" — not by
  reaching for `as` to paper over the difference.

`skipLibCheck` is in the base for speed (§9): it skips type-checking the `.d.ts` files under `node_modules`,
never your own code.

## 2. Thin overlays: library, app, runtime

The base is artifact-neutral. Three thin overlays add only the flags a given artifact needs; each such flag
lives in exactly ONE overlay and never in the base, so it applies only where it is meaningful.

| Overlay | Adds | When |
|---|---|---|
| **library** | `declaration`, `declarationMap`, `isolatedDeclarations` | publishing a package that ships its own `.d.ts` |
| **app** | `noEmit` (a bundler or runtime emits instead) | an application a bundler builds, publishing no types |
| **runtime** | `lib` / `module` / `moduleResolution` deltas, and `rewriteRelativeImportExtensions` for a type-stripping runtime | cross-runtime code — see `runtime-deltas.md` |

```jsonc
// tsconfig.lib.json — the library overlay
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "declaration": true,          // emit the .d.ts consumers resolve against
    "declarationMap": true,       // map the .d.ts back to source for go-to-definition
    "isolatedDeclarations": true  // force fully-annotated exports — see below
  }
}
```

`isolatedDeclarations` (5.5) lives ONLY in the library overlay: it forces every exported binding to carry an
explicit type, so a `.d.ts` can be produced from one file with no whole-program inference. That constraint
earns its cost only when a `.d.ts` is actually shipped, so an app never pays it. `declarationMap` is what lets
a consumer's "go to definition" land on your source instead of the generated `.d.ts`. The `runtime` overlay's
`rewriteRelativeImportExtensions` is the subject of §4.

## 3. ESM, `moduleResolution: nodenext`, and `verbatimModuleSyntax`

The module model is ESM end to end. Declare it once in `package.json`, then set the resolver:

```json
// package.json
{
  "type": "module"
}
```

```jsonc
{
  "compilerOptions": {
    "module": "nodenext",
    "moduleResolution": "nodenext"
  }
}
```

**Why `nodenext`, even for a library that will be bundled.** The official guidance is to resolve with
`nodenext` (not `bundler`) for anything you publish: code that resolves under Node's rules almost always works
in a bundler too, while the reverse is false. `moduleResolution: bundler` allows imports a bundler accepts but
Node rejects, and — worse for a library — the emitted `.d.ts` can then error when a consumer resolves it under
`nodenext`. Reserve `bundler` for an application that owns its bundler; `runtime-deltas.md` names that variant.

**`verbatimModuleSyntax` makes erasure deterministic.** An import or export WITHOUT a `type` modifier is
emitted verbatim; anything WITH the `type` modifier is dropped whole. That removes the ambiguity
`esModuleInterop` and `allowSyntheticDefaultImports` create, and it forces `import type` at a type-only import
and `export type` at a type-only export — so what reaches runtime is exactly what you wrote:

```ts
// verbatimModuleSyntax forces the `type` keyword on a type-only export, so this
// line erases whole; the value export below is emitted verbatim.
type Celsius = number;
export type { Celsius };

export const freezing = 0;
```

Omit the keyword on a type and the compiler rejects it rather than silently guessing what to erase:

```ts expect-error
type Fahrenheit = number;

// @ts-expect-error verbatimModuleSyntax: a type-only export must use `export type`
export { Fahrenheit };
```

`verbatimModuleSyntax` is also why the skill publishes ESM-only: one source cannot deterministically erase to
both ESM and CJS. `packaging-publishing.md` owns that `exports`-map consequence.

## 4. The import-extension fork

SKILL.md's Rule fixes the choice; this section is why the two modes exist and how each resolves. A relative
import's specifier depends on HOW the file is consumed, because the two consumers resolve extensions
differently:

| Consumption | Import written | Enabled by |
|---|---|---|
| Emitted via `tsc` (published library) | `import { util } from "./util.js"` | `module: nodenext` — the emitted `.js` is what resolves |
| Direct type-stripping (Node 24+, Bun, Deno) | `import { util } from "./util.ts"` | `rewriteRelativeImportExtensions: true` + `module: nodenext` |

**Why `.js` on the emitted path.** `tsc` does not rewrite specifiers by default, and `nodenext` resolves a
relative specifier against the EMITTED file — which is `.js`. So the source must already name `.js`, even
though the file on disk is `.ts`; name `"./util"` or `"./util.ts"` and the emitted import fails to resolve at
runtime.

**Why `.ts` on the stripping path.** A type-stripping runtime executes the `.ts` file in place and resolves
the real on-disk `.ts` name. `rewriteRelativeImportExtensions` (5.7) lets the SAME source also be built by
`tsc`, which rewrites each `.ts` specifier to `.js` on emit — so one source both runs stripped and publishes a
correct build.

Never mix the two in one source tree: read the mode off P1's target-runtime contract and keep every relative
import in it.

## 5. Erasable syntax: `isolatedModules`, `isolatedDeclarations`, `erasableSyntaxOnly`

Three similarly-named flags guard three different single-file guarantees. The base carries `isolatedModules`
and `erasableSyntaxOnly`; the library overlay (§2) adds `isolatedDeclarations`.

| Flag | Guarantees one file can be… | Consumer |
|---|---|---|
| `isolatedModules` | transpiled with no whole-program type info | a single-file transpiler (esbuild, swc, Babel) |
| `erasableSyntaxOnly` | run by stripping types, generating no code from a type | a type-stripping runtime (Node 24+, Bun, Deno) |
| `isolatedDeclarations` | turned into a `.d.ts` from itself alone | the declaration emitter for a library |

`erasableSyntaxOnly` (5.8) is the flag that shapes daily syntax: it rejects any construct that would emit
RUNTIME code from a type position — an `enum`, a `namespace` with runtime members, and a constructor parameter
property. SKILL.md shows the `enum`; the parameter property is the other trap ordinary code hits:

```ts expect-error
class Timer {
  // @ts-expect-error a parameter property emits a runtime assignment; erasableSyntaxOnly rejects it
  constructor(private readonly ms: number) {}
}
```

The fix is the same each time: a plain field assignment instead of a parameter property, an `as const` object
or a discriminated union instead of an `enum`. `isolatedModules` is the weaker sibling of `verbatimModuleSyntax`
(§3): `verbatimModuleSyntax` implies its constraints and adds deterministic erasure, so a project already on
`verbatimModuleSyntax` satisfies `isolatedModules` for free.

## 6. Typed lint: `typescript-eslint`

`tsc` proves types; it does not catch a floating promise or a misused one. `typescript-eslint` with its
TYPE-CHECKED configs closes that gap — it reads the type information `tsc` computes and flags correctness bugs
the compiler allows:

```js
// eslint.config.js — flat config
import tseslint from "typescript-eslint";

export default tseslint.config(
  ...tseslint.configs.strictTypeChecked,    // correctness rules that need type info
  ...tseslint.configs.stylisticTypeChecked, // consistency rules
  {
    languageOptions: {
      parserOptions: { projectService: true }, // typed rules need the program
    },
  },
);
```

`strict-type-checked` brings the rules that matter most here: `no-floating-promises` (an un-awaited promise),
`no-misused-promises` (a promise in a boolean or `void` position), and the `no-unsafe-*` family (an `any`
flowing through your code). `stylistic-type-checked` adds the consistency rules. Because these read type
information, they require `parserOptions.project` (or `projectService`) and run far slower than syntactic lint
— roughly an order of magnitude — which is why typed lint is a project-level, CI-run gate, not a
per-keystroke cost.

**TS 7.0 caveat (honest).** The native Go compiler at TS 7.0 ships NO programmatic compiler API (7.1 is
expected to add one), and `typescript-eslint` needs that API. So under a 7.0 install, typed lint does NOT run
against the 7.0 binary: it runs against a side-by-side TS 6.x-compatible API package
(`@typescript/typescript6`, which exposes a `tsc6`). Treat 7.0 as a type-check SPEED target for
`tsc --noEmit`, not as one toolchain that also satisfies the typed-lint gate — the P7 lint step runs on the
6.x-compat API alongside it.

## 7. Formatting: Prettier or Biome

Formatting is not a type concern: it runs first in the P7 verify order and never blocks on types. Pick one
deterministic formatter and run it in check mode in CI:

- **Prettier** is the default — ubiquitous, editor-integrated, opinionated.
- **Biome** is the fast alternative — a single Rust tool that formats AND lints, much faster on a large tree,
  at the cost of a smaller ecosystem.

Follow the project's existing choice; two formatters fighting over the same file is pure churn. Neither
replaces `typescript-eslint`'s typed rules (§6) — a formatter arranges code, it does not reason about types,
and Biome's linter is not type-aware, so it does not cover `no-floating-promises`.

## 8. Build: `tsc` vs a bundler

Two jobs hide under "build," and only one of them checks types.

- **`tsc`** type-checks AND emits `.js` + `.d.ts`. For a published library this IS the build: it is the only
  tool that produces the `.d.ts` a consumer resolves (with the library overlay, §2), and it is the type-check
  of record.
- **A bundler** (esbuild, tsup, rollup) is faster and app-oriented, but most bundlers STRIP types the way a
  runtime does — esbuild does not type-check at all. A bundled app therefore still needs a separate
  `tsc --noEmit` as its type gate: the bundler emits, `tsc` judges.

The rule that falls out: `tsc --noEmit` is the type-check gate no matter who emits the runtime artifact. A
green bundler build is not a green type-check. (`tsup` and similar wrap `tsc` to emit the `.d.ts` on top of an
esbuild bundle — a library convenience, but the `.d.ts` still comes from `tsc`.)

## 9. Compiler performance

Three levers cut `tsc` time on a growing codebase without weakening a single type:

- **`skipLibCheck`** (already in the base, §1) skips type-checking the `.d.ts` files under `node_modules` — a
  large, mostly-stable surface. It does NOT skip your own types.
- **`incremental`** writes a `.tsbuildinfo` cache so a rebuild re-checks only what changed. Cheap to enable;
  keep the cache file out of version control.
- **Project references** split a large repo into composite sub-projects (`composite: true`) built with
  `tsc -b`; each references those it depends on, so a change rebuilds only the affected sub-graph and its
  dependents. This is the structural lever for a monorepo — decomposition-by-responsibility applied to the
  build graph.

Reach for these once build time is measured and growing, not preemptively (coding P14 — optimize on
evidence). The TS 7.0 native compiler (§6) is the other axis: a large type-check speedup with no config
change, bounded only by the typed-lint API caveat.
