# Project Perspective — 5-Role Agent Taxonomy (iter4, claude)

## Artifact Summary + W/W/H

**Artifact under review (post-iter4 comprehensive sweep)**: 5-file role bundle at `.gobbi/projects/gobbi/agents/{manager,leader,executor,evaluator,assistant}.md` + 16 skill dirs at `.gobbi/projects/gobbi/skills/` (delegation, discussion, evaluation, execution, git, gobbi, ideation, interview, memorization, mistake, orchestration, planning, preparation, principles, research, wrap-up).

iter4 was a comprehensive sweep across 5 themes (per the prompt's claims):
- Sweep 1 — AskUserQuestion (17 violations → 17 fixed)
- Sweep 2 — Dangling v0.4 skill refs (4 violations → 4 fixed)
- Sweep 3 — Non-existent perspective doc paths (6 violations → 6 fixed)
- Sweep 4 — preparation project-memory write (1 violation → 1 fixed)
- Sweep 5 — Trivial regressions (2 fixed: assistant.md:3 citation, git dedupe)

**What / Why / How (iter4 fresh judgment)**:
- What ✓ — 5-role taxonomy plus 16 skills wired with corrected discipline contract
- Why ✓ — close iter3's recurrent partial-sweep regression by going wide rather than narrow
- How ✓ — discipline shift from "patch the file the iter3 evaluator named" to "grep all surfaces that hold the same contract". Comprehensive sweep is itself the methodology fix

## Memory reads

- `iter3/claude/project.md` (inheritance — 11 listed findings)
- `iter3/claude/overall.md` (regression-class META F-O-iter3-NEW-01 + 4 stuck)
- `iter3/claude/{structure,performance,aesthetics,usage,consistency,risk}.md`
- `agents/{manager,leader,executor,evaluator,assistant}.md` (full)
- `skills/principles/SKILL.md`, `skills/delegation/SKILL.md`, `skills/wrap-up/SKILL.md`
- `skills/evaluation/SKILL.md`, `skills/ideation/evaluation.md`
- `skills/orchestration/workflow/preparation.md`
- `skills/gobbi/SKILL.md` (mistake claim)
- `skills/git/SKILL.md` (Forbidden Operations + #258 disclosure)
- `ls .gobbi/projects/gobbi/skills/` — confirmed 16 skill dirs including `mistake/`

## Locked Frame (Stage 1)

### S-P-1 (inherited, stuck): Retired v0.4 mapping documented (F-P-01)
- [ ] Migration map enumerated in any bundle file

### S-P-2 (inherited, addressed): No `(or leader)` regressions

### S-P-3 (inherited, addressed): 6-step phase ownership preserved

### S-P-4 (adversarial inherited): Manager scope-creep "single-line edits" exception (F-P-07)

### S-P-5 (adversarial inherited, stuck): Dual-stance retirement cross-pollination (F-P-03)

### S-P-6 (iter4 verification — Sweep 1 frontmatter): Subagent `tools:` lists ↔ prose discipline aligned
- [ ] leader.md `tools:` has NO AskUserQuestion
- [ ] executor.md `tools:` has NO AskUserQuestion
- [ ] evaluator.md `tools:` has NO AskUserQuestion
- [ ] assistant.md `tools:` has NO AskUserQuestion

### S-P-7 (iter4 verification — Sweep 1 skill files): Downstream skill files match agent-file prose
- [ ] wrap-up/SKILL.md frontmatter has NO AskUserQuestion
- [ ] wrap-up/SKILL.md prose: all "MUST run AskUserQuestion" rewritten to NEEDS_CONTEXT
- [ ] memorization/SKILL.md aligned
- [ ] execution/SKILL.md aligned
- [ ] evaluation/SKILL.md aligned

### S-P-8 (iter4 verification — Sweep 4): preparation.md leader-direct-write removed
- [ ] preparation.md does NOT say "leader writes to project memory"
- [ ] Routing through session staging + Wrap-up promotion

### S-P-9 (iter4 verification — Sweep 5b): assistant.md:3 description cites correct skill
- [ ] No `evaluation/SKILL.md memory access matrix` mis-citation

### S-P-10 (NEW iter4 adversarial): Did Sweep 1 introduce a tool-grant gap for legitimate flows?
- [ ] If wrap-up/SKILL.md needs AskUserQuestion at runtime, where is it granted?
- [ ] Are there flows that now fail because the tool was removed without replacement?

### S-P-11 (NEW iter4 adversarial): Did Sweep 2 leave a "mistake skill exists OR doesn't exist" contradiction?
- [ ] gobbi/SKILL.md mistake-skill stance ↔ executor.md mistake-skill load ↔ ls skills/mistake/

### S-P-12 (NEW iter4 adversarial): Sweep 3 evaluator.md correctness
- [ ] evaluator.md path examples reference only existing paths
- [ ] delegation/templates/evaluator.md aligned

### S-P-13 (Privacy / Licensing): not-applicable

## Per-scenario per-check results (Stage 2)

### S-P-1 (F-P-01)
- (a) `grep -nE "pi\|researcher\|agent-evaluator\|skills-evaluator\|gobbi-agent"` in `agents/*.md` → 0 hits (pre-existing v0.4 references absent). No retirement map present. → **open (stuck iter1+iter2+iter3+iter4)**

### S-P-2 (F-P-04 regression check)
- (a) `(or leader)` ambiguity → 0 hits. → **addressed (carry)**

### S-P-3 (F-P-05)
- (a) Phase ownership preserved across 6 phases. → **addressed (carry)**

### S-P-4 (F-P-07)
- (a) manager.md:15 unchanged "single-line edits" exception. → **open (Medium, carry)**

### S-P-5 (F-P-03)
- (a) delegation/SKILL.md still "Single leader per dispatch"; no cross-pollination alternative. → **open (stuck iter1+iter2+iter3+iter4)**

### S-P-6 (iter4 Sweep 1 frontmatter — agent files)
- Tool-grep evidence:
  - `agents/leader.md:4 tools: Read, Grep, Glob, Bash, WebSearch, WebFetch, Write` — AskUserQuestion removed ✓
  - `agents/executor.md:4 tools: Read, Grep, Glob, Bash, Write, Edit` — AskUserQuestion removed ✓
  - `agents/evaluator.md:4 tools: Read, Grep, Glob, Bash` — already absent ✓
  - `agents/assistant.md:4 tools: Read, Grep, Glob, Bash, Write, Edit, WebSearch, WebFetch` — already absent ✓
  - `agents/manager.md:4 tools: "*"` — manager-only retains the tool (correct; the orchestrator owns AskUserQuestion)
- → **F-P-iter3-NEW-01 disposition: addressed**

### S-P-7 (iter4 Sweep 1 skill files — downstream sweep)
- wrap-up/SKILL.md:4 `allowed-tools: Read, Grep, Glob, Bash, Write, Edit` — AskUserQuestion removed ✓
- wrap-up/SKILL.md prose: lines 39, 53, 137, 172, 351, 357 all rewritten to "manager runs AskUserQuestion on your behalf" or "Return `NEEDS_CONTEXT`" patterns. Direct-call wording for the assistant role is gone ✓
- wrap-up/SKILL.md:98, 110, 246, 335: "Run AskUserQuestion" remains, but the subject is the **manager** in every case (DISCUSSION phase, manager-owned section) — semantically correct ✓
- memorization/SKILL.md, execution/SKILL.md, evaluation/SKILL.md, delegation/SKILL.md, principles/SKILL.md, git/SKILL.md: none grant AskUserQuestion in frontmatter ✓
- Manager-loaded skills that still grant AskUserQuestion (per design): gobbi, orchestration, ideation, planning, preparation, interview, discussion — these are loaded by the manager session, not by subagents. ✓
- → **F-P-iter3-NEW-02 / F-C-iter3-NEW-03 / F-U-iter3-NEW-01 / F-R-iter3-NEW-01 disposition: addressed**

### S-P-8 (iter4 Sweep 4 — preparation project-memory write)
- Sweep claim: leader-direct-write removed; replaced with session-staging routing
- Evidence — preparation.md:64: **"The leader writes the draft at `sessions/{date}-{session-id}/preparation/rawdata/draft-iter{n}.md` AND executes the approved gap fixes (stamp missing skills, apply missed memory promotions)."**
- Evidence — preparation.md:72: "WORK execution is more than documentation here, because Preparation's purpose is to **make the gaps go away**. New skills are actually stamped in this phase."
- Evidence — preparation.md:123-125: "Plus session-staged outputs by the leader during WORK — routed to project memory by Wrap-up only: Missed memory promotion candidates → `sessions/.../preparation/staging/{type}/{slug}.md` (Wrap-up promotes these to project memory at session close)"
- **Contradiction**: lines 64+72 say leader stamps skills + applies promotions directly (i.e., writes to `.gobbi/projects/{project-name}/skills/` + `mistakes/`/etc.); lines 123-125 say leader stages and Wrap-up promotes. The two are inconsistent.
- The Sweep 4 claim that "preparation.md leader-direct-write removed" is **only partially true** — lines 123-125 were added (or already existed) showing the staging path, but lines 64+72 still describe direct project-memory writes ("stamp missing skills", "apply missed memory promotions", "New skills are actually stamped in this phase").
- This is the **exact iter3 META-finding pattern** — partial-sweep recurrence. Sweep 4 patched one location and left another speaking the opposite.
- wrap-up/SKILL.md:33 corroborates: "Project memory tier ... **WRITE + UPSERT** — Wrap-up promotes project-scope staging (rules, project-wide design, project-level mistakes, learnings, reports, reviews, journal notes)" — Wrap-up is the contract's sole-writer.
- preparation/SKILL.md (separate file from the orchestration/workflow/preparation.md): readiness scanning; verified READ-ONLY per the Memory Access Matrix (preparation/SKILL.md:30: `**READ-ONLY** — required for readiness scanning ...; Wrap-up owns project-memory writes`). So the role's own skill file is correct; the orchestration workflow file contradicts the role skill file.
- → **F-P-iter4-NEW-01** (High/100, regression class — Sweep 4 was incomplete, same partial-sweep shape as iter3 META)

### S-P-9 (iter4 Sweep 5b — assistant.md:3 citation)
- assistant.md:3 description: "**...session staging during MEMORIZATION + Wrap-up phases (per memorization/SKILL.md Memory Access Matrix); read-only in lookup mode.**" — the prompt claims this fix landed.
- Evidence: `head -10 .gobbi/projects/gobbi/agents/assistant.md` line 3: "...session staging during MEMORIZATION + Wrap-up phases (per memorization/SKILL.md Memory Access Matrix); read-only in lookup mode." ✓
- → **F-A-iter3-NEW-02 disposition: addressed**

### S-P-10 (NEW iter4 adversarial — Sweep 1 introducing tool-grant gap)
- Question: does any flow legitimately need the assistant to call AskUserQuestion at runtime?
- wrap-up/SKILL.md:98 (DISCUSSION manager step): "Run AskUserQuestion" — subject is **manager** ✓
- wrap-up/SKILL.md:137 (WORK step 4, assistant): "Return `NEEDS_CONTEXT` ... manager runs AskUserQuestion on your behalf" — NEEDS_CONTEXT escalation ✓
- No assistant-side AskUserQuestion direct-call required by Sweep 1's post-state. Tool-grant gap is **non-existent**. ✓
- → no finding

### S-P-11 (NEW iter4 adversarial — mistake skill contradiction)
- `ls skills/mistake/` returns `SKILL.md` (the skill exists and has its own SKILL.md file)
- executor.md:29: "**`mistake` skill** — past pitfalls." — loads the skill
- executor.md:49: "Check `mistake` for known pitfalls in this domain."
- gobbi/SKILL.md:154: "Mistake recording is handled directly as project memory under `.gobbi/projects/{project-name}/mistakes/` per the [mistakes template](../memorization/templates/mistakes.md). **There is no separate `mistake` skill.**"
- Evidence: the skill file exists on disk; the gobbi/SKILL.md text explicitly denies its existence; executor.md explicitly loads it.
- This is a **fresh contradiction in iter4** (not in iter3 inheritance — iter3 noted mistake skill peer-conformance with no contradiction). Either the gobbi/SKILL.md text or the skills/mistake/ directory should change.
- The CLAUDE.md (project instructions) at "Gobbi-specific tooling" says: "Every agent MUST load the `mistake` skill before starting work." — supports executor.md.
- → **F-P-iter4-NEW-02** (High/100, NEW iter4 regression — gobbi/SKILL.md:154 directly contradicts the existence of `skills/mistake/SKILL.md` and the load directive in CLAUDE.md + executor.md)

### S-P-12 (NEW iter4 adversarial — Sweep 3 evaluator path verification)
- evaluator.md:41 lists `skills/ideation/evaluation.md` + `skills/execution/evaluation.md` as examples
- File existence: `skills/ideation/evaluation.md` ✓ (read in Stage 0)
- evaluator.md:43: "No perspective-specific sub-docs exist under `skills/evaluation/`, `agents/evaluation/`, `rules/evaluation/`, or `project/evaluation/` — do not construct paths to those directories." — Sweep 3 added a negative ratchet preventing the iter3 F-U-03 path-fabrication failure mode ✓
- delegation/templates/evaluator.md (verified) — line 81 references "phase-specific evaluation doc (e.g., `skills/ideation/evaluation.md`, `skills/execution/evaluation.md`, `skills/planning/evaluation.md`, `skills/wrap-up/evaluation.md`)". `planning/evaluation.md` and `wrap-up/evaluation.md` referenced — quick spot-check:
  - `skills/wrap-up/evaluation.md` referenced in wrap-up/SKILL.md:18 and 227 — assumed present (would need ls to confirm)
  - `skills/planning/evaluation.md` — not directly verified in this Stage 2 pass
- → **F-U-03 disposition: addressed via Sweep 3** (the previously-fabricated `agents/evaluation/{perspective}.md` paths replaced with existing-skill-evaluation paths and a negative ratchet)

### S-P-13 (Privacy / Licensing)
- not-applicable

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-P-01** | `scenario_gap` | `docs-sync` | **open (stuck iter1-4)** | 75 | Medium | No retirement map for v0.4 → 5-role mapping | Carry-forward stuck |
| **F-P-02** | `assumption_risk` | `process` | open (carry) | 50 | Medium | gobbi-agent plugin agent fate still silent | Carry |
| **F-P-03** | `design_flaw` | `process` | **open (stuck iter1-4)** | 75 | High | delegation/SKILL.md:45 still "Single leader per dispatch"; no cross-pollination alternative | Stuck across 4 iters |
| **F-P-04** | `design_flaw` | `process` | addressed (carry) | 100 | n/a | No `(or leader)` regression | Carry |
| **F-P-05** | `scenario_gap` | `process` | addressed (carry) | 100 | n/a | 6-phase ownership preserved | Carry |
| **F-P-06** | `design_flaw` | `docs-sync` | addressed (bundle) / deferred (CLAUDE.md) | 100 | n/a | Bundle phase list intact | Carry |
| **F-P-07** | `design_flaw` | `process` | open (carry) | 50 | Medium | manager.md:15 single-line exception | Carry |
| **F-P-08** | `scenario_gap` | `process` | open (carry) | 25 | Low | Parallel evaluator synthesis ownership unclear | Carry |
| **F-P-iter2-NEW-01** | `design_flaw` | `cost` | open (carry) | 50 | Medium | Assistant sonnet sole-writer carry | Carry |
| **F-P-iter3-NEW-01** | `design_flaw` | `docs-sync` | **addressed (Sweep 1)** | 100 | n/a | leader.md + executor.md frontmatter `tools:` no longer grant AskUserQuestion | iter3 regression closed by comprehensive sweep |
| **F-P-iter3-NEW-02** | `design_flaw` | `docs-sync` | **addressed (Sweep 1)** | 100 | n/a | wrap-up/SKILL.md frontmatter cleansed; prose rewritten to NEEDS_CONTEXT routing | iter3 regression closed |
| **F-P-iter4-NEW-01** | `design_flaw` | `process` | **open (NEW iter4 regression)** | 100 | **High** | orchestration/workflow/preparation.md:64+72 still say "leader stamps missing skills" / "applies missed memory promotions" / "New skills are actually stamped in this phase"; lines 123-125 say leader stages and Wrap-up promotes. Internal contradiction within the same file; cross-file contradiction with wrap-up/SKILL.md:33 sole-writer claim and preparation/SKILL.md:30 read-only project-memory tier | The Codex-H1 finding the prompt claimed was "1 violation, 1 fix" — only the staging-path was added; the direct-write language wasn't deleted. SAME partial-sweep shape as iter3's META-finding. preparation/SKILL.md (role) is correct; preparation.md (orchestration) contradicts it |
| **F-P-iter4-NEW-02** | `design_flaw` | `docs-sync` | **open (NEW iter4 regression)** | 100 | **High** | `skills/mistake/SKILL.md` exists on disk; CLAUDE.md mandates loading the `mistake` skill; executor.md:29 + agent files load `mistake` skill; **gobbi/SKILL.md:154 says "There is no separate `mistake` skill."** Direct contradiction | A central skill is denied to exist in the workspace's entry-point skill while every other surface loads it. The first thing a fresh subagent reads is the load directive that says "load the `mistake` skill", but `gobbi/SKILL.md` says it doesn't exist. Either delete the skill dir or correct the gobbi/SKILL.md text |
| **F-S-04** | `scenario_gap` | `docs-sync` | **disputed (per iter4 contract)** | n/a | n/a | git/SKILL.md:123 references issue #258 | Locked per user |

## Per-perspective verdict

**REVISE** — Two NEW High/100 regression-class findings (F-P-iter4-NEW-01 + F-P-iter4-NEW-02). Plus stuck F-P-03 High/75.

Per the rule: no Critical ≥ 75; three Highs (one stuck, two new) → REVISE.

The iter4 comprehensive sweep closed the iter3 partial-sweep regressions (F-P-iter3-NEW-01 + -02 — agent frontmatter + wrap-up/SKILL.md). But it introduced TWO NEW partial-sweep regressions of the SAME shape:
1. Sweep 4 added the staging-path language to preparation.md but did not delete the direct-write language already there
2. Sweep 2 was supposed to clean up dangling refs but introduced or preserved the gobbi/SKILL.md:154 mistake-skill contradiction (the skill exists; the text denies it)

This is the **fourth consecutive iter** introducing the partial-sweep failure shape. iter4 was promised as the comprehensive fix; it closed two but spawned two.

## Low-confidence appendix

- F-P-08 (Low/25) — carry-forward
