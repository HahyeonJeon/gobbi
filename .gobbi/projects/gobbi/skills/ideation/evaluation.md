# Ideation Loop — Evaluation Frame

Phase child doc loaded by the evaluator at Stage 0 when the workflow phase is `ideation`. Provides the per-perspective evaluation **procedure** for an Ideation Loop's working draft: each perspective's **lens**, its **recommended verifications**, and its **perspective-specific anti-patterns**, plus the **Overall (Stage 3)** anchors. The concrete GOOD / BAD / adversarial **scenario families** live in the sibling `scenario.md`, and their yes/no **checks** live in the sibling `checklist.md` (whose heading tree mirrors `scenario.md`); each perspective below points to its section in both.

The artifact under evaluation is the leader's draft at `sessions/{date}-{session-id}/1-ideation/working/draft-iter{n}.md`. It contains: Scope Contract, Framed Problem (six forcing questions), Research Insights (internal + external, managed independently), Scenarios, Implementation Checklist, Design (directional decisions). Ideation is a process loop — the artifact is an idea, not code — so the scenario families in `scenario.md` already include adversarial cases (symptom framing, silent scope overlap, unfalsifiable premise, scope drift) so Stage 2 walks each Frame once without a separate adversarial pass.

Scope Contract schema canonical at `evaluation/SKILL.md` § Scope Contract Schema.

---

## Project

**Lens**: Does the idea solve the **right** problem, inside the locked Scope Contract?

**Scenario source:** `scenario.md` § Project (`IDEA-PROJ-SCENARIO-*`)
**Checklist source:** `checklist.md` § Project (`IDEA-PROJ-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| `git log` / file existence | Confirm "prior attempts" claims (commits / branches / PRs the artifact cites) actually exist |
| Grep into existing memory | Confirm the framed problem is not already solved or already deferred |
| Read Scope Contract against project's `features/{feature-name}/` | Detect contract overlap with active features |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Symptom framing accepted as root cause** | Push back: the "Why" must terminate at a cause that, if absent, would obviate the work |
| **Scope Contract that uses "etc." or "and related"** | Reject — Scope Contract must enumerate. Open-ended phrasing is scope creep waiting to happen |
| **Counterfactual that the creator already won** | Steel-man failed. Re-derive counterfactual with the strongest possible "do nothing" argument |

---

## Structure

**Lens**: Is the idea's **organizing decomposition** sound? Are abstractions appropriate? Will the implementation that follows be maintainable and testable?

**Scenario source:** `scenario.md` § Structure (`IDEA-STRUCT-SCENARIO-*`)
**Checklist source:** `checklist.md` § Structure (`IDEA-STRUCT-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| Grep into project for the proposed library/pattern | Confirm it's not already in use in a way that would conflict |
| Read project's existing module boundaries | Detect cross-cutting concerns the new decomposition would violate |
| Check project's `mistakes/` (recursively — descend into every `{area}/` subdir) for related structural lessons | Avoid repeating known structural mistakes |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Innovation token spent on the wrong thing** | Every novel structural choice spends a finite innovation budget — gstack: "every company gets three innovation tokens". Push back if the idea spends one without justification |
| **Premature abstraction** | If three callers do not yet exist, the abstraction is speculative. Flag as `assumption_risk` |
| **Untestable decomposition** | A design that cannot be incrementally verified will not be incrementally implemented. Flag `design_flaw` |

---

## Performance

**Lens**: Are there **efficiency, resource, or scalability** risks the idea must address now (vs deferring)?

**Scenario source:** `scenario.md` § Performance (`IDEA-PERF-SCENARIO-*`)
**Checklist source:** `checklist.md` § Performance (`IDEA-PERF-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| Read existing perf-sensitive code paths in the project | Confirm the proposed change does not regress an already-tight budget |
| Grep for benchmarks / load tests in the repo | Confirm the perf claim has a verification path |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"Premature optimization" used to dismiss valid concerns** | The label is overused. If a perf risk has a non-trivial probability and the fix is cheap during design, raise it |
| **Reasoning about big-O instead of measuring** | For artifacts at the Ideation stage measurement is not yet possible — but the artifact should commit to a measurement strategy for Execution |

---

## Aesthetics

**Lens**: Is the **artifact itself** readable, consistent, and free of polish gaps? (For Ideation, "aesthetics" applies to the draft document, not to UI of any downstream implementation.)

**Scenario source:** `scenario.md` § Aesthetics (`IDEA-AESTH-SCENARIO-*`)
**Checklist source:** `checklist.md` § Aesthetics (`IDEA-AESTH-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| Compare to a known-good prior Ideation draft in the project | Detect divergence from project conventions |
| Grep for placeholder strings (`TBD`, `TODO`, `???`) | Mechanical placeholder check |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Aesthetics treated as "style preferences"** | Drop confidence to ≤ 25 only if the finding is genuinely subjective. Convention violations and ambiguity-causing names are not preferences |
| **Aesthetics findings used as `FAIL` blockers** | Aesthetics rarely produces `FAIL`. Most findings are Medium or Low; calibrate severity accordingly |

---

## Usage

**Lens**: For the **next consumer of this idea** — the Planner who decomposes it, the Executor who implements it, and the future-self who maintains it — is the artifact usable?

**Scenario source:** `scenario.md` § Usage (`IDEA-USAGE-SCENARIO-*`)
**Checklist source:** `checklist.md` § Usage (`IDEA-USAGE-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| Read the project's Planning skill's input requirements | Confirm the draft contains everything Planning expects |
| Test the "3am test" by reading only the artifact | Identify what context is missing without the leader's session |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Usage findings collapsed into Aesthetics** | Usage is about *consumability*, not *readability*. A perfectly written doc can fail Usage if it omits what the consumer needs |
| **"The Planner will ask if unclear"** | The Planner asking the user is a failure mode for the Ideation artifact — the artifact's job was to answer those questions |

---

## Consistency

**Lens**: Did everything that should sync inside the idea, sync? Are there internal contradictions, mismatches between sections, or drifts from cited research?

**Scenario source:** `scenario.md` § Consistency (`IDEA-CONS-SCENARIO-*`)
**Checklist source:** `checklist.md` § Consistency (`IDEA-CONS-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| `grep -n` for each defined term across the draft | Detect synonym drift |
| Cross-reference scan: every "see Section X" target exists | Detect broken internal links |
| Diff Research Insights vs Design rationale | Detect insight-design drift |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"The reader will understand from context"** | Internal contradictions are not resolved by good readers. Flag `design_flaw` |
| **Cited insight that doesn't say what's cited** | Misquoted / over-claimed research. Re-read the insight and either restate accurately or drop the citation |

---

## Risk

**Lens**: **What breaks if this is wrong?** Blast radius, reversibility, security surface, rollback path. The two-week smell test.

**Scenario source:** `scenario.md` § Risk (`IDEA-RISK-SCENARIO-*`)
**Checklist source:** `checklist.md` § Risk (`IDEA-RISK-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| Grep for callers of any function / module the design will change | Quantify blast radius |
| Read project's `mistakes/` (recursively — descend into every `{area}/` subdir) for related risk lessons | Avoid repeating a known risk pattern |
| Diff the Scope Contract against the Design section | Detect scope drift directly |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"It's just a docs change"** | Docs changes can have blast radius through `MUST load` directives, link targets, and downstream skill behaviors. Don't dismiss |
| **Rollback path that requires perfect coordination** | If rollback assumes everyone notices fast and acts in concert, the rollback path is not real. Flag `assumption_risk` |
| **Security surface delta declared "none" without checking** | "I don't think this changes auth" is not a check. Grep for auth / token / cookie / cors code paths the artifact touches |

---

## Overall (Stage 3) — phase-specific anchors

When the evaluator runs Stage 3 on an Ideation artifact, the Karpathy-4 check applies as follows:

| Karpathy mode | What it looks like in an Ideation artifact |
|---|---|
| **Wrong assumptions** | A premise in the Framed Problem section that the research insights do not support |
| **Overcomplexity** | A directional design decision that could have been "use the existing pattern" but spent an innovation token instead |
| **Orthogonal edits** | The Scope Contract spans subsystems that should have been decomposed into separate ideas — bundling them invites scope creep |
| **Imperative-over-declarative** | The Evaluation Criteria prescribe implementation mechanism instead of stating the verifiable goal (e.g., "must use a recursive parser" instead of "must handle nested expressions correctly") |

**Preserve-list anchors specific to Ideation**: the leader's research insights that are well-grounded; directional design decisions that defensibly chose the boring path; Scope Contract phrasing that is sharp.

---

## Output reminder

The evaluator writes **nine** output files per system: the seven per-perspective files + one `overall.md` + the filled `checklist.md` (copied from the sibling `checklist.md` at Stage 0 and ticked through Stage 2), all under `sessions/{date}-{session-id}/1-ideation/evaluation/iter{n}/{system}/`:

- Seven per-perspective files at `sessions/{date}-{session-id}/1-ideation/evaluation/iter{n}/{system}/{project,structure,performance,aesthetics,usage,consistency,risk}.md`
- One overall file at `sessions/{date}-{session-id}/1-ideation/evaluation/iter{n}/{system}/overall.md`
- One filled `sessions/{date}-{session-id}/1-ideation/evaluation/iter{n}/{system}/checklist.md` — the copy-then-tick coverage artifact (Stage 0 copy → Stage 1 `## Stage 1 Additions` → Stage 2 tick with `PASS:` / `FAIL: {finding-id}` / `n/a: {reason}`)

Each per-perspective file structure (mandatory headers): `## Artifact Summary + Memory reads` (from Stage 0; includes paths consumed for project/feature overrides + project mistakes + project rules + prior-phase canonical when applicable; when no project rule files exist, this section records the NO_PROJECT_RULES fallback note (per memory/rules.md § Empty-state contract) instead of omitting project rules silently) → `## Locked Frame (Stage 1)` (augmented from this child doc's seed content + prior-iter open findings + overrides) → `## Per-scenario per-check results` → `## Typed findings` (Stage 2, each with Type / Domain / Disposition / Confidence / Severity / Evidence) → `## Low-confidence appendix` section.
