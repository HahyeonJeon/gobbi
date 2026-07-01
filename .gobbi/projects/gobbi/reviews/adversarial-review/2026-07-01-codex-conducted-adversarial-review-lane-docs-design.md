---
name: codex-conducted-adversarial-review-lane-docs-design
description: Lane C review for D3 docs design and information architecture
type: reviews
scope: project
feature: null
status: active
created: 2026-07-01
session: 019f1ef9-a676-7f12-8d78-922f12cb64e9
tags: [evaluation, docs-sync, design]
keywords: [d3, docs-design, information-architecture, skills, codex-conducted]
author: codex
review_kind: adversarial-review
subject: "Gobbi general surface — D3 docs design and information architecture"
verdict: needs-attention
---

# Lane C — D3 Docs Design And Information Architecture

This lane reviews how Gobbi skills and docs guide new managers, spawned agents, and maintainers.

## Method

Lane C reviewed skill/document information architecture, reader journeys, runtime-specific
branching, section placement, and how new managers or spawned agents find the next instruction.
It treated the 2026-06-29 review corpus as dedupe context and did not re-file generic
doc-density, known D5 centralization/compact candidates, the `coding` skill-map gap, the
missing Glossary `Stage` entry, or the known `rules/docs-cleanup-parallelism.md` broken link as
standalone findings.

Commands and checks used included:

- required load reads for `AGENTS.md`, evaluator role prompt, principles, mistake, evaluation,
  research, coding, and this charter
- prior-review reads for D2, D3/D5, D4, D6, and D1/D7 artifacts
- `find -L .agents/skills -type f -name 'evaluation.md' -print | sort`
- `rg --files .gobbi/projects/gobbi/rules`
- targeted `nl -ba` reads of `gobbi`, `orchestration`, mode docs, workflow child docs,
  `evaluation`, `memory`, `ideation`, evaluator role prompt, and `memory-map`

## Findings

### GEN-D3-001: Bootstrap entry path bypasses the selected mode doc
- Type: design_flaw
- Domain: process
- Severity: High
- Confidence: 100
- Priority: high
- Disposition: open
- Runner: codex
- Dimension: D3
- Owner-surface: workflow
- Location: `.agents/skills/gobbi/SKILL.md:102`; `.agents/skills/gobbi/SKILL.md:104`; `.agents/skills/orchestration/SKILL.md:76`; `.agents/skills/orchestration/SKILL.md:78`; `.agents/skills/orchestration/SKILL.md:81`; `.agents/skills/orchestration/SKILL.md:84`; `.agents/skills/orchestration/auto-mode.md:44`; `.agents/skills/orchestration/auto-mode.md:51`; `.agents/skills/orchestration/chat-mode.md:61`; `.agents/skills/orchestration/chat-mode.md:63`
- Expected: After Configuration selects `settings.mode`, the new manager should be sent to the selected mode document first; the mode document should then dispatch Ideation / Preparation / Planning / Execution / Wrap-up.
- Observed: `gobbi/SKILL.md` Step 6 tells the reader that the first productive step is Ideation and to load `ideation` directly. The orchestration skill instead says the manager reads `settings.mode` and delegates Steps 2-6 to `auto-mode.md` or `chat-mode.md`. Auto and Chat docs both declare themselves the canonical per-mode SOP.
- Evidence: `nl -ba .agents/skills/gobbi/SKILL.md | sed -n '88,108p'` shows Step 6 sending the reader to Ideation. `nl -ba .agents/skills/orchestration/SKILL.md | sed -n '72,92p'` shows the mode-doc routing. `nl -ba .agents/skills/orchestration/auto-mode.md | sed -n '40,84p'` and `nl -ba .agents/skills/orchestration/chat-mode.md | sed -n '56,68p'` show the two mode docs are intended workflow homes.
- False-positive check: none. This is not the prior successor-handoff class; it is the initial reader journey immediately after bootstrap.
- Proposed remediation: Make `gobbi/SKILL.md` Step 6 route through `orchestration/SKILL.md` / the selected mode doc, and let the mode row load Ideation.
- Verification: A fresh manager starting from `gobbi/SKILL.md` can answer "Auto or Chat next?" without already knowing the orchestration docs.
- Second-pass: validated by Godel (`019f1f2d-20a4-71f0-a5e5-0ef5512dd3dc`). Severity remains High.

### GEN-D3-002: Mode workflow tables point spawned agents at manager-only orchestration docs
- Type: design_flaw
- Domain: process
- Severity: High
- Confidence: 100
- Priority: high
- Disposition: open
- Runner: codex
- Dimension: D3
- Owner-surface: workflow
- Location: `.agents/skills/orchestration/auto-mode.md:76`; `.agents/skills/orchestration/auto-mode.md:79`; `.agents/skills/orchestration/auto-mode.md:80`; `.agents/skills/orchestration/auto-mode.md:81`; `.agents/skills/orchestration/chat-mode.md:148`; `.agents/skills/orchestration/chat-mode.md:151`; `.agents/skills/orchestration/chat-mode.md:152`; `.agents/skills/orchestration/chat-mode.md:153`; `.agents/skills/orchestration/workflow/ideation.md:1`; `.agents/skills/orchestration/workflow/ideation.md:3`; `.agents/skills/orchestration/workflow/evaluation.md:1`; `.agents/skills/orchestration/workflow/evaluation.md:3`; `.agents/skills/orchestration/workflow/record.md:1`; `.agents/skills/orchestration/workflow/record.md:3`
- Expected: In a table with `Refs` and `Agent`, the reference for a spawned `leader`, `evaluator`, or `assistant` should be the exact document that agent needs to load, or the table should label the reference as manager-only.
- Observed: Auto and Chat rows list `leader` / `evaluator` / `assistant` as the actor while linking `workflow/ideation.md`, `workflow/evaluation.md`, and `workflow/record.md`. Those files immediately state they are manager orchestration docs and that specialists load `ideation/SKILL.md`, `evaluation/SKILL.md`, `record/SKILL.md`, and `memory/memory-map.md` instead.
- Evidence: `nl -ba .agents/skills/orchestration/auto-mode.md | sed -n '40,84p;92,120p;128,156p'` shows specialist-agent rows whose refs are `workflow/*.md`. `nl -ba .agents/skills/orchestration/chat-mode.md | sed -n '144,156p;176,204p;228,240p'` shows the same pattern. `nl -ba .agents/skills/orchestration/workflow/{ideation,evaluation,record}.md` shows those linked files are manager-facing.
- False-positive check: none. Links resolve; the defect is wrong abstraction level and ambiguous load guidance, not link rot.
- Proposed remediation: Split the table into manager orchestration refs and spawned-agent load directives, or change specialist rows to point at specialist skill docs directly.
- Verification: A manager can copy a row's load refs into a delegation prompt without accidentally giving a specialist a manager-only doc.
- Second-pass: validated by Godel (`019f1f2d-20a4-71f0-a5e5-0ef5512dd3dc`). Severity remains High.

### GEN-D3-003: Evaluation child docs are hidden behind a same-basename manager doc
- Type: design_flaw
- Domain: process
- Severity: Medium
- Confidence: 100
- Priority: medium
- Disposition: open
- Runner: codex
- Dimension: D3
- Owner-surface: workflow
- Location: `.agents/skills/orchestration/auto-mode.md:80`; `.agents/skills/orchestration/auto-mode.md:98`; `.agents/skills/orchestration/auto-mode.md:116`; `.agents/skills/orchestration/auto-mode.md:134`; `.agents/skills/orchestration/auto-mode.md:152`; `.agents/skills/orchestration/workflow/evaluation.md:36`; `.agents/skills/orchestration/workflow/evaluation.md:47`; `.agents/skills/evaluation/SKILL.md:126`; `.agents/skills/evaluation/SKILL.md:141`; `.agents/skills/evaluation/SKILL.md:542`
- Expected: The evaluator spawn site should make the phase-specific evaluation child doc discoverable at the point where the evaluator is spawned.
- Observed: Every EVALUATION row links only to `workflow/evaluation.md`, a manager doc. That doc says the evaluator loads `ideation/evaluation.md`, `preparation/evaluation.md`, `planning/evaluation.md`, `execution/evaluation.md`, or `wrap-up/evaluation.md` at Stage 0. The executable child docs all share the basename `evaluation.md`, so a fresh manager has to infer which `evaluation.md` belongs in the delegation prompt.
- Evidence: `find -L .agents/skills -type f -name 'evaluation.md' -print | sort` returns seven files: `coding/evaluation.md`, five phase child docs, and `orchestration/workflow/evaluation.md`. `nl -ba .agents/skills/evaluation/SKILL.md | sed -n '120,180p;536,552p'` shows Stage 0 and the phase-child table.
- False-positive check: new-variant. Prior D2-003 covers the `coding/evaluation.md` dead-end from Execution EVALUATION; this finding covers general phase-child discoverability at mode spawn rows.
- Proposed remediation: Put the exact phase child doc in each EVALUATION row or delegation template, and consider renaming/labeling the manager doc so `workflow/evaluation.md` is not confused with evaluator child docs.
- Verification: Each EVALUATION delegation prompt generated from the mode table contains `evaluation/SKILL.md` plus the exact phase child doc path.

### GEN-D3-004: Memory read guidance is fragmented and the memory entry point points only to mistakes
- Type: design_flaw
- Domain: docs-sync
- Severity: Medium
- Confidence: 100
- Priority: medium
- Disposition: open
- Runner: codex
- Dimension: D3
- Owner-surface: memory
- Location: `.agents/skills/memory/SKILL.md:28`; `.agents/skills/memory/SKILL.md:34`; `.agents/skills/memory/SKILL.md:40`; `.agents/skills/gobbi/SKILL.md:95`; `.agents/skills/gobbi/SKILL.md:97`; `.agents/skills/ideation/SKILL.md:103`; `.agents/skills/evaluation/SKILL.md:142`
- Expected: The memory entry point should tell a new manager or spawned agent where to find the durable-memory read contract across memory types, or point to one canonical read map.
- Observed: `memory/SKILL.md` describes staging, promotion, and read-back, then says building a read procedure is not its job and points only to `mistake/SKILL.md § P1`. `gobbi/SKILL.md` checks only whether memory looks sparse. Concrete non-mistake reads are scattered in phase docs such as Ideation and Evaluation.
- Evidence: `nl -ba .agents/skills/memory/SKILL.md | sed -n '1,48p'` shows the read beat and the mistakes-only pointer. `nl -ba .agents/skills/gobbi/SKILL.md | sed -n '88,108p'` shows the bootstrap memory check. `nl -ba .agents/skills/ideation/SKILL.md | sed -n '96,118p'` and `nl -ba .agents/skills/evaluation/SKILL.md | sed -n '120,180p'` show phase-local read tables that are not discoverable from the memory entry point.
- False-positive check: none. Prior D3 memory findings focus on semantic retrieval / staleness; this is the docs information-architecture path for basic read instructions.
- Proposed remediation: Add a durable-memory read map keyed by role and phase, then have `memory/SKILL.md`, `gobbi/SKILL.md`, and phase docs point to it.
- Verification: Starting from `memory/SKILL.md`, a new evaluator or leader can find required reads for mistakes, rules, design, notes, backlogs, decisions, and feature-scoped memory without searching the whole skill tree.

### GEN-D3-005: Required project-rules reads have no empty-state contract
- Type: scenario_gap
- Domain: process
- Severity: Medium
- Confidence: 100
- Priority: medium
- Disposition: open
- Runner: codex
- Dimension: D3
- Owner-surface: memory
- Location: `.gobbi/projects/gobbi/agents/evaluator.md:34`; `.gobbi/projects/gobbi/agents/evaluator.md:35`; `.agents/skills/ideation/SKILL.md:103`; `.agents/skills/ideation/SKILL.md:110`; `.agents/skills/evaluation/SKILL.md:142`; `.agents/skills/memory/memory-map.md:132`; `.agents/skills/memory/memory-map.md:139`
- Expected: If evaluator and phase docs require recursive reads from `.gobbi/projects/{project-name}/rules/`, the project should either contain that directory or state that an absent directory is a valid "no rules" state and how to record it.
- Observed: The evaluator prompt mandates loading all project rules, Ideation and Evaluation require recursive `rules/` reads, and the memory map lists `rules/{area}/{slug}.md`. In this worktree, `.gobbi/projects/gobbi/rules` does not exist; a read command errors instead of producing an explicit empty rules set.
- Evidence: `nl -ba .gobbi/projects/gobbi/agents/evaluator.md | sed -n '26,42p'` shows the mandatory evaluator load. `nl -ba .agents/skills/ideation/SKILL.md | sed -n '96,118p'` and `nl -ba .agents/skills/evaluation/SKILL.md | sed -n '120,180p'` show required phase reads. `rg --files .gobbi/projects/gobbi/rules` returns `No such file or directory (os error 2)`.
- False-positive check: new-variant. Prior D2-023 covers a specific broken link into `rules/docs-cleanup-parallelism.md`; this covers a broader required-read empty-state failure across evaluator and phase docs.
- Proposed remediation: Define absent-directory behavior in the memory read contract, or ship an empty `rules/` skeleton / README that makes "no current project rules" mechanically readable.
- Verification: Required rules-read paths either resolve successfully or the reading agent records an explicit `project rules: none / directory absent by contract` entry without treating it as missing context.
