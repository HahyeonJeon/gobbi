---
name: codex-bridge-prompt-contract
description: Session journal for the bounded Codex bridge prompt-file contract work.
type: notes
scope: project
feature: null
status: active
created: 2026-07-03
session: 019f1f53-6ae2-7853-953e-4ee246cbef0b
tags: [codex, docs-sync, verification]
keywords: [delegation, prompt-file, claude-wrapper, workflow]
author: codex
features_touched: [workflow]
steps_completed: [ideation, preparation, planning, execution, wrap-up]
shipped: [codex-bridge-prompt-file-contract, codex-delegation-prompt-contract, task-01-codex-bridge-contract, task-02-claude-child-doc-exposure, task-03-parent-routing-docs]
---

# Codex Bridge Prompt Contract

## What happened

The session defined and shipped a bounded Claude-wrapper-to-Codex prompt-file contract. Ideation narrowed the work to a child doc under the Codex skill, with direct Claude mirror exposure and narrow parent routing. Preparation repaired workflow drift after early source edits and Planning decomposed the work into three execution tasks.

Execution shipped three commits: the canonical `codex/delegation.md` child doc, the `.claude/skills/codex/delegation.md` mirror symlink, and parent routing updates in `codex/SKILL.md`, `delegation/SKILL.md`, `workflow/production.md`, and `workflow/evaluation.md`.

## What shipped

- `archive/design/codex/2026-07-20-codex-bridge-prompt-file-contract.md`
- `archive/plans/workflow/2026-07-20-codex-delegation-prompt-contract.md`
- `features/workflow/changelogs/codex/2026-07-03-task-01-codex-bridge-contract.md`
- `features/workflow/changelogs/codex/2026-07-03-task-02-claude-child-doc-exposure.md`
- `features/workflow/changelogs/codex/2026-07-03-task-03-parent-routing-docs.md`
- `mistakes/verification/backticks-in-shell-patterns-trigger-command-substitution.md`
- `mistakes/verification/regex-header-check-false-missing.md`
- `mistakes/tooling/tempfile-move-after-jq-error.md`
- `mistakes/verification/zsh-special-variable-names-break-shell-checks.md`
- `mistakes/assumption/source-edits-before-planning-readiness.md`
- `mistakes/verification/rg-l-is-not-files-without-match.md`

## What got stuck

Planning evaluation was skipped by explicit user approval after repeated evaluator and stdout-proxy failures. During Execution, the user removed Claude-side evaluation for the session, so Execution used Codex-only evaluation artifacts.

## What shifted

The session corrected its own workflow order. Source edits started before Preparation and Planning, then the session stopped, ran the missing workflow gates, and treated the existing edits as WIP evidence rather than finished work.

The command contract also shifted from undocumented `@prompt-file` examples to official stdin prompt-file transport: `codex exec ... - < "$prompt_file"`.

## Decisions to respect

- `codex/delegation.md` is the detailed Claude-wrapper-to-Codex prompt-file contract owner.
- `codex/SKILL.md` owns runtime selection, entry points, invocation posture, and high-level use cases.
- `delegation/SKILL.md` owns general subagent delegation and producer brief shape, not Codex prompt-file transport.
- Full dual-system production/evaluation architecture redesign remains deferred in `archive/backlogs/codex/2026-07-20-dual-system-architecture-redesign.md`.

## Next session

Start from the shipped docs and avoid re-opening the bounded contract unless new Codex CLI behavior invalidates the stdin prompt-file transport.

## Related

- [[codex-bridge-prompt-file-contract]] - design shipped this session.
- [[codex-delegation-prompt-contract]] - plan shipped this session.
- [[dual-system-architecture-redesign]] - deferred broader architecture work.
