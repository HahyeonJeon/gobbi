---
name: evaluation
description: MUST load for EVALUATION. Defines the 4-stage review, seven perspectives, finding schema, scoring, and phase child docs.
allowed-tools: Read, Grep, Glob, Bash
---

# Evaluation

Skill for any agent performing review during a loop's EVALUATION sub-phase. Whoever loads this skill takes on the **evaluator role** for the duration of the review — the role, not a fixed agent type. Review runs four stages sequentially: **Stage 0 (Target Understanding) → Stage 1 (Scenario-Checklist Frame Build) → Stage 2 (Per-Perspective Sequential Evaluation across seven perspectives) → Stage 3 (Overall)**. The agent that created the artifact must **never** be the same agent that reviews it (separate agent, fresh context).

In Stage 1 scenarios and checklists are **not separate lists** — each scenario carries an **attached checklist** of concrete yes/no conditions that, if all satisfied, prove the scenario is handled. Adversarial coverage (edge cases / failure modes / attack vectors) is baked into the scenarios at frame-build time, not deferred to a separate adversarial sub-stage. Stage 2 walks each perspective's locked Frame once.

Inputs to a review pass:
- The artifact under evaluation (e.g., the Ideation Loop's working draft)
- Any artifact-embedded evaluation criteria the creator provided (context for Stage 1 frame-build, not a separate measurement pass)
- The workflow phase (`ideation` / `preparation` / `planning` / `execution` / `wrap-up`) — selects which child doc to load at Stage 0; the non-loop `startup` P6.5 target is a first-class evaluation target too (§ Phase-specific focus → Startup non-loop target exception)
- The perspective set (always all seven + Overall; no pruning)
- Iter number `n` (resolved by the manager from `session.json.workflow.{loop}.iterations.length`)
- Prior iter's per-perspective files (if `n ≥ 2`) — explicit input for Stage 1 inheritance

The job of evaluation: **find the problems the creator missed**. It is not a confirmation step. A `PASS` verdict without findings must be defensible — "looks fine" is not a finding.

Orchestration concerns — dual-system spawn, perspective selection, cross-system reconciliation, divergence handling, aggregation, iteration caps — are defined separately in [`orchestration/workflow/evaluation.md`](../orchestration/workflow/evaluation.md).

---

## Three-Tier Memory Access Matrix

The agent in the evaluator role MUST observe these tier boundaries. The only write surface is the per-iter per-system per-perspective directory.

| Memory tier | Path root | Access from evaluator role |
|---|---|---|
| **Session record — own perspective dir** | `sessions/{date}-{session-id}/{N}-{loop}/evaluation/iter{n}/{system}/` | **READ + WRITE** — the agent's only writable surface (for the non-loop `startup` P6.5 target the write surface differs — § Phase-specific focus → Startup non-loop target exception) |
| **Session record — prior iter** | `sessions/{date}-{session-id}/{N}-{loop}/evaluation/iter{m}/{system}/` (m < n) | **READ-ONLY** — iter (n-1) is the required source for Stage 1 inheritance; iter `m < n-1` is read on-demand when a `disposition: superseded` reference points to a finding in that earlier iter |
| **Session record — current loop working + staging** | `sessions/{date}-{session-id}/{N}-{loop}/{working,staging}/` | **READ-ONLY** — the artifact + WORK-staged references / backlogs |
| **Session record — prior loops** | `sessions/{date}-{session-id}/{N}-{prior-loop}/` (e.g., Planning evaluator reading Ideation outputs) | **READ-ONLY** — required for cross-loop trace checks |
| **Session record — `session.json`** | `sessions/{date}-{session-id}/session.json` | **FORBIDDEN** — evaluator never reads or writes session.json; the manager owns it (iter `n` is supplied as an input) |
| **Feature memory** | `.gobbi/projects/{project-name}/features/{feature-name}/` | **READ-ONLY** — for verification (e.g., checking existing scenarios / decisions / mistakes). Never written; Wrap-up owns feature-memory writes |
| **Memory** | `.gobbi/projects/{project-name}/{mistakes,rules,design,notes,backlogs,references,decisions,plans,reviews,reports,learnings,archive}/` | **READ-ONLY** — required for Stage 1 to load applicable mistakes + rules. Never written; Wrap-up owns memory writes |

**Delete semantics**: the evaluator NEVER deletes any file in any tier. Supersession is recorded via the `disposition: superseded` field on findings (citing the superseding finding's ID). Once a memory artifact reaches a terminal state, Wrap-up moves the full file (`git mv`) to `archive/{type}/` per the move-on-terminal model — never deletes it.

**Read-only enforcement**: any write attempted outside `sessions/.../{N}-{loop}/evaluation/iter{n}/{system}/` — or, for the non-loop `startup` P6.5 target, outside `sessions/.../startup/working/evaluation/iter{n}/{system}/` (§ Phase-specific focus → Startup non-loop target exception) — is a constraint violation. Code attempting writes to other tiers must be revoked and the evaluator restarted with a corrected scope.

---

## Core Principles

Cross-cutting principles for any agent that loads this skill while in the evaluator role.

> **The creator never evaluates its own output.**

Self-evaluation is structurally biased. The agent that produced the artifact cannot see it as a fresh reader would. Evaluators are always separate agents with fresh context.

> **The Codex proposer and the Codex evaluator are independent — they never share state.**

The Codex proposer (a production-time `codex exec` run) and the Codex evaluator (this review-time run) are distinct, stateless processes with no shared context. The artifact under review is the Claude-authored canonical draft — never the Codex proposal file — and the proposal transcript never enters the evaluator's prompt. This structural independence preserves the anti-groupthink signal: the proposer's framing cannot leak into the evaluation. See `orchestration/workflow/production.md` § Proposer ↔ evaluator independence.

> **An evaluable artifact has clear What / Why / How. If any is missing, flag the gap before measuring.**

Per `principles` Principle 4, no task starts without clear What / Why / How — and an artifact whose own What / Why / How is unclear is unevaluable in the same sense. Measuring an artifact that does not say what it is, why it exists, or how it intends to be implemented produces verdicts that look precise but are about the agent's guesses, not the artifact. At Stage 0 the agent extracts the artifact's W / W / H per the phase child-doc bundle's `evaluation.md`; if any is missing or ambiguous, that gap is itself a Critical `general` finding recorded **before** Stage 1 begins, and Stages 1–3 proceed best-effort with the gap noted in every per-perspective file.

> **Critical, adversarial stance is mandatory.**

Review stance is "find ways this will fail". Not "is this good?" — that question collapses into agreement with the creator. A `PASS` verdict that did not actively try to break the artifact is unreliable. **Comfort is a warning sign.** If the agent feels comfortable with the artifact, it has not pushed hard enough.

> **Build the scenario-checklist frame — including adversarial coverage — before judging the artifact.**

Stage 1 grows scenarios (each with its attached checklist) **before** Stage 2 measures against them. The Frame must already include adversarial scenarios — edge cases, failure modes, attack vectors — because Stage 2 has no separate adversarial pass to pick those up later. A creator's scenarios are often incomplete; evaluating only against an incomplete frame misses the very gaps evaluation exists to surface. The frame is itself an output.

> **Checklist items get binary verdicts. Findings beyond the frame get confidence + severity.**

The checklist items attached to each scenario are yes/no questions designed for clean binary answers. Findings surfaced during Stage 2 that the Frame did not anticipate (a missed edge case, a broken assumption, an anti-pattern hit) carry uncertainty that yes/no cannot express, so they get confidence (how sure?) and severity (how bad if true?).

> **Match verification to the artifact; never shortcut a runnable check.**

Verification mode follows artifact type. For runnable artifacts (code, tests, commands, builds), running produces the strongest evidence — and tool-verified findings cap higher confidence than reasoning-only ones. For text-only artifacts (ideas, plans, design docs, handoff summaries), close reading combined with cross-reference, project `grep`, and file-existence checks **is** the verification — there is no "run" to substitute for, and applying that lens deeply is the equivalent rigor. The discipline: apply the strongest method the artifact admits. Never substitute reasoning for a feasible run; never apologize for reading when the artifact has nothing to run.

> **Recurring findings become mistakes.**

A finding the agent has seen variations of before is the highest-value input to the loop's RECORD phase. Surface it explicitly so the synthesizing assistant can promote it.

---

## Perspectives

Stage 2 applies **seven perspectives** to every artifact (Stage 2), then a final **Overall** holistic pass (Stage 3). The seven form the per-perspective rotation; Overall is its own stage.

| # | Perspective | Lens | Key questions |
|---|---|---|---|
| 1 | **Project** | Right problem, scope contract | <ul><li>Does the artifact solve the right problem?</li><li>Does it stay inside the locked Scope Contract?</li><li>Are there scope drifts (changes unrelated to stated intent)?</li></ul> |
| 2 | **Structure** | Organization, decomposition, dependencies, testability, maintainability | <ul><li>Is the structure sound? Are abstractions appropriate?</li><li>Is coupling managed?</li><li>Is the structure boring-by-default, or is it innovating where it shouldn't?</li><li>Is it testable?</li><li>Will it make sense in two weeks?</li></ul> |
| 3 | **Performance** | Efficiency, resource use, scalability | <ul><li>Are there efficiency risks?</li><li>Resource hogs?</li><li>Hot paths missing optimization?</li><li>Scalability limits identified?</li></ul> |
| 4 | **Aesthetics** | Readability, naming, style conventions, polish | <ul><li>Is it readable?</li><li>Are names accurate and self-explanatory?</li><li>Does it follow project naming / formatting conventions?</li><li>Does every element earn its pixels (Rams)?</li><li>Is the artifact self-evident (Krug)?</li></ul> |
| 5 | **Usage** | Consumer's POV (agent / user / operator / future-self) | <ul><li>Will the next consumer understand and operate this correctly?</li><li>Is the interface intuitive at 3am for a tired human?</li><li>Are failure modes communicated?</li></ul> |
| 6 | **Consistency** | Cross-artifact coherence, sync, internal contradictions | <ul><li>Did *everything that should change together, change together*?</li><li>Code ↔ docs ↔ tests ↔ types ↔ comments ↔ indexes — are they synchronized?</li><li>Are there internal contradictions inside the artifact?</li><li>Does the artifact trace coherently back to the prior phase (Plan ↔ Ideation, Execution ↔ Plan)?</li></ul> |
| 7 | **Risk** | Blast radius, reversibility, security, rollback | <ul><li>What breaks if this is wrong?</li><li>Can it be rolled back?</li><li>Is the security surface understood?</li><li>Are there irreversible operations without safeguards?</li><li>Two-week smell test?</li></ul> |
| — | **Overall** (Stage 3) | Holistic, cross-perspective | <ul><li>What gaps exist *between* perspectives?</li><li>What strengths must be preserved?</li><li>Are any of Karpathy's four failure modes present (wrong assumptions / overcomplexity / orthogonal edits / imperative-over-declarative)?</li></ul> |

Every evaluation runs **all seven perspectives + Overall**. No pruning. Inapplicable perspectives are not skipped — they are still walked and may legitimately produce zero findings, which is itself a recorded result.

> **This 7-perspective vocabulary is the single source for evaluation file naming.** The bare perspective names — `project`, `structure`, `performance`, `aesthetics`, `usage`, `consistency`, `risk` (plus `overall`) — are the canonical filenames every per-perspective evaluation output uses: `sessions/.../{N}-{loop}/evaluation/iter{n}/{system}/{perspective}.md`. **Both systems (Claude + Codex) MUST use these same seven names** so cross-system reconciliation can pair files 1:1. No `pN-` positional prefix, no system-specific perspective vocabulary (e.g. a Codex `scope.md` / `specificity.md` divergent set is non-canonical). If a delegation brief seeds a divergent perspective vocabulary, that is a brief-side defect — the canonical seven here are authoritative. See [`record/SKILL.md` § Per-perspective evaluation file naming](../record/SKILL.md#per-perspective-evaluation-file-naming-the-execution-per-task-quartet) and [`orchestration/workflow/session-record.md`](../orchestration/workflow/session-record.md#workflow-session-record).

### Coverage Ownership Matrix

Cross-cutting concerns that have no obvious single owner are assigned to specific perspectives **as required seed coverage** to prevent silent omission. Every phase's `scenario.md` MUST include seed scenarios for the items below under the assigned perspective(s); the agent CRUDs them at Stage 1 like any other seed scenario.

| Cross-cutting concern | Owning perspective(s) | What's verified |
|---|---|---|
| **Accessibility** | Usage | Keyboard navigation, screen reader paths, color contrast where applicable; for non-UI artifacts: agent / operator accessibility (skip-friendly headings, scannable structure) |
| **Internationalization / localization** | Usage | Locale-sensitive strings, sort order, date / number formats; for text artifacts: terms that don't translate (idioms / culture-bound metaphors) |
| **Privacy / data retention** | Risk + Consistency | Data flow boundaries, PII handling, retention policy; Consistency checks whether the artifact's data flow matches stated retention |
| **Licensing / IP** | Risk + Consistency | License headers, dep licenses, IP statements; Consistency checks license-doc sync |
| **Dependency supply chain** | Risk + Structure | New deps justified, no untrusted sources, version pinning; Structure checks dep-graph implications |
| **Observability / telemetry** | Structure + Usage | Log levels, telemetry coverage of hot paths, alert-ability; Usage checks operator can diagnose at 3am from logs alone |
| **Cost / budget impact** | Performance + Risk | Token / API / infra cost delta named; Risk weighs cost-runaway scenarios |
| **Error budget impact** | Performance + Risk | SLO impact, alert noise, rollback cost |
| **RECORD staging shape + naming** | Consistency + Aesthetics | Per-finding `{slug}.md` filename convention (no bulk files); 5-Type vocabulary (`scenario_gap` / `checklist_gap` / `design_flaw` / `assumption_risk` / `general`) in frontmatter; Domain routing matches `evaluation/SKILL.md § Complete Domain → staging destination routing`; Slug+collision policy compliance per `evaluation/SKILL.md:385-393` |

The owning perspective's seed scenarios in each phase child doc **must** include at least one entry covering each applicable cross-cutting concern (or an explicit `not-applicable: <rationale>` declaration). The manager validates this at Stage 1 exit.

---

## Stages

### Stage 0 — Target Understanding

**Purpose**
Read the artifact end-to-end before judging anything. Identify what it is, what it claims to do, what phase produced it, and which child doc applies. Extract the artifact's **What / Why / How** and confirm each is clear before any Stage 1 work — an unclear W / W / H makes the artifact unevaluable in any precise sense (see Core Principles). Without this, every later stage operates on partial context.

**Inputs**
- Artifact under evaluation
- Workflow phase passed by the manager (`ideation` / `preparation` / `planning` / `execution` / `wrap-up`), or the non-loop `startup` target at its P6.5 gate (§ Phase-specific focus → Startup non-loop target exception)

**Procedure**

| # | Input | Action | Output |
|---|---|---|---|
| 1 | Artifact | Read in full — do not skim, do not skip sections | (context loaded) |
| 2 | Artifact + phase tag | Identify artifact type (idea / plan / code / docs / other) and confirm against phase tag | Confirmed phase + artifact type |
| 3 | Phase tag | **MUST load all three matching phase child docs**: `{phase}/scenario.md` (Stage 1 seed scenarios), `{phase}/checklist.md` (Stage 1 seed checks + copy source), and `{phase}/evaluation.md` (procedure, recommended verifications, perspective anti-patterns, Overall anchors). Verify all three are present and readable, then **copy** the sibling `checklist.md` to `sessions/{date}-{session-id}/{N}-{loop}/evaluation/iter{n}/{system}/checklist.md` before Stage 1 (per § Evaluation child-doc bundle). If any of `scenario.md`, `checklist.md`, or `evaluation.md` is missing or unreadable, record a Critical `general` finding (Domain: `unevaluable`), **halt Stage 0**, and return `BLOCKED` to the manager — never enter Stage 1 with an empty seed frame or a missing procedure (there is no monolithic fallback). | Loaded 3-file child-doc bundle context + Stage-0 `checklist.md` copy |
| 4 | Prior-phase artifacts (if applicable) + Scope Contract + project mistakes + project rules | **READ memory**: (a) prior-phase outputs at `sessions/.../{N}-{prior-loop}/outputs/` (Planning evaluator reads the full `1-ideation/outputs/` directory; Execution evaluator reads `3-planning/outputs/`; Wrap-up reads all prior loops' outputs). (b) Scope Contract — extracted from the prior-loop artifact tagged `artifact_type: scope-contract` (or equivalent), or from this artifact if Ideation. (c) Project mistakes at `.gobbi/projects/{project-name}/mistakes/` (filter by perspective + Domain). (d) Project rules at `.gobbi/projects/{project-name}/rules/`. **Read both directories recursively** — `mistakes/` and `rules/` nest one area level under the type dir (`{type}/{area}/{slug}.md`), so descend into every `{area}/` subdirectory; a single-level read misses by-area files. An absent or empty rules/ dir is the valid no-rules state — record NO_PROJECT_RULES: rules/ absent-or-empty; fallback memory/rules.md read in the Memory-reads register and continue; do NOT treat the empty read as an error (see memory/rules.md § Empty-state contract). **All reads recorded in Artifact Summary's "Memory reads" subsection** so the audit trail is explicit | Memory-read register (paths consumed + which extended which Frame) |
| 5 | Iter number `n` (from manager) | If `n ≥ 2`: **READ prior iter's per-perspective files** at `sessions/.../{N}-{loop}/evaluation/iter{n-1}/{system}/{perspective}.md` (all 8 per system). Additionally, for any `disposition: superseded` reference encountered that points to a finding in iter `m < n-1`, READ `sessions/.../{N}-{loop}/evaluation/iter{m}/{system}/{perspective}.md` on-demand to resolve the reference. Required for Stage 1 inheritance | Prior iter findings + frames available for Stage 1 |
| 6 | Artifact + the bundle's `evaluation.md` W / W / H mapping | Extract the artifact's **What / Why / How** per the phase child-doc bundle's `evaluation.md`. (Ideation: What = the idea / deliverable direction, Why = framed problem + root cause, How = directional design decisions. Preparation: What = the readiness gap list + stamped skills + feature directory, Why = closing the gaps Ideation surfaced before planning starts, How = gap-by-gap resolution steps. Planning: What = the task list, Why = the locked idea this implements, How = task ordering + agent-type assignments. Execution: What = the change-set, Why = the plan task this implements, How = the implementation approach. Wrap-up: What = the handoff summary + promotions, Why = closing the session cleanly, How = the consolidation procedure.) | Extracted W / W / H |
| 7 | Extracted W / W / H | For each axis (W, W, H) judge: is this clear, present, and specific? Apply the **W/W/H gate** below — missing What or Why halts and escalates; missing How proceeds best-effort with Critical finding. Findings recorded here are **first-class scored findings** that participate in per-perspective and Overall aggregation, not silent context | W / W / H clarity verdict + any unevaluable findings |
| 8 | Artifact + extracted W / W / H + memory reads | Write the **Artifact Summary**: one paragraph stating (a) What — the artifact / deliverable, (b) Why — the trigger and success criterion, (c) How — the approach, (d) the Scope Contract it sits under (cite its source path), (e) which downstream consumers will depend on it. Plus a **Memory reads** subsection listing every memory path consumed at step 4 + step 5 | Artifact Summary + Memory reads register |

**W/W/H gate**

| Axis missing or ambiguous | Action |
|---|---|
| **What** (no clear deliverable) | **Halt Stage 0.** Record Critical `general` finding (domain: `unevaluable`). Manager must escalate to user through the active runtime's user-decision primitive before Stage 1 begins. The loop verdict floor is `FAIL` until What is clarified |
| **Why** (no clear trigger / success criterion) | **Halt Stage 0.** Same handling as What missing — without Why the evaluator cannot judge whether the artifact addresses the right problem |
| **How** (no clear approach / first step) | **Continue best-effort.** Record Critical `general` finding (domain: `unevaluable`). Stages 1–3 proceed; per-perspective verdicts inherit at least `REVISE` until How is clarified |

Stage 0 findings are **scored** (Confidence + Severity) and entered into both per-perspective files (header section, propagated) and the Overall stage findings list. They cannot be silently absorbed.

**Phase-mismatch gate** — distinct from W/W/H: if the artifact's identified type does not match the manager-supplied phase tag (e.g., phase tag says `planning` but the artifact reads as an Execution change-set), **halt Stage 0** and escalate through the active runtime's user-decision primitive. The user picks one of: (a) re-evaluate with the detected-type child doc and record a Critical `general` finding (domain: `phase-mismatch`), (b) halt the loop and re-route. Do not silently use the manager-supplied phase tag against a divergent artifact.

**Outputs**
- Extracted W / W / H + clarity verdict + W/W/H gate decision — propagates into every later stage; gate findings are first-class scored findings
- Artifact Summary (1 paragraph) + Memory reads register — written into the per-perspective file's header section, reused across Stages 1–3
- Phase confirmation (or phase-mismatch escalation outcome)
- Loaded 3-file child-doc bundle context (`scenario.md` seed scenarios + `checklist.md` seed checks + `evaluation.md` procedure) + the Stage-0 `checklist.md` copy — frame Stage 1 and Stage 2
- Prior iter findings (if `n ≥ 2`) — available for Stage 1 inheritance

**Exit checklist**
- Artifact read in full
- Phase tag confirmed; mismatch (if any) escalated and resolved per the phase-mismatch gate above
- All three phase child docs (`scenario.md` + `checklist.md` + `evaluation.md`) loaded and readable; `checklist.md` copied to the iter output dir; a missing `scenario.md`/`checklist.md` halted Stage 0 (`BLOCKED`)
- Project mistakes + rules read and filtered by perspective × Domain
- Prior-phase canonical artifact + Scope Contract read (if applicable for this loop)
- Prior iter per-perspective files read (if `n ≥ 2`)
- W / W / H extracted; clarity of each judged; missing What/Why escalated, missing How recorded as Critical `general` finding (domain: `unevaluable`); all gate findings entered into aggregation
- Artifact Summary + Memory reads register written

---

## Scope Contract Schema

The Scope Contract is produced by the Ideation Loop and consumed by every downstream loop (Preparation, Planning, Execution, Wrap-up) to enforce scope boundaries. This is the canonical field schema. All consuming skills reference this section.

```yaml
# Artifact frontmatter (required)
artifact_type: scope-contract
feature: <feature-name or null>          # set during Ideation; locked before Planning
goal: <one-line user-facing outcome>
created-by: <ideation-loop-session-id>
created-at: <ISO-8601 timestamp>

# Body (markdown sections — all five are required)

## In-Scope
- <item 1 — specific work the artifact authorizes>
- <item 2>

## Out-of-Scope
- <item 1 — specific work the artifact excludes; rationale optional>
- <item 2>

## Decisions Locked
- <decision-1>: <one-line rationale>
- <decision-2>

## Success Criteria
- <verifiable criterion 1>
- <verifiable criterion 2>

## Deferred
- <item-1> — pointer (e.g., #258, backlog/foo.md)
```

Consuming skills: `research/SKILL.md`, `ideation/evaluation.md`, `orchestration/workflow/evaluation.md`, `planning/SKILL.md`, `planning/evaluation.md` — each references this section as the canonical schema. Do not define Scope Contract fields elsewhere.

---

### Stage 1 — Scenario-Checklist Frame Build (CRUD per perspective)

**Purpose**
For each perspective, **build the scenario-checklist frame** that Stage 2 will measure against. Scenarios are primary; each scenario carries an **attached checklist** of concrete yes/no conditions that, if all satisfied, prove the scenario is handled. Adversarial coverage (edge cases / failure modes / attack vectors) is baked into the scenarios at this stage — Stage 2 has no separate adversarial sub-stage. The Frame and the gap findings it surfaces are both Stage 1 outputs.

**Inputs**
- Artifact Summary + extracted W / W / H + Memory reads register (Stage 0)
- Artifact's scenario list and implementation checklist (whatever the creator wrote, in whatever shape)
- Phase sibling `scenario.md` per-perspective seed scenarios + the Stage-0-copied `checklist.md` stable seed checks; phase sibling `evaluation.md` supplies only recommended verifications + perspective-specific anti-patterns + Overall anchors

- Prior iter `n-1` per-perspective file (if `n ≥ 2`) — for inheritance
- Perspective lens (Project / Structure / Performance / Aesthetics / Usage / Consistency / Risk)

**Procedure** — run once per perspective. Iterate the seven perspectives in order.

| # | Input | Action | Output |
|---|---|---|---|
| 1 | Artifact's scenarios + perspective lens | **Read** — filter the creator's scenarios to those relevant to this perspective; absorb any checklist-like items the creator wrote into candidate attached-checklist material under whichever scenario they belong to | Filtered creator scenarios + candidate attached items |
| 2 | Phase sibling `scenario.md` seed scenarios + Stage-0-copied `checklist.md` seed checks (this perspective) | **Read** — load the perspective's seed scenario families from `scenario.md` and attach the matching stable CHECK IDs from the copied `checklist.md`; use `evaluation.md` only for procedure, recommended verifications, and anti-patterns. Confirm the seed set includes adversarial scenarios (edge case / failure mode / attack vector); if not, the child-doc bundle has a gap | Seed scenarios + attached seed checks for this perspective |
| 3 | If `n ≥ 2`: prior iter per-perspective file at `sessions/.../{N}-{loop}/evaluation/iter{n-1}/{system}/{perspective}.md` | **Read** — enumerate all prior-iter `disposition: open` findings + all `scenario_gap` / `checklist_gap` discoveries. Carry forward as Stage 1 seed input. (Iter 1 skips this step) | Inherited prior-iter content for Frame seeding |
| 4 | Filtered creator scenarios + seed scenarios + inherited prior-iter content + **applicable project mistakes + rules** (from Stage 0 memory reads, filtered by this perspective × Domain) | **CRUD on scenarios**: Create missing scenarios (especially adversarial ones the creator did not anticipate, prior-iter `open` scenario_gap not yet addressed, AND scenarios derived from applicable mistakes / rules that the artifact must guard against), Update ambiguous creator scenarios, Delete creator scenarios outside this perspective. **Every applicable mistake / rule must become either (a) a Frame scenario citing the mistake/rule path, or (b) an explicit `not-applicable: <rationale>` declaration in the Frame**. Every Create or Update emits a `scenario_gap` finding | Augmented scenario set + `scenario_gap` findings + mistake/rule citations |
| 5 | Augmented scenario set + seed attached checklists + candidate attached items + prior-iter `checklist_gap` findings | For each scenario in the augmented set, **attach its checklist** — the concrete yes/no conditions whose joint satisfaction would prove the scenario handled. Seed from the phase's `checklist.md` (the Stage-0-copied source); fold in creator-written items + any prior-iter `checklist_gap` items that anchor to this scenario | Per-scenario attached checklists |
| 6 | Per-scenario attached checklists | **CRUD on attached items**: Create missing checks, Update ambiguous (every check item must be concrete enough that "did the artifact satisfy this" has an unambiguous yes/no answer), Delete OOS. Every Create or Update emits a `checklist_gap` finding | Augmented attached checklists + `checklist_gap` findings |
| 7 | Augmented scenarios + their attached checklists | Write the perspective's **locked Frame** to the per-perspective file at `sessions/.../{N}-{loop}/evaluation/iter{n}/{system}/{perspective}.md` under the header `## Locked Frame (Stage 1)` — scenarios in order, each with its attached checklist, plus citations for any prior-iter inheritance. Header name is mandatory; iter (n+1) reads this section by exact header match | Per-perspective locked Frame, persisted |

**Outputs** (per perspective)
- Locked Frame — scenarios with attached checklists; used by Stage 2 and Stage 3
- `scenario_gap` and `checklist_gap` findings — **constructive**: on `PASS`, RECORD stages them under `staging/scenarios/` and `staging/checklists/` for Wrap-up to promote

**Adversarial scenario requirement**

Each perspective's Frame MUST include either:
- **≥ 1 adversarial scenario** (explicit `(adversarial)` label, covering an edge case / failure mode / attack vector), OR
- An explicit `not-applicable: <one-sentence rationale>` declaration in the Frame stating why this perspective has no adversarial scenarios for this artifact

Silent omission is **not** allowed. The manager validates this at Stage 1 exit before reconciliation: any Frame that lacks both an adversarial scenario and a `not-applicable:` rationale is bounced back. Forced generic "adversarial" entries to satisfy the rule (e.g., "what if it fails?" with no specific failure mode) count as silent non-compliance — calibrate against the seed adversarial scenarios in the child doc.

**Cross-cutting coverage validation**

The manager also validates that each Frame covers the applicable items from the **Coverage Ownership Matrix** (Accessibility / I18n / Privacy / Licensing / Supply chain / Observability / Cost / Error budget) per the assigned owning perspective(s). Each item either has a seed scenario inherited or augmented, or carries an explicit `not-applicable: <rationale>` declaration. Missing coverage without a rationale bounces the Frame.

**Exit checklist**
- Stage 1 run for every selected perspective (all seven)
- Each perspective's Frame is non-empty
- Each Frame meets the adversarial scenario requirement (≥ 1 adversarial OR explicit `not-applicable:` rationale)
- Each Frame covers all applicable Coverage Ownership Matrix items (or carries `not-applicable:` rationale per item)
- Every scenario has at least one attached checklist item
- Every Create / Update is recorded as a typed finding (`scenario_gap` or `checklist_gap`) with Type + Domain + Confidence + Severity

---

### Stage 2 — Per-Perspective Sequential Evaluation

**Purpose**
For each perspective, judge the artifact against that perspective's **locked Frame** (scenarios with their attached checklists, built in Stage 1). A single unified pass per perspective: walk each scenario and its attached checklist, judge each check item yes/no with evidence, and record any finding the Frame did not anticipate. Because the Frame is required to include adversarial scenarios at frame-build time, Stage 2 does not need a separate adversarial sub-stage — adversarial coverage is already inside the Frame.

**Inputs**
- Artifact Summary + extracted W / W / H (Stage 0)
- Per-perspective locked Frame (Stage 1) — scenarios with attached checklists
- Any artifact-embedded evaluation criteria the creator provided (context, not a separate measurement pass)
- Phase child doc's recommended verifications + perspective-specific anti-patterns

**Procedure** — run once per perspective. Iterate the seven perspectives **in this order**: Project → Structure → Performance → Aesthetics → Usage → Consistency → Risk. Consistency comes after Usage (sync issues are concrete once consumer needs are clear) and before Risk (a sync failure is itself a risk signal Risk should weigh).

| # | Input | Action | Output |
|---|---|---|---|
| 1 | Frame's scenarios (each with attached checklist) | For each scenario in order: for each attached checklist item, judge yes/no with the specific quote / section / tool-output / read-evidence that triggered the answer. Apply the strongest verification the artifact admits (run tools for runnable artifacts; close-reading + cross-reference + `grep` for text artifacts) | Per-scenario per-check yes/no results with evidence |
| 2 | While iterating step 1 | If a previously-unanticipated issue surfaces (edge case the Frame did not name, anti-pattern hit, broken assumption, contradiction), record it as a new typed finding — `scenario_gap` (a new adversarial scenario should be in the Frame) / `checklist_gap` (a covered scenario needs a new check) / `design_flaw` / `assumption_risk` / `general`. Do **not** suppress the finding to fit the Frame — extend the record instead | New typed findings |
| 3 | If `n ≥ 2`: each prior-iter finding inherited at Stage 1 | Judge its **current `disposition:`** based on the artifact: `addressed` (resolved by a change in this artifact iteration — cite the resolution evidence), `open` (still present, unchanged), `disputed` (creator pushed back with rationale; record both creator and evaluator positions), `deferred` (moved to backlog with pointer), `superseded` (replaced by a more general / specific finding — cite the new ID). Iter 1 skips this step | Per-finding disposition update |
| 4 | All findings (checklist failures + new discoveries + inherited prior-iter) | Tag every finding with Type + Domain + Confidence (0/25/50/75/100) + Severity (Critical/High/Medium/Low) + Evidence + Disposition; FP-check against false-positive categories; apply tool / close-reading verification appropriate to artifact before assigning confidence ≥ 75 | Scored typed findings |
| 5 | Scored findings — contributor set is `{open, disputed, newly-surfaced}`; `addressed` / `deferred` / `superseded` are recorded but do not contribute | Compute per-perspective verdict: any `Critical` finding with confidence ≥ 75 → `FAIL`; any `High` finding with confidence ≥ 50 → `REVISE`; otherwise → `PASS` (lower-severity findings recorded for context) | Per-perspective verdict |

**Outputs** (per perspective)
- Per-perspective verdict (`PASS` / `REVISE` / `FAIL`)
- Per-scenario per-check yes/no results — every Frame item answered with evidence
- Typed findings — each with Type / Domain / Confidence / Severity / Evidence / FP-check / **Disposition**
- `## Low-confidence appendix` section at the end of the per-perspective file for findings suppressed at the threshold

**Exit checklist**
- All seven perspectives run in order
- Each perspective's Frame walked end-to-end — every scenario, every attached check item answered
- New discoveries surfaced during step 2 recorded as typed findings (not silently dropped)
- For `n ≥ 2`: every prior-iter finding inherited at Stage 1 has a current `disposition:` value
- Per-perspective verdict computed from the rule above (only `open` / `disputed` / newly-surfaced findings count)
- No perspective skipped — every evaluation runs all seven perspectives without exception

---

### Stage 3 — Overall

**Purpose**
After all seven per-perspective passes, step back and look at the artifact **holistically**. The per-perspective stages are necessarily local; Stage 3 catches what only emerges when the perspectives are seen together — gaps between perspectives, strengths to preserve, integration issues, and Karpathy's four failure modes.

**Inputs**
- All seven per-perspective verdicts and findings (Stage 2)
- Artifact Summary (Stage 0)
- Phase child doc's Overall section

**Procedure**

| # | Input | Action | Output |
|---|---|---|---|
| 1 | Seven per-perspective verdicts | Identify divergences (e.g., Structure says `PASS` but Risk says `REVISE` — what does that reveal?) | Cross-perspective tensions |
| 2 | All findings combined | Look for issues no single perspective owns: cross-cutting concerns, missed integration points, orphaned assumptions | Cross-cutting findings |
| 3 | Artifact + Karpathy 4 failure modes | Check each: **wrong assumptions** (creator built on a faulty premise) / **overcomplexity** (simpler design would suffice) / **orthogonal edits** (artifact bundles unrelated changes) / **imperative-over-declarative** (artifact prescribes mechanism instead of stating the verifiable goal) | Karpathy-mode findings |
| 4 | Artifact | Identify **strengths worth preserving** — what the creator got right and should not be touched by REVISE iterations | Preserve list |
| 5 | All Stage 3 candidate findings | Tag with **Type / Domain / Disposition** / Confidence / Severity / Evidence; FP-check. New Stage 3 findings default to `disposition: open`. The full metadata contract is the same as Stage 2 — no Stage 3 finding is exempt from Type+Domain routing | Overall findings |
| 6 | All Overall findings | Compute Overall verdict: same threshold rules as Stage 2 (any `Critical` ≥ 75 → `FAIL`; any `High` ≥ 50 → `REVISE`; otherwise `PASS`) | Overall verdict |

**Outputs**
- Overall verdict (`PASS` / `REVISE` / `FAIL`)
- Overall findings (cross-cutting + Karpathy-mode), each carrying Type / Domain / Disposition / Confidence / Severity / Evidence (same schema as Stage 2 findings)
- Preserve list (what to leave alone on REVISE)

**Exit checklist**
- All four Karpathy failure modes explicitly checked
- Preserve list non-empty (or "none — every section needs revision" stated explicitly)
- All Overall findings carry the full metadata (Type + Domain + Disposition included; not just Type/Confidence/Severity)
- Overall verdict computed

---

## Finding Metadata: Type / Domain / Disposition / Confidence / Severity

Every Stage 1 gap, every Stage 2 finding, and every Stage 3 finding carries **five required metadata fields**:

- **Type** (5 values) — finding category; routes RECORD
- **Domain** (15+ values) — subject area; routes specialized memory promotion
- **Disposition** (5 values) — iteration lifecycle state (`open` / `addressed` / `disputed` / `deferred` / `superseded`). Iter 1 findings default to `open`. Iter ≥ 2 must judge a fresh disposition for every inherited prior-iter finding (Stage 2 step 3)
- **Confidence** (0/25/50/75/100)
- **Severity** (Critical / High / Medium / Low)

The Type + Domain pair determines staging destination on `PASS` (Stage 2 / 3 below). The Disposition field gates iteration semantics: only `open` / `disputed` / newly-surfaced findings contribute to the per-perspective verdict computation.

### Type (5 values)

| Type | Source | Downstream effect at RECORD (`PASS` only) |
|---|---|---|
| **`scenario_gap`** | Stage 1 Create / Update on scenarios, or Stage 2 discovery of a missing scenario | Stage at `sessions/{date}-{session-id}/{N}-{loop}/staging/scenarios/{slug}.md` |
| **`checklist_gap`** | Stage 1 Create / Update on checklist, or Stage 2 discovery of a missing check | Stage at `sessions/{date}-{session-id}/{N}-{loop}/staging/checklists/{slug}.md`, anchored to its scenario |
| **`design_flaw`** | Stage 2/3 found a concrete flaw (broken invariant, missed failure mode, wrong abstraction) | Surface as `REVISE` requirement; the next iteration must address it. On `PASS` despite the finding, stage at `staging/decisions/` as deferred risk |
| **`assumption_risk`** | Stage 2/3 found an assumption that may not hold | Stage at `staging/decisions/` as assumption note; raise as contribution point if user input is warranted |
| **`general`** | Stage 2/3 finding that does not fit the above | Routed by Domain per the table below |

`scenario_gap` and `checklist_gap` are **constructive** — they grow the artifact rather than reject it. `design_flaw` and `assumption_risk` are **adversarial** — they flag what must change before the artifact passes.

### Complete Domain → staging destination routing (`general` Type)

For Type = `general`, the Domain field selects the staging destination deterministically. This table is the canonical routing — RECORD does not improvise.

| Domain | Staging destination (`PASS` only) |
|---|---|
| `security` | `staging/decisions/{slug}.md` (with frontmatter `security: true`) |
| `performance` | `staging/decisions/{slug}.md` (with frontmatter `performance: true`) — pre-existing perf-regression evidence |
| `test` | `staging/checklists/{slug}.md` — represents a missing test surface |
| `observability` | `staging/decisions/{slug}.md` (with frontmatter `observability: true`) |
| `privacy` | `staging/decisions/{slug}.md` (with frontmatter `privacy: true`) |
| `compliance` | `staging/decisions/{slug}.md` (with frontmatter `compliance: true`) |
| `dependency` | `staging/references/{slug}.md` (cite the dep + version + license + risk) |
| `docs-sync` | `staging/checklists/{slug}.md` — represents a missing doc-update check |
| `cost` | `staging/decisions/{slug}.md` (with frontmatter `cost-impact: <estimate>`) |
| `accessibility` | `staging/checklists/{slug}.md` — represents a missing a11y check |
| `i18n` | `staging/checklists/{slug}.md` |
| `unevaluable` | `staging/decisions/{slug}.md` — usually reflects a process gap |
| `phase-mismatch` | `staging/decisions/{slug}.md` |
| `regression` | `staging/decisions/{slug}.md` (with frontmatter `regression: true`) — record the iter that introduced it |
| `process` | `staging/decisions/{slug}.md` with frontmatter `mistake-candidate: true` — Wrap-up promotes to `features/{feature-name}/mistakes/` or `mistakes/` (user-confirmed scope) |
| `general` | **Error**: a finding with Type = `general` AND Domain = `general` violates the metadata contract — re-derive Domain or escalate |

For Type = `design_flaw` or `assumption_risk`, the destination is always `staging/decisions/{slug}.md` regardless of Domain (the Domain becomes a frontmatter tag).

**Frontmatter tags vs destination routing**: most Domain-specific frontmatter tags above (`security: true`, `privacy: true`, `cost-impact: <estimate>`, `regression: true`, etc.) are **metadata for downstream filtering and audit**, not routing keys — the destination is determined by the staging directory + slug. The only frontmatter tag that affects Wrap-up's destination routing is `mistake-candidate: true`, which routes `staging/decisions/*` to a feature-scoped or project-scoped `mistakes/` directory (see [`wrap-up/promotion.md` § Staging → Memory routing](../wrap-up/promotion.md#staging--memory-routing)).

For Type = `scenario_gap` / `checklist_gap`, the destination is `staging/scenarios/{slug}.md` / `staging/checklists/{slug}.md` regardless of Domain.

### Slug + collision policy

- Slugs are kebab-case, ≤ 60 characters, derived from the finding's primary symptom (not from Type / Domain — those are metadata, not name).
- **Stable finding-ID** — every finding carries a stable `finding-id` field (UUID-like or content-hash) in its frontmatter, set on first creation and preserved across iterations. This is the **idempotency key** for re-runs and collisions:
  - **Same finding-id, same destination** → overwrite (re-run on same iter produces identical file)
  - **Same finding-id, different slug** → impossible by construction; if it ever happens it's a bug, escalate
  - **Different finding-id, same slug at destination** → disambiguate with `-2`, `-3` numeric suffix; record the disambiguation in `working/promotion-manifest.md` (Wrap-up) or per-iter staging notes (loop RECORD). Never overwrite a distinct finding's file
- **Cross-loop slug collisions** (e.g., Planning loop and Execution loop both stage a `redis-connection-pool` finding with different finding-ids) use the loop name as suffix: `redis-connection-pool-planning.md` vs `redis-connection-pool-execution.md`
- **Pre-write check**: before writing staging/{type}/{slug}.md, the writer reads any existing file at that path; if it exists and its frontmatter `finding-id` matches the new finding, overwrite; otherwise apply suffix disambiguation

### Domain (required when applicable)

Every finding carries a `Domain` tag. The Domain is the subject-area label; combined with Type, it lets RECORD route specialized findings without lossy reduction to `general`.

| Domain | Examples |
|---|---|
| **`security`** | Authn / authz gaps, untrusted-input handling, secret leakage, eval / exec misuse |
| **`performance`** | Regression evidence, N+1, hot-path miss, cache misuse |
| **`test`** | Test gap, flake risk, test isolation failure, mock-vs-prod drift |
| **`observability`** | Missing log / metric / trace, alert noise, undiagnosable failure path |
| **`privacy`** | PII handling, data retention, cross-boundary data flow |
| **`compliance`** | License / IP, regulatory requirement, audit trail |
| **`dependency`** | Supply chain risk, undeclared / outdated / vulnerable dep |
| **`docs-sync`** | Code-docs drift, stale comment, missing CHANGELOG, broken link |
| **`cost`** | Token / API / infra cost regression, paid-API misuse |
| **`accessibility`** | A11y violation in UI or agent-facing artifact structure |
| **`i18n`** | Locale-sensitive logic, hardcoded strings, sort-order assumption |
| **`unevaluable`** | Stage 0 W/W/H gap, phase-mismatch escalation outcome |
| **`phase-mismatch`** | Artifact type ≠ manager-supplied phase tag |
| **`regression`** | A finding introduced by a previous REVISE iteration (i.e., this iter is worse than prior on this axis) |
| **`process`** | Workflow discipline (e.g., mistake not recorded, scope-contract not enumerated) |
| **`general`** | When no specific domain applies. Use sparingly — most findings have a domain |

Domain is **required** for every finding except trivial style nits. A finding tagged `general` Type + `general` Domain is a code smell — the evaluator should pick a more specific domain or escalate the taxonomy gap.

---

## Scoring

### Confidence

Anchored at five values. Pick one — interpolation is forbidden because it implies precision the evaluation cannot support.

| Confidence | Meaning |
|---|---|
| **0** | False positive — appears like an issue but, on closer inspection, is not one |
| **25** | Possible but unverified — could be an issue; no evidence confirms it |
| **50** | Probable — likely exists, but evidence is indirect or incomplete |
| **75** | Significant and likely — strong reasoning or partial tool evidence |
| **100** | Definite — verified by tool output, reproduced behavior, or incontrovertible reasoning |

### Severity

Severity is independent of confidence. A finding can be `Critical`/`25` (high-impact if real, unverified) or `Low`/`100` (definitely true, doesn't matter much).

| Severity | Meaning |
|---|---|
| **Critical** | Blocks progress; breaks correctness; creates a security vulnerability |
| **High** | Significant flaw that will cause rework if not addressed now |
| **Medium** | Real issue that should be addressed but doesn't block |
| **Low** | Minor concern, stylistic, or optimization opportunity |

### Threshold filtering

By default, per-perspective output **suppresses** findings with `Confidence ≤ 25` to prevent noise. Suppressed findings are not discarded — they go to a `## Low-confidence appendix` section in the per-perspective file that the manager or user can request.

### False-positive categories

Before assigning confidence ≥ 50, check whether the finding falls into a known false-positive category. If it does, confidence drops to ≤ 25 or the finding is dropped entirely.

| Category | Description |
|---|---|
| **Pre-existing** | Issue exists in the codebase before this artifact's changes |
| **Out-of-scope** | Real issue, but outside the locked Scope Contract |
| **Style preference** | Subjective, not a convention violation |
| **Linter-catchable** | Mechanical issue that automated tooling should catch |
| **Speculative** | Hypothetical concern without supporting evidence |

---

## Verification by tools

When a finding **can** be verified by running a tool, run it before assigning confidence ≥ 75. Tool-verified findings are the highest-confidence class. When the artifact has nothing to run (text-only ideas, plans, docs), the highest-confidence class is **close-reading + cross-reference + grep/file-existence** evidence — the strongest method the artifact admits. Reasoning-only findings — judgments without any verification artifact attached — cap at 50 unless the reasoning chain is short and unambiguous.

### Mixed-mode artifacts

Real artifacts are often mixed: a plan with runnable commands, a design doc with code examples, an execution change-set with both code and notes, a wrap-up with paths plus promoted files. The "runnable vs text-only" framing applies **per segment**, not per artifact. Split the artifact into:

| Segment kind | Verification |
|---|---|
| **Runnable snippet** (commands, code blocks, scripts) | Execute when safe (see Preflight below); confidence ≥ 75 requires tool evidence |
| **File / path / structural claim** | `grep`, `ls`, file-existence checks; confidence ≥ 75 requires the check to actually run and confirm |
| **Prose / decision / rationale claim** | Close-reading + cross-reference; confidence ≥ 75 requires citing the supporting passage explicitly |

Confidence is recorded **per finding** based on the strongest verification mode that applied to that finding's evidence segment — not based on the artifact's overall character.

### Verification preflight (side-effectful tools)

Before running any test, benchmark, or command-as-verification, identify side effects:

| Side effect class | Required action |
|---|---|
| **In-memory / pure compute** | Run freely |
| **File-system write** (workspace-scoped) | Run if in a worktree or scratch dir; never against the user's actual sources |
| **File-system write** (outside workspace) | Forbidden without explicit user approval |
| **Database write** | Require sandbox / test DB / transaction-rolled-back mode; otherwise lower confidence to ≤ 25 and record a `process` finding |
| **Network call** (read-only public) | Run if low cost; confidence as usual |
| **Network call** (live service / mutation / paid API) | Forbidden without explicit user approval; lower confidence to ≤ 25 with a `process` finding if approval unavailable |
| **External notification** (email, Slack, SMS) | Forbidden — always lower confidence and skip the tool run |
| **Cost-bearing call** (paid LLM, cloud API) | Forbidden without explicit user approval and a budget cap |

If safe execution is unavailable, the evaluator does **not** silently downgrade to reasoning-only at the same confidence — confidence is explicitly lowered and the finding records "verification deferred: <reason>". Trust-boundary violations (running side-effectful tools without approval) are anti-patterns.

| Tool | Use when |
|---|---|
| Tests | The project's test suite or a targeted subset can exercise the behavior |
| Grep / rg | Confirm code patterns the artifact references actually exist |
| File existence | Check that paths the artifact mentions actually resolve |
| Type / compile checks | For Execution evaluation, confirm the implementation builds |
| Benchmarks | For performance perspectives, run measurements rather than reasoning about big-O |
| Scope-drift diff | For Project perspective, compare stated intent (Scope Contract / PR description / commit messages) against the actual changeset |

Evaluators are **read-only**: do not modify the artifact, run destructive commands, or write files outside the per-perspective output.

---

## Anti-patterns

Patterns to avoid during review.

| Anti-pattern | What it looks like | Correction |
|---|---|---|
| **Rigid path-checking** | Failing the artifact because it solves the problem differently than the agent imagined | Grade outcomes, not paths. If the design achieves the criterion's goal, the criterion passes regardless of method |
| **Ambiguous criteria absorption** | Interpreting an ambiguous criterion silently in one direction and grading against that interpretation | Log ambiguity as a Stage 2 finding on the `Ambiguity` axis; do not silently resolve it |
| **Grading bypasses** | Accepting artifacts that satisfy criteria cosmetically without solving the underlying problem | Stage 2's typed-finding discovery exists to catch this — probe whether the criteria were satisfied in substance, not just in form |
| **Penalizing valid alternatives** | Marking `FAIL` because the design differs from the agent's preferred approach | Multiple correct approaches exist for most problems. Reject only on factual or contractual violations |
| **"Looks fine" verdicts** | `PASS` without specific evidence the agent attempted to find problems | A `PASS` must be defensible. Stage 2's per-check evidence + new-finding record together document what was looked for and why nothing was missed |
| **Sycophantic verdicts** | Agreeing with the creator's framing or echoing the artifact's claims back as findings | User/creator owns intent; evaluator owns technical correctness. Disagree when the artifact is wrong. "That's interesting" is a failure signal |
| **Severity inflation** | Tagging every finding `Critical` to maximize visibility | "All critical" = "nothing critical". Calibrate against the severity table — most findings are Medium or Low |
| **Frame collapse** | Measuring the artifact only against the creator's scenarios, skipping Stage 1's Create / Update | Stage 1 is non-skippable. The seed scenarios from the phase's `scenario.md` must be reconciled with the creator's set |
| **Stage-skipping** | Jumping from Stage 0 to Stage 2 because "the scenarios look complete" | Stage 1 always runs. "Looks complete" is itself a sycophancy signal |
| **Author-aware evaluation** | Verdict softened because the evaluator knows / infers who wrote the artifact (e.g., "the leader is usually careful, so this gap is probably fine") | The evaluator does not see creator session history. Treat every artifact as if written by an unknown author. Author identity is not evidence |
| **Evaluator fatigue across perspectives** | Late perspectives (Risk, Consistency) get less rigor than early ones (Project, Structure) because the agent's attention waned | Apply identical depth per perspective. If you find yourself wanting to wrap up faster on perspective 6 or 7, that's the fatigue signal — slow down or escalate to a fresh evaluator |
| **Perspective-affinity bias** | Evaluator privileges perspectives it's comfortable with (e.g., Structure deep, Aesthetics shallow) | Each perspective gets the same procedure. Discomfort with a perspective is a coverage gap, not a license to skim |
| **Finding batching to appear thorough** | Splitting one issue into many low-quality findings to make the output look exhaustive | Every finding must have distinct evidence + distinct remediation. Findings that share evidence + remediation are one finding |
| **Confidence inflation on Critical labels** | Tagging a finding `Critical` with confidence `100` to make it stick, even when evidence is partial | Severity and confidence are independent. A `Critical / 50` finding is honest. A `Critical / 100` without tool-verified or close-reading evidence is inflation |
| **Severity deflation on self-disagreement** | Downgrading a finding from `High` to `Medium` because the evaluator is uncertain whether the creator will accept it | Severity reflects impact-if-true, not predicted reception. Downgrade only when impact assessment changes, not when courage wanes |

---

## Phase-specific focus

The procedure is the same across workflow loops; the **focus** shifts by phase via the phase child-doc bundle loaded at Stage 0.

| Phase | Child-doc bundle | What the bundle provides |
|---|---|---|
| Ideation | [`ideation/evaluation.md`](../ideation/evaluation.md) | Seed scenarios (`scenario.md`) + seed checklist (`checklist.md`) + procedure (`evaluation.md`) for an Ideation Loop's working draft (idea, scope contract, framed problem, research insights, design direction, evaluation criteria) |
| Preparation | [`preparation/evaluation.md`](../preparation/evaluation.md) | Seed scenarios (`scenario.md`) + seed checklist (`checklist.md`) + procedure (`evaluation.md`) for a Preparation Loop's readiness artifacts (gap closure, skill stamps, feature directory bootstrap, Ideation-surfaced backlog coverage) |
| Planning | [`planning/evaluation.md`](../planning/evaluation.md) | Seed scenarios (`scenario.md`) + seed checklist (`checklist.md`) + procedure (`evaluation.md`) for a Planning Loop's task decomposition |
| Execution | [`execution/evaluation.md`](../execution/evaluation.md) | Seed scenarios (`scenario.md`) + seed checklist (`checklist.md`) + procedure (`evaluation.md`) for an Execution Loop's code changes. Detailed coding-domain quality checks live in the `coding` skill's evaluation child when that skill exists |
| Wrap-up | [`wrap-up/evaluation.md`](../wrap-up/evaluation.md) | Seed scenarios (`scenario.md`) + seed checklist (`checklist.md`) + procedure (`evaluation.md`) for a Wrap-up Loop's handoff summary |
| Startup (non-loop) | [`startup/evaluation.md`](../startup/evaluation.md) | Seed scenarios (`scenario.md`) + seed checklist (`checklist.md`) + procedure (`evaluation.md`) for a completed startup baseline SET, run at the startup P6.5 gate — see the Startup non-loop target exception below |

Each phase ships a **three-file bundle**: `scenario.md` (per-perspective seed scenarios) + `checklist.md` (per-perspective seed checklist — the copy-then-tick source) + `evaluation.md` (recommended tool verifications → perspective-specific anti-patterns → Overall stage anchors for the phase). See § Evaluation child-doc bundle. All five loop phases plus the non-loop startup target ship the bundle.

> **Startup non-loop target exception.** `startup` is an evaluation target only at its P6.5 gate; it is not a workflow loop and has no `{N}-{loop}` directory. When the target tag is `startup`, Stage 0 loads the `startup/{scenario,checklist,evaluation}.md` bundle (same three-file hard requirement), copies the checklist, and writes all nine per-system evaluator outputs to `sessions/{date}-{session-id}/startup/working/evaluation/iter{n}/{system}/` — NOT a `{N}-{loop}/evaluation/` path. Each evaluator's sole write grant is its own `{system}/` directory there; the manager reads both for reconciliation; iter `{n}` is supplied by the manager and evaluators still never read or write `session.json`. Startup has no prior-loop canonical artifact and no loop Scope Contract, so Stage 0 instead reads the completed baseline SET and the overlapping prior memory named by [`startup/evaluation.md`](../startup/evaluation.md), and extracts the startup What / Why / How from that child doc. Two fresh systems run all seven perspectives + Overall; the generic finding schema, thresholds, checklist semantics, and nine-file contract otherwise apply unchanged. Where a table or enumeration in this skill names only the five loop phases (`ideation` / `preparation` / `planning` / `execution` / `wrap-up`), read it as "plus the non-loop startup target" for this gate.

---

## Evaluation child-doc bundle and the copy-then-tick checklist

Every workflow phase uses a **required three-file child-doc bundle** — `evaluation.md` (procedure, recommended verifications, perspective anti-patterns, Overall (Stage 3) anchors) + `scenario.md` (Stage 1 seed scenario families) + `checklist.md` (the stable seed checks, copied into the evaluator's output directory at Stage 0). All five loop skills (`ideation` / `preparation` / `planning` / `execution` / `wrap-up`) ship the bundle; `execution/` is the reference implementation. **There is no monolithic fallback**: Stage 0 HARD-REQUIRES all three siblings and halts (a Critical `general` / `unevaluable` finding, `BLOCKED`) if `scenario.md` or `checklist.md` is missing or unreadable. Every evaluator writes **nine output files per system**: the seven per-perspective files + `overall.md` + the filled `checklist.md`.

**The three files.** The required three-file bundle divides the work the monolithic `evaluation.md` used to hold:

| File | Role | Consumed at |
|---|---|---|
| `evaluation.md` | the **procedure** — each perspective's lens, source pointers to the two sibling files, recommended verifications, perspective anti-patterns, Overall (Stage 3) anchors | Stage 0 (context) + Stage 2/3 (verifications, anti-patterns) |
| `scenario.md` | the per-perspective GOOD / BAD / adversarial **scenario families** (one `### {ID}` block each: Category / Situation / Good / Bad / Adversarial / Checklist IDs) | Stage 1 seed scenarios |
| `checklist.md` | the concrete yes/no **checks** — one `- [ ]` GFM item per check with a stable CHECK ID, heading tree 1:1 with `scenario.md` | Stage 1 seed checklist + the copy-then-tick source |

**The copy-then-tick output (all phases).** For every phase, the seed `checklist.md` is a *source* the evaluator fills in, producing one extra output file alongside the per-perspective files and `overall.md`:

1. **Stage 0 — copy.** Copy the phase's seed `checklist.md` to `sessions/{date}-{session-id}/{N}-{loop}/evaluation/iter{n}/{system}/checklist.md` (for Execution, under the per-task subtree: `sessions/{date}-{session-id}/4-execution/task-{NN}-{slug}/evaluation/iter{n}/{system}/checklist.md`). The source ships every box unchecked; the copy starts unchecked. This filled copy is the extra evaluation output file for every phase — a coverage artifact, not a finding file.
2. **Stage 1 — `## Stage 1 Additions`.** When Stage 1's CRUD creates or updates a scenario or a check that the seed `checklist.md` did not carry, append it to the copied checklist under a section headed exactly `## Stage 1 Additions` (same heading tree, same stable CHECK-ID style as the seeded checks). This keeps the copied checklist aligned with the per-perspective locked Frames without editing the seed source.
3. **Stage 2 — tick.** As each seeded or Stage-1-added check is judged, tick its box `[x]` and annotate the outcome inline with exactly one marker: `PASS:` (verified satisfied), `FAIL: {finding-id}` (verified violated — cite the Stage 2 finding), or `n/a: {reason}` (not applicable to this artifact). A ticked box means **VERIFIED** — the check was checked against the artifact with the strongest verification it admits (run a tool / read the diff / `grep` / read the call site) — never that work merely happened.
4. **Completeness gate.** Every box in the filled copy (seed checks + `## Stage 1 Additions`) resolves to exactly one of `PASS:` / `FAIL: {finding-id}` / `n/a: {reason}`. An unresolved `- [ ]` box at Stage 2 exit is an incomplete evaluation.

**Legend + counts.** The filled copy carries the legend `- [ ]` unresolved · `- [x] … PASS:` verified satisfied · `- [x] … FAIL: {finding-id}` verified violated · `- [x] … n/a: {reason}` not applicable, plus per-perspective counts (PASS / FAIL / n/a / total).

**Compact per-perspective CHECK-ID results table.** For every phase, each per-perspective file also records its Stage 2 per-check results as a compact table under a `## Per-scenario per-check results` section — one row per check, so a reader traces a scenario's checks without rereading the whole filled copy:

| Scenario ID | CHECK ID | Result | Evidence |
|---|---|---|---|
| `{STEP}-{PERSP}-SCENARIO-01` | `{STEP}-{PERSP}-SCENARIO-01-CHECK-01` | `PASS` / `FAIL: {finding-id}` / `n/a: {reason}` | quote / path / tool output / read-evidence |

This is the tabular rendering of the "per-scenario per-check yes/no results" the Stage 2 Outputs already require; the filled `checklist.md` copy is its cross-perspective companion. Typed findings still live in the per-perspective files and `overall.md` — do not treat checklist rows as finding files.

---

## Output paths

All evaluator writes are **session-scoped**. Evaluators never touch memory.

| Path | Written by | Written |
|---|---|---|
| `sessions/{date}-{session-id}/{N}-{loop}/evaluation/iter{n}/{system}/{perspective}.md` | evaluator | One per perspective per system — contains Artifact Summary + W/W/H (Stage 0) + locked Frame (Stage 1) + per-scenario per-check yes/no results + typed findings + per-perspective verdict (Stage 2) + `## Low-confidence appendix` section |
| `sessions/{date}-{session-id}/{N}-{loop}/evaluation/iter{n}/{system}/overall.md` | evaluator | One per system — contains the Stage 3 overall verdict, cross-cutting findings, Karpathy-mode checks, and Preserve list |
| `sessions/{date}-{session-id}/{N}-{loop}/evaluation/iter{n}/{system}/checklist.md` | evaluator | One filled copy per system — the copy-then-tick coverage register: seed `checklist.md` copied at Stage 0, extended under `## Stage 1 Additions`, and fully ticked with one `PASS:` / `FAIL: {finding-id}` / `n/a: {reason}` marker per check through Stage 2. Together the three rows are the nine per-system evaluator outputs (7 perspectives + `overall.md` + `checklist.md`) |

**Path conventions**

- `{date}` — session start date in `YYYY-MM-DD`
- `{session-id}` — runtime session ID resolved by the manager during Configuration and supplied by the delegation prompt's `session-id:` header field (the parent session's id). Use `CLAUDE_CODE_SESSION_ID` for Claude Code and `CODEX_THREAD_ID` for native Codex. Do NOT read runtime env vars from spawned subagents for this value: in a spawned-subagent context that env-var holds the subagent's own UUID, not the parent session's — use the parent session id supplied by the manager.
- `{loop}` — the workflow loop being evaluated (`ideation` / `preparation` / `planning` / `execution` / `wrap-up`). On disk the loop dir carries the `{N}-` ordinal prefix (`1-ideation` … `5-wrap-up`); the `workflow.{loop}` keys in `session.json` stay **bare** (SEAM-3 — see [`record/record-map.md`](../record/record-map.md))
- `{N}` — the loop's fixed ordinal (`1`=ideation, `2`=preparation, `3`=planning, `4`=execution, `5`=wrap-up); the on-disk loop-dir prefix
- `{system}` — `claude` or `codex` (the system running this evaluator instance)
- `{perspective}` — the perspective slug (`project` / `structure` / `performance` / `aesthetics` / `usage` / `consistency` / `risk`)

The directory `sessions/{date}-{session-id}/{N}-{loop}/evaluation/iter{n}/{system}/` is bootstrapped by the manager before spawning evaluators. Cross-system divergence is **derived at RECORD** by comparing per-system files; no separate divergence file is written.

**Non-loop startup exception.** The `{N}-{loop}` path above applies to the five workflow loops only. The non-loop `startup` target (§ Phase-specific focus → Startup non-loop target exception) writes its nine per-system files to `sessions/{date}-{session-id}/startup/working/evaluation/iter{n}/{system}/` instead — no `{N}-` ordinal, no `{loop}` segment. The manager bootstraps that directory at the startup P6.5 gate.

---

## Constraints

- **MUST be a separate agent from the creator** — the agent that produced the artifact never evaluates it.
- **MUST execute all four stages in order** — Stage 0 → Stage 1 → Stage 2 → Stage 3. No skipping. Stage 1 in particular is non-negotiable.
- **MUST iterate the seven perspectives in the documented order** at Stage 1 and Stage 2 — Project → Structure → Performance → Aesthetics → Usage → Consistency → Risk. Order is not aesthetic; downstream perspectives sometimes depend on earlier verdicts (e.g., Risk weighs Consistency sync failures).
- **MUST load all three phase child docs at Stage 0** (`scenario.md` + `checklist.md` + `evaluation.md`) and **halt** (`BLOCKED`, Critical `general` / `unevaluable`) on a missing or unreadable `scenario.md` or `checklist.md` — there is no monolithic fallback, and measuring against an empty seed is frame collapse.
- **MUST extract and judge the artifact's What / Why / How at Stage 0**, per `principles` Principle 4 — an artifact without clear W / W / H is unevaluable, and the gap is a Critical `general` finding that must be recorded before Stage 1 begins.
- **MUST tag every finding with a `Type` AND a `Domain`** — untyped or domain-less findings cannot be routed by RECORD. `general` Type + `general` Domain is a code smell; specialize at least one.
- **MUST escalate on missing What or Why at Stage 0** — Stage 0 halts and triggers the active runtime's user-decision primitive; missing How proceeds best-effort with Critical `general` (domain: `unevaluable`) finding propagated into aggregation.
- **MUST escalate on phase-mismatch at Stage 0** — never silently evaluate against a phase tag that contradicts the artifact's identified type.
- **MUST validate Stage 1 Frames at exit** — every perspective Frame must satisfy the adversarial scenario requirement and the Coverage Ownership Matrix; bounce and re-build any Frame that doesn't.
- **MUST apply verification preflight before side-effectful tool runs** — DB writes, live network calls, paid APIs, external notifications require explicit user approval; otherwise lower confidence to ≤ 25.
- **MUST apply the strongest verification the artifact admits** — for runnable artifacts, tool-verified evidence is required for confidence ≥ 75; for text-only artifacts, close-reading + cross-reference + `grep` / file-existence checks fill the same role. Reasoning-only findings cap at 50 unless the reasoning chain is short and unambiguous.
- **MUST check every finding against the false-positive categories** before assigning confidence ≥ 50.
- **MUST be read-only against the artifact AND all memory tiers except own write surface** — never modify the artifact; never write to feature memory, memory, session.json, or other systems' evaluation dirs. The ONLY allowed write surface is `sessions/.../{N}-{loop}/evaluation/iter{n}/{system}/*` — or, for the non-loop `startup` P6.5 target, `sessions/.../startup/working/evaluation/iter{n}/{system}/*` instead (§ Phase-specific focus → Startup non-loop target exception). See § Three-Tier Memory Access Matrix for the full table.
- **MUST never delete** — supersession via `disposition: superseded` field; deletion of any file in any tier is forbidden. Terminal memory artifacts are moved (never deleted) to `archive/{type}/` by Wrap-up at session close.
- **MUST never read or write `session.json`** — the manager owns it. Iter `n` is supplied as a delegation input, not derived by the evaluator.
- **MUST record memory reads** — every Stage 0 / Stage 1 read of project / feature / prior-iter memory is logged in the per-perspective file's `## Memory reads` register so audit is explicit.
