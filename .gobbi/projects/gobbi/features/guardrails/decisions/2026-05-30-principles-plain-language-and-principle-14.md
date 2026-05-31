---
name: principles-plain-language-and-principle-14
description: Removed Iron Law Index; rewrote P6/P10/P11 to literal wording; standardized P10 on "trigger"; added Principle 14 governing all agent-authored text.
type: decisions
scope: feature
feature: guardrails
status: active
created: 2026-05-30
session: a30b7a6e-164f-49ac-a857-ee225e831a7c
tags: [principles, plain-language, behavioral-floor, docs-sync]
supersedes: null
superseded_by: null
decision_status: accepted
---

# Principles Clarity Pass: Plain Language Rewrite and New Principle 14

## Context

The `principles/SKILL.md` file contained three classes of drift that reduced its precision as an agent instruction document:

1. **The Iron Law Index** — a duplicate quick-reference table of all Iron Laws placed near the top of the file. This table was redundant with the per-principle Iron Law blocks and introduced a second surface where wording could diverge from the authoritative per-principle text. CLAUDE.md already carries the canonical Iron Law table, so the in-skill copy had no load-bearing function.

2. **Metaphoric Iron Law wording** — three principles (P6, P10, P11) had Iron Laws or titles expressed as metaphors or indirect phrasing. Metaphors introduce a decode step: an agent reading "Specificity Is the Only Currency" or "Witness-bound Work" must interpret the figure before it can act on the instruction. That decode step is an error surface.

3. **Missing coverage for agent-authored text** — no principle explicitly governed the language style of text agents themselves write. Agents could produce metaphor-heavy or indirect prose without violating any listed principle. The coverage gap left a behavioral blind spot.

## Decision

Four changes were made to `principles/SKILL.md`, with co-updates propagated across all files that mirror the Iron Law table:

**(1) Remove the Iron Law Index.** The quick-reference table listing all 13 Iron Laws was removed from `principles/SKILL.md`. The table in `CLAUDE.md` remains the canonical always-visible summary. The in-skill index was a redundant copy.

**(2) Surgical literal rewrite of P6, P10, P11.** Three principles were reworded to state their instruction directly without a decode step:
- P6 title: `Specificity Is the Only Currency` → `Refine Vague Requirements Before Acting`
- P6 Iron Law: `REFUSE TO TRANSACT IN VAGUENESS.` → `DO NOT ACT ON A VAGUE REQUIREMENT; MAKE IT CONCRETE FIRST.`
- P6 body: removed the "Comfort is a warning sign" aphorism.
- P10 title: `Witness-bound Work` → `Change Only With a Real Trigger`
- P10 Iron Law: `NO CHANGE WITHOUT A REAL MOTIVATOR.` → `NO CHANGE WITHOUT A REAL TRIGGER.`
- P10 body, P12 cross-reference, and all backlog + feature-decision occurrences: the concept word `witness` standardized to `trigger`; `motivator` standardized to `trigger`.
- P11 title: `Metrics Are Signals, Not Targets` → `Improve the Property, Not the Metric`

**(3) Add Principle 14 — Write Plainly and Literally.** A fourteenth principle was added with Iron Law: `USE PLAIN, LITERAL LANGUAGE; DO NOT REPLACE A LITERAL STATEMENT WITH A METAPHOR.` Its reach is ALL agent-authored text — not limited to instruction documents. P14's own body includes two deliberate counter-examples (phrases the principle forbids) to teach by contrast; these are intentional and are not retired wording subject to the blast-radius sweep.

**(4) Standardize P10 on "trigger".** Across the repo, the concept previously called `witness`, `motivator`, or `real motivator` in the context of P10 was unified to `trigger`. Files updated: `principles/SKILL.md` (P10 body + P12 cross-reference), two `backlogs/` files, and one `features/install-runtime/decisions/` record.

Co-updated files to mirror rows 6/10 in the Iron Law table and add row 14:
- `.claude/CLAUDE.md`
- `.codex/AGENTS.md`
- `skills/orchestration/SKILL.md`
- `skills/interview/SKILL.md`
- `skills/delegation/templates/assistant.md`
- `agents/assistant.md`

## Rationale

Principles are agent instructions, not literature. When an Iron Law is expressed as a metaphor ("transact in vagueness", "witness-bound"), an agent must translate the figure into an operational rule before it can act. That translation step is invisible, happens inside the agent's inference, and can decode wrong. A literal statement ("do not act on a vague requirement") leaves nothing to decode — the instruction is the rule.

The Iron Law Index removal eliminates a second wording surface in the skill itself. Keeping one canonical table per doc (CLAUDE.md for the summary; per-principle blocks in the skill for the detail) removes the risk that the index drifts from the per-principle text and agents load conflicting wordings.

P14 closes a coverage gap: the prior 13 principles governed what agents do (scope, verification, design process) but not how they write. An agent could produce indirect or metaphor-laden prose without violating any prior principle. P14 covers that gap with a reach of all agent-authored text.

## Surgical calibration — deliberately KEPT shorthands

The rewrite was SURGICAL: only wording that requires a decode step was replaced with a literal instruction. Three established shorthands were deliberately preserved because their meaning is fully body-defined in the principle text and the community around this codebase treats them as precise terms, not vague metaphors:

| Shorthand | Principle | Why kept |
|---|---|---|
| Goodhart's Law / "games the tool" | P11 | Body-defined: the Goodhart sentence in P11 gives the exact definition. Evaluators and the user already use "gaming the tool" as a precise technical term for metric-Goodharting. |
| CRUD plan / "blast radius" | P13 | Body-defined: the CRUD section explains all four ops; "blast radius" is the standard technical term for change propagation scope. |
| contract / client | P4 | Body-defined: P4's body specifies exactly what "the contract with the user" means. These are established software-engineering terms that carry precise meaning without a decode step. |

## Consequences

- The Iron Law count is now 14. All Iron Law tables in CLAUDE.md, AGENTS.md, and agent templates carry 14 rows.
- The principle numbering is unchanged (P1–P13 are in place; P14 is new at the end).
- Any future principle rewrite must pass the same calibration boundary: replace only wording that decodes to a different instruction than it states; preserve body-defined shorthands and industry-standard technical terms.
- A blast-radius search for any retired principal wording must grep for ALL retired surface forms: titles, Iron Law phrases, AND concept shorthands (e.g., "witness", "motivator") across the WHOLE repo — not a hand-listed subset of trees, and not excluding `features/`.

## Related

- Commits: `31d53f9` (Task 01 — Iron Law Index removal + P13 blast-radius fix), `d9cdbc5` (Task 02 initial literal rewrite + P14), `ec2c735` (Task 02 remediation iter1), `4d8f2e1` (Task 02 remediation iter2 — stranded features/ decision record)
- Ideation artifact: `sessions/2026-05-30-a30b7a6e-164f-49ac-a857-ee225e831a7c/ideation/artifacts/principles-clarity-redesign.md`
- Dual-system eval iter1: `sessions/2026-05-30-a30b7a6e-164f-49ac-a857-ee225e831a7c/execution/evaluation/iter1/{claude,codex}/`
- Dual-system eval iter2: `sessions/2026-05-30-a30b7a6e-164f-49ac-a857-ee225e831a7c/execution/evaluation/iter2/{claude,codex}/`
