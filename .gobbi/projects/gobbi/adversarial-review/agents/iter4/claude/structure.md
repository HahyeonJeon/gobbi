# Structure Perspective — 5-Role Agent Taxonomy (iter4, claude)

## Artifact Summary + W/W/H

See `project.md`. Structure = 5-file decomposition + cross-file coupling + drift detection + sole-writer boundaries.

## Memory reads

- `iter3/claude/structure.md` (inheritance — F-S-04 disputed; F-S-02/03/05/NEW-02 carry)
- `agents/*.md` (full)
- `skills/{wrap-up,memorization,preparation,orchestration,git,mistake,gobbi,delegation}/SKILL.md`
- `skills/orchestration/workflow/preparation.md`
- `ls skills/` — 16 dirs

## Locked Frame (Stage 1)

### S-S-1 (inherited, addressed): Single Memorization owner

### S-S-2 (inherited, open): Leader Write tool policy-gate enforceability (F-S-02)

### S-S-3 (inherited, open partial): Hub-and-spoke fragility / misroute recovery (F-S-03)

### S-S-4 (inherited, disputed): Drift detector (F-S-04)

### S-S-5 (inherited, open Low): Implicit ideation Sub-step C coupling (F-S-05)

### S-S-6 (adversarial inherited): Coordinator anti-pattern

### S-S-7 (inherited iter2 NEW): mistake skill placement + peer-conformance

### S-S-8 (inherited iter2 NEW): assistant two-mode shape (F-S-NEW-02)

### S-S-9 (NEW iter4 adversarial): Sweep 4 sole-writer boundary structurally enforced?
- [ ] preparation.md (orchestration/workflow/) ↔ preparation/SKILL.md (role) ↔ wrap-up/SKILL.md sole-writer claim — coherent across 3 surfaces
- [ ] Memory Access Matrix (READ-ONLY for non-Wrap-up loops) matches workflow doc procedure

### S-S-10 (NEW iter4 adversarial): mistake skill structural placement
- [ ] gobbi/SKILL.md stance ↔ skills/mistake/ directory presence ↔ executor.md load directive — coherent

### S-S-11 (NEW iter4): Sweep 1 frontmatter — any skill files now grant a tool inconsistent with what's used?
- [ ] Cross-check `allowed-tools:` for skills with role-bound usage

## Per-scenario per-check results (Stage 2)

### S-S-1 (F-S-01) — addressed (carry)

### S-S-2 (F-S-02 — leader Write policy)
- (a) leader.md:4 `tools: ... Write` — Write still granted
- (b) leader.md:15 policy-only guidance unchanged
- (c) NEW iter4 angle: with Sweep 1 cleaning AskUserQuestion from the leader tools list, the contrast is now sharper — discipline IS the contract for one tool (AskUserQuestion removed), policy-only is the contract for another (Write). Mixed model persists.
- → **open (carry from iter3, Medium)**

### S-S-3 (F-S-03 — hub fragility)
- (a) Manager phase table: 6 phases preserved
- (b) Recovery mechanism for misroute: still none
- → **open (carry from iter3)**

### S-S-4 (F-S-04 — drift detector)
- (a) git/SKILL.md:123 disclosure intact (Sweep 5a verified the duplicate-sentence is removed: grep -c "Cross-layer drift" returned 1)
- (b) Disputed per iter4 contract
- → **disputed (per contract)**

### S-S-5 (F-S-05) — open (Low, carry)

### S-S-6 (adversarial — coordinator) — F-P-07 (Project) covers

### S-S-7 (mistake skill peer-conformance) — see S-S-10 below

### S-S-8 (assistant two-mode bleed)
- Unchanged in iter4. Carry from iter3.

### S-S-9 (NEW iter4 — Sweep 4 sole-writer boundary)
- 3-surface coherence check:
  - **wrap-up/SKILL.md:33** Memory Access Matrix: project memory tier = WRITE + UPSERT (Wrap-up) — sole writer
  - **preparation/SKILL.md:30** Memory Access Matrix: project memory tier = "**READ-ONLY** — required for readiness scanning ...; Wrap-up owns project-memory writes" — explicit
  - **orchestration/workflow/preparation.md:64-72**: "The leader writes the draft at `sessions/.../preparation/rawdata/draft-iter{n}.md` AND executes the approved gap fixes (stamp missing skills, apply missed memory promotions)." + line 72: "New skills are actually stamped in this phase."
- The orchestration workflow file describes a leader-direct-write (or executes) flow; the role skill file says READ-ONLY; the wrap-up file claims sole-writer. The orchestration file violates the contract claimed by the other two.
- Sweep 4 added lines 123-125 (staging path) but the language at lines 64-72 is unchanged.
- → **F-S-iter4-NEW-01** (High/100, regression class — structural drift across 3 surfaces; partial-sweep shape)

### S-S-10 (NEW iter4 — mistake skill placement)
- `ls .gobbi/projects/gobbi/skills/mistake/` returns `SKILL.md` — directory exists, file exists
- The dir is a valid skill (loads as `mistake`)
- gobbi/SKILL.md:154 says "no separate `mistake` skill" — denies what's on disk
- Other agent files (executor.md:29, leader.md, evaluator.md) load `mistake` skill — assume it exists
- CLAUDE.md (project) mandates loading the `mistake` skill
- This is structural drift: the directory tree contradicts a written claim in a load-bearing skill (`gobbi`, the entry-point skill).
- → **F-S-iter4-NEW-02** (High/100 — same structural-coherence class as F-S-04 but for skill existence rather than skill behavior)

### S-S-11 (NEW iter4 — skill frontmatter cross-check)
- Cross-check sample (skills that now lack AskUserQuestion in `allowed-tools:`): memorization, execution, evaluation, delegation, principles, git, wrap-up, mistake
- Cross-check skills that retain AskUserQuestion (per manager-loaded design): gobbi, orchestration, ideation, planning, preparation, interview, discussion
- The split is correct: manager-loaded skills retain the tool; subagent-loaded skills do not. ✓
- → no finding (Sweep 1 frontmatter discipline structurally clean)

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-S-01** | `design_flaw` | `process` | addressed (carry) | 100 | n/a | Single Memorization owner | Carry |
| **F-S-02** | `assumption_risk` | `security` | open (carry) | 75 | Medium | leader.md Write granted + policy-only | Carry |
| **F-S-03** | `design_flaw` | `process` | open (carry) | 75 | Medium (effective) | No misroute recovery | Carry; F-R-06 covers Risk lens |
| **F-S-04** | `scenario_gap` | `docs-sync` | **disputed (contract)** | n/a | n/a | git/SKILL.md:123 + #258 | Locked |
| **F-S-05** | `assumption_risk` | `docs-sync` | open (carry) | 50 | Low | Sub-step C coupling | Carry |
| **F-S-NEW-01** | `general` | `docs-sync` | addressed (verification) | 100 | n/a | mistake skill structure peer-conformant | Carry — BUT see F-S-iter4-NEW-02 for the iter4 contradiction |
| **F-S-NEW-02** | `design_flaw` | `process` | open (carry) | 50 | Medium | Assistant two-mode bleed | Carry |
| **F-S-iter3-NEW-01** | `general` | `docs-sync` | addressed (carry) | 100 | n/a | Fix 1 dangling-refs cleanup intact | Carry |
| **F-S-iter4-NEW-01** | `design_flaw` | `process` | **open (NEW iter4)** | 100 | **High** | orchestration/workflow/preparation.md:64+72 say leader stamps + applies project-memory writes; preparation/SKILL.md:30 says READ-ONLY; wrap-up/SKILL.md:33 claims sole-writer | Structural drift across 3 files. The role skill is right; the workflow file violates it |
| **F-S-iter4-NEW-02** | `design_flaw` | `docs-sync` | **open (NEW iter4)** | 100 | **High** | skills/mistake/SKILL.md exists; gobbi/SKILL.md:154 says "no separate `mistake` skill"; executor.md:29 + agents load it | Skill existence claim vs filesystem |

## Per-perspective verdict

**REVISE** — Two NEW High/100 structural drift findings (F-S-iter4-NEW-01 sole-writer cross-file contradiction + F-S-iter4-NEW-02 mistake-skill existence contradiction). F-S-02 (Medium) + F-S-03 (Medium effective) carry.

Per the rule: no Critical ≥ 75; two Highs → **REVISE**.

iter3 verdict was PASS (because F-S-04 became disputed). iter4 introduces 2 new High-severity structural-drift findings of the same shape as iter3's META — partial-sweep regressions. The iter3 PASS was contingent on the bundle's structural coherence; iter4 has fractured that.

## Low-confidence appendix

(none below threshold)
