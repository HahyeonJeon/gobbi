---
name: codex-bridge-prompt-file-contract
description: Final design for the Claude wrapper to Codex prompt-file handoff contract.
type: design
scope: feature
feature: workflow
status: active
created: 2026-07-02
session: 019f1f53-6ae2-7853-953e-4ee246cbef0b
tags: [design, process]
keywords: [codex, delegation, prompt-file, wrapper, orchestration]
author: codex
supersedes: null
superseded_by: null
related: []
---

# Codex Bridge Prompt-File Contract

## Problem

Gobbi needs a canonical contract for Claude wrapper agents handing work to stateless `codex exec` jobs. Without it, Codex can receive weak one-way prompts, write to the wrong root, produce unusable output, or appear successful without contracted files.

## Scope

In scope: `codex/delegation.md`, prompt-file lifecycle, invocation shapes, wrapper responsibilities, proposer and evaluator prompt contracts, source-read-only semantics, budget guidance, failure behavior, parent routing, and mirror exposure.

Out of scope: runtime code, settings schema, agent roster, plugin manifest changes, plugin package materialization, and a full dual-system production/evaluation architecture redesign.

## Approach

Create `.gobbi/projects/gobbi/skills/codex/delegation.md` as the child-doc owner for Codex bridge mechanics. The doc uses official stdin prompt-file handoff, `--cd`, minimal `--add-dir`, least sandbox, explicit output paths, and file-truth verification. It separates sandbox-enforced source-read-only from prompt/diff-enforced source-read-only.

Parent docs route to the child doc instead of repeating command recipes. `.claude/skills/codex/delegation.md` must directly expose the child doc because Claude wrapper agents are consumers and `.claude/skills/codex/` is a real directory with per-file symlinks.

## Scenarios

- Proposer success: Codex writes a proposal at the contracted path with `PROPOSAL:`, and source state passes the selected source-read-only gate.
- Evaluator success: Codex writes exactly eight evaluator files with verdicts and required sections.
- Mirror exposure: `.claude/skills/codex/delegation.md` resolves to the canonical child doc.
- Timeout, empty, malformed, missing, or wrong-root output: wrapper reports `BLOCKED`.
- Source-write violation: proposer run is invalidated, source is restored before executor work, and the process concern is surfaced.
- Wrapper self-authoring: Claude-family wrapper output under a Codex label is invalid.
- Long-running job: wrapper sets a wall-clock cap, backgrounds only when needed, captures PID, and validates files.

## Validation

- Child doc has the required headings and owner boundary.
- `readlink -e .claude/skills/codex/delegation.md` resolves to the canonical child doc or an equally concrete direct exposure mechanism is documented and verified.
- `bash scripts/sync-plugin-package.sh --check` passes.
- Parent docs route bridge mechanics to `codex/delegation.md`.
- Stale-recipe checks are semantic or path-scoped and do not fail on legitimate `scenario_gap` or `checklist_gap` vocabulary.
- `git status --short -- .gobbi/projects/gobbi/skills .agents .claude .codex plugins` is reviewed after implementation.

## Trade-offs

The design accepts limited local duplication for command skeletons and prompt anatomy because wrapper authors need a self-contained contract. It avoids duplicating generic delegation, production, evaluation, plugin, settings, or roster rules.

## Open issues

The exact command shape for the strongest feasible source-read-only mode is left to Execution because it depends on the output shape selected for the child doc examples.

## Related

- `1-ideation/outputs/scope-contract.md`
- `1-ideation/outputs/design-package.md`
- `1-ideation/staging/backlogs/feature/dual-system-architecture-redesign.md`
