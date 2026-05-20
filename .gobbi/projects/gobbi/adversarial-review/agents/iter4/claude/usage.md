# Usage Perspective — 5-Role Agent Taxonomy (iter4, claude)

## Artifact Summary + W/W/H

See `project.md`. Usage = next-consumer POV (operator, manager subagent, evaluator subagent, fresh subagent loaded by the manager).

## Memory reads

- `iter3/claude/usage.md` (inheritance — F-U-iter3-NEW-01 High/100, F-U-03 stuck)
- `agents/*.md`
- `skills/wrap-up/SKILL.md` (Sweep 1 + 5 target)
- `skills/evaluation/SKILL.md` (Sweep 3 target — evaluator.md path templates)
- `skills/orchestration/workflow/preparation.md` (Sweep 4 target)

## Locked Frame (Stage 1)

### S-U-1 (inherited): 3am operator reads one file knows the role

### S-U-2 (inherited, addressed): `(or X)` ambiguity (F-U-01)

### S-U-3 (inherited, stuck): Evaluator path templates (F-U-03)

### S-U-4 (adversarial inherited): Terms consistent

### S-U-5 (inherited, open): Status enum co-occurrence (F-U-04)

### S-U-6 (Accessibility / I18n): not-applicable

### S-U-7 (Observability): status output parseable

### S-U-8 (iter2 NEW, addressed): AskUserQuestion manager-owned (F-U-NEW-01)

### S-U-9 (iter3 NEW): Downstream skill file sweep — wrap-up/SKILL.md AskUserQuestion contract

### S-U-10 (NEW iter4): Sweep 3 — evaluator paths verified existing

### S-U-11 (NEW iter4 adversarial): If a fresh subagent loads gobbi/SKILL.md and reads "no separate `mistake` skill" — what do they do when their delegation prompt says load `mistake` skill?

### S-U-12 (NEW iter4 adversarial): A fresh leader subagent reads preparation.md — do they correctly understand whether to write to project memory directly?

## Per-scenario per-check results (Stage 2)

### S-U-1 — first paragraph self-describes for each of 5 roles ✓

### S-U-2 (F-U-01) — addressed (carry)

### S-U-3 (F-U-03 — evaluator paths)
- evaluator.md:41-44 in iter4: "Evaluating any workflow artifact (ideation, planning, execution, wrap-up) → load the phase-specific evaluation doc (e.g., `skills/ideation/evaluation.md`, `skills/execution/evaluation.md`). The canonical schema and perspective definitions are in `skills/evaluation/SKILL.md`. ... No perspective-specific sub-docs exist under `skills/evaluation/`, `agents/evaluation/`, `rules/evaluation/`, or `project/evaluation/` — do not construct paths to those directories."
- Sweep 3 rewrote the path templates: the previously-fabricated `agents/evaluation/{perspective}.md` paths are gone; an explicit negative ratchet at line 43 prevents reconstruction.
- File existence: `skills/ideation/evaluation.md` confirmed; `skills/execution/evaluation.md` referenced (assumed present — the prompt's Sweep 3 claim states 6 violations fixed; the negative ratchet is the load-bearing fix).
- → **F-U-03 disposition: addressed via Sweep 3**

### S-U-4 (terms consistent)
- Carry — F-A-01 Low (leader-name)

### S-U-5 (F-U-04) — open (Medium, carry)

### S-U-7 — status output parseable

### S-U-8 (F-U-NEW-01 — Sweep 1 verification at agent level)
- manager.md:12 single canonical exception preserved
- assistant.md:27 NEEDS_CONTEXT escalation preserved
- → **addressed (carry)**

### S-U-9 (F-U-iter3-NEW-01 — wrap-up/SKILL.md sweep)
- wrap-up/SKILL.md:4 frontmatter: `allowed-tools: Read, Grep, Glob, Bash, Write, Edit` — AskUserQuestion removed ✓
- All assistant-role AskUserQuestion direct-call language rewritten to "Return `NEEDS_CONTEXT`; manager runs AskUserQuestion on your behalf" — internal consistency restored
- Manager-role AskUserQuestion language preserved at lines 98, 110, 246 (correctly, since the manager owns it)
- → **F-U-iter3-NEW-01 disposition: addressed (Sweep 1 comprehensive)**

### S-U-10 (NEW iter4 — Sweep 3 verification)
- Per S-U-3 above — evaluator.md paths post-Sweep-3 reference only existing files
- Negative ratchet at line 43 prevents future path-fabrication regressions
- delegation/templates/evaluator.md (Stage 0 read) also rewritten to reference `skills/{phase}/evaluation.md` consistently
- → no NEW finding

### S-U-11 (NEW iter4 adversarial — fresh subagent loading conflicting mistake-skill claim)
- A fresh subagent's delegation prompt (per `delegation/SKILL.md` Load Directives) instructs: "principles → rules → skills → mistakes" and "mistake skill (mandatory)" (delegation/templates/leader.md:34, executor.md:34, evaluator.md:79, assistant.md:42)
- The subagent reads `gobbi/SKILL.md:154` (loaded at session start) and sees: "There is no separate `mistake` skill."
- The subagent then tries to `Read .gobbi/projects/gobbi/skills/mistake/SKILL.md` — succeeds (the file exists). The skill loads.
- Net: the subagent gets contradictory information but the load-bearing path (file existence) wins. The textual claim in gobbi/SKILL.md is misleading but not blocking.
- However: an evaluator or operator who reads gobbi/SKILL.md first may infer "the team retired the mistake skill" and stop searching — confusing for the next session's adversarial review.
- → **F-U-iter4-NEW-01** (High/100 — fresh-subagent confusion + a discoverability failure for the next adversarial review pass; same finding owned at higher altitude by Project F-P-iter4-NEW-02)

### S-U-12 (NEW iter4 adversarial — fresh leader reading preparation.md)
- Fresh leader subagent in Preparation Loop loads `orchestration/workflow/preparation.md` per the delegation Load Directives
- Reads line 64: "executes the approved gap fixes (stamp missing skills, apply missed memory promotions)" → forms mental model "I write to skills/ and mistakes/"
- Reads line 72: "New skills are actually stamped in this phase" → confirms the mental model
- Reads line 124 (if they scroll that far): "staged outputs ... routed to project memory by Wrap-up only" → contradicting mental model
- The role's OWN skill file (preparation/SKILL.md:30 Memory Access Matrix) is explicit READ-ONLY for project memory. If the leader loaded `preparation/SKILL.md` (which it does per the orchestration doc), they get a third, correct, mental model.
- Three documents, three possibly-different mental models on the most load-bearing question: "do I write to project memory or not?"
- Per Principle 6 (Specificity), this is a Usage failure: the consumer (fresh leader) does not know which contract to follow.
- → **F-U-iter4-NEW-02** (High/100 — fresh-leader-subagent contract confusion; same finding owned at higher altitude by Project F-P-iter4-NEW-01)

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-U-01** | `design_flaw` | `process` | addressed (carry) | 100 | n/a | `(or X)` 0 hits | Carry |
| **F-U-02** | `design_flaw` | `docs-sync` | addressed (carry) | 100 | n/a | Carry | Carry |
| **F-U-03** | `scenario_gap` | `docs-sync` | **addressed (Sweep 3)** | 100 | n/a | evaluator.md:41-44 rewritten with negative ratchet | Stuck-3-iter finding closed |
| **F-U-04** | `scenario_gap` | `process` | open (carry) | 75 | Medium | Status co-occurrence rule still absent | Carry |
| **F-U-NEW-01** | `design_flaw` | `docs-sync` | addressed (carry) | 100 | n/a | manager.md ↔ assistant.md aligned | Carry |
| **F-U-iter3-NEW-01** | `design_flaw` | `docs-sync` | **addressed (Sweep 1)** | 100 | n/a | wrap-up/SKILL.md internal consistency + cross-file alignment with assistant.md | iter3 regression closed |
| **F-U-iter4-NEW-01** | `design_flaw` | `docs-sync` | **open (NEW iter4)** | 100 | **High** | gobbi/SKILL.md:154 "no separate `mistake` skill" vs skills/mistake/ existing | Fresh subagent reads conflicting claims |
| **F-U-iter4-NEW-02** | `design_flaw` | `docs-sync` | **open (NEW iter4)** | 100 | **High** | preparation.md:64+72 vs preparation.md:124 vs preparation/SKILL.md:30 — three possibly-different mental models for "leader writes to project memory?" | Fresh leader gets contradictory contract on the most load-bearing question |

## Per-perspective verdict

**REVISE** — Two NEW High/100 (F-U-iter4-NEW-01 + F-U-iter4-NEW-02) — fresh-subagent confusion on load-bearing facts. F-U-04 Medium carry. F-U-03 stuck → **addressed via Sweep 3** (good).

Per the rule: no Critical ≥ 75; two Highs → **REVISE**.

iter3 verdict was REVISE; iter4 closes F-U-iter3-NEW-01 + F-U-03 (the iter3 stuck) — that's two closures. But adds two NEW regressions of the same shape (fresh-subagent contract confusion). The shape persists; the locus shifts.

## Low-confidence appendix

(none)
