---
name: codex-conducted-adversarial-review-lane-live-ux
description: Lane G review for D7 live-session UX and operator ergonomics
type: reviews
scope: project
feature: null
status: active
created: 2026-07-01
session: 019f1ef9-a676-7f12-8d78-922f12cb64e9
tags: [evaluation, codex, process]
keywords: [d7, live-session, ux, operator-ergonomics, codex-conducted]
author: codex
review_kind: adversarial-review
subject: "Gobbi general surface — D7 live-session UX and operator ergonomics"
verdict: needs-attention
---

# Lane G — D7 Live-Session UX And Operator Ergonomics

This lane reviews progress visibility, task state, blockers, artifact paths, and long-running work.

## Method

Lane G reviewed the live-session user and operator path: startup/resume, progress state,
task records, pending blockers, status rendering, transcript availability, and long-running
workflow recoverability.

The lane checked prior D7 findings before filing. It did not re-file the earlier pending-decision
and progress-display findings where the current evidence was only a duplicate. It did file current
variants where the state path or operator contract remains distinct.

Commands and checks used included:

- required load reads for `AGENTS.md`, evaluator role prompt, principles, mistake, evaluation,
  research, coding, and the 2026-07-01 charter
- targeted reads of `.agents/skills/gobbi/SKILL.md`
- targeted reads of `.agents/skills/orchestration/{SKILL.md,chat-mode.md,templates/*.json}`
- targeted reads of `.agents/skills/record/record-map.md`, record initialization scripts, and
  scaffold scripts
- `rg -n` checks for `currentIndex`, `InProgress`, `task-record`, `transcriptPath`, and prior D7
  duplicates
- `git rev-parse --show-toplevel`, `git rev-parse --abbrev-ref HEAD`, `git rev-parse HEAD`, and
  `git status --short`

## Findings

### GEN-D7-001: Resume path can reset active state to Ideation
- Type: design_flaw
- Domain: process
- Severity: High
- Confidence: 100
- Priority: high
- Disposition: open
- Runner: codex
- Dimension: D7
- Owner-surface: workflow
- Location: `.agents/skills/gobbi/SKILL.md:72`; `.agents/skills/gobbi/SKILL.md:102`; `.agents/skills/orchestration/SKILL.md:104`; `.agents/skills/orchestration/SKILL.md:237`
- Expected: Resume reads the persisted `state.json` and continues the active loop/phase without clobbering the active position.
- Observed: The Gobbi entry path detects an existing `settings.json`, then still hands off to the first productive step, Ideation. Configuration row 4 stamps `state.json` with Configuration `Done` and Ideation `Active`, while the same orchestration doc says `state.json` is the recovery source after resume, clear, and compact.
- Evidence: `.agents/skills/gobbi/SKILL.md:72-80` says existing settings means resume/clear/compact; `.agents/skills/gobbi/SKILL.md:102-104` enters Ideation as the first productive step. `.agents/skills/orchestration/SKILL.md:104-108` says the mode docs run after Configuration; `.agents/skills/orchestration/SKILL.md:237-247` stamps Ideation active. The state-persistence section says `state.json` recovers position after resume/clear/compact.
- False-positive check: not a duplicate of prior D7-R8. That earlier item concerns operator visibility; this finding concerns state overwrite on resume.
- Proposed remediation: Split fresh initialization from resume rehydration. On resume, read `state.json`, validate it, render the active state, and continue from that state without re-running row 4's Ideation-active stamp.
- Verification: A future dry-run starts from a session whose `state.json` marks Planning or Execution active, resumes it, and proves no Configuration path rewrites it to Ideation.
- Second-pass: validated by Godel (`019f1f2d-20a4-71f0-a5e5-0ef5512dd3dc`). Severity remains High.

### GEN-D7-002: Codex missing rollout path is both allowed and treated as Critical
- Type: design_flaw
- Domain: process
- Severity: High
- Confidence: 100
- Priority: high
- Disposition: open
- Runner: codex
- Dimension: D7
- Owner-surface: workflow
- Location: `.agents/skills/codex/SKILL.md:50`; `.agents/skills/gobbi/SKILL.md:55`; `.agents/skills/record/SKILL.md:181`
- Expected: Codex sessions with unavailable rollout metadata degrade cleanly and remain operable, with a visible warning and a lower-severity audit limitation.
- Observed: The Codex runtime docs permit `session.json.transcriptPath` to be `null` when rollout lookup fails. RECORD then treats an absent `session.json.transcriptPath` as a Critical `general` finding with Domain `unevaluable` every time transcript copy runs.
- Evidence: `.agents/skills/codex/SKILL.md:50-59` allows a null transcript path; `.agents/skills/gobbi/SKILL.md:55-62` says lookup failure should not block the workflow; `.agents/skills/record/SKILL.md:181-193` records a Critical unevaluable finding if the path is absent.
- False-positive check: not a generic transcript concern. This is the native Codex degraded-metadata contract colliding with the runtime-neutral RECORD rule.
- Proposed remediation: Add a Codex-aware degraded transcript state: expected-missing rollout metadata should warn and mark audit coverage degraded; unexpected missing paths in runtimes that guarantee transcripts can remain Critical.
- Verification: A future Codex session with `CODEX_THREAD_ID` and no rollout row completes RECORD without a Critical finding, while a Claude session missing `CLAUDE_TRANSCRIPT_PATH` still fails loudly.
- Second-pass: validated by Godel (`019f1f2d-20a4-71f0-a5e5-0ef5512dd3dc`). Severity remains High.

### GEN-D7-003: Agent metadata collapses actionable statuses into `ok|failed`
- Type: checklist_gap
- Domain: observability
- Severity: Medium
- Confidence: 100
- Priority: medium
- Disposition: open
- Runner: codex
- Dimension: D7
- Owner-surface: template
- Location: `.agents/skills/delegation/SKILL.md:192`; `.agents/skills/orchestration/SKILL.md:353`; `.agents/skills/orchestration/templates/session.template.json:29`
- Expected: Durable per-agent metadata preserves the actual terminal status and any blocker or pending user-question state needed by the manager and future operators.
- Observed: Delegation defines actionable statuses `DONE`, `DONE_WITH_CONCERNS`, `NEEDS_CONTEXT`, and `BLOCKED`, but the session metadata lifecycle status has only `ok|failed`.
- Evidence: `.agents/skills/delegation/SKILL.md:192-199` and `:267-286` define the four-status dispatch contract. `.agents/skills/orchestration/SKILL.md:353` and `.agents/skills/orchestration/templates/session.template.json:29-55` model agent metadata with a collapsed status.
- False-positive check: none. The display can show active state, but the durable agent record loses the distinction between concerns, context needs, and hard blocks.
- Proposed remediation: Extend `agents[]` records with the delegation status enum, a lifecycle field if needed, and optional `needs_context` / `blocker` data.
- Verification: A synthetic `NEEDS_CONTEXT` subagent result persists as `NEEDS_CONTEXT` in `session.json`, not as `failed` or omitted data.

### GEN-D7-004: Chat task-record path is outside the canonical session tree and scaffold
- Type: design_flaw
- Domain: docs-sync
- Severity: Medium
- Confidence: 100
- Priority: medium
- Disposition: open
- Runner: codex
- Dimension: D7
- Owner-surface: workflow
- Location: `.agents/skills/orchestration/chat-mode.md:216`; `.agents/skills/orchestration/chat-mode.md:343`; `.agents/skills/record/record-map.md:15`; `.agents/skills/record/scripts/init-record-map.sh:76`
- Expected: Any path backing Chat status, review gates, or Wrap-up mining is part of the canonical session map and created by initialization or scaffold scripts.
- Observed: Chat requires `sessions/{date}-{session-id}/chat/tasks/{NN}-{slug}/task-record.md`, but the record map, initialization script, and scaffold scripts do not create or name that path.
- Evidence: Chat mode references the path at `chat-mode.md:216`, `:343-367`, and `:422-428`. The record map and initialization logic cover the fixed `1-ideation` through `5-wrap-up` loop tree, not a `chat/tasks` subtree.
- False-positive check: none. This is not a preference for one layout; the path is consumed by status/review flow but is not in the tree contract.
- Proposed remediation: Either add the Chat task-record tree to `record-map.md`, initialization, and scaffold validation, or move task records under the existing canonical loop/task tree.
- Verification: `init-record-map.sh <session-root> chat` creates the task-record parent path or the Chat docs stop referencing it.

### GEN-D7-005: Chat status renderer references missing `currentIndex` and non-canonical `InProgress`
- Type: checklist_gap
- Domain: docs-sync
- Severity: Medium
- Confidence: 100
- Priority: medium
- Disposition: open
- Runner: codex
- Dimension: D7
- Owner-surface: workflow
- Location: `.agents/skills/orchestration/chat-mode.md:467`; `.agents/skills/orchestration/chat-mode.md:511`; `.agents/skills/orchestration/SKILL.md:245`; `.agents/skills/orchestration/templates/state.template.json:11`
- Expected: Chat status examples and render rules reference fields and enums that exist in `state.json` / `session.json`.
- Observed: Chat status rendering uses `state.workflow.chat.currentIndex` and status `InProgress`, but templates and field references do not define `currentIndex`, and canonical state values use `Active` for active work.
- Evidence: `.agents/skills/orchestration/chat-mode.md:467-469` and `:511-529` reference these names. `.agents/skills/orchestration/SKILL.md:245-247`, `:352`, `templates/state.template.json:11`, and `templates/session.template.json:27` do not define the same field/enum pair.
- False-positive check: none. The task array exists, but the index and enum names used by the renderer drift from the persisted schema.
- Proposed remediation: Add `currentIndex` and the exact enum to the schema/templates, or rewrite the renderer to derive the active task from existing canonical fields.
- Verification: A JSON schema or fixture for Chat mode validates the status-render example with no undefined fields or enum drift.
