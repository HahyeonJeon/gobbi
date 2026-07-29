---
name: react-skill-execution-eval-deferred-findings
description: The Medium and Low findings from the react skill's Execution iteration-1 dual-system evaluation, deferred by user disposition after the Highs were fixed.
type: backlogs
scope: project
feature: null
status: deferred
created: 2026-07-26
session: bae334bf-c3df-4155-bbd0-92d5a36f3feb
tags: [evaluation, docs-sync, process]
keywords: [react-skill, execution-evaluation, deferred-findings, revise]
author: claude
priority: medium
project-scope: true
shipped_in: null
---

# React skill — deferred findings from the Execution iteration-1 evaluation

## Context

The `react` skill's Execution iteration-1 evaluation ran as a full dual-system pass on the frozen
fourteen-file tree: one fresh Claude evaluator and one fresh Codex evaluator, mutually blind. Both
returned **REVISE**. The Claude evaluator filed 13 findings, the Codex evaluator 9.

At the disposition gate the user chose: **fix the High findings now, defer the rest.** The five Highs
were fixed in the same session — `H16`'s missing sandbox obligation, `H9`'s over-broad return-focus,
the uncovered Procedure P7 reproducer conjunct, `H6`'s missing connection in the acceptance side, and
`H9`'s citation of a W3C document that has since been discontinued. Two record defects (`RX-06`,
`RX-13`) were also corrected. This record carries what was deferred.

## Deferred — Claude evaluator (`eval-claude-execution-i1.md`, md5 `5155decf`)

| ID | Severity · confidence | Finding |
|---|---|---|
| `RX-04` | **High** · 75 | The register is bound to two consumers with different evidence availability, and its mode forbids the tokens the executor's P8 self-check needs — several unconditional gates name runtime experiments that Procedure P7's gate list does not produce. **See the note below: this one is High and was not in the fix set.** |
| `RX-05` | Medium · 75 | Several gate and required items fuse independently falsifiable clauses into one binary claim. |
| `RX-08` | Medium · 100 | `ecosystem.md`'s documented re-resolution command does not reproduce the two rows the file exists to carry. |
| `RX-09` | Low · 100 | A deferral in `scenarios.md` states a hold condition that was discharged earlier in the same session. |
| `RX-10` | Low · 75 | `H11` attributes context-value immutability to a page that does not state it. |
| `RX-11` | Low · 100 | One quotation is truncated mid-source-sentence in a way that changes how "an exception" reads. |
| `RX-12` | Low · 100 | `H4` omits one of the three named "Rules of keys" on the page it cites. |

`RX-07` (Medium — the References register claimed the First Rule of ARIA Use has four exception
conditions) is **not deferred: it was discharged incidentally** by the `H9` citation repair, which
replaced that register entry wholesale. Verify before re-filing it.

## Deferred — Codex evaluator (`eval-codex-execution-i1.md`, md5 `598f4a28`)

The Codex evaluator ran twice. Run 1 was rejected by the record validator on a verdict-derivation
defect and produced 9 findings with 2 High; run 2 validated and produced 11 findings with 7 High. **The
two runs resample rather than accumulate — neither is a superset of the other**, so both, with the
Claude ledger, are three independent samples of one artifact. Only run 2's ledger is on disk; run 1's
non-High findings were never relayed and are not recoverable from this record.

| ID | Severity · confidence | Finding |
|---|---|---|
| `STRUCT-COMPANION-POLICY-01` | Medium · 100 | `convention.md` §4–§6 prescribe grouping, colocation, promotion timing, import direction, import order and formatting in directive language, but no parent rule, scenario or check owns or evaluates them. Either demote them to background with no compliance implication, or promote the load-bearing ones to parent Rules with a scenario and check behind them. |
| `STRUCT-DEFERRED-ROUTE-01` | Medium · 75 | `useDeferredValue` is taught in `rendering.md` but named in neither P2 route nor `async.md`'s seam table, so a reader deciding whether to use it is not routed to it. Name it in one route and in the seam, keeping the mechanics in `rendering.md` only. |
| `CONSISTENCY-ARIA-COUNT-01` | Medium · 100 | The References register said *Using ARIA* supplies four `H9` exception conditions while everything else says three. **Discharged during the fix pass** — the register entry was replaced wholesale by the discontinued-source repair. Verify before re-filing. |
| `CONSISTENCY-LEGEND-01` | Medium · 100 | `evaluation.md`'s legend resolves each rule to its **opening clause only**, so a change to a rule's exceptions, evidence class, or branch criteria leaves the legend and its stated synchronization test unchanged — it cannot perform the propagation guarantee it claims. Codex also measured that 10 of 33 legend quotations are not literal substrings because the source clauses wrap across lines; whitespace normalization repairs that but not the underlying blindness. `H4`, `H6`, `H8`, `H9`, `H13`, `H14` and `H15` all carry policy beyond their opening clause. Recommendation: store a normalized fingerprint of the complete normative text per entry, or add exception-focused adversarial checks. |

**`CONSISTENCY-LEGEND-01` is the same defect the executor reported to the manager as an open structural
concern after T15**, in those words: the legend quotes only a rule's opening clause, which is why `H9`'s
missing ARIA circumstance survived three consecutive tasks that all edited the rules. Two systems reached
it independently from opposite directions — one from having been bitten by it, one from reading the
crosswalk's own claim. That convergence is why it is worth doing rather than noting.

`PROJECT-GATE-01` (High) is **not deferred and not an artifact defect**: it observes that the skill
approaches merge with Ideation ended at REVISE and Planning unevaluated. Both were explicit user
decisions under budget pressure. It belongs in the Wrap-up handoff as a disclosed limitation and the
manager carries it.

The four run-2 Highs that were fixed — `RISK-ELECTRON-SANDBOX-01`, `RISK-H6-CHECKS-01`,
`RISK-ARIA-SOURCE-01`, `PERF-USEMEMO-01`, `USAGE-EXTERNAL-STORE-01` — are not listed here. The first
three re-confirm Claude findings independently; the last two were new.

## Why deferred

User disposition at the evaluation gate: the Highs were defects that let a wrong change-set pass, so
they were fixed immediately; the rest are quality and consistency work that does not block acceptance
and that would have extended an already long Execution step.

## When to pick up

The next session that revises the `react` skill, or a dedicated fix session. `RX-04` should be looked
at first — see below.

## `RX-04` deserves a decision, not just a queue position

It is filed **High**, and it was not in the five the user dispositioned for immediate fix. Its remedy
is architectural rather than a text repair — the evaluator names three options: split the executor
self-check into a design-mode companion where `recorded-open` is legal; generalize `REACT-CHECK-16`'s
weaker-observation clause into a register-level evidence-substitution rule; or narrow the named
evidence to what Procedure P7's gates actually produce and move the runtime experiments into scenario
oracles. Each is a scope decision with consequences for `checklist/SKILL.md` conformance, which is why
it is recorded here rather than absorbed.

Its provenance is worth carrying too: the P7 cold-load proof named the same shape as its defect
`5(c)`, so this is the second independent observation of it.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-25-bae334bf-c3df-4155-bbd0-92d5a36f3feb/`
Evaluation report: `3-execution/staging/reviews/eval-claude-execution-i1.md`
