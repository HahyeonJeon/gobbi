# Test Tooling Gotchas

Gotchas for test tooling used in this repo — fast-check property-based testing, TypeScript strict-mode interactions with test generators, and test framework patterns. Read before authoring or modifying property tests.

---

## fast-check v4 dropped `fc.hexaString` — use `fc.array(fc.constantFrom(...'0123456789abcdef'.split('')))`

**Priority:** Low

**What happened:** Plan/research docs targeting fast-check v3 frequently reference `fc.hexaString({ minLength: 64, maxLength: 64 })` for generating 64-char sha256 digests. fast-check v4 (this repo pins `^4.6.0`) removed the shorthand. The E.7 executor hit this writing the `VerificationResultData` round-trip property and had to substitute.

**User feedback:** Self-caught by E.7 executor during property-test authoring 2026-04-18; no user correction required.

**Correct approach:** In fast-check v4+, generate hex strings via `fc.array(fc.constantFrom(...'0123456789abcdef'.split('')), { minLength: 64, maxLength: 64 }).map(chars => chars.join(''))`. Same output shape, no semantic change. When following research docs for property generators, reconcile against the installed fast-check major version at import time — v3 → v4 dropped several shorthands.

---

## `fc.option(arb, { nil: undefined })` ≠ `exactOptionalPropertyTypes` — wrap with `stripUndefined` map

**Priority:** Medium

**What happened:** The E.7 executor generated partial `ProjectConfigInput` values for the `loadProjectConfig` default-completeness property using `fc.option(arb, { nil: undefined })`. `fc.option(x, { nil: undefined })` produces `T | undefined`. Under TS `exactOptionalPropertyTypes: true`, interfaces that declare optional fields as `field?: T` (with no explicit `| undefined`) reject values where the field is present and set to `undefined` — the TS contract requires the key to be absent, not the value to be `undefined`. Type-narrowing + the typed cast into `ProjectConfigInput` failed until the generated value had `undefined` keys stripped.

**User feedback:** Self-caught by E.7 executor during `loadProjectConfig` property authoring 2026-04-18; no user correction required.

**Correct approach:** Wrap `fc.option` generators with a `stripUndefined` map step that recursively drops `undefined` leaves before handing the value to the SUT:
- `fc.option(arb, { nil: undefined }).map(stripUndefined)` preserves the "field absent" coverage the generator intended without tripping `exactOptionalPropertyTypes`.
- Applies to any arbitrary feeding an interface with `field?: T` (no explicit undefined) style optionals. Reference: `packages/cli/src/specs/__tests__/properties.test.ts::loadProjectConfig default completeness`.

---

## Worktree `packages/cli/dist/` is gitignored — `bun run build` before running the CLI shim live
---
priority: low
tech-stack: bun, worktree
enforcement: advisory
---

**Priority:** Low

**What happened:** The v0.5.0 feature-pass-1 P7 executor implemented `gobbi --is-latest` in `packages/cli/src/lib/version-check.ts` + dispatched from `cli.ts`. To verify the flag worked live, the executor tried to run `./packages/cli/bin/gobbi.js --is-latest` from the worktree. The shim requires the compiled JS output in `packages/cli/dist/`, which is gitignored and did NOT exist in the fresh worktree. First invocation failed with a "cannot find module" style error from Bun. A single `bun run build` in the worktree produced the `dist/` output and subsequent invocations worked.

**User feedback:** Self-caught by P7 executor during verification step 2026-04-21; flagged explicitly in the executor's report as a brief-omission for future task authors.

**Correct approach:** When a task brief asks an executor to run the CLI shim live from a freshly-created worktree, either:

- Include `bun run build` as an explicit pre-run step in the brief, OR
- Test via the source code (`bun run packages/cli/src/cli.ts ...`) if the source form works, avoiding the build step, OR
- Assert correctness via unit tests only and skip live invocation

The `dist/` directory is gitignored per `.gitignore`, so every fresh worktree starts without it. Subagents running from a worktree that was just created cannot assume `dist/` is present. Tests that run via the source (like `bun test`) work without a build; live CLI invocation via the `bin/gobbi.js` shim does not.
