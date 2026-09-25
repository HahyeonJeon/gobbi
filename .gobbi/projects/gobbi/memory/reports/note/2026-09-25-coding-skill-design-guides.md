# Coding skill design guides

> Tracked Memory work account at `memory/reports/note/`. Omit Git action states and recovery commands.

**Completed at:** 2026-09-25T08:40:25Z

## Result

Coding Ideation now studies shared pattern and SOLID guides, designs in three levels, and records each confirmed decision only in its own heading. Coding Execution reads the same guides while implementing and does not replace that design.

## Context

| Item | Detail |
|---|---|
| Purpose | Agents need one pattern set and the SOLID principles when they design classes and when they implement the accepted design. |
| Requirements | `design-pattern.md` holds the 23 Gang of Four patterns, each heading ending in "Pattern", with a description and one example. `SOLID.md` holds the five principles, each with a description and one example. Both files live in `skills/coding/`. |
| Scope | Coding Ideation procedure and templates, Coding Execution read steps, the two guides, and the plugin projection of those files. |
| Exclusions | Coding Planning, Coding Review, and the coding navigation root were not changed. |
| Accepted decisions | The design order and guide homes are recorded in [Coding skill family](../../design/feature/coding-skill-family.md). |

## Work

| Item | Detail | Evidence |
|---|---|---|
| Design pattern guide | Twenty-three pattern entries, each with a description and one Python example. | `skills/coding/design-pattern.md` |
| SOLID guide | Five principles, each with a description and one Python example. | `skills/coding/SOLID.md` |
| Coding Ideation | Phase 2 studies, discusses, and designs. Phase 3 confirms with a tree, schema, and diagram, then records. | `skills/coding/coding-ideation/SKILL.md` |
| Coding Execution | Reads both guides before implementation details and keeps the accepted class and method design. | `skills/coding/coding-execution/SKILL.md` |

## Memory

| Action | Owner | Change and reason | Evidence |
|---|---|---|---|
| Updated | `design/feature/coding-skill-family.md` | Recorded the two guides and the three-level design order. | This note |
| Updated | `learnings/design/mistakes.md` | Recorded that a phase order must not be applied outside that phase. | This note |
| Created | `reports/note/2026-09-25-coding-skill-design-guides.md` | Durable work account. | This file |
| Created | `history/2026-09-25-coding-skill-design-guides.md` | The session changed the coding skill. | History file |

## Remaining limits

The second review quality opinion was mixed. The Singleton example can still be constructed twice, the skill and templates use different classification words, and some procedure steps are longer than the skill-writing length limit. Those items do not change the contract-gate PASS.
