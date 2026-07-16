# TypeScript — Packaging and Publishing

**Ownership** — the ESM-only publish surface: `type: module` + the `package.json` `exports` map and
its condition order; the shipped `.d.ts` (the library overlay's declaration emit); the `sideEffects`
tree-shaking pledge; the `publint` + `arethetypeswrong` machine gates; public-API semver and
deprecation; and the CJS-consumer path as an explicit out-of-default exception.

**Split criterion** — skill-writing P3 (d): an independent-audience sub-procedure — a package
publisher reads it on its own, apart from the author writing an ordinary strict module.

This doc **deepens, and does not restate,** SKILL.md's ESM-only Rules (publish ESM-only; never ship
dual ESM + CJS from one `verbatimModuleSyntax` source; pick the import extension by consumption mode)
and Principle 7 (*type-erase cleanly*). SKILL.md fixes the one-line invariant — "publish ESM-only,
treat a required CJS build as a separate non-default emit"; this doc owns the concrete publish shape
behind it: the `exports` conditions, what each machine gate catches, and the exact steps the CJS
exception costs. The module model it builds on — `verbatimModuleSyntax`, `moduleResolution: nodenext`,
the import-extension fork, the library tsconfig overlay — is owned by `modules-tooling.md`; this doc
references it, never redraws it.

Every block below is `package.json` / config / CLI, shown as `json` / `jsonc` / `bash` — a
`package.json` object is data, not TypeScript. The one fenced `ts` block is the shipped public-API
surface (§5), a taught fact that type-checks under the skill's maximal-strict examples baseline.

## Contents

1. [`type: module` and the ESM-only `exports` map](#1-type-module-and-the-esm-only-exports-map)
2. [The shipped `.d.ts`: declaration emit](#2-the-shipped-dts-declaration-emit)
3. [`sideEffects`: the tree-shaking pledge](#3-sideeffects-the-tree-shaking-pledge)
4. [The machine gates: `publint` then `arethetypeswrong`](#4-the-machine-gates-publint-then-arethetypeswrong)
5. [Public-API evolution: semver and deprecation](#5-public-api-evolution-semver-and-deprecation)
6. [The CJS out-of-default exception (non-recommended)](#6-the-cjs-out-of-default-exception-non-recommended)

---

## 1. `type: module` and the ESM-only `exports` map

`type: module` makes every `.js` file in the package ESM — the publish-side half of the ESM model
`modules-tooling.md` owns on the resolver side. The `exports` map is the entry declaration AND an
encapsulation boundary: only the subpaths it lists are importable, so a consumer cannot deep-import
an internal file you did not publish.

```json
{
  "name": "my-lib",
  "version": "1.4.0",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "default": "./dist/index.js"
    },
    "./package.json": "./package.json"
  },
  "files": ["dist"],
  "sideEffects": false
}
```

**Condition order is load-bearing.** A resolver reads the conditions top-to-bottom and takes the
first that applies, so `types` MUST come first — a TypeScript consumer has to resolve the `.d.ts`
before the runtime condition, or it gets no types at all. `import` is the ESM entry; `default` is the
last-resort runtime fallback (the same file here). There is deliberately **no `require` condition and
no `.d.cts`** — that is the CJS path (§6), left out on purpose to keep the package ESM-only.

**What else ships.** `files` allow-lists the published tarball — ship `dist`, not `src` (the one
exception is `declarationMap`, §2). The `./package.json` self-export lets tooling read your manifest.
With `exports` present, the legacy top-level `main` / `module` / `types` fields are optional;
`publint` (§4) tells you which, if any, a consumer toolchain still needs.

## 2. The shipped `.d.ts`: declaration emit

The `types` condition points at a `.d.ts`, and `tsc` is the only tool that produces it — the library
tsconfig overlay (`modules-tooling.md` §2) turns on `declaration`, `declarationMap`, and
`isolatedDeclarations` for exactly this. This doc owns what that emit means for the published package;
the flags themselves live in `modules-tooling.md`.

- **`declaration`** emits the `.d.ts` a consumer resolves against — the public type contract, and the
  artifact the machine gates (§4) validate.
- **`declarationMap`** emits a `.d.ts.map` so a consumer's "go to definition" lands on your `.ts`
  source instead of the generated `.d.ts`. It only works if the `.ts` source ships too, so either add
  `src` to `files` when you publish maps, or leave `declarationMap` off for a `dist`-only package.
- **`isolatedDeclarations`** requires each exported binding's type to be trivially computable from the file — an explicit annotation wherever it is not already evident — so the `.d.ts`
  is produced from each file alone — fast emit, and an un-annotated public export becomes a compile
  error instead of a silently-inferred, fragile type in the shipped contract.

## 3. `sideEffects`: the tree-shaking pledge

`"sideEffects": false` tells a bundler that importing any module in the package runs no code with an
observable effect, so it may drop every export a consumer does not use (tree-shaking). Set it only
when it is true. A module that DOES run on import — a polyfill, a global registration, a CSS import —
must be listed, or the bundler shakes it away and the effect silently vanishes:

```json
{
  "sideEffects": ["./dist/polyfill.js", "*.css"]
}
```

This is the publish-side pledge to the bundler; `noUncheckedSideEffectImports` (the compile-side base
flag, `modules-tooling.md` §1) is its counterpart — it fails the build when a bare side-effect
import's target does not resolve.

## 4. The machine gates: `publint` then `arethetypeswrong`

Two tools verify the PACKED artifact — the tarball a consumer installs, not your checkout. Run both
in the P7 build step (SKILL.md P7), `publint` first (fix the shape), then `arethetypeswrong` (prove
the types resolve).

**`publint --strict`** validates the `package.json` publish shape: that every `exports` / `main` /
`module` / `types` target exists on disk, that the condition order is correct (`types` first), that a
file's extension matches its `type`, and that no declared entry is missing. `--strict` turns its
warnings into a non-zero exit, so it works as a self-failing gate.

```bash
npx publint --strict
```

**`arethetypeswrong --pack`** (attw) packs the real tarball and checks how a TypeScript CONSUMER
resolves your shipped `.d.ts` across resolution modes (`node10`, `node16` CJS + ESM, `bundler`). It
catches the errors a `tsc` pass on your own source cannot see: a `.d.ts` that claims ESM but resolves
as CJS (a false export shape), a missing `types` condition, or types that fail to resolve under
`nodenext`.

```bash
npx attw --pack
```

For an ESM-only package, attw reports `node10` (the legacy pre-`exports` resolver) as "no types" —
that is EXPECTED, not a defect: a pure-ESM package intentionally drops the old CJS resolver. Configure
attw to ignore the `node10` profile rather than adding a CJS path just to satisfy it.

## 5. Public-API evolution: semver and deprecation

The public API is everything reachable through `exports` — every exported value AND every exported
type. Because TypeScript is structural, the type surface is part of the contract: widening a return
type, narrowing a parameter, adding a required field to an input, or removing an export all BREAK a
consumer's build and require a MAJOR version. Adding an optional field or a new export is a MINOR
bump. Removing a subpath from `exports` is breaking even if the file stays on disk — the encapsulation
boundary is the contract, not the file.

Deprecate before you remove. Mark the old surface with the `@deprecated` TSDoc tag naming its
replacement; editors strike it through and `typescript-eslint` can flag its use. Keep it for one major
cycle, then remove it in the next major.

```ts
/** A parsed semantic version. */
export interface SemVer {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
}

/**
 * Parse a version string like `"1.4.0"`.
 * @deprecated since 2.1 — use {@link parseVersion}; removed in 3.0.
 */
export function parse(input: string): SemVer | undefined {
  return parseVersion(input);
}

/** Parse a version string, or return `undefined` when it is malformed. */
export function parseVersion(input: string): SemVer | undefined {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(input);
  if (match === null) {
    return undefined;
  }
  // noUncheckedIndexedAccess: each capture group is `string | undefined`.
  const major = match[1];
  const minor = match[2];
  const patch = match[3];
  if (major === undefined || minor === undefined || patch === undefined) {
    return undefined;
  }
  return { major: Number(major), minor: Number(minor), patch: Number(patch) };
}
```

## 6. The CJS out-of-default exception (non-recommended)

Shipping CJS alongside ESM is a deliberate exception, not the default. Reach for it only when a named
consumer genuinely cannot load ESM; the ESM-only package above is the recommended path.

The exception costs three things. First, you step OUTSIDE `verbatimModuleSyntax` — one source cannot
deterministically erase to both module systems (SKILL.md's Rule; `modules-tooling.md` §3 owns why), so
the CJS build uses a SEPARATE emit config (`module: commonjs`, or a dual-emit bundler such as `tsup`).
Second, you emit a second declaration set: a `.d.cts` for the `require` condition — a plain `.d.ts`
under `require` is exactly the "false CJS types" `arethetypeswrong` flags. Third, `exports` grows a
`require` condition beside `import`, each with its OWN nested `types`:

```jsonc
{
  "exports": {
    ".": {
      "import": { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
      "require": { "types": "./dist/index.d.cts", "default": "./dist/index.cjs" }
    }
  }
}
```

Both module systems must then pass `publint` AND `arethetypeswrong`, and you take on the dual-package
hazard: a consumer that reaches your package through both an ESM and a CJS path loads two copies of
its module state, so a singleton or an `instanceof` check across the boundary breaks. Prefer ESM-only;
add this only under a concrete, named constraint.
