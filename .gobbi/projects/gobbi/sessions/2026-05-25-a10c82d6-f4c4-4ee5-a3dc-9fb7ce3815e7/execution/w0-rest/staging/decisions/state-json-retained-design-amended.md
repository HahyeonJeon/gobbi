---
name: state-json-retained-design-amended
description: User-ratified KEEP the live workflow state-machine state.json; design-of-record §3.4/§7#7/§8 amended with CORRECTION notes. The "retire state.json" instruction was a misread of PR-FIN-2a-iii's SQLite-era retirement.
type: decisions
scope: project
feature: project-memory
created: 2026-05-26
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
mistake-candidate: true
domain: process
---

# Decision — state.json is RETAINED (live state-machine); design amended

## What
During W0-rest, the locked design §7 #7 + §3.4 + §8 instructed "retire state.json references." The executor and the Claude evaluator both refused and surfaced evidence; the Codex evaluator initially held the design-literal "retire" view. Manager surfaced the divergence as a USER CHALLENGE. **User ratified: KEEP state.json as the live workflow state-machine.** Design-of-record amended at §3.4, §7#7, and §8 with dated CORRECTION notes (originals struck-through, preserved).

## Why (the misread)
`state.json` is the live per-session workflow state-machine: initialized at orchestration Step 1 row 5.5 from `templates/state.template.json` (ships on disk), updated by the manager at every state transition, read for `/clear`/`/compact` recovery, and projected into the Workflow Status Display. `session.json` is a separate telemetry file and is NOT a replacement. The design §3.4 "state.json retired per MEMORY.md" conflated this live file with the OLD SQLite-era `state.json` that PR-FIN-2a-iii actually retired.

## How to recognize next time
When a design instruction says "retire/remove X," verify X is not a LIVE mechanism with no specified replacement. A retirement instruction that names no destination for the retired entity's responsibilities is a red flag — cross-check the cited witness (here: PR-FIN-2a-iii) to confirm it refers to the same X.

## Corrected approach
- Live state-machine `state.json` stays canonical (orchestration/SKILL.md unchanged — already coherent).
- Closed-session `state.json` + root `HANDOFF.md` left untouched per RATIFY-7; W4-T1 removes only `tmp/`.
- Design-of-record carries CORRECTION annotations (grep -ci CORRECTION == 4).

Related: [[manager-skipped-dual-system-eval]] (dual-system caught this — Codex held design-literal, Claude+executor held design-defective; the divergence forced the right user decision).
