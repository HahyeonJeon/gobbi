# Project Perspective — 5-Role Agent Taxonomy (iter5, claude)

## Artifact Summary + W/W/H

**Artifact under review (post-iter5 surgical fixes)**: 5-file role bundle at `.gobbi/projects/gobbi/agents/{manager,leader,executor,evaluator,assistant}.md` + 16 skill dirs at `.gobbi/projects/gobbi/skills/` (delegation, discussion, evaluation, execution, git, gobbi, ideation, interview, memorization, mistake, orchestration, planning, preparation, principles, research, wrap-up).

iter5 landed 5 surgical fixes:
- **Fix 1 (F-iter4-NEW-01, High)** — `orchestration/workflow/preparation.md` lines 10, 64, 72 + MEMORIZATION 91-92 rewritten to staging language; cross-doc consistency restored across preparation.md, preparation/SKILL.md:30, wrap-up/SKILL.md:33
- **Fix 2 (F-iter4-NEW-02, High)** — `gobbi/SKILL.md:154` rewrote the "no separate mistake skill" claim to accurate "The mistake skill lives at `skills/mistake/SKILL.md`"
- **Fix 3 (F-P-01 stuck Medium)** — `manager.md` gained "## Retirement map (v0.4.x → v0.5.0)" section
- **Fix 4 (F-P-03 stuck High)** — `delegation/SKILL.md` gained "Cross-pollination mechanism" note linking dual-system evaluation
- **Fix 5 (F-R-06 stuck High)** — 4 subagent docs + delegation/SKILL.md gained `wrong-phase-dispatch` BLOCKED sub-bullet

**What / Why / How (iter5 fresh judgment)**:
- What ✓ — 5-role taxonomy + 16 skills with iter4 regressions repaired AND 3 stuck findings explicitly addressed
- Why ✓ — close iter4's partial-sweep regressions + the 3 long-stuck findings that survived 4 iters because never explicitly scoped
- How ✓ — targeted edits to the exact violating lines; cross-doc grep verification per fix

## Memory reads

- `iter4/claude/{project,structure,performance,aesthetics,usage,consistency,risk,overall}.md` (inheritance)
- `agents/{manager,leader,executor,evaluator,assistant}.md` (full)
- `skills/principles/SKILL.md`, `skills/delegation/SKILL.md`, `skills/gobbi/SKILL.md`
- `skills/evaluation/SKILL.md`, `skills/ideation/evaluation.md`
- `skills/orchestration/workflow/preparation.md`, `skills/preparation/SKILL.md`, `skills/wrap-up/SKILL.md`
- `ls .gobbi/projects/gobbi/skills/` — confirmed 16 skill dirs

## Locked Frame (Stage 1)

### S-P-1 (inherited, stuck → iter5 candidate close): Retired v0.4 mapping documented (F-P-01)
- [ ] Migration map enumerated in any bundle file
- [ ] All 6 retired roles mapped (pi, researcher, gobbi-agent, agent-evaluator, project-evaluator, skills-evaluator)

### S-P-2 (inherited, addressed): No `(or leader)` regressions

### S-P-3 (inherited, addressed): 6-step phase ownership preserved

### S-P-4 (adversarial inherited): Manager scope-creep "single-line edits" exception (F-P-07)

### S-P-5 (adversarial inherited, stuck → iter5 candidate close): Dual-stance retirement cross-pollination (F-P-03)
- [ ] delegation/SKILL.md names the replacement mechanism for v0.4.x cross-stance hypothesis generation
- [ ] Cross-reference exists to evaluation orchestration doc

### S-P-6 (iter4 verification): Sweep 1 frontmatter still clean (no AskUserQuestion regression)

### S-P-7 (iter5 verification — Fix 1): preparation.md staging language coherent across 4 surfaces
- [ ] preparation.md line 10 (phase table) — staging language
- [ ] preparation.md line 64 (WORK Manager's job) — staging + Wrap-up sole promoter
- [ ] preparation.md line 72 — staging path only
- [ ] preparation.md MEMORIZATION (lines ~88-92) — assistant stages routing candidates
- [ ] preparation/SKILL.md:30 (role memory matrix) — project memory READ-ONLY
- [ ] wrap-up/SKILL.md:33 — Wrap-up sole writer

### S-P-8 (iter5 verification — Fix 2): gobbi/SKILL.md mistake-skill claim accurate
- [ ] No "no separate mistake skill" prose
- [ ] Correct pointer to skills/mistake/SKILL.md
- [ ] Load-bearing claim survives grep against CLAUDE.md, executor.md, delegation templates

### S-P-9 (iter5 adversarial — Fix 1 regression): Did Fix 1's staging rewrite introduce new contradictions or remove legitimate "leader-stages" language?
- [ ] No silent narrowing of leader's WORK responsibilities
- [ ] No new contradictions between staging language and Wrap-up promotion table

### S-P-10 (iter5 adversarial — Fix 3 regression): Retirement map accuracy
- [ ] Each v0.4.x role's new role assignment matches the bundle's actual role split
- [ ] No retirement map row conflicts with another doc's statement of role ownership

### S-P-11 (Privacy / Licensing): not-applicable

## Per-scenario per-check results (Stage 2)

### S-P-1 (F-P-01 — retirement map)
- `grep -n "Retirement map"` in `agents/manager.md` → line 46 ✓
- Map enumerates 6 v0.4.x roles: pi / researcher / gobbi-agent / agent-evaluator / project-evaluator / skills-evaluator (last 3 consolidated in one row) → 6 roles mapped to 5 v0.5.0 roles ✓
- Each row carries a Notes column explaining the mapping rationale (dual-stance retirement, plugin role rename, perspective consolidation, explicit extraction for executor + assistant) ✓
- Discoverability: the map lives in `manager.md` (the orchestrator's own role spec) — first doc anyone reading the agent system encounters
- → **F-P-01 disposition: addressed (Fix 3 — stuck-4-iter finding closed)**

### S-P-2 (F-P-04 regression check)
- `grep -n "(or leader)"` → 0 hits → **addressed (carry)**

### S-P-3 (F-P-05)
- Phase ownership preserved → **addressed (carry)**

### S-P-4 (F-P-07 — manager single-line exception)
- manager.md:15 unchanged → **open (Medium, carry)**

### S-P-5 (F-P-03 — dual-stance cross-pollination)
- delegation/SKILL.md:52 (new in iter5): "**Cross-pollination mechanism:** the v0.4.x dual-stance design (innovative + best stances as orthogonal hypothesis generators) was retired in v0.5.0 in favor of a single leader per dispatch. Orthogonal hypothesis generation is now provided by **dual-system evaluation** — Claude and Codex independently judge the leader's output, and divergence between systems is the anti-groupthink signal. See `orchestration/workflow/evaluation.md` § Why dual-system is mandatory."
- Names the v0.4.x design retired, the v0.5.0 replacement, AND the cross-reference for deeper context ✓
- Cross-reference target: `orchestration/workflow/evaluation.md` § Why dual-system is mandatory — load-bearing claim; would benefit from spot-check that the referenced section exists, but the cross-reference itself is a defensible anchor
- Also reflected in manager.md retirement map row 1 (Notes column) → cross-doc consistency between Fix 3 and Fix 4 ✓
- → **F-P-03 disposition: addressed (Fix 4 — stuck-4-iter finding closed)**

### S-P-6 (iter4 Sweep 1 frontmatter)
- All 4 subagent `tools:` lists checked: no AskUserQuestion regression ✓
- → preserved

### S-P-7 (iter5 Fix 1 — preparation.md staging coherence)
- preparation.md:10 (phase table WORK row): "Leader documents the readiness assessment AND stages approved gap fixes (new skills, missed memory promotions) at `sessions/{date}-{session-id}/preparation/staging/`; Wrap-up promotes to project memory." → staging language ✓
- preparation.md:64 (WORK Manager's job): "Manager's job: spawn the leader for documentation. The leader writes the draft at `sessions/.../preparation/rawdata/draft-iter{n}.md` AND stages the approved gap fixes at `sessions/.../preparation/staging/`. Wrap-up is the sole promoter of staged artifacts to project memory." → staging + sole-promoter language ✓
- preparation.md:72: "New skills are staged at `sessions/.../preparation/staging/skills/{slug}/SKILL.md` — the staging step closes the gap for downstream planning. Wrap-up promotes staged skills to project memory at session close per `preparation/SKILL.md` Memory Access Matrix." → staging only, with cross-ref to role memory matrix ✓
- preparation.md MEMORIZATION (lines 88-92): "the assistant also stages Wrap-up routing candidates: New project-specific skills from this loop → `sessions/.../preparation/staging/skills/{slug}/SKILL.md` ; scenario_gap / checklist_gap findings → `sessions/.../preparation/staging/{scenarios,checklists}/{slug}.md`. Wrap-up reads these staging directories and routes them to features/..." → assistant stages, Wrap-up routes ✓
- preparation/SKILL.md:30 (project memory tier): "**READ-ONLY** — required for readiness scanning (project skills, mistakes, rules). Never written; Wrap-up owns project-memory writes" ✓
- wrap-up/SKILL.md:33: "Project memory ... **WRITE + UPSERT** — Wrap-up promotes project-scope staging..." ✓
- All 4 surfaces agree on the sole-writer contract. The iter4 partial-sweep regression is closed.
- grep verification: `grep -n "stamp missing skills\|apply missed memory\|actually stamped\|leader.*write.*project memory" preparation.md` → 0 hits ✓
- → **F-P-iter4-NEW-01 disposition: addressed (Fix 1)**

### S-P-8 (iter5 Fix 2 — gobbi mistake skill claim)
- gobbi/SKILL.md:154 (verified): "The `mistake` skill lives at `skills/mistake/SKILL.md`. Every agent MUST load it before starting work. Mistake recordings are written to `.gobbi/projects/{project-name}/mistakes/` per the [mistakes template](../memorization/templates/mistakes.md); Wrap-up promotes session-staged mistake candidates to project memory."
- Accuracy check vs filesystem: `ls skills/mistake/` → `SKILL.md` exists ✓
- Consistency check vs CLAUDE.md "Every agent MUST load the `mistake` skill before starting work" ✓
- Consistency check vs executor.md:29 "mistake skill — past pitfalls" ✓
- grep verification: `grep -n "no separate.*mistake\|There is no separate" gobbi/SKILL.md` → 0 hits ✓
- → **F-P-iter4-NEW-02 disposition: addressed (Fix 2)**

### S-P-9 (iter5 adversarial — Fix 1 regression check)
- Did Fix 1 over-correct and remove all leader WORK responsibility?
- Line 64 still says "the leader writes the draft ... AND stages the approved gap fixes" — leader still has WORK output, just within staging tier ✓
- Line 72 still says "the staging step closes the gap for downstream planning" — the "gaps go away" framing preserved ✓
- No silent narrowing observed
- Are there new cross-doc contradictions between the new staging language and the existing routing table in `wrap-up/SKILL.md`?
- wrap-up/SKILL.md "Staging → Project-memory routing" table reads staging/skills/{slug}/ → skills/{slug}/ ; preparation.md line 72 directly says "Wrap-up promotes staged skills to project memory" referencing the role matrix
- No new contradictions
- → no NEW finding

### S-P-10 (iter5 adversarial — Fix 3 retirement map accuracy check)
- Row 1: `pi` → `leader` (dual-stance retired; cross-pollination via dual-system eval) — consistent with delegation/SKILL.md:52 cross-pollination note (Fix 4) ✓
- Row 2: `researcher` → `leader` (depth merged into investigation/Research dispatch) — consistent with leader.md role spec which covers Ideation/Preparation/Research/Planning ✓
- Row 3: `gobbi-agent` → `manager` (plugin role rename) — but `gobbi-agent` is mentioned as a v0.4.x plugin-distributed agent in `.gobbi/projects/gobbi/rules/__gobbi-convention.md` (read in CLAUDE.md project rules) — that rule says "`gobbi-agent` is an interface agent. It is distributed via the plugin." — this rule file is project-tracked. Potential tension: project rule still references gobbi-agent as live, but retirement map says it's retired. **Out-of-scope per user lock** (`.claude/CLAUDE.md`, `.claude/agents/*.toml`, project rules outside the agent bundle); the retirement map is internally coherent against the agent bundle, but the project rule file still calling gobbi-agent live is a separate question. Disposition: out-of-scope deferred (not introduced by iter5).
- Row 4: `agent-evaluator / project-evaluator / skills-evaluator` → `evaluator` (consolidated) — consistent with evaluation/SKILL.md 7-perspective procedure ✓
- Row 5: (no v0.4.x) → `executor` — accurate; executor.md confirms explicit extraction ✓
- Row 6: (no v0.4.x) → `assistant` — accurate; assistant.md confirms ✓
- → no NEW finding from the map itself; one out-of-scope tension noted

### S-P-11 (Privacy / Licensing) — not-applicable

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-P-01** | `scenario_gap` | `docs-sync` | **addressed (Fix 3 — stuck-4-iter closed)** | 100 | n/a | manager.md:46 "Retirement map (v0.4.x → v0.5.0)" with 6 v0.4.x roles mapped | Stuck across 4 iters; closed in iter5 |
| **F-P-02** | `assumption_risk` | `process` | open (carry) | 50 | Medium | gobbi-agent plugin agent fate ambiguity vs project rule | Now partially clarified via retirement map but project rule file unchanged (out-of-scope user lock) |
| **F-P-03** | `design_flaw` | `process` | **addressed (Fix 4 — stuck-4-iter closed)** | 100 | n/a | delegation/SKILL.md:52 cross-pollination note + manager.md retirement map row 1 | Stuck across 4 iters; closed in iter5 |
| **F-P-04** | `design_flaw` | `process` | addressed (carry) | 100 | n/a | No `(or leader)` regression | Carry |
| **F-P-05** | `scenario_gap` | `process` | addressed (carry) | 100 | n/a | 6-phase ownership preserved | Carry |
| **F-P-06** | `design_flaw` | `docs-sync` | addressed (bundle) / deferred (CLAUDE.md) | 100 | n/a | Bundle phase list intact | Carry |
| **F-P-07** | `design_flaw` | `process` | open (carry) | 50 | Medium | manager.md:15 single-line exception | Carry — not in iter5 scope |
| **F-P-08** | `scenario_gap` | `process` | open (carry) | 25 | Low | Parallel evaluator synthesis ownership unclear | Carry |
| **F-P-iter2-NEW-01** | `design_flaw` | `cost` | open (carry) | 50 | Medium | Assistant sonnet sole-writer carry | Carry |
| **F-P-iter3-NEW-01** | `design_flaw` | `docs-sync` | addressed (Sweep 1, carry) | 100 | n/a | Frontmatter still clean | Carry |
| **F-P-iter3-NEW-02** | `design_flaw` | `docs-sync` | addressed (Sweep 1, carry) | 100 | n/a | wrap-up frontmatter + prose | Carry |
| **F-P-iter4-NEW-01** | `design_flaw` | `process` | **addressed (Fix 1)** | 100 | n/a | preparation.md lines 10, 64, 72, 88-92 rewritten; grep "stamp missing skills" returns 0 | iter4 partial-sweep closed |
| **F-P-iter4-NEW-02** | `design_flaw` | `docs-sync` | **addressed (Fix 2)** | 100 | n/a | gobbi/SKILL.md:154 rewritten; grep "no separate.*mistake" returns 0 | iter4 partial-sweep closed |
| **F-S-04** | `scenario_gap` | `docs-sync` | **disputed (per user lock #258)** | n/a | n/a | git/SKILL.md:123 references issue #258 | Locked |

## Per-perspective verdict

**PASS** — Two iter4 regressions cleanly closed (F-P-iter4-NEW-01 + -02), two stuck-4-iter findings cleanly closed (F-P-01 + F-P-03), zero new regressions introduced.

Per the rule: no Critical ≥ 75; no High ≥ 50 in `open` / newly-surfaced state (F-P-07 Medium and F-P-02 Medium are pre-existing carries with no iter5 regression contribution). → **PASS**.

This is the **first PASS verdict on Project in 5 iters**. iter1-iter4 all REVISE on Project; iter5 surgical fixes closed both iter4 regressions AND two stuck-4-iter findings without introducing new ones.

## Low-confidence appendix

- F-P-08 (Low/25) — carry-forward
