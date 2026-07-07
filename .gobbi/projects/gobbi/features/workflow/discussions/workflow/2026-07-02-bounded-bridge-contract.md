---
name: bounded-bridge-contract
description: User-approved scope and design decisions for the bounded Codex bridge contract.
type: discussions
scope: feature
feature: workflow
status: active
created: 2026-07-02
session: 019f1f53-6ae2-7853-953e-4ee246cbef0b
tags: [ideation, process]
keywords: [codex, delegation, bridge, prompt-file, scope]
author: codex
outcome: The user approved a bounded bridge-orchestration contract centered on codex/delegation.md and official stdin prompt-file handoff.
---

# Bounded Bridge Contract

## Context

The user asked to improve the Gobbi Codex skill by adding a `delegation.md` child doc. The root problem was that Claude wrapper agents were delivering underspecified prompts to Codex agents that cannot ask follow-up questions.

## Question

What scope and design should govern the Codex bridge work before Planning and Execution?

## Options considered

The session considered a narrow child-doc task, a broader orchestration redesign, and a bounded bridge-orchestration contract. It also considered whether `codex/delegation.md` should own only Codex prompt-file mechanics or duplicate broader Gobbi delegation rules.

## User decision

The user approved bounded bridge orchestration. The final scope is `gobbi / workflow / bounded-codex-bridge-orchestration-contract`.

The user also approved:

- `codex/delegation.md` owns the Codex prompt-file handoff contract.
- Limited local duplication is acceptable for wrapper prompt anatomy.
- Generic delegation remains owned by `delegation/SKILL.md`.
- Official stdin prompt-file handoff is the standard: `codex exec ... - < "$prompt_file"`.
- The final design package should proceed to WORK after deeper Codex reference research.
- Native Codex stand-ins may write the canonical `claude/` and `codex/` evaluation directories, with degraded-evaluation disclosure, because a true Claude Code evaluator was unavailable.

## Implication

Planning must implement the child doc, the direct Claude mirror exposure, parent routing updates, and the verification gates inside the locked scope. It must not change runtime code, settings schema, agent roster, plugin manifests, plugin package materialization, or the full dual-system architecture.

## Related

- `1-ideation/outputs/scope-contract.md`
- `1-ideation/outputs/design-package.md`
- `1-ideation/working/discussion-log.md`
