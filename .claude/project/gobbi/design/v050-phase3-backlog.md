# v0.5.0 Phase 3 Backlog

Items deferred from v0.5.0 Phase 2 to a future release cycle. Each item has a decision trigger — the condition that signals revisiting. Without triggers, backlog items accumulate indefinitely and Phase 3 planners have no way to know when an item is ready to resurface. Triggers convert a wishlist into an actionable queue: when the condition fires, the item moves into the next release plan.

---

## Backlog items

Items are grouped by trigger class for faster Phase 3 scanning. The trigger-class index below identifies which items can ship at any time versus which are blocked on a precondition.

| Trigger class | Items |
|---|---|
| `velocity` — ship when capacity allows | #98 |
| `signal` — awaits user/data trigger | async ticker, guard daemon, content-hash, `bun --compile` binary, cross-platform CI, #89, #90, #91, #93, #95, #96, #99, #100, ARCH-P1 |
| `architecture` — blocked on internal decision | stance-skill, docs-banner, `@gobbitools/cli` dep declaration |
| `external` — blocked on upstream | `bun --compile` CI gate, npm publish |

---

### Async verification ticker

**Source:** #77 Deferred to Phase 3 (item 1)

**Description:** Async verification mode (`verification.mode: async` per CP4) for long-running test suites. v0.5.0 ships synchronous-default only. Async mode would allow the workflow to continue while verification runs in a background ticker, reporting results on the next `SubagentStop` cycle.

**Trigger:** User reports verification blocking workflow progress on a real project — sync mode p50 latency exceeds 5 seconds on representative sessions. Surface via `gobbi workflow status --verification`.

**Trigger class:** `signal`

---

### Guard daemon

**Source:** #77 Deferred to Phase 3 (item 2)

**Description:** Long-running guard process to reduce per-tool-call CLI startup cost. Current design per `v050-cli.md:45` relies on Bun's single-digit-millisecond startup being fast enough; the daemon would replace per-invocation cold start with an IPC call to an already-warm process.

**Trigger:** Profiling across representative sessions shows guard hook p99 latency exceeds 20ms. Until that data exists, the current per-invocation model is presumed sufficient.

**Trigger class:** `signal`

---

### Content-hash migrations

**Source:** #77 Deferred to Phase 3 (item 3)

**Description:** Spec-file content-hash invalidation for the predicate registry to detect silent spec drift. When a spec file changes without a schema-version bump, the predicate registry currently has no mechanism to detect the stale registration.

**Trigger:** One or more silent-drift incidents reported — a spec changed without triggering re-validation, producing incorrect predicate behavior. Until that happens, the migration-on-schema-bump discipline is sufficient.

**Trigger class:** `signal`

---

### `bun --compile` binary distribution

**Source:** #77 Deferred to Phase 3 (item 4); `v050-cli.md:173`

**Description:** Standalone binary distribution for environments without npm. `bun build --compile` produces a self-contained executable; users in restricted environments could install gobbi without requiring npm or Node.

**Trigger:** Two or more user reports of restricted environments blocking npm install of `@gobbitools/cli`.

**Trigger class:** `signal`

---

### Cross-platform CI tests

**Source:** #77 Deferred to Phase 3 (item 5)

**Description:** Windows and macOS CI matrix. Current CI is Linux-only. Cross-platform gaps are unknown until tests run on those systems — path separators, shell assumptions, and Bun behavior differences are the primary risk surface.

**Trigger:** Windows or macOS user bug report, OR a planned open-source launch that requires platform-coverage confidence.

**Trigger class:** `signal`

---

### Docs-banner CLI helper

**Source:** #77 Deferred to Phase 3 (item 6)

**Description:** `gobbi docs banner add/remove` command to automate the deprecation-banner workflow used manually in PR F.3. PR F.3 applied banners by hand-editing skill files; a CLI helper would reduce friction for future major deprecations.

**Trigger:** Another major deprecation event at v0.6.0 or later that would require applying banners to multiple skill files simultaneously.

**Trigger class:** `architecture`

---

### Stance-skill JSON-embedding maintainability

**Source:** #77 Deferred to Phase 3 (item 7)

**Description:** Review how stance skills (`_innovation`, `_best-practice`) embed content into compiled prompts. Current embedding is string-based; the compiler inlines stance text directly without a structured indirection layer. This becomes a maintenance burden when stance content needs updating.

**Trigger:** Adding a third stance skill, OR any stance-content edit that requires touching the compiler source rather than just the skill file.

**Trigger class:** `architecture`

---

### `bun --compile` CI gate

**Source:** #77 Deferred to Phase 3 (item 8)

**Description:** CI gate that runs `bun build --compile` on every PR to catch compile-time regressions before merge. Currently no CI step validates that the CLI produces a working compiled binary.

**Trigger:** Ships when the `bun --compile` binary distribution path (item 4 above) activates — the CI gate is only meaningful once the binary is a deliverable.

**Trigger class:** `external`

**Blocked-by:** `bun --compile` binary distribution (item 4)

---

### Verification dependency DAG spec

**Source:** #89 (PR E follow-up L12-1)

**Description:** Replace the sequential `runAfterSubagentStop` array in `.gobbi/project-config.json` with a DAG representation. Real-world verification often has dependency structure — typecheck must pass before test is meaningful; lint can run in parallel with both. The current array shape treats all commands as strictly sequential.

**Trigger:** User configures four or more verification commands on one project and reports dependency pain — commands that could parallelize are serialized, or a downstream command runs despite an upstream gate failure.

**Trigger class:** `signal`

---

### Rate-card refresh cadence + cache-economics telemetry

**Source:** #90 (PR E follow-up L12-2)

**Description:** Automate `MODEL_RATES` refresh when Anthropic publishes new pricing, and surface prompt-cache hit-rate telemetry in `gobbi workflow status --cost --cache`. The current `packages/cli/src/lib/cost-rates.ts` has a `lastUpdated` comment but no enforcement mechanism.

**Trigger:** Anthropic publishes a rate-card change that makes the stored rates stale by more than 5%. Overlaps with #96 (MODEL_RATES refresh automation) — coordinate with that item.

**Trigger class:** `signal`

**Blocks:** #96 (coordinate, overlapping scope)

---

### Actionable verification briefing

**Source:** #91 (PR E follow-up L12-3)

**Description:** Extend `compileVerificationBlock` to render actionable briefing — short-form suggestions a subagent can act on directly from the compiled prompt. Today the block renders structured digests only.

**Trigger:** Verification failure rate exceeds 15% of sessions across representative users, OR user feedback explicitly requesting richer failure context in the compiled prompt.

**Trigger class:** `signal`

**Blocked-by:** #93 (`joinCompiledPrompts` unified-budget primitive — must land before actionable briefing to avoid silent budget overflow)

---

### `joinCompiledPrompts` unified-budget primitive

**Source:** #93 (PR E follow-up NEW-5)

**Description:** Extract a `joinCompiledPrompts(primary, ...appendices)` primitive that lets `allocate()` see the full prompt payload when verification-block or other appendices are attached. Current architecture concatenates the verification block outside the allocator, which silently allows total prompt size to exceed the caller's budget invariant.

**Trigger:** Any feature that enlarges the verification block beyond digest-only rendering (e.g., actionable briefing from #91, full stream capture, multi-variant outcomes). This item is a prerequisite; it fires when #91 fires.

**Trigger class:** `signal`

**Blocks:** #91 (actionable verification briefing)

---

### Second e2e scenario: `workflow next` + verification runner

**Source:** #95 (PR E follow-up NEW-7); also deferred per L-F10

**Description:** Add a second e2e scenario at `packages/cli/src/__tests__/e2e/workflow-cycle.test.ts` that exercises `workflow next`, `runVerification`, `compileVerificationBlock`, and `detectAndEmitTimeout` end-to-end through real CLI subprocesses. The existing scenario walks `init → transition×3 → PASS → FINISH` and bypasses the verification path entirely.

**Trigger:** Regression found in the `workflow next` + verification integration that the current single-scenario e2e suite fails to catch.

**Trigger class:** `signal`

---

### `MODEL_RATES` refresh automation

**Source:** #96 (PR E follow-up NEW-8)

**Description:** Scheduled GitHub Actions workflow or release-cut hook that scrapes Anthropic's pricing documentation and compares against the stored `MODEL_RATES` in `packages/cli/src/lib/cost-rates.ts`. On drift, opens a draft PR updating rates and `lastUpdated`. Alternative: at-startup warning when `lastUpdated` is older than N days.

**Trigger:** Anthropic publishes a rate change. Overlaps with #90 (cache-economics telemetry) — coordinate scope at planning time to avoid duplicate automation.

**Trigger class:** `signal`

**Blocks:** #90 (overlapping scope — coordinate)

---

### Fast-check + TS-strict gotchas consolidation

**Source:** #98 (PR E follow-up NEW-10); also deferred per L-F4

**Description:** Create `.claude/project/gobbi/gotchas/test-tooling.md` and migrate the fast-check v4 and `exactOptionalPropertyTypes` gotcha entries from `phase2-planning.md`. These are generic test-tooling patterns, not phase-specific planning errors. Discoverability for future test authors is lower than it should be at the current location.

**Trigger:** A third fast-check-related or TS-strict gotcha is filed, making the case for a dedicated test-tooling doc unambiguous.

**Trigger class:** `velocity`

---

### Fail-fast policy-scope config flag

**Source:** #99 (PR E follow-up NEW-11)

**Description:** Extend `.gobbi/project-config.json` with `verification.policyScope: 'subagent' | 'global'` (default `subagent`). The current implementation stops only the failing subagent's remaining verification commands on gate failure. Projects with cross-subagent correctness gates may need global scope where any gate failure stops all subagents' remaining commands.

**Trigger:** User requests global fail-fast mode — a project has cross-subagent interlocking correctness gates where a failure in one subagent's verification should halt all others.

**Trigger class:** `signal`

---

### `meta.timeoutMs` telemetry emission

**Source:** #100 (PR E follow-up NEW-12)

**Description:** Surface `workflow.step.timeout` events in `gobbi workflow status`, add a `status --timeouts` flag reporting timeout-event counts per step, and optionally emit a structured log line at detection time. Currently the event is persisted but not surfaced in any command output.

**Trigger:** First timeout event seen in production on a real project session.

**Trigger class:** `signal`

---

### Dual-registration duplicate-fire investigation

**Source:** ARCH-P1 (plan-eval Architecture finding)

**Description:** Pre-existing v0.4.x behavior may result in hook events registered in both `plugins/gobbi/hooks/hooks.json` and `.claude/settings.json` simultaneously. If Claude Code does not deduplicate, guard hook may double-emit `guard.violation` or `delegation.complete` events, producing duplicated event-store entries and incorrect cost tallies.

**Trigger:** Reports of double-emitted guard or delegation events in the event store, OR PR F integration testing reveals duplicate events during hook registration verification.

**Trigger class:** `signal`

---

### `@gobbitools/cli` dep declaration in `plugin.json`

**Source:** ARCH-5 (plan-eval Architecture finding)

**Description:** `plugins/gobbi/.claude-plugin/plugin.json` should declare `@gobbitools/cli` as a dependency per `v050-cli.md:158-163`. The declaration is currently absent. Adding it signals to plugin managers that the CLI must be installed before the plugin can function.

**Trigger:** After `@gobbitools/cli@0.5.0` is published to npm. The declaration references a published package — adding it before publish would reference a version that doesn't exist yet.

**Trigger class:** `architecture`

**Blocked-by:** npm publish of `@gobbitools/cli@0.5.0`

---

### npm publish of `@gobbitools/cli@0.5.0` + integration PR

**Source:** L-F2 (plan explicit out-of-scope deferral)

**Description:** Publish `@gobbitools/cli@0.5.0` to npm and open the integration PR merging `phase/v050-phase-2` into `main`/`develop`. Both are out of PR F scope. The publish runs after the integration PR merges — not as part of the feature branch merge. No `.github/workflows/release.yml` exists; publish is currently manual via `npm publish --workspace=packages/cli` from the maintainer's machine.

**Trigger:** PR F merges into `phase/v050-phase-2` and the user decides to ship v0.5.0. The trigger is a deliberate decision, not a data signal.

**Trigger class:** `external`

**Blocks:** `@gobbitools/cli` dep declaration in `plugin.json`

---

## Revisit cadence

- Review this backlog before every minor release transition (v0.5.x → v0.6.x). Items whose triggers have fired move into the next release plan.
- Items in the `velocity` class have no external dependency — they can be picked up whenever capacity allows. Prefer scheduling them alongside structurally related work (e.g., #97 + #98 in the same cleanup pass).
- Items that have not triggered after 12 months should be reassessed: either the trigger condition is wrong, the need no longer exists, or the item should be closed as won't-fix.
- When filing a new follow-up issue, add a backlog entry here with source, description, trigger, and trigger class before the session closes. An issue without a backlog entry has no signal for when to resurface.
