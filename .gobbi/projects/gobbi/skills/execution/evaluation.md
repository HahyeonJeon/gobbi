# Execution Loop — Evaluation Frame

Phase child doc loaded by the evaluator at Stage 0 when the workflow phase is `execution`. Provides the per-perspective evaluation **procedure** for an Execution Loop's code changes: each perspective's **lens**, its **recommended tool verifications**, and its **perspective-specific anti-patterns**, plus the **Overall (Stage 3)** anchors. The concrete GOOD / BAD / adversarial **scenario families** live in the sibling `scenario.md`, and their yes/no **checks** live in the sibling `checklist.md` (whose heading tree mirrors `scenario.md`); each perspective below points to its section in both.

The artifact under evaluation is **the actual change-set** (committed code, modified files, plus the executor's notes). It is **judged against the plan task it implements**. The Planning working draft + the task spec are required input. The scenario families in `scenario.md` already include adversarial cases (regressions, hidden coupling, security-surface drift) so Stage 2 walks each Frame once without a separate adversarial pass.

Domain-specific code quality details (language idioms, type-system patterns, framework-specific anti-patterns) live in the **`coding` skill's `evaluation.md` child** when that skill is created. This child doc covers the workflow-level evaluation: did the executor implement what the plan asked, completely, without scope creep, and verifiably?

---

## Project

**Lens**: Did the executor implement the **right task**, the whole task, and **only** the task?

**Scenario source:** `scenario.md` § Project (`EXE-PROJ-SCENARIO-*`)
**Checklist source:** `checklist.md` § Project (`EXE-PROJ-SCENARIO-*-CHECK-*`)

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

**Scenario source:** `scenario.md` § Structure (`EXE-STRUCT-SCENARIO-*`)
**Checklist source:** `checklist.md` § Structure (`EXE-STRUCT-SCENARIO-*-CHECK-*`)

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

**Scenario source:** `scenario.md` § Performance (`EXE-PERF-SCENARIO-*`)
**Checklist source:** `checklist.md` § Performance (`EXE-PERF-SCENARIO-*-CHECK-*`)

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

**Scenario source:** `scenario.md` § Aesthetics (`EXE-AESTH-SCENARIO-*`)
**Checklist source:** `checklist.md` § Aesthetics (`EXE-AESTH-SCENARIO-*-CHECK-*`)

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

**Scenario source:** `scenario.md` § Usage (`EXE-USAGE-SCENARIO-*`)
**Checklist source:** `checklist.md` § Usage (`EXE-USAGE-SCENARIO-*-CHECK-*`)

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

**Scenario source:** `scenario.md` § Consistency (`EXE-CONS-SCENARIO-*`)
**Checklist source:** `checklist.md` § Consistency (`EXE-CONS-SCENARIO-*-CHECK-*`)

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

**Scenario source:** `scenario.md` § Risk (`EXE-RISK-SCENARIO-*`)
**Checklist source:** `checklist.md` § Risk (`EXE-RISK-SCENARIO-*-CHECK-*`)

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

Same as the parent SKILL.md — **nine** output files per system: the seven per-perspective files + one `overall.md` + the filled `checklist.md` (copied from the sibling `checklist.md` at Stage 0 and ticked through Stage 2), all under `sessions/{date}-{session-id}/4-execution/task-{NN}-{slug}/evaluation/iter{n}/{system}/`. Each per-perspective file structure (mandatory headers): `## Artifact Summary + Memory reads` (Stage 0) → `## Locked Frame (Stage 1)` → `## Per-scenario per-check results` → `## Typed findings` (Stage 2, each with Type / Domain / Disposition / Confidence / Severity / Evidence) → `## Low-confidence appendix` section.
