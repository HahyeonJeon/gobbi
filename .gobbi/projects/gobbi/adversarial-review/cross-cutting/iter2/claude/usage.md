# Usage Perspective — Cross-cutting Batch (iter2, claude)

## Stage 0 — Target Understanding

Consumers: (a) manager reading orchestration/SKILL.md and spawning subagents, (b) leader/executor/evaluator/assistant subagents reading their templates + phase docs, (c) future-self maintainer at 3am. W/W/H clear. iter2 fixes 1-8 applied — Usage-relevant: Fix 2 (Interview bootstrap/mature split), Fix 4 (wire format), Fix 6 (user-question schema), Fix 7 (orchestration row 7).

## Inheritance from iter1

| iter1 ID | Severity | Conf | iter2 disposition |
|---|---|---|---|
| F-U-01 (no entry-level "how to start a session" SOP) | High | 75 | **Persisted** — no fix in iter2 scope. orchestration/SKILL.md still does not cite `/gobbi` entry point. |
| F-U-02 (NEEDS_CONTEXT user-question schema undefined) | High | 75 | **Addressed** — Fix 6 ships a YAML schema in `delegation/SKILL.md:160-170` + a worked example at L138-154. Manager dispatch table (L193) explicitly handles the block. |
| F-U-03 (`feature` stamping mechanism unclear) | Medium | 50 | **Persisted** — no fix. |
| F-U-04 (Re-Ideate iter counter semantic unclear) | Medium | 50 | **Persisted** — no fix. |
| F-U-05 (mistake skill template not in scope) | Medium | 50 | **Persisted** — informational, out of batch. |

## Stage 1 — Locked Frame

Inherited from iter1 (S1-S5). New scenarios for iter2:

**S6. (iter2 adversarial) Fix 6 schema is usable — a fresh subagent can produce a valid user-question block from the schema alone**
- [ ] Required fields enumerated (question, description, options, recommended-option)
- [ ] Manager dispatch knows what to do with absent block

**S7. (iter2 adversarial) Fix 7's Step 1 row 7 reads cleanly — manager knows what to do at every branch**
- [ ] Detection criteria spelled out
- [ ] Accept path / decline path both lead somewhere unambiguous

## Stage 2 — Findings

### F-U-02-iter2 — RESOLVED — NEEDS_CONTEXT user-question schema defined

**Type**: `general` / **Domain**: `docs-sync` / **Confidence**: 100 / **Severity**: — / **Disposition**: addressed

**Evidence**: `delegation/SKILL.md:160-170` provides YAML schema with required fields (question, description, options, recommended-option) and per-option (label, description ≥ 40 chars). Worked example at L138-154 shows the schema in context. Manager dispatch table at L193: "If `user-question:` block present: construct AskUserQuestion and ask user. Otherwise: fetch missing context ... and re-delegate." Determinism boundary now explicit: presence/absence of the block routes manager action.

### F-U-01 (carry forward, persisted) — Manager entry-point SOP gap

Same as iter1 F-U-01. orchestration/SKILL.md still starts at "Read the default settings template" without citing `/gobbi` as the entry. Persisted.

### F-U-NEW-1 — Fix 1 partial sweep makes templates/evaluator.md a usability hazard

**Type**: `general` / **Domain**: `docs-sync` / **Confidence**: 100 / **Severity**: High / **Disposition**: open

**Evidence**: A fresh evaluator subagent loads `delegation/templates/evaluator.md` as its operating contract. Reading top-down:
- L77-83: "Evaluate: the deliverable... Perspective discipline: stay in your assigned perspective. Trust parallel evaluators to cover their own lenses." → mental model = single perspective
- L85-91: "Walk through the perspective's checklist against the deliverable." → reinforces single-perspective
- L122-128: wire format ends with "DONE — all 7 perspectives + Overall complete" → contradicts the prior 50 lines

The evaluator must hold two incompatible mental models simultaneously. Most-likely outcomes: (a) writes 1 perspective file and reports DONE (misleading), (b) writes 7 perspective files but applies "your assigned perspective" framing wrongly within Stage 2, (c) bounces with NEEDS_CONTEXT for clarification.

**Why it matters**: Templates are the contract for the role. A self-contradicting template breaks the principle of templates-as-specs. Usage is where the gap surfaces operationally — Performance prices it, Consistency tags it as a sync failure, Risk weighs blast radius. Suggested-direction (not a fix prescription): rewrite L82-88 to read "Perspective discipline: walk all 7 perspectives in the documented order, completing each before moving to the next. The 7 sequential passes form your isolation discipline. Trust the OTHER SYSTEM's parallel evaluator (Claude ↔ Codex) to cover system-bias, not other perspective-agents."

### F-U-NEW-2 — Fix 7 row 7's decline path forward-pointer is technically correct but jarring

**Type**: `general` / **Domain**: `aesthetics` / **Confidence**: 50 / **Severity**: Low / **Disposition**: open

**Evidence**: `orchestration/SKILL.md:83` row 7: "If the user declines, proceed to Step 2 directly." A fresh manager could read "Step 2" as "row 2 of the current Step 1 table" — both row numbers and step numbers use single integers in this doc. Phrasing as "proceed to Step 2 (Ideation Loop) directly" or "proceed to the Ideation Loop" disambiguates without cost.

### F-U-03 / F-U-04 / F-U-05 (carry forward, persisted)

Same as iter1. Not addressed in iter2; not blockers.

## Stage 2 Verdict

**REVISE** — F-U-NEW-1 (High, conf 100) replaces F-U-02 as the new High. iter1's F-U-01 + F-U-02 both High; Fix 6 cleanly addressed F-U-02. F-U-01 persisted (deferred). F-U-NEW-1 newly surfaced via Fix 1 partial sweep. Net: iter1 had 2 Highs; iter2 has 2 Highs (1 persisted + 1 new from partial sweep) — same verdict, different population.

## Low-confidence appendix

- LC-U-1-iter2 (conf 25, Low): Same as iter1 LC-U-1 (Interview wave time estimates). Defer.
- LC-U-2-iter2 (conf 25, Low): Worked example at `delegation/SKILL.md:138-154` is a single block doing both NEEDS_CONTEXT-without-question (the simple case) and NEEDS_CONTEXT-with-question (the complex case). Split would aid skim-readers. Polish.
