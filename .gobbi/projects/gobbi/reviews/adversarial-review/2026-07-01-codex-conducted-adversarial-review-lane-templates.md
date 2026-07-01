---
name: codex-conducted-adversarial-review-lane-templates
description: Lane D review for D4 templates and schema usability
type: reviews
scope: project
feature: null
status: active
created: 2026-07-01
session: 019f1ef9-a676-7f12-8d78-922f12cb64e9
tags: [evaluation, docs-sync, design]
keywords: [d4, templates, schemas, memory, record, codex-conducted]
author: codex
review_kind: adversarial-review
subject: "Gobbi general surface — D4 templates and schema usability"
verdict: needs-attention
---

# Lane D — D4 Templates And Schema Usability

This lane reviews templates, schema docs, writer/reader ownership, and validation expectations.

## Method

Lane D reviewed memory templates, session templates, settings/state/session schemas, review
formats, generated scaffolds, and delegation templates for writer/reader ownership, required
fields, lifecycle timing, validation expectations, and wrong-write prevention.

Prior D2/D4 findings were checked for duplicates. This lane did not re-file already covered
items such as `session.template.json` missing `iterations[]`, mistake timing, exact
`skill-writing` frontmatter issues, Claude-only `AskUserQuestion` wording, or executor example
nonexistent skills.

Commands and checks used included:

- required load reads for AGENTS, evaluator role prompt, principles, mistake, evaluation,
  research, coding, memory, record, and this charter
- `find .gobbi/projects/gobbi/reviews/adversarial-review -maxdepth 1 -type f -name '2026-06-29-*.md' -print | sort`
- `rg -n "^author: claude" .agents/skills/memory/templates`
- `rg -n "validate.*session|session.*validate|validate.*state|state.*validate|session\\.template|state\\.template" .agents/skills scripts`
- `jq empty` on orchestration JSON templates
- targeted line reads of cited templates, memory rules, evaluation metadata, and validation scripts

## Findings

### GEN-D4-001: Memory templates stamp Claude as author even when Codex writes
- Type: design_flaw
- Domain: docs-sync
- Severity: Medium
- Confidence: 100
- Priority: high
- Disposition: open
- Runner: codex
- Dimension: D4
- Owner-surface: memory
- Location: `.agents/skills/memory/templates/decisions.md:38`
- Expected: Memory templates should make `author` runtime-derived, or visibly placeholdered, because memory rules allow `claude | codex | user` and define it as the runtime/system that authored the file.
- Observed: Concrete templates default to `author: claude`, while only the trailing comment mentions `codex`.
- Evidence: `.agents/skills/memory/rules.md:186` requires `author: claude | codex | user`; `.agents/skills/memory/rules.md:205` defines `author` as the runtime/system that authored the file. `rg -n "^author: claude" .agents/skills/memory/templates` returned concrete Claude defaults in every memory template, including `decisions.md`, `reviews.md`, `feature.md`, and both checklist blocks.
- False-positive check: none. The enum comment is present, but the copyable field value is still Claude, which is the part a writer will preserve under time pressure.
- Proposed remediation: Replace concrete `author: claude` defaults with a runtime placeholder or explicit auto-stamp instruction, and require Wrap-up/session promotion to fill it from the active runtime.
- Verification: `rg -n "^author: claude" .agents/skills/memory/templates` returns no copyable defaults except clearly labeled historical examples.

### GEN-D4-002: Codex delegation templates load canonical skill paths instead of Codex entrypoint paths
- Type: design_flaw
- Domain: process
- Severity: High
- Confidence: 100
- Priority: high
- Disposition: open
- Runner: codex
- Dimension: D4
- Owner-surface: template
- Location: `.agents/skills/delegation/templates/leader.md:31`
- Expected: Native Codex delegation prompts should direct fresh Codex specialists to load repo-local Codex skill paths under `.agents/skills/<skill>/SKILL.md`, matching the Gobbi Codex entrypoint contract.
- Observed: Shared delegation templates tell subagents to load `.gobbi/projects/<<project-name>>/skills/...` paths.
- Evidence: `.agents/skills/codex/SKILL.md:41` says native Codex loads Gobbi skills from `.agents/skills/<skill-name>/SKILL.md`; `.agents/skills/codex/SKILL.md:63` says Codex uses project custom agents from `.codex/agents`; `.agents/skills/codex/SKILL.md:70` says fresh Codex subagents need explicit load directives. Delegation templates hard-code canonical paths in leader, executor, assistant, and evaluator templates. Prior D2/D4 review did not contain this exact native-Codex template-path issue.
- False-positive check: none. The canonical paths exist, but the template violates the documented Codex entrypoint and bypasses the `.agents/skills` surface that the repo explicitly says Codex should load.
- Proposed remediation: Parameterize load-root by runtime, with native Codex prompts rendering `.agents/skills/...` paths and bridge/internal canonical prompts rendering `.gobbi/projects/...` only when intended.
- Verification: Render each native Codex delegation template and verify mandatory load directives contain `.agents/skills/principles/SKILL.md`, `.agents/skills/mistake/SKILL.md`, and phase/domain skills under `.agents/skills`.
- Second-pass: rejected as duplicate by Godel (`019f1f2d-20a4-71f0-a5e5-0ef5512dd3dc`). Source evidence is true, but aggregate counts this under `GEN-D2-002` only.

### GEN-D4-003: Producer templates hard-code Claude as producer and Codex as proposer
- Type: assumption_risk
- Domain: process
- Severity: High
- Confidence: 100
- Priority: high
- Disposition: open
- Runner: codex
- Dimension: D4
- Owner-surface: template
- Location: `.agents/skills/delegation/templates/executor.md:82`
- Expected: Delegation templates should distinguish Claude Code bridge dual-production from native Codex specialist execution, or use runtime placeholders for producer/proposer identity.
- Observed: Producer templates instruct the worker that they are the Claude producer and degraded output should be stamped `production_mode: claude-only`, even when the template is used to brief a native Codex role.
- Evidence: `.agents/skills/delegation/SKILL.md:152` states native Codex leader/executor/assistant dispatches are fresh specialist spawns with full load directives. `.agents/skills/delegation/SKILL.md:363` defines dual-production as Claude producer plus Codex proposer. Templates mirror that as concrete worker identity: leader says "You are the Claude producer"; executor does the same; assistant says Wrap-up Claude-producer and degraded Claude-only.
- False-positive check: none. This is not the prior finding about duplicated dual-system blocks in loop skills; this is the reusable delegation template surface that would mislabel a native Codex producer.
- Proposed remediation: Split or parameterize producer templates so native Codex workers are not told they are Claude, and reserve `production_mode: claude-only` for actual Claude-side degraded runs.
- Verification: Render leader/executor/assistant prompts for native Codex and confirm they do not contain "You are the Claude producer", "Wrap-up Claude producer", or `production_mode: claude-only` unless the runtime is actually Claude Code bridge mode.
- Second-pass: validated by Godel (`019f1f2d-20a4-71f0-a5e5-0ef5512dd3dc`). Severity remains High.

### GEN-D4-004: Durable review template drops required evaluation routing and idempotency fields
- Type: checklist_gap
- Domain: process
- Severity: Medium
- Confidence: 100
- Priority: high
- Disposition: open
- Runner: codex
- Dimension: D4
- Owner-surface: memory
- Location: `.agents/skills/memory/templates/reviews.md:59`
- Expected: Review-memory findings, especially evaluator-driven reviews, should preserve the evaluation finding metadata needed for RECORD routing and re-run idempotency.
- Observed: The durable `reviews.md` template says evaluator-driven reviews mirror evaluation metadata, but the actual finding block omits `Type`, `Domain`, `finding-id`, `Priority`, `Runner`, `Dimension`, `Owner-surface`, `False-positive check`, and other charter fields.
- Evidence: `.agents/skills/memory/templates/reviews.md:59-60` says evaluator-driven reviews mirror evaluation metadata. The mini-template at `.agents/skills/memory/templates/reviews.md:62-68` only lists Severity, Confidence, Description, Evidence, Proposed remediation, and Disposition. The evaluation contract requires Type values, deterministic Domain routing, stable `finding-id` idempotency, and Domain on findings. The July 1 charter requires fuller review fields.
- False-positive check: none. Narrative human reviews may be looser, but the template explicitly covers evaluator-driven reviews and should not discard their routing schema.
- Proposed remediation: Make `reviews.md` include or directly reference the complete evaluation/charter finding shape for evaluator-driven reviews, including `finding-id`, Type, Domain, Disposition, and false-positive checks.
- Verification: A staged review generated from an evaluator report can be round-tripped back into RECORD routing without inventing Type/Domain or losing stable IDs.

### GEN-D4-005: Root session/state/settings schemas have no validation guard
- Type: checklist_gap
- Domain: test
- Severity: Medium
- Confidence: 100
- Priority: medium
- Disposition: open
- Runner: codex
- Dimension: D4
- Owner-surface: template
- Location: `.agents/skills/record/scripts/verify-record-map.sh:12`
- Expected: The session root templates and their lifecycle-critical schemas should have a mechanical validation gate for required keys, allowed values, and cross-field invariants.
- Observed: Existing record-map verification intentionally excludes session-root JSON invariants, and no separate session/state/settings schema validator appears in the skill/script surface.
- Evidence: Configuration bootstraps the full record skeleton and stamps `state.json` and `session.json`; RECORD later requires `workflow.{loop}.iterations[]` upserts and checks `evaluation_dir`. But `verify-record-map.sh` says it never diffs root invariants including `session.json`, `state.json`, and `settings.json`. `rg -n "validate.*session|session.*validate|validate.*state|state.*validate|session\\.template|state\\.template" .agents/skills scripts` returned no session/state schema validator. `jq empty` passed for JSON templates, checking syntax only.
- False-positive check: none. This is distinct from already-filed `iterations[]` schema drift; the finding is the absence of a guard that would catch that class of drift.
- Proposed remediation: Add a schema/check script, or extend an existing guard, to validate session-root JSON templates and stamped instances for required keys, allowed enums, lifecycle fields, and Codex/Claude metadata expectations.
- Verification: The guard fails a fixture missing `workflow.<loop>.iterations[]`, a bad `state.workflow.*.state` enum, or invalid/misplaced Codex metadata, and passes corrected canonical templates.
