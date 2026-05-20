# Consistency Perspective — 5-Role Agent Taxonomy (iter4, claude)

## Artifact Summary + W/W/H

See `project.md`. Consistency = cross-artifact sync, internal contradictions, references resolve.

## Memory reads

- `iter3/claude/consistency.md` (inheritance — F-C-iter3-NEW-02 + -03 High/100 regression closed by Sweep 1)
- `agents/*.md`
- `skills/{wrap-up,memorization,evaluation,gobbi,delegation,git,principles}/SKILL.md`
- `skills/orchestration/workflow/preparation.md`
- `ls skills/`

## Locked Frame (Stage 1)

### S-C-1..S-C-9 — inherited from iter3 (most addressed/deferred)

### S-C-10 (NEW iter4): Sweep 1 sweep completeness — frontmatter + prose + skill files all aligned

### S-C-11 (NEW iter4): Sweep 4 sweep completeness — preparation orchestration ↔ preparation role skill ↔ wrap-up sole-writer

### S-C-12 (NEW iter4): Sweep 2 sweep completeness — gobbi/SKILL.md ↔ skills/mistake/ ↔ agent-file load directives

### S-C-13 (NEW iter4 adversarial): Sweep 5 polish — assistant.md citation correct; git/SKILL.md dedupe done

### S-C-14 (Privacy / Licensing): not-applicable

## Per-scenario per-check results (Stage 2)

### S-C-1 / S-C-2 / S-C-3 / S-C-4 / S-C-5 — addressed (carry)

### S-C-6 (F-C-05 + F-C-06) — addressed (carry)

### S-C-8 (F-C-NEW-01) — addressed (carry)

### S-C-10 (NEW iter4 — Sweep 1 across surfaces)
- Agent files (`tools:` frontmatter):
  - manager.md: `"*"` (correctly retains, manager owns AskUserQuestion)
  - leader/executor/evaluator/assistant: NO AskUserQuestion ✓
- Skill files (`allowed-tools:` frontmatter):
  - Manager-loaded: gobbi/orchestration/ideation/planning/preparation/interview/discussion — retain ✓
  - Subagent-loaded: wrap-up/memorization/evaluation/execution/delegation/principles/git/mistake/research — none retain ✓
- Prose alignment in wrap-up/SKILL.md:
  - Line 39: "manager runs AskUserQuestion on your behalf" (NEEDS_CONTEXT pattern) ✓
  - Line 53: "manager resolves the routing via AskUserQuestion" (NEEDS_CONTEXT pattern) ✓
  - Line 137 (table step 4): "return `NEEDS_CONTEXT` ... manager runs AskUserQuestion on your behalf" ✓
  - Line 172 (exit checklist): "User-confirm requested via `NEEDS_CONTEXT` (manager ran AskUserQuestion on your behalf)" ✓
  - Line 351 (constraint): "return `NEEDS_CONTEXT` with a `user-question:` block so the manager can run AskUserQuestion on your behalf" ✓
  - Line 357 (constraint): "return `NEEDS_CONTEXT` ... manager runs AskUserQuestion on your behalf" ✓
  - Lines 98, 110, 246 (manager-owned context): "Run AskUserQuestion" — correctly direct, subject is manager ✓
- → **F-C-iter3-NEW-02 + F-C-iter3-NEW-03 disposition: addressed (comprehensive Sweep 1 holds)**

### S-C-11 (NEW iter4 — Sweep 4 completeness)
- Surface 1 — wrap-up/SKILL.md:33 Memory Access Matrix project memory tier: **WRITE + UPSERT** (Wrap-up = sole writer)
- Surface 2 — preparation/SKILL.md:30 Memory Access Matrix project memory tier: **READ-ONLY** ("Wrap-up owns project-memory writes")
- Surface 3 — orchestration/workflow/preparation.md:64+72: "leader ... executes the approved gap fixes (stamp missing skills, apply missed memory promotions). ... New skills are actually stamped in this phase."
- Surface 4 — orchestration/workflow/preparation.md:123-125: "staged outputs ... routed to project memory by Wrap-up only"
- **Surfaces 1, 2, 4 agree; surface 3 contradicts them.** Sweep 4's claim of "1 violation, 1 fix" is verified WRONG by close-reading — the violation has 2 parts (lines 64 + 72); only the staging-path was added (lines 123-125), the violating prose at 64+72 was not deleted.
- → **F-C-iter4-NEW-01** (High/100 — Sweep 4 incomplete; cross-file contradiction across 4 surfaces; partial-sweep regression class)

### S-C-12 (NEW iter4 — Sweep 2 completeness)
- gobbi/SKILL.md:154: "There is no separate `mistake` skill."
- skills/mistake/SKILL.md exists on disk
- delegation/templates/{leader,executor,evaluator,assistant}.md:34/34/79/42 reference "`mistake` skill (mandatory)"
- executor.md:29, leader.md, assistant.md, evaluator.md all load `mistake` skill
- CLAUDE.md mandates loading the `mistake` skill
- Five surfaces affirm; one surface denies; the file system has the skill.
- → **F-C-iter4-NEW-02** (High/100 — gobbi/SKILL.md:154 stale claim contradicting 5+ other surfaces and the file system)

### S-C-13 (NEW iter4 — Sweep 5)
- assistant.md:3 citation corrected to memorization/SKILL.md ✓
- git/SKILL.md:123 "Cross-layer drift" sentence count = 1 ✓
- → no Consistency-owned finding (Aesthetics owned the polish; Sweep 5 closed them)

### S-C-14 (Privacy / Licensing) — not-applicable

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-C-01 / 02 / 03 / 04 / 05 / 06** | various | various | addressed (carry) | 100 | n/a | All from iter3 inheritance | Carry |
| **F-C-NEW-01** | `design_flaw` | `docs-sync` | addressed (carry) | 100 | n/a | manager.md ↔ assistant.md aligned | Carry |
| **F-C-iter3-NEW-01** | `general` | `docs-sync` | addressed (verification, carry) | 100 | n/a | Fix 3 sweep verified | Carry |
| **F-C-iter3-NEW-02** | `design_flaw` | `docs-sync` | **addressed (Sweep 1)** | 100 | n/a | leader.md + executor.md frontmatter no longer grant AskUserQuestion | iter3 regression closed |
| **F-C-iter3-NEW-03** | `design_flaw` | `docs-sync` | **addressed (Sweep 1)** | 100 | n/a | wrap-up/SKILL.md prose + frontmatter rewritten; internal consistency restored | iter3 regression closed |
| **F-C-iter4-NEW-01** | `design_flaw` | `docs-sync` | **open (NEW iter4)** | 100 | **High** | orchestration/workflow/preparation.md:64+72 contradicts preparation/SKILL.md:30 + wrap-up/SKILL.md:33 + own line 124. 4-surface cross-file contradiction | Partial-sweep regression — Sweep 4 incomplete |
| **F-C-iter4-NEW-02** | `design_flaw` | `docs-sync` | **open (NEW iter4)** | 100 | **High** | gobbi/SKILL.md:154 vs file system vs CLAUDE.md vs 4 delegation templates vs 4 agent files | Single stale claim contradicts 5+ surfaces |
| **F-C-DEF-01 + DEF-02** | `general` | `docs-sync`/`process` | deferred (carry) | 75 | Medium | User-locked carries | Carry |

## Per-perspective verdict

**REVISE** — Two NEW High/100 cross-file contradictions (F-C-iter4-NEW-01 + F-C-iter4-NEW-02). Two iter3 regressions closed cleanly.

Per the rule: no Critical ≥ 75; two Highs → **REVISE**.

The pattern recurs: iter4 sweeps fixed the iter3-named surfaces (agent frontmatter + wrap-up/SKILL.md) but missed:
- Sweep 4 was promised "1 fix" but the file has 2 violating lines (64 + 72) and only added a third (124) — net: still inconsistent
- Sweep 2 was promised "4 fixes" for v0.4 dangling refs but did not address the gobbi/SKILL.md:154 stale claim contradicting the existing mistake skill

iter3 regression class = "incomplete sweep". iter4 regression class = "incomplete sweep" again, just on different surfaces. **Fourth consecutive iter of the same shape.**

## Low-confidence appendix

(none)
