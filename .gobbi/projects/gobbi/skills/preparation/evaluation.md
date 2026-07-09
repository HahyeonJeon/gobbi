---
name: preparation/evaluation
description: Phase child doc loaded by the evaluator at Stage 0 when the workflow phase is `preparation`. Provides the per-perspective evaluation procedure (lens, recommended verifications, anti-patterns, Overall) for a Preparation Loop's readiness artifact; the scenario families and checks live in the sibling scenario.md and checklist.md.
allowed-tools: Read, Grep, Glob, Bash
---

# Preparation Loop — Evaluation Frame

Phase child doc loaded by the evaluator at Stage 0 when the workflow phase is `preparation`. Provides the per-perspective evaluation **procedure** for a Preparation Loop's working draft: each perspective's **lens**, its **recommended verifications**, and its **perspective-specific anti-patterns**, plus the **Overall (Stage 3)** anchors. The concrete GOOD / BAD / adversarial **scenario families** live in the sibling `scenario.md`, and their yes/no **checks** live in the sibling `checklist.md` (whose heading tree mirrors `scenario.md`); each perspective below points to its section in both.

The artifact under evaluation is the leader's draft at `sessions/{date}-{session-id}/2-preparation/working/draft-iter{n}.md`. It contains: Scope reference, Readiness summary, Design + memory readiness (Sub-step B output), Execution skills readiness (Sub-step C output), Generated this loop, Out of scope gaps, Decisions log. Preparation is a process loop — the artifact verifies readiness before planning, not code — so the scenario families in `scenario.md` already include adversarial cases (silent skip, scope absorption, skeleton skills, staging-path misroute) so Stage 2 walks each Frame once without a separate adversarial pass.

---

## Project

**Lens**: Does the Preparation artifact cover the **right readiness gaps** for this specific task? Does it stay inside the locked Scope Contract?

**Scenario source:** `scenario.md` § Project (`PREP-PROJ-SCENARIO-*`)
**Checklist source:** `checklist.md` § Project (`PREP-PROJ-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| Read `1-ideation/outputs/` | Confirm that every gap the artifact claims to address traces to the actual Ideation output |
| Grep for slug names in `2-preparation/staging/` | Confirm every "Generated this loop" entry actually exists on disk |
| Read "Out of scope gaps" vs Scope Contract | Confirm the classification boundary is correct — items inside the Scope Contract should not be deferred without user-approved `defer` decisions |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Scope creep via "while we're here"** | Preparation only resolves readiness gaps for this task. If the leader stamped a skill that was not in the gap-resolution plan, that is an unauthorized action — flag `design_flaw` |
| **Gap count inflation** | Leaders sometimes inflate the gap list to appear thorough. Push back: each gap must be independently verifiable, not derived from vague "we might need this" reasoning |
| **Summary not matching details** | A Readiness summary that says "3 gaps resolved" but the Generated section lists 2 is an internal inconsistency — flag `general` (domain: `docs-sync`) |

---

## Structure

**Lens**: Is the Preparation artifact's **organizing decomposition** sound? Are the staged artifacts shaped correctly? Will downstream loops be able to consume them without confusion?

**Scenario source:** `scenario.md` § Structure (`PREP-STRUCT-SCENARIO-*`)
**Checklist source:** `checklist.md` § Structure (`PREP-STRUCT-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| Grep for `TODO\|TBD\|<\.\.\.>` in staged skill files | Mechanical skeleton check — incomplete skills fail the template bar |
| Check `2-preparation/staging/` directory structure | Confirm the directory layout matches the canonical shape in `preparation/SKILL.md § Output paths` |
| Read one staged skill end-to-end | Confirm it is genuinely useful to an executor, not a placeholder |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Skeleton skills accepted as "generate-now" results** | A skill with placeholder text is not a generated skill — it is a deferred skill. Flag `design_flaw` |
| **Staging path confusion** | Skills staged at `staging/decisions/` instead of `staging/skills/` will be silently lost at Wrap-up promotion. Verify directory structure before assigning confidence |

---

## Performance

**Lens**: Is the Preparation artifact causing **downstream work amplification** — gaps left open that will cost more to fix in Planning or Execution?

**Scenario source:** `scenario.md` § Performance (`PREP-PERF-SCENARIO-*`)
**Checklist source:** `checklist.md` § Performance (`PREP-PERF-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| Read the Execution skills readiness section | Confirm severity assignments are calibrated — "Low" for a skill an executor will hit on every task is likely mis-classified |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Severity deflation to avoid work** | A gap classified as Low to justify `skip` when it is clearly blocking is a severity deflation. Cross-check against the Ideation Scope Contract to confirm the severity is real |

---

## Aesthetics

**Lens**: Is the **working draft itself** readable, consistent, and free of polish gaps?

**Scenario source:** `scenario.md` § Aesthetics (`PREP-AESTH-SCENARIO-*`)
**Checklist source:** `checklist.md` § Aesthetics (`PREP-AESTH-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| Grep for placeholder strings (`TODO`, `TBD`, `<...>`, `???`) in the working draft | Mechanical placeholder check |
| Compare section ordering to the required-sections template | Detect structural deviation from the seven-section contract |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Aesthetics findings used as `FAIL` blockers** | Aesthetics rarely produces `FAIL`. Most findings are Medium or Low; calibrate severity accordingly |
| **"Readiness summary" that only says "preparation complete"** | A summary without counts and per-category status is a placeholder, not a summary — flag `general` (domain: `docs-sync`) |

---

## Usage

**Lens**: For the **next consumer** of this artifact — the Planning leader, the Execution executor, and the Wrap-up assistant — is the Preparation output usable?

**Scenario source:** `scenario.md` § Usage (`PREP-USAGE-SCENARIO-*`)
**Checklist source:** `checklist.md` § Usage (`PREP-USAGE-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| Read `wrap-up/SKILL.md § Staging → Memory routing` | Confirm every staged file's path is handled by the routing table |
| Read one staged skill as if you are an executor who has never seen the DISCUSSION | Identify what context is missing without the leader's session |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"The Planner will ask if unclear"** | The Preparation artifact's job was to answer readiness questions before Planning starts. A Planner who needs to re-ask is a Preparation failure |
| **Staged skills that reference session state** | Staged skills must be standalone. A skill that says "per our discussion" or "as agreed" is unusable outside the session context |

---

## Consistency

**Lens**: Did everything that should sync inside the Preparation artifact, sync? Are there internal contradictions, mismatches between sections, or drifts from the Ideation output?

**Scenario source:** `scenario.md` § Consistency (`PREP-CONS-SCENARIO-*`)
**Checklist source:** `checklist.md` § Consistency (`PREP-CONS-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| Grep slug names from "Generated this loop" in `2-preparation/staging/` | Confirm every listed file exists |
| Read `1-ideation/outputs/` Scope Contract against "Scope reference" section | Confirm the Scope reference is an accurate pointer, not a rewrite |
| Cross-reference the Decisions log against the gap table | Every gap entry should have exactly one Decisions log entry |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"The Decisions log captures everything" without checking** | The Decisions log is easy to falsify by listing decisions that were not actually made. Cross-verify against the gap table row-by-row |
| **Staging directory as source of truth without verification** | Claiming "Generated this loop" is complete based on the staging directory without reading the files is a coverage gap — verify each file is well-formed, not just present |

---

## Risk

**Lens**: **What breaks if Preparation is wrong?** Wrap-up sole-writer contract, staging path correctness, re-Ideate triggers not caught, deferred items lost.

**Scenario source:** `scenario.md` § Risk (`PREP-RISK-SCENARIO-*`)
**Checklist source:** `checklist.md` § Risk (`PREP-RISK-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| `find .gobbi/projects/{project-name}/skills/ -name "*.md"` | Check for any direct memory writes that bypassed staging |
| Check `2-preparation/staging/skills/` slugs against existing skills | Detect slug collisions before Wrap-up promotion |
| Grep `re-ideate` (case-insensitive) in preparation working draft | Confirm the re-Ideate assessment is explicitly recorded, not silently skipped |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Wrap-up sole-writer contract assumed without checking** | The sole-writer contract is a hard constraint. A `generate-now` decision that wrote directly to memory is a constraint violation — flag `design_flaw` (Critical) |
| **"No re-Ideate needed" without checking the Ideation design for unworkable premises** | re-Ideate classification requires comparing each gap's root cause against the Ideation design. A blanket "no re-Ideate" without that check is overconfident |

---

## Overall (Stage 3) — phase-specific anchors

When the evaluator runs Stage 3 on a Preparation artifact, the Karpathy-4 check applies as follows:

| Karpathy mode | What it looks like in a Preparation artifact |
|---|---|
| **Wrong assumptions** | A gap classified as `skip` based on an assumption ("the executor will figure it out") that the Ideation Scope Contract does not support |
| **Overcomplexity** | A `generate-now` skill that codifies conventions that could have been expressed in two sentences in the Ideation design direction — the skill adds maintenance overhead without adding executor clarity |
| **Orthogonal edits** | The Preparation artifact resolves gaps unrelated to the current task (scope absorption) — bundling out-of-scope work dilutes focus and risks Wrap-up promotion pollution |
| **Imperative-over-declarative** | A staged skill that describes what the executor should do step-by-step rather than what the domain conventions *are* — skills teach, they do not script |

**Preserve-list anchors specific to Preparation**: gap-resolution decisions that correctly classify re-Ideate triggers; staged skills that are genuinely complete and standalone; Decisions log entries that capture the user's explicit reasoning per gap.

---

## Output reminder

The evaluator writes **nine** output files per system: the seven per-perspective files + one `overall.md` + the filled `checklist.md` (copied from the sibling `checklist.md` at Stage 0 and ticked through Stage 2), all under `sessions/{date}-{session-id}/2-preparation/evaluation/iter{n}/{system}/`:

- Seven per-perspective files at `sessions/{date}-{session-id}/2-preparation/evaluation/iter{n}/{system}/{project,structure,performance,aesthetics,usage,consistency,risk}.md`
- One overall file at `sessions/{date}-{session-id}/2-preparation/evaluation/iter{n}/{system}/overall.md`
- One filled `sessions/{date}-{session-id}/2-preparation/evaluation/iter{n}/{system}/checklist.md` — the copy-then-tick coverage artifact (Stage 0 copy → Stage 1 `## Stage 1 Additions` → Stage 2 tick with `PASS:` / `FAIL: {finding-id}` / `n/a: {reason}`)

Each per-perspective file structure (mandatory headers): `## Artifact Summary + Memory reads` (from Stage 0; includes paths consumed for project/feature overrides + project mistakes + project rules + prior-phase canonical; when no project rule files exist, this section records the NO_PROJECT_RULES fallback note (per memory/rules.md § Empty-state contract) instead of omitting project rules silently) → `## Locked Frame (Stage 1)` (augmented from this child doc's seed content + prior-iter open findings + overrides) → `## Per-scenario per-check results` → `## Typed findings` (Stage 2, each with Type / Domain / Disposition / Confidence / Severity / Evidence) → `## Low-confidence appendix` section.
