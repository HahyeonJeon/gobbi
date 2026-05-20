# Project Perspective — 5-Role Agent Taxonomy (iter2, claude)

## Artifact Summary + W/W/H

**Artifact under review (post-REVISE)**: 5-file role bundle at `.gobbi/projects/gobbi/agents/{manager,leader,executor,evaluator,assistant}.md` + newly created `skills/mistake/SKILL.md` + modified `skills/delegation/SKILL.md` + `skills/delegation/templates/evaluator.md`. iter1 returned Overall FAIL with 5/7 perspective FAILs; iter2 REVISE ran 7 docs-only tasks (A–G).

**What / Why / How**: same as iter1 (see iter1 project.md). The bundle still claims to define the v0.5.0 5-role taxonomy that drives the 6-step workflow.

**W/W/H gate (iter2 fresh judgment)**: What ✓, Why ✓. **How** is now clearer — Task D landed a canonical phase list in `manager.md:40` ("Configuration → Ideation → Preparation → Planning → Execution → Wrap-up") and `delegation/SKILL.md:213` cross-references it. The iter1 F-P-00 (composition mechanism deferred to orchestration) is partially mitigated by the explicit per-phase delegation table at `manager.md:33-38`.

## Memory reads

- `.gobbi/projects/gobbi/adversarial-review/agents/iter1/claude/project.md` (inheritance source — 8 findings + Stage 0 finding)
- `.gobbi/projects/gobbi/adversarial-review/agents/iter1/claude/overall.md` (cross-cutting context)
- `.gobbi/projects/gobbi/agents/manager.md` (lines 34-40, 84-87)
- `.gobbi/projects/gobbi/agents/leader.md`, `executor.md`, `evaluator.md`, `assistant.md`
- `.gobbi/projects/gobbi/skills/delegation/SKILL.md` (lines 45-48, 213-223)
- `.gobbi/projects/gobbi/skills/mistake/SKILL.md` (new in iter2)
- `.gobbi/projects/gobbi/skills/evaluation/SKILL.md` (Finding Metadata, Perspectives table)
- `.gobbi/projects/gobbi/skills/principles/SKILL.md` (Principle 2, 4, 12)
- Cross-system glance: `iter1/codex/project.md` — Codex iter1 also flagged Preparation omission + mistake skill absence (convergent)

## Locked Frame (Stage 1)

Frame inherited from iter1 + adversarial seeds + REVISE-task verification scenarios. Adversarial scenarios marked.

### S-P-1: Inherited iter1 — Retired v0.4 mapping documented (F-P-01 seed)
- [ ] Migration map between retired (pi/researcher/agent-evaluator/skills-evaluator/gobbi-agent) and the 5 new roles is enumerated somewhere
- [ ] No retired responsibility silently dropped

### S-P-2: Inherited iter1 — Scope Contract sharpness across 5 files (F-P-04 seed)
- [ ] No `(or leader)` ambiguities
- [ ] Each role file enumerates non-overlapping scope

### S-P-3: Inherited iter1 — 6-step workflow has owners (F-P-05 seed, the iter1 Critical)
- [ ] Memorization phase names a SPECIFIC role
- [ ] Wrap-up phase names a SPECIFIC role
- [ ] Every canonical phase has an owner in `manager.md` phase table

### S-P-4 (adversarial inherited): Manager scope-creep exception (F-P-07 seed)
- [ ] "single-line edits" exception does not erode Principle 2 self-evaluation prohibition

### S-P-5 (adversarial inherited): Dual-stance retirement cross-pollination loss (F-P-03 seed)
- [ ] Alternative mechanism for orthogonal hypotheses is named

### S-P-6: REVISE Task verification — Task C (assistant ownership of Memorization/Wrap-up)
- [ ] `manager.md` Memorize section explicitly names `assistant` (not "executor or leader")
- [ ] `assistant.md` explicitly claims MEMORIZATION + Wrap-up WORK ownership

### S-P-7: REVISE Task verification — Task D (canonical phase list locked)
- [ ] One canonical phase list cited identically across `CLAUDE.md` (user-locked, may not match), `manager.md`, `delegation/SKILL.md`
- [ ] No agent file invents a phase not in the canonical list

### S-P-8 (adversarial, NEW iter2): Did Task C introduce a regression — assistant overload?
- [ ] Assistant now owns MEMORIZATION (every loop) + Wrap-up WORK + Wrap-up MEMORIZATION + lookup mode. Is the role coherent or is it now a kitchen-sink role?
- [ ] sonnet model + Wrap-up WORK as "sole writer to project memory" is a load-bearing combination — appropriate?

### S-P-9 (adversarial, NEW iter2): Did Task A leave dangling references?
- [ ] evaluator.md no longer defines its own Type schema (per Task A); does anything still depend on the old 5-Type local schema?

## Per-scenario per-check results (Stage 2)

### S-P-1 (F-P-01 inherited)
- (a) Migration map: **STILL NO** — grep `agents/*.md` for `pi\|researcher\|agent-evaluator\|skills-evaluator\|gobbi-agent` still returns 0 hits. iter1 finding F-P-01 unchanged. → **disposition: open (stuck candidate)**
- (b) Silent drops: **STILL UNDOCUMENTED**. The bundle continues to assume readers know the v0.4 → v0.5 map.

### S-P-2 (F-P-04 inherited)
- (a) `(or leader)` ambiguity: **GONE** — grep `(or leader)` across `agents/*.md` and `delegation/SKILL.md` returns 0 hits. manager.md:84-87 now names `assistant` exclusively. → **F-P-04 disposition: addressed**

### S-P-3 (F-P-05 inherited — iter1 Critical)
- (a) Memorization role specified: **YES** — manager.md:34-38 each phase row says "delegate MEMORIZATION to **assistant**"; manager.md:86 confirms "spawn an **assistant** with the `memorization` skill". → **addressed**
- (b) Wrap-up role specified: **YES** — manager.md:38 "Delegate WORK to **assistant** (sole writer to project memory)"; manager.md:87 confirms. assistant.md:12 echoes the ownership. → **addressed**

### S-P-4 (adversarial inherited, F-P-07)
- (a) Manager self-evaluation hole: **UNCHANGED** — manager.md:15 still carves "single-line edits when delegation overhead would dwarf the work" without instructing manager to spawn an evaluator. iter1 F-P-07 still applies. → **disposition: open**

### S-P-5 (adversarial inherited, F-P-03)
- (a) Orthogonal hypotheses mechanism: **STILL NOT NAMED** — delegation/SKILL.md:45 unchanged ("Single leader per dispatch"). No agent file documents an alternative to dual-stance cross-pollination. → **disposition: open (stuck candidate)**

### S-P-6 (Task C verification)
- (a) manager.md Memorize names assistant: **YES** — lines 84-87.
- (b) assistant.md claims ownership: **YES** — line 12: "You own the MEMORIZATION sub-phase for every loop (Ideation / Preparation / Planning / Execution) and the WORK + MEMORIZATION sub-phases of the Wrap-up loop."
- Task C verdict: **passed**

### S-P-7 (Task D verification)
- (a) Canonical phase list cited identically: manager.md:40 says "Configuration → Ideation → Preparation → Planning → Execution → Wrap-up"; delegation/SKILL.md:213 same phrasing. .claude/CLAUDE.md (user-locked) still lists "Ideation → Planning → Execution → Memorization → Handoff" — divergence persists but is **out-of-scope** per user lock. → **F-P-06 disposition: addressed** for the bundle; CLAUDE.md drift is **deferred**.
- (b) No invented phases: **YES** — leader.md:32-34 lists Ideation / Preparation / Research / Planning; "Research" is still treated as a sub-phase ("loaded by ideation Sub-step C"). Consistent with the canonical list IF research is understood as nested under Ideation.

### S-P-8 (NEW iter2 — assistant overload?)
- The assistant.md frontmatter declares two modes (line 10) and explicitly anchors MEMORIZATION + lookup. The role is coherent in description but the **load distribution** is uneven: MEMORIZATION runs once per loop × ~4-5 loops; Wrap-up runs once. Lookup mode is on-demand. sonnet for Wrap-up sole-write-to-project-memory is **borderline** — sole-writer responsibility for promotion routing is judgment-heavy (mistake scope confirmation, rules promotion, unrouted staging). → **F-P-iter2-NEW-01** (Medium)
- assistant.md:27 grants AskUserQuestion during Wrap-up WORK step 4 — this is the one place a subagent talks to the user. Documented exception but it **breaks the "AskUserQuestion is manager-owned" invariant** newly tightened in Task E. → **F-P-iter2-NEW-02** (High, regression class)

### S-P-9 (NEW iter2 — Task A residue)
- evaluator.md no longer defines a local Finding Type schema (line 35: "load from `skills/evaluation/SKILL.md` § Finding Metadata"). delegation/templates/evaluator.md:90 also delegates ("Load from `evaluation/SKILL.md`"). No dangling references to the old 5-Type schema (`correctness/scope/process/convention/risk`) anywhere in the bundle. → **F-P-09 (new) — no regression**

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-P-00** | `general` | `unevaluable` | addressed | 50 | Medium | Task D landed canonical phase list at manager.md:40 + delegation/SKILL.md:213 | iter1 partially-clear How is now mostly resolved |
| **F-P-01** | `scenario_gap` | `docs-sync` | **open (stuck)** | 75 | Medium | No retirement map in agents/*.md or delegation/SKILL.md | Same as iter1; not addressed by any REVISE task |
| **F-P-02** | `assumption_risk` | `process` | open | 50 | Medium | `gobbi-agent` plugin agent fate still silent | Same as iter1 |
| **F-P-03** | `design_flaw` | `process` | **open (stuck)** | 75 | High | delegation/SKILL.md:45 unchanged: "Single leader per dispatch"; no cross-pollination alternative documented | Groupthink risk in Ideation persists; iter1 finding unmitigated |
| **F-P-04** | `design_flaw` | `process` | **addressed** | 100 | Medium | grep `(or leader)` → 0 hits; manager.md:84-87 names `assistant` | iter1 Medium fixed |
| **F-P-05** | `scenario_gap` | `process` | **addressed** | 100 | Critical | manager.md:38, 84-87 + assistant.md:12 all name assistant for Memorization + Wrap-up | iter1 Critical resolved (the headline iter1 finding) |
| **F-P-06** | `design_flaw` | `docs-sync` | **addressed (bundle); deferred (CLAUDE.md)** | 100 | High | manager.md:33-38 lists 6 phases including Preparation (line 35); .claude/CLAUDE.md (user-locked) still has old 5-step list | Bundle fix landed; CLAUDE.md drift is user-locked out-of-scope |
| **F-P-07** | `design_flaw` | `process` | open | 50 | Medium | manager.md:15 "single-line edits…" exception unchanged | Self-evaluation hole persists; not in iter2 REVISE scope but should have been |
| **F-P-08** | `scenario_gap` | `process` | open | 25 | Low | No agent owns "synthesize parallel evaluator outputs" | Carry-forward; Low priority |
| **F-P-iter2-NEW-01** | `design_flaw` | `cost` | open | 50 | Medium | assistant.md:18 "sole project-memory write surface… judgment-heavy routing"; frontmatter model: sonnet | Sole-writer-to-project-memory under sonnet has unclear quality bar; combined with Wrap-up WORK step 4 user-facing exception, the role is judgment-heavier than the model tier admits |
| **F-P-iter2-NEW-02** | `design_flaw` | `process` | open | 75 | **High (regression)** | assistant.md:27 grants AskUserQuestion during Wrap-up WORK step 4; manager.md:12 + Task E principle: "AskUserQuestion is manager-owned. Subagents NEVER call AskUserQuestion directly. The Interview skill is the only named exception" | Two named exceptions exist: Interview skill AND Wrap-up step 4 — but the manager-owned invariant is now "Interview is the only named exception" (manager.md:12). assistant.md:27 contradicts manager.md:12 directly |
| **F-P-09** | `general` | `docs-sync` | (n/a, verification finding) | 100 | n/a | evaluator.md + delegation template both load Finding schema from evaluation/SKILL.md; no dangling refs to old 5-Type schema | Task A clean — no regression |

## Per-perspective verdict

**REVISE** — F-P-iter2-NEW-02 (High/75, regression class) is the load-bearing finding. iter1's Task E ("AskUserQuestion is manager-owned") created a new invariant that Task F ("assistant write surface… Wrap-up WORK exception") immediately violates. Two REVISE tasks landed contradictory exceptions to the same rule in the same iter — this is the classic regression pattern.

iter1 F-P-05 (Critical/100) is addressed. iter1 F-P-06 (High/100) addressed inside the bundle (CLAUDE.md drift is user-locked deferred).

Stuck findings: F-P-01, F-P-03. F-P-01 is Medium and survivable; F-P-03 (groupthink) is High and is the most important iter1 finding the REVISE never touched.

## Low-confidence appendix

- F-P-08 (Low/25) — carry-forward
