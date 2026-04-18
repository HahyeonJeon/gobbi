# Phase 2 Planning Gotchas

Gotchas discovered during v0.5.0 Phase 2 planning workflow (session 0f8427c1, 2026-04-16).

---

## GitHub labels referenced in plans must exist before issue creation

**Priority:** Medium

**What happened:** The Phase 2 plan specified creating an umbrella issue with labels `phase-2`, `breaking-change`, `major-version`. The project-perspective evaluator ran `gh label list` and confirmed NONE of these labels existed in the repo. `gh issue create --label "phase-2"` would have failed with "label not found."

**User feedback:** Flagged by plan evaluator (MAJOR-3 project). No user correction, but the gap would have blocked Step 4 execution.

**Correct approach:** Before any `gh issue create` with labels, verify the labels exist: `gh label list | grep -E "^(phase-2|breaking-change|major-version)"`. If missing, create them first: `gh label create phase-2 --description "v0.5.0 Phase 2 umbrella" --color "0052cc"`. Repeat for each referenced label. Ideally the plan itself should include this as a prerequisite step.

---

## Plugin config lives at `plugins/gobbi/.claude-plugin/plugin.json`, not `plugins/gobbi/plugin.json`

**Priority:** High

**What happened:** Research synthesis and an early draft of the plan referenced `plugins/gobbi/plugin.json`. The project-perspective evaluator discovered via `find` that the actual path is `plugins/gobbi/.claude-plugin/plugin.json`. Had this gone into execution, PR F.6 would have created a spurious `plugins/gobbi/plugin.json` while leaving the actual config at 0.4.5.

**User feedback:** Flagged by multiple eval perspectives.

**Correct approach:** The Claude Code plugin directory convention places `plugin.json` inside a `.claude-plugin/` subdirectory. When referencing plugin config files, `find plugins/ -name 'plugin.json'` to confirm the actual location before writing it into design docs or plans.

---

## Always verify new library recommendations against current package.json

**Priority:** High

**What happened:** Research recommended `ajv` for JSON Schema validation. The research synthesis and plan built on the assumption it was already installed. The project-perspective evaluator caught that `packages/cli/package.json` had ZERO production dependencies — a deliberate architectural choice — and adding `ajv` was a meaningful first-production-dep change that hadn't been flagged as such.

**User feedback:** Flagged by plan evaluator (CRIT-2 project). Addressed by user via AskUserQuestion with explicit approval of adding ajv as first production dep.

**Correct approach:** During research phase, when recommending any library, read the target project's package.json (or equivalent) and explicitly state whether the library is pre-existing or new. For projects with dependency-count opinions, frame any new dependency as an architectural decision requiring user approval. "Use ajv" is not a complete recommendation without "(new production dep — package.json currently has zero)."

---

## Schema-bump flip lists must include rendered-output assertions, not only typed-field assertions

**Priority:** Medium

**What happened:** The PR D.5 plan's "exact 4 assertions to flip" list enumerated four `expect(…schemaVersion).toBe(2)` sites but missed a fifth consequential assertion at `commands/workflow/__tests__/status.test.ts:189` — `expect(captured.stdout).toContain('Schema: v2')`. That line does not reference `schemaVersion` by type; it asserts on the CLI's human-readable rendered output, which the `status` command derives from `state.schemaVersion` via `Schema: v${snapshot.schemaVersion}` at `commands/workflow/status.ts:237`. Bumping `initialState().schemaVersion` 2→3 without flipping the rendered-output assertion would have passed typecheck but failed at runtime.

**User feedback:** Self-caught by the D.5 executor during pre-execution study when grepping `Schema: v2\|Schema: v3` across the test suite.

**Correct approach:** When planning a state-schema bump, the flip list must cover both typed field assertions (`expect(x.schemaVersion).toBe(N)`) AND every rendered/serialized form that passes through a pretty-printer (`Schema: v${n}`, `session.schemaVersion=${n}` in prompt snapshots, etc.). The executor should grep both patterns before committing:

```
grep -rn 'schemaVersion).toBe(' packages/cli/src/
grep -rn 'Schema: v[0-9]\|schemaVersion=[0-9]\|schemaVersion: [0-9]' packages/cli/src/
```

Metadata-file assertions that check a hard-coded TypeScript literal (e.g., `metadata.json.schemaVersion` pinned to 2 because the file shape is immutable per release) must be explicitly excluded by path in the briefing — otherwise an overly-mechanical flip would break the metadata contract.

---

## `reduce(state, event)` has no `event.ts` — reducer signature change required for timestamp-derived state

**Priority:** High

**What happened:** The v0.5.0 Phase 2 PR E.10 briefing and research doc both prescribed `stepStartedAt: event.ts` at two reducer sites (STEP_EXIT and RESUME). Pre-execution study revealed that the `Event` discriminated union is `{ type, data }` only — the on-wire timestamp lives on `EventRow.ts` (the store-layer row) and is explicitly dropped by `rowToEvent`, which returns a plain `Event`. The existing reducer signature `reduce(state, event)` has no access to `ts` at all; `WorkflowStartData.timestamp` and `DelegationSpawnData.timestamp` are payload fields, but STEP_EXIT (`StepExitData = { step }`) and RESUME (`ResumeData = { targetStep, fromError }`) carry no timestamp. `event.ts` as written is aspirational rather than present in the codebase.

**User feedback:** Self-caught by the E.10 executor during pre-execution study when grepping for `event.ts` and finding zero hits outside the briefing's aspirational language.

**Correct approach:** When a plan says "derive state field X from `event.ts`", verify the reducer's actual input type before accepting the literal syntax. Options:

1. **Extend reducer signature** (chosen for E.10): change `reduce(state, event, ts?)` with `ts` plumbed in from `engine.ts`'s `effectiveTs` and `state.ts::deriveState` via `row.ts`. Optional param keeps legacy test call sites working (they preserve prior value). Also update `ReduceFn` in `types.ts`.
2. **Add timestamp field to event data** (rejected — requires schema migration and changes factory callers; breaks additive-identity migration discipline per PR D/E hops).
3. **Return `Event & { ts: string }` from `rowToEvent`** (rejected — changes `Event` shape and propagates through every type signature).

The signature-extension approach preserves reducer purity (given `state, event, ts`, output is deterministic) and keeps `Event` as a pure on-wire shape. Executors receiving a "from `event.ts`" briefing should pre-check `rg 'event\.ts' packages/cli/src/workflow/` to see whether the field actually exists before planning implementation.

---

## Parallel executor worktree has in-flight other-task changes — stage by file, not `git add -A`

**Priority:** High

**What happened:** v0.5.0 Phase 2 PR E Wave 2 runs E.2, E.3, E.4, E.5, E.8, E.9 in parallel on the SAME worktree branch `feat/v050-phase-2-prE`. When the E.5 executor started, `git status` showed 8 modified files and 1 untracked file from other executors still in-flight (validate.ts, reducer.ts, state.ts, events/delegation.ts, etc.). Typecheck on the aggregate state produced 3 errors that were NOT caused by E.5's code. If the executor had used `git add -A` or `git add .` to stage, it would have committed half-finished work from E.2 / E.3 into its commit, poisoning the E.5 commit with another executor's partial state.

**User feedback:** Self-caught during E.5 execution via `git diff` review before commit.

**Correct approach:** On shared worktrees during parallel-wave execution, always stage by explicit file list: `git add packages/cli/src/lib/project-config.ts packages/cli/src/lib/__tests__/project-config.test.ts packages/cli/src/commands/workflow/init.ts`. Run `git diff --staged --stat` before committing to verify only your scope's files are staged. If `git status` shows unexpected files modified, diff them — they're almost certainly other executors' in-flight work. Do not revert them (that destroys their progress); just skip them in your stage.

Also — a `git stash --include-untracked` + `bun test` trick is useful to distinguish pre-existing failures from regressions you introduced. If the suite passes 100% with your code stashed and the same tests fail with it unstashed, those failures are yours. If the same tests fail in both states (or new unrelated tests fail with your code stashed), the failures belong to someone else.

---

## Schema-bump grep must include `CURRENT_SCHEMA_VERSION).toBe(N)` canary assertions

**Priority:** Medium

**What happened:** The PR E E.2 schema v3→v4 flip gate used the canonical `grep schemaVersion).toBe(` pattern (plus `'Schema: v[0-9]'` rendered-literal grep), but a canary test at `packages/cli/src/workflow/__tests__/migrations.test.ts:55` wrote `expect(CURRENT_SCHEMA_VERSION).toBe(3)` — asserting on the exported constant, not on `state.schemaVersion`. The existing grep missed it. Without flipping, the canary would have failed post-bump and locked the schema version in a contradictory state (constant says 4, test pins 3).

**User feedback:** Self-caught by E.2 executor during post-flip `bun test`.

**Correct approach:** Extend the schema-bump pre-flip grep gate to THREE patterns, not two:

```
grep -rn 'schemaVersion).toBe(' packages/cli/src/
grep -rn 'CURRENT_SCHEMA_VERSION.*toBe\|toBe.*CURRENT_SCHEMA_VERSION' packages/cli/src/
grep -rn "'Schema: v[0-9]'\|schemaVersion=[0-9]\|schemaVersion: [0-9]" packages/cli/src/
```

The first matches typed-field assertions; the second matches exported-constant canary assertions; the third matches rendered-output literals (original PR D miss class). Update the flip manifest to include all three classes.

---

## Parallel executor git-tree-modifying operations silently revert peers

**Priority:** High

**What happened:** During PR E Wave 2, four executors worked concurrently in the same worktree. One executor ran `git stash push --keep-index` to isolate its commit, then discarded the stash without restoring. Another executor's uncommitted in-progress work was wiped. A third executor observed the worktree had been `git reset`-ed mid-task and had to re-apply its change set. The final commit state was eventually correct — but one executor's branch of work was silently lost and had to be re-done.

**User feedback:** Surfaced in three of four Wave 2 executor reports (E.2 stashed/dropped; E.5 observed reversion; E.9 had to re-apply).

**Correct approach:** Parallel executors in a shared worktree MUST NOT run `git stash`, `git reset --hard`, `git rebase`, `git checkout .`, or any other index-modifying / worktree-rewriting operation that touches files outside their own change set. Stage ONLY the files you intentionally modify (use `git add <specific-files>`, never `git add .`). If your intended files conflict with another executor's in-progress work, stop and surface to the orchestrator — do NOT attempt to isolate via stash or reset.

Mitigations at the orchestration level:
- Batch parallel executors into waves by file-disjoint sets (plan's Wave 2 file-collision map)
- Pre-allocate zone sentinels in an earlier serial wave (E.2 pattern)
- Keep wave duration short so the "same worktree, two writers" window is minimal

---

## Parallel waves defining shared types silently diverge

**Priority:** High

**What happened:** PR E Wave 2 had four parallel executors each adding related modules: E.2 authored `events/verification.ts`, E.4 authored `workflow/verification-scheduler.ts`, E.5 authored `lib/project-config.ts`. The types `VerificationCommandKind` (`'lint' | 'test' | 'typecheck' | 'build' | 'format' | 'custom'`) and `VerificationPolicy` (`'inform' | 'gate'`) were each independently declared in ALL THREE modules. TypeScript's structural typing accepted all three as compatible — no compile error, no runtime mismatch. But the types had three authority sites with no import linkage. Adding a new commandKind (e.g. `'security'`) would require three simultaneous, uncoordinated edits; missing any one produces silent divergence invisible to tsc.

**User feedback:** Flagged by Project + Architecture + Overall Wave 2 evaluators (all three caught it independently).

**Correct approach:** When multiple parallel executors need a shared type, designate ONE canonical module up-front in the plan — usually the earliest module to land in the wave — and require subsequent executors to import from that canonical source.

For this project specifically, the canonical source for verification-related closed unions (`VerificationCommandKind`, `VerificationPolicy`) is `packages/cli/src/workflow/events/verification.ts`. Any future module that needs these types MUST `import type { VerificationCommandKind, VerificationPolicy } from '../workflow/events/verification.js';` — never redeclare.

Orchestration-level mitigations:
- Specify the canonical source for cross-wave shared types in the plan briefing
- Include an explicit `grep` verification gate in the plan: exactly one declaration per shared type across all files
- Flag in executor briefings when a module is expected to be a producer (other waves will import) vs a consumer (must import, never declare)

---

## AJV `nullable: true` ≠ runtime `null` — defensive guard on `== null`, not `=== undefined`

**Priority:** Low

**What happened:** The v0.5.0 step-spec AJV schema declares `meta.timeoutMs` (and similar optional numeric fields) as `nullable: true`. Codebase convention is to OMIT the field rather than emit `null`, so runtime guards written as `x === undefined` work in practice. However, `nullable: true` in AJV permits null values per JSON Schema — future spec build paths, hand-edited project configs, or a migration-from-prev-version pass could emit `null`, and the `=== undefined` guard would silently fail.

**User feedback:** Wave 3b Overall-perspective evaluator self-caught; user approved the defensive tightening during E.11 evaluation discussion 2026-04-18.

**Correct approach:** For any schema-derived type where the AJV field is `nullable: true`, use loose equality `x == null` (catches both `null` and `undefined`) in runtime guards, not `x === undefined`. The TS type remains `number | undefined` per tsc inference — the guard is defense-in-depth against schema-drift. Pattern reference: `packages/cli/src/commands/workflow/stop.ts::detectAndEmitTimeout`.

---

## Clock-skew produces negative `elapsedMs` — always `< 0` early-return, don't rely on `<=` implicit safety

**Priority:** Low

**What happened:** The `stop.ts::detectAndEmitTimeout` branch computes `elapsedMs = now - Date.parse(state.stepStartedAt)`. If `stepStartedAt` is in the future (clock skew between machines, ntp drift, or test fixtures with synthetic future timestamps), `elapsedMs` is negative. The original implementation was implicitly safe because the check was `elapsedMs > timeoutMs` (negative > positive → false, no timeout emitted). But this safety hinges on the `>` / `<=` semantics — a future refactor introducing `Math.abs()` or switching to `< timeoutMs` would break it silently.

**User feedback:** Wave 3b Overall-perspective evaluator identified the latent invariant; user approved adding an explicit guard 2026-04-18.

**Correct approach:** Add an explicit `if (!Number.isFinite(elapsedMs) || elapsedMs < 0) return;` before any timeout comparison. Documents the invariant at the check site and protects against future refactor regressions. Reference: `packages/cli/src/commands/workflow/stop.ts::detectAndEmitTimeout`.

---
