---
name: cross-ref-and-classification-execution-gates
description: Execution T4 must enforce bidirectional cross-reference checks and exhaustive escalation classification — two gaps found in Planning evaluation that T4 now gates
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-06-07
session: 422308da-f2c4-41a4-8ee3-adc89acde977
tags: [execution, cross-reference, classification, evaluation-discipline]
---

# Execution T4 — cross-reference and classification gate checklist

These items were surfaced during Planning evaluation (iters 1–3) as gaps in T4's verification coverage. They must be enforced when T4 runs in Execution.

| # | Item | Anchor | Status | Verification |
|---|---|---|---|---|
| 1 | Bidirectional cross-reference check: evaluation.md → auto-mode.md §7 (T1's reciprocal row resolves to the §7 header T2 created) | iter3 Codex COD-ITER2-001 (addressed) | pending | grep "auto-mode.md § Evaluation discipline" in evaluation.md; grep "## §7" in auto-mode.md; confirm match |
| 2 | Bidirectional cross-reference check: auto-mode.md §7 → evaluation.md sections (all cited section names resolve to real headers in evaluation.md) | iter1 Claude S-1, Codex COD-OVERALL-002 | pending | grep each cited evaluation.md section name in evaluation.md; confirm every one exists |
| 3 | Exhaustive escalation classification: grep evaluation.md for every escalation site ("AskUserQuestion", "escalate to", "Escalate to", "Surface to user", "Flag for user") and confirm each site is classified as ROUTINE-TRIAGE (mode-split) or SAFETY-GATE (named carve-out); no unclassified survivor | iter1 Claude C-1; cotouch-enumeration-must-cover-semantic-equivalents mistake | pending | run the grep sweep; count sites; cross-check against the 9-site table in plan.md classification section; zero survivors |
| 4 | No-survivor claims in plan/self-review are verified by a fresh scan, not from memory | iter2 Codex COD-ITER2-002; carried-stale-anchor-despite-upstream-correction mistake | pending | grep draft/plan for any "no X remains" assertion; re-run the grep on the live files to confirm it is literally true |

## Item details

### 1. Bidirectional check — evaluation.md → auto-mode.md §7

T1 adds the reciprocal Cross-references row to evaluation.md pointing at "auto-mode.md § Evaluation discipline (§7)" by stable section name. T2 creates §7. T4 must confirm the row in evaluation.md uses a name that resolves to the actual §7 header that T2 created. Both directions must be verified: auto-mode→evaluation (T2's Cross-references block) and evaluation→auto-mode (T1's Cross-references row).

**Anchor reasoning:** iter3 Codex COD-ITER2-001 — the iter2 plan omitted the reciprocal T4 check; iter3 added T4(b) to gate it. This checklist item records that T4(b) is non-negotiable.

**Verification approach:** grep evaluation.md for any line containing "auto-mode.md § Evaluation discipline"; grep auto-mode.md for "## §7"; compare the section name in evaluation.md's row against the actual §7 header text.

### 2. Bidirectional check — auto-mode.md §7 → evaluation.md sections

T2 appends §7 which cites multiple evaluation.md section names (§ Degraded-mode policy, § Iteration Caps, § Stuck detection, § Regression marking, § Severity-gated divergence). None of T2's cited names must have been renamed by T1 (T1's no-header-rename constraint). T4 must confirm every cited name resolves.

**Anchor reasoning:** iter1 Claude S-1 / Codex COD-OVERALL-002 — stale line anchor made T4 un-runnable. The fix was section-name verification. This checklist item cements that the section-name grep is the right technique.

**Verification approach:** for each section name cited in auto-mode.md §7, run `grep "^## <section name>" evaluation.md` and confirm a match.

### 3. Exhaustive escalation classification

The cotouch-enumeration mistake (`mistakes/cotouch-enumeration-must-cover-semantic-equivalents.md`) requires that classification covers every semantic expression of a rule, not just one phrasing. For evaluation.md escalation sites, this means every "AskUserQuestion", "escalate to", "Escalate to", "Surface to user", "Flag for user" occurrence must be found and classified. iter1 Claude C-1 found that 3 unclassified sites (lines 109/137/197) were not named. The final plan's 9-site classification table enumerates all of them; T4(e) must enforce this.

**Anchor reasoning:** `mistakes/cotouch-enumeration-must-cover-semantic-equivalents.md` — the full phrase set must be grepped, not a single keyword.

**Verification approach:** run the multi-term grep on evaluation.md; compare the result set against the 9-site table in the plan; confirm zero survivors (each found line is classified in the table).

### 4. No-survivor claims verified by fresh scan

iter2 Codex COD-ITER2-002 caught that the self-review "no SKILL.md:247 remains" claim was literally false because DD6 still contained the literal string. The fix was to scope the claim to "no OPERATIVE anchor" and explicitly account for meta-commentary occurrences. The lesson: any "no X remains" assertion in a plan or self-review must be verified by a fresh grep of the document, not stated from intent alone.

**Anchor reasoning:** `carried-stale-anchor-despite-upstream-correction` mistake-candidate (this session); [[leader-iter2-verification-claim-without-evidence]].

**Verification approach:** before T4 asserts any "no X remains" claim, grep the document for X and confirm every match is either (a) the operative occurrence that was corrected, or (b) an explicitly labeled meta-commentary entry. Any unlabeled occurrence is a surviving leak.
