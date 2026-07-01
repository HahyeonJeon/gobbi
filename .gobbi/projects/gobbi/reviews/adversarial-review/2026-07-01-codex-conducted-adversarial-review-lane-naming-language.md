---
name: codex-conducted-adversarial-review-lane-naming-language
description: Lane E review for D5 naming, vocabulary, and word-choice clarity
type: reviews
scope: project
feature: null
status: active
created: 2026-07-01
session: 019f1ef9-a676-7f12-8d78-922f12cb64e9
tags: [evaluation, docs-sync, design]
keywords: [d5, naming, vocabulary, wording, clarity, codex-conducted]
author: codex
review_kind: adversarial-review
subject: "Gobbi general surface — D5 naming, vocabulary, and word-choice clarity"
verdict: needs-attention
---

# Lane E — D5 Naming, Vocabulary, And Word-Choice Clarity

This lane reviews operational naming and wording that can cause users or agents to misread instructions.

## Method

Lane E reviewed operational naming and wording: schema names, state labels, task identity
terms, retired vocabulary, and terms that can make users or agents misread instructions.

Commands and checks used included:

- required load reads for AGENTS, evaluator role prompt, principles, mistake, evaluation,
  research, coding, and this charter
- `rg --files .gobbi/projects/gobbi/reviews/adversarial-review`
- targeted dedupe search for `wrapUp`, `taskRecord: written`, `workflow.execution.tasks`,
  `task-id`, `Rawdata draft`, `two producers`, and lower-case verdict enum variants
- targeted `nl -ba` reads of chat mode, orchestration field references, execution RECORD,
  record procedure, state/session templates, production workflow, gobbi glossary, delegation,
  evaluator prompt, and prior review files

## Findings

### GEN-D5-001: Chat task boundary names schema fields as pseudo-states
- Type: design_flaw
- Domain: process
- Severity: Medium
- Confidence: 100
- Priority: medium
- Disposition: open
- Runner: codex
- Dimension: D5
- Owner-surface: workflow
- Location: `.agents/skills/orchestration/chat-mode.md:526-529`; `.agents/skills/orchestration/SKILL.md:246,352`; `.agents/skills/orchestration/templates/state.template.json:10`; `.agents/skills/orchestration/templates/session.template.json:26`
- Expected: State-transition labels should use canonical schema keys and shapes: workflow step key `wrap-up`, and chat task metadata `taskRecord: { path, writtenAt }`.
- Observed: Chat mode uses `taskRecord: written` as a transition state and sends "Wrap up the session" to `wrapUp.state: InProgress`, while the canonical workflow key is `wrap-up` and `taskRecord` is an object, not a state/string.
- Evidence: `chat-mode.md:526-529` has `taskRecord: written` and `wrapUp.state: InProgress`; `orchestration/SKILL.md:246` says workflow keys include `wrap-up`; `orchestration/SKILL.md:352` defines `taskRecord: { path, writtenAt }`; templates seed `"wrap-up"` at `state.template.json:10` and `session.template.json:26`.
- False-positive check: new-variant. Prior D4-008 covers neighboring invalid state tokens such as `InProgress`, `MEMO`, and `WRAPUP`, but not the camelCase key or `taskRecord` payload-shape mismatch.
- Proposed remediation: Replace pseudo-state labels with canonical state/metadata wording, e.g. "current task's `taskRecord.path`/`writtenAt` present" and `workflow["wrap-up"].state`.
- Verification: `rg -n 'wrapUp|taskRecord: written' .agents/skills/orchestration` returns no active procedure hits, and chat task examples still show a recoverable task-record path.

### GEN-D5-002: Execution RECORD invents `{task-id}` and `workflow.execution.tasks`
- Type: design_flaw
- Domain: process
- Severity: Medium
- Confidence: 100
- Priority: medium
- Disposition: open
- Runner: codex
- Dimension: D5
- Owner-surface: skill
- Location: `.agents/skills/execution/SKILL.md:222,231,236,242,251,263`; `.agents/skills/orchestration/SKILL.md:351`; `.agents/skills/record/SKILL.md:192,214`
- Expected: Execution task telemetry should use canonical `taskNo` + `slug` identity and write per-task value telemetry under `workflow.execution.integration.tasks[]`.
- Observed: The execution RECORD section repeatedly names `{task-id}` and writes/checks `workflow.execution.iterations[]` keyed by `{task-id, iter}` plus `workflow.execution.tasks[{task-id}]`, neither of which is the canonical per-task telemetry shape.
- Evidence: `execution/SKILL.md:222` says `workflow.execution.iterations[]` keyed by `{task-id, iter}`; `:236` says `workflow.execution.tasks[{task-id}].finishedAt`; `:251` checks `session.json.workflow.execution.tasks[{task-id}]`; `:263` defines `{task-id}`. By contrast, `orchestration/SKILL.md:351` and `record/SKILL.md:192,214` define execution per-task telemetry as `{ taskNo, slug, iter, ...counts }` in `workflow.execution.integration.tasks[]`.
- False-positive check: none. Prior D4/D5 dedupe search for `task-id|workflow.execution.tasks|taskNo` did not surface a prior finding with this claim.
- Proposed remediation: Use one task identity vocabulary in Execution RECORD: `taskNo` + `slug` for telemetry, and only documented `workflow.execution.integration.tasks[]` for the per-task array unless a separate task-status array is formally added.
- Verification: `rg -n 'task-id|workflow\\.execution\\.tasks' .agents/skills/execution/SKILL.md` has no hits, and `rg -n 'workflow\\.execution\\.integration\\.tasks|taskNo' .agents/skills/execution/SKILL.md` shows the corrected path.

### GEN-D5-003: `workflow.{step}.verdict` enum is lower-case and includes `skipped`
- Type: design_flaw
- Domain: process
- Severity: Medium
- Confidence: 100
- Priority: medium
- Disposition: open
- Runner: codex
- Dimension: D5
- Owner-surface: workflow
- Location: `.agents/skills/orchestration/SKILL.md:118,141,148,350`; `.agents/skills/record/SKILL.md:197`
- Expected: Verdict vocabulary should be stable: when a verdict exists it is `PASS` / `REVISE` / `FAIL`; skipped is a state/no-verdict condition, not a verdict value.
- Observed: The workflow metadata field reference defines `workflow.{step}.verdict` as lower-case `pass | fail | skipped`, while the glossary, status display, and RECORD write path use uppercase verdicts and state that skipped leaves the Verdict column as `—`.
- Evidence: `gobbi/SKILL.md:118` defines Verdict as `PASS / REVISE / FAIL`; `orchestration/SKILL.md:141` says skipped keeps Verdict `—`; `orchestration/SKILL.md:148` says Verdict displays `PASS / REVISE / FAIL`; `orchestration/SKILL.md:350` says `verdict` is `pass | fail | skipped`; `record/SKILL.md:197` sets `workflow.{loop}.verdict: PASS`.
- False-positive check: new. Prior D4-010 covers Ideation omitting `FAIL`, but not lower-case session metadata or `skipped` being named as a verdict.
- Proposed remediation: Align the field reference to the canonical enum and specify skipped as `state: "Skipped"` with `verdict: null` or absent.
- Verification: `rg -n '\`pass\` \\| \`fail\` \\| \`skipped\`|verdict.*skipped' .agents/skills/orchestration .agents/skills/record` returns no active schema-contract hits.

### GEN-D5-004: RECORD resurrects retired `Rawdata` wording for the canonical draft source
- Type: design_flaw
- Domain: docs-sync
- Severity: Medium
- Confidence: 100
- Priority: medium
- Disposition: open
- Runner: codex
- Dimension: D5
- Owner-surface: skill
- Location: `.agents/skills/record/SKILL.md:17,179,194`; `.agents/skills/orchestration/workflow/production.md:27,122`; `.gobbi/projects/gobbi/reviews/adversarial-review/2026-06-29-gobbi-adversarial-review-d2.md:680-682`
- Expected: The canonical work artifact source is `working/draft-iter{n}.md`; retired `rawdata` wording should not appear in active loop RECORD procedure.
- Observed: RECORD Step 5 names its source as "Rawdata draft," even though the same skill's input list and production workflow identify `working/draft-iter{n}.md`.
- Evidence: `record/SKILL.md:17` lists drafts at `working/draft-iter{n}.md`; `record/SKILL.md:179` names the current WORK output path as `working/draft-iter{n}.md`; `record/SKILL.md:194` says `Rawdata draft`; `production.md:27,122` confirm the canonical artifact lives at `working/draft-iter{n}.md`. Prior D2-038 explicitly says every loop renamed `rawdata` to `working` and treats residual `rawdata` as retired vocabulary.
- False-positive check: new-variant. Prior D2-038 covered `interview/SKILL.md`; it did not cover `record/SKILL.md:194`, and that prior review called interview the only residual carrier.
- Proposed remediation: Rename this source cell to "WORK draft" or the literal `working/draft-iter{n}.md`.
- Verification: `rg -n '\\brawdata\\b|Rawdata|raw data|raw-data' .agents/skills/record .agents/skills/orchestration` has zero hits outside historical/prior-review files.

### GEN-D5-005: Production calls the Codex proposer a "producer"
- Type: assumption_risk
- Domain: process
- Severity: Low
- Confidence: 75
- Priority: low
- Disposition: open
- Runner: codex
- Dimension: D5
- Owner-surface: workflow
- Location: `.agents/skills/orchestration/workflow/production.md:3,5,21,23,25,28`; `.agents/skills/gobbi/SKILL.md:122-123`; `.gobbi/projects/gobbi/agents/evaluator.md:25`; `.agents/skills/evaluation/SKILL.md:55-57`
- Expected: The actor that writes the canonical artifact should be called the producer; the Codex actor should consistently be called the proposer, because evaluator independence is defined around not evaluating one's own producer work and around Codex proposer/evaluator separation.
- Observed: `production.md` says the manager spawns "exactly two producers — the Claude producer and the Codex proposer" and has a "Spawning the Producers" table whose second row is `Codex proposer`. This makes `producer` mean both the canonical author/integrator and any independent generator.
- Evidence: `gobbi/SKILL.md:122` defines Proposer as the Codex generator that never writes the canonical artifact; `gobbi/SKILL.md:123` says dual-system production is a Claude producer and a Codex proposer; `production.md:5` says exactly two producers; `production.md:21-28` labels the section/table as producers while row 2 is `Codex proposer`; evaluator and evaluation docs distinguish producer work from proposer/evaluator separation.
- False-positive check: style preference avoided. The failure mode is not that "producer" sounds bad; it can make a Codex evaluator or manager over-apply producer/evaluator separation to the Codex proposal instead of the canonical artifact.
- Proposed remediation: Reserve `producer` for the canonical author/integrator; use "two generators" or "producer + proposer" for the pair.
- Verification: `rg -n 'two producers|Spawning the Producers|Producer \\| Who' .agents/skills/orchestration/workflow/production.md .agents/skills/delegation/SKILL.md` no longer labels the Codex proposer as a producer.

### GEN-D5-006: Chat display uses `task-record` and `taskRecord` for the same boundary object
- Type: design_flaw
- Domain: observability
- Severity: Low
- Confidence: 100
- Priority: low
- Disposition: open
- Runner: codex
- Dimension: D5
- Owner-surface: workflow
- Location: `.agents/skills/orchestration/chat-mode.md:497,526-529`; `.agents/skills/orchestration/SKILL.md:352`
- Expected: The visible label and schema field should make clear that the same thing is an artifact file plus a metadata object: `task-record.md` on disk and `taskRecord: { path, writtenAt }` in state/session JSON.
- Observed: The status table displays a row named `task-record`, but the transition table uses `taskRecord: written` as if it were a state. The schema then defines `taskRecord` as an object. That three-way wording invites an implementation to store a string flag or miss the `path`/`writtenAt` metadata Wrap-up needs.
- Evidence: `chat-mode.md:497` renders `task-record` with `{written|pending}`; `chat-mode.md:526-529` uses `taskRecord: written`; `orchestration/SKILL.md:352` defines `taskRecord: { path, writtenAt }`.
- False-positive check: new-variant. This overlaps the same chat-mode region as D4-008, but the prior defect was non-Glossary state tokens; this is a file-label/schema-field collision with a concrete metadata-loss path.
- Proposed remediation: Keep `task-record.md` for the file and `taskRecord.path` / `taskRecord.writtenAt` for metadata; avoid using either as a state label.
- Verification: The chat status example and transition table mention `taskRecord.path` or equivalent object fields, and no active procedure contains `taskRecord: written`.
