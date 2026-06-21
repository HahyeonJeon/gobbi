# Execution Loop — Evaluation Frame

Phase child doc loaded by the evaluator at Stage 0 when the workflow phase is `execution`. Provides per-perspective **seed scenarios with attached checklists** + **recommended tool verifications** + **perspective-specific anti-patterns** for an Execution Loop's code changes.

The artifact under evaluation is **the actual change-set** (committed code, modified files, plus the executor's notes). It is **judged against the plan task it implements**. The Planning working draft + the task spec are required input. Scenarios include adversarial cases (regressions, hidden coupling, security surface drift) so Stage 2 walks each Frame once without a separate adversarial pass.

Domain-specific code quality details (language idioms, type-system patterns, framework-specific anti-patterns) live in the **`coding` skill's `evaluation.md` child** when that skill is created. This child doc covers the workflow-level evaluation: did the executor implement what the plan asked, completely, without scope creep, and verifiably?

---

## Project

**Lens**: Did the executor implement the **right task**, the whole task, and **only** the task?

### Seed scenarios with attached checklists

**The change-set matches the task's `outputs:` field 1:1**
- Each output the task promised is produced
- Files touched in the change-set match the files the task scoped to (or a subset)

**The task's `verifies:` command passes on the change-set**
- Verification is actually run, not asserted
- The verification command produces a clean pass without modification

**No file outside the task's stated scope is touched**
- `git diff --name-only` confirms scope adherence
- Any out-of-scope file change has an explicit allow in the task spec

**The task's `inputs:` are respected — no silently-changed upstream contracts**
- Upstream interfaces the task consumes are unchanged unless the task explicitly modifies them
- No "incidental refactor" of input-side code

**Commit message / PR description names the task being implemented**
- The commit / PR explicitly references the task ID or title
- Message matches the actual diff (no understatement, no overstatement)

**An unrelated "while I was in there" cleanup slips into the change-set (adversarial)**
- The diff is scanned for changes that do not map to any task output
- Cleanup commits are either (a) reverted from this task, or (b) filed as a separate task

### Recommended verifications

| Tool | Use for |
|---|---|
| `git diff` of the change-set vs the task scope | Detect unauthorized file changes |
| Run the task's `verifies:` command in the worktree | Confirm pass |
| Read the task spec alongside the diff | Detect partial implementation |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"I fixed an unrelated bug while I was in there"** | Unrelated fix = scope creep. Revert and file as a separate task, even if "obvious" |
| **Partial implementation labeled complete** | If any of the task's outputs are missing or any verification step skipped, the task is not done — regardless of how close it feels |

---

## Structure

**Lens**: Is the **code structure** of the change-set sound? Does it match project conventions and the Ideation/Planning design direction?

### Seed scenarios with attached checklists

**The change-set's modules / functions / types match the directional design decisions from Ideation**
- New code follows the named library / pattern / API shape from Ideation
- No deviation from the directional design without explicit justification in the commit / PR

**Coupling stays unidirectional — no new cycles**
- `grep` for circular import patterns returns no new hits
- Module-dependency graph remains a DAG

**New code follows project patterns**
- No novel pattern introduced where existing pattern fits
- New functions / methods follow project naming + signature conventions

**Tests exist for the new behavior and run**
- Tests added for new behavior; tests modified for changed behavior
- Tests added are not `test.skip` / `pending` — they actually run

**Tests are isolated and not flake-prone**
- New tests do not share mutable global state with other tests
- New tests have explicit setup / teardown for any file / DB / network state they touch
- New tests do not depend on test execution order (parallel-safe)
- Time / random / external-service dependencies are mocked or pinned (no `Date.now()` / `Math.random()` without seeded substitute)

**Dependency surface is controlled (supply-chain)**
- No new dependencies (or new deps explicitly justified — see memory's "verify deps before recommending" feedback)
- New deps listed in `package.json` (no implicit installs)
- New deps have known license + license matches project policy
- New deps have no known critical CVEs (check vulnerability database)
- New deps are from a recognized publisher / registry (not a typo-squat or fork-of-fork)

**Environment / config / secret changes are explicit and reviewed**
- New env vars added in code are documented (README / `.env.example` / config schema)
- Config schema changes have migration notes for existing config files
- No secrets committed (grep for known secret patterns; check `.gitignore` covers new local-config paths)
- Default values for new config are safe (no production-impacting defaults silently introduced)
- CI / build config changes are explicit (workflow files, lockfile updates explained)

**Type / compile gates pass**
- Type-check / compile run and pass on every modified file
- No `any` / `@ts-ignore` / equivalent inserted without explanation

**No dead code / commented-out blocks / orphan exports**
- Removed code is removed, not commented-out
- New exports have at least one caller (or are clearly public-API additions)

**Error handling style matches project conventions**
- Errors are thrown / returned in the same shape as adjacent code
- No new error-handling pattern introduced silently

**A new "helper" turns out to have only one caller (adversarial)**
- Newly extracted helpers are checked against caller count
- Premature abstractions are flagged and inlined

### Recommended verifications

| Tool | Use for |
|---|---|
| Project's test suite (targeted subset) | Confirm new + changed behavior |
| Type-check / compile | Confirm structural integrity |
| `grep` for circular import patterns | Detect coupling regressions |
| `grep` for new dependency imports vs `package.json` | Detect undeclared deps |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"Refactoring + feature in one commit"** | Hard to review, hard to revert. Split into refactor task + feature task |
| **Tests added but skipped / pending** | A `test.skip` for new behavior is not a test. Flag `design_flaw` |
| **New helper added with one caller** | Premature abstraction. Inline unless the abstraction was named in Ideation |

---

## Performance

**Lens**: Does the change-set **honor** the Ideation perf budgets, and does it not regress existing benchmarks?

### Seed scenarios with attached checklists

**Existing benchmarks pass at expected thresholds**
- Project's benchmark suite runs to completion
- Results within expected variance (no silent regression labeled "noise")

**New IO / network / disk operations honor Planning policies**
- New IO operations have explicit timeout + retry + batch size (or doc justification for default)
- Cache / memoization decisions match Planning commitments

**Hot-path changes have measurement evidence, not reasoning**
- For Ideation-flagged hot paths, the change-set includes a measurement (benchmark output / micro-benchmark result)
- No "I think this is faster" — actual numbers

**No silent N+1 introduced (adversarial)**
- Loops in the new code are scanned for per-iteration external calls
- DB / network call counts are profiled where relevant

**Cost / budget impact is named** (Coverage Matrix: Performance + Risk)
- Token / API / paid-service / infra cost delta vs prior is estimated
- No new paid-API call without an explicit cost ceiling or rate-limit guard
- Cost-bearing operations have a "kill switch" for runaway scenarios

**Observability / telemetry preserved or improved** (Coverage Matrix: Structure + Usage)
- New / changed code paths emit logs at the project's standard levels (info / warn / error)
- New error paths have at least one diagnostic log line — operators can trace failure without re-running
- New / changed metrics or alerts are deliberate, not accidentally removed
- Hot paths critical to Ideation perf budgets emit measurement signals (timing / counter)

### Recommended verifications

| Tool | Use for |
|---|---|
| Project's benchmark suite | Detect regressions |
| `grep` for per-iteration network/db calls in new code | Detect N+1 patterns |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"Benchmark differences are noise"** | Maybe. But the executor must rerun and confirm noise vs regression, not assume |

---

## Aesthetics

**Lens**: Is the **code itself** readable, consistent, and polished?

### Seed scenarios with attached checklists

**Naming matches project conventions**
- Variable / function names follow project casing and naming patterns
- Names are accurate post-refactor (if behavior changed, name should too)

**Comments explain *why* (the non-obvious), not *what* (the obvious)**
- No "this assigns x to y"–style narration comments
- Existing comments invalidated by the change are updated or removed

**Formatting / linting passes**
- Project's lint / format runner passes on every modified file
- No formatter-vs-author disagreements left in the diff

**No leftover debug / commented-out code**
- No `console.log` / `print` / `dbg!` / equivalents in non-test code
- No commented-out code blocks left behind

**The diff "looks neat" but hides a logic shift in formatting noise (adversarial)**
- Pure-formatting diffs are isolated from behavior diffs
- Reviewers can distinguish "this re-flowed the whitespace" from "this changed the conditional"

### Recommended verifications

| Tool | Use for |
|---|---|
| Project's lint / format runner | Mechanical aesthetics |
| `grep` for debug-print patterns | Catch leftover debug code |
| `grep` for `// removed` / `// TODO` / `// FIXME` patterns | Catch shorthand leftover |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Comments narrating the code** | "// loop over users" above `for (user of users)` is noise. Flag, suggest deletion |
| **Naming drift after refactor** | A function whose body changed but name didn't is a maintenance trap |

---

## Usage

**Lens**: For the **next consumer of this code** — the next caller of the changed function, the next maintainer, the future-self who debugs at 3am — is the code usable?

### Seed scenarios with attached checklists

**New / changed function signatures are self-explanatory at call sites**
- Public API additions have signatures / doc-comments / types sufficient for first-time use
- Parameter names communicate intent at the call site

**Error messages are actionable**
- Error messages name the failure + a remediation path
- No generic "Error" / "Something went wrong" messages

**Behavior changes affecting downstream are documented**
- Breaking changes to internal contracts are flagged in commit / PR description
- Public-API behavior changes are documented in the relevant doc (README, CHANGELOG, in-code)

**Logging additions match project log-level conventions**
- New logs use the project's level conventions (info vs warn vs error)
- No info-level logs that should have been debug

**A caller has to read the implementation to know what to do (adversarial)**
- For every new exported function, simulate a fresh caller using only the signature + doc-comment
- If the caller would have to open the implementation, the interface is incomplete

**Accessibility / I18n** (Coverage Matrix: Usage; `not-applicable:` if pure server-side compute)
- UI changes meet keyboard navigation + screen reader expectations + color contrast where applicable
- New user-facing strings are externalized for translation (or `not-applicable:` documented)
- Locale-sensitive operations (sort / date / number format) use locale-aware APIs

### Recommended verifications

| Tool | Use for |
|---|---|
| Read call sites of every changed exported function | Detect call-site fragility |
| `grep` for error-throwing code paths | Audit error message quality |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Error: "Error"** | A generic error message is a debugging dead-end. Flag `design_flaw` |
| **"Caller will know what to do"** | If the caller has to read the implementation to know what to do, the signature is incomplete |

---

## Consistency

**Lens**: Did **everything that should change together, change together**? Code ↔ docs ↔ tests ↔ types ↔ comments ↔ indexes ↔ migrations — are they in sync?

### Seed scenarios with attached checklists

**Renamed function / class / module: every caller updated**
- `grep` for the old name returns no production hits
- Test files referencing the old name are updated

**Changed function signature: every call site updated**
- Every call site updated to the new signature (or explicitly overload-compatible)
- Type errors at call sites are absent

**Tests reflect the new behavior**
- New behavior has a test; modified behavior has a modified test; removed behavior has no orphan test
- No `test.skip` on a real behavior change

**Docs (README, design docs, skill SKILL.md files) reflect the new behavior**
- Public docs referencing changed code are updated in the same change-set
- Stale references to removed/renamed entities are caught and updated

**In-code comments are not stale**
- Comments referencing the changed code are updated or removed
- No comment that contradicts the code it sits above

**Index / barrel / public-API manifests reflect the change-set's exports**
- New exports added to index files
- Removed exports stripped from index files

**Schema / types / migrations all reflect the change together**
- If schema / types changed: migrations, validators, and dependent types all reflect the change
- No "we'll update the validator later"

**CLI / skill / agent references stay in sync**
- If CLI command / flag changed: man-page-equivalent docs and any skill referencing the command are updated
- Skill file paths referenced from agents are updated when paths move

**Commit message / PR description matches the diff**
- Description accurately summarizes the diff (not just one of its tasks)
- No "fix typo" message attached to a 200-line behavioral change

**Code passes tests but docs are now misleading (adversarial)**
- Doc-build / link-check tool runs and passes
- Stale doc claims are detected by comparing doc text to current API surface

### Recommended verifications

| Tool | Use for |
|---|---|
| `grep` old names / old signatures across the repo | Detect un-updated callers / stale references |
| `git diff --name-only` filtered by extension (`.md` vs `.ts` vs `.test.ts`) | Detect "code changed but no docs changed" or "code changed but no tests changed" patterns |
| `grep` in-code comments for terms that name renamed entities | Detect stale comments |
| Project's docs-build / link-check tool | Detect broken doc references |
| Diff commit message vs `git diff --stat` | Detect description-vs-change drift |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"Docs change is a separate task"** | Docs sync goes with the change that breaks them. A "fix docs later" attitude produces a stale-doc backlog that never gets done |
| **"Tests still pass, so we're fine"** | Tests passing while docs are stale is a Consistency failure, not a green light. Check docs explicitly |
| **"This rename is internal"** | Internal renames still break internal callers + internal docs + internal comments. Grep before declaring "internal" |
| **Silent skill drift** | Code change that moves / renames a file path referenced from a skill or agent .md is a sync failure. Update the .md in the same change-set |
| **Commit message understates the diff** | Reviewers and future readers trust the message. A message saying "fix typo" attached to a 200-line diff is a Consistency failure with downstream review-quality cost |

---

## Risk

**Lens**: **What breaks**? Backwards compatibility, security surface, concurrency, blast radius, irreversible operations.

### Seed scenarios with attached checklists

**Blast radius matches the plan's expectation — no unannounced ripple**
- `grep` confirms callers of any changed exported function have been updated or are explicitly tolerated
- Cumulative file-touch count matches the plan's projection

**Backwards-compat for any public interface is a deliberate decision**
- No public-API signature changes without a migration path or a deliberate-break declaration
- Breaking changes are flagged in commit / PR / CHANGELOG

**New security surface is deliberate and reviewed**
- No new untrusted-input path without validation / sanitization
- `grep` for auth / token / cookie / cors / eval / exec code paths in the change-set

**Irreversible operations have rollback paths**
- Migrations / DDL / file writes have rollback steps or revert procedures
- No one-way doors landed without explicit "this is one-way" gating

**Concurrency-sensitive code has explicit synchronization decision**
- Shared mutable state has a synchronization decision (mutex / actor / queue / "not shared")
- No silent reliance on "only one process writes this"

**No safety-bypass primitives left in committed code**
- No `--no-verify` / `--force` / `--skip-tests` in any committed script
- No `eval(` / `exec(` on untrusted input

**A "small refactor" silently widens auth or input trust boundary (adversarial)**
- Any change touching auth / authz / cors / input parsing is reviewed against prior security surface
- Trust-boundary changes are flagged even when they look like cleanup

**Privacy / data retention preserved** (Coverage Matrix: Risk + Consistency)
- No new PII collection without explicit purpose + retention statement
- Existing data-flow boundaries preserved (no silent widening of who can read PII)
- Logs don't newly capture user-identifying or sensitive payload content (or new logs explicitly scrub)
- Backup / replication / cache surfaces respected for any data-class-sensitive change

**License / IP compliance** (Coverage Matrix: Risk + Consistency)
- License headers preserved on modified source files (where project conventions require)
- Added third-party code (copied, vendored, or wrapped) carries its license + attribution
- License-incompatible code (e.g., GPL into MIT project) not introduced

**Infrastructure / deployment surface understood**
- IaC / Dockerfile / Kubernetes manifest changes are deliberate
- Deployment-affecting changes have a rollout plan (canary / staged / instant + revert plan)
- Resource limits (memory, CPU, disk, conn) reviewed for any service-level change

### Recommended verifications

| Tool | Use for |
|---|---|
| `grep` for callers of any changed exported function | Quantify blast radius |
| `grep` for `--no-verify`, `--force`, `eval(`, `exec(`, untrusted-input sinks | Audit risk surface |
| Project's security checklist (if any) | Confirm coverage |
| Read project's `mistakes/` (recursively — descend into every `{area}/` subdir) for related risk lessons | Avoid repeating known mistakes |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"It's an internal API, breaking is fine"** | Internal != callers don't exist. Grep for callers first |
| **Migration without rollback** | A migration the team cannot reverse is a one-way door. Flag `Critical` unless explicitly designed as one-way and gated |
| **Concurrency assumed away** | "Only one process writes this" is an assumption, not a guarantee. Flag `assumption_risk` if not enforced structurally |

---

## Overall (Stage 3) — phase-specific anchors

| Karpathy mode | What it looks like in an Execution artifact |
|---|---|
| **Wrong assumptions** | A test passes because the executor's mental model matches the implementation, but neither matches reality (mocked something that doesn't behave like prod) |
| **Overcomplexity** | The implementation introduces an abstraction / config-knob / strategy-pattern that the task did not require |
| **Orthogonal edits** | The diff bundles changes from multiple plan tasks ("while I was in there"). Should be split |
| **Imperative-over-declarative** | The verification is "check that the diff has these lines" instead of "check that this behavior holds" |

**Preserve-list anchors specific to Execution**: tests that pin previously-undocumented behavior; refactors that made code self-explanatory; verifications that are robust to future changes.

---

## Output reminder

Same as the parent SKILL.md — seven per-perspective files + one overall file under `sessions/{date}-{session-id}/4-execution/task-{NN}-{slug}/evaluation/iter{n}/{system}/`. Each per-perspective file structure (mandatory headers): `## Artifact Summary + Memory reads` (Stage 0) → `## Locked Frame (Stage 1)` → `## Per-scenario per-check results` → `## Typed findings` (Stage 2, each with Type / Domain / Disposition / Confidence / Severity / Evidence) → `## Low-confidence appendix` section.
