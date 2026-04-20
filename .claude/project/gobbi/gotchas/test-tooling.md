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
