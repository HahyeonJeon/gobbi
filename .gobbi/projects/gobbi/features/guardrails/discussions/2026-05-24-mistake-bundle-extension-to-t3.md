---
name: mistake-bundle-extension-to-t3
description: User decision — hook + reconstructor tasks use Iron Law 7 mistake only (not the full 3-mistake bundle used for setup tasks).
type: discussions
scope: feature
feature: guardrails
status: active
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [mistake-bundle, task-briefs, iron-law-7, planning-lock]
outcome: Iron Law 7 procedural mistake only for hook + reconstructor tasks (LOCK #3); the other 2 mistakes from the setup-task bundle are inapplicable
---

# Mistake bundle extension to hook + reconstructor tasks (Planning LOCK #3)

## Context

The guardrails Planning preparation mandated a 3-mistake bundle for all infrastructure setup task briefs. The leader asked whether the same bundle should extend to hook + reconstructor tasks (the group implementing the PostToolUse hook script, the reconstructor shell script, `.claude/settings.json` registration, and delegation skill structured-header conventions), or whether only the Iron Law 7 procedural mistake applies.

## Question

Should hook + reconstructor tasks receive the full 3-mistake setup-task bundle, or a narrower subset?

## Options considered

1. **Full 3-mistake bundle for hook + reconstructor tasks** — consistent with setup tasks; all three mistakes always loaded.
2. **Iron Law 7 mistake only for hook + reconstructor tasks** (recommended) — `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` applies; the other two (cwd routing, rm -rf safety) are inapplicable to these surfaces.

## User decision

Iron Law 7 procedural mistake only confirmed (Planning LOCK #3, narrowed from the leader's 3-mistake recommendation).

## Rationale

- `codex-eval-session-write-path-nested-in-worktree.md`: guards cwd routing for session writes. Hook + reconstructor tasks (hook script, reconstructor, settings.json, delegation headers) do not write to session paths. Inapplicable.
- `manager-rm-rf-without-investigating-tracked-files.md`: guards against destructive rm operations without investigation. Hook + reconstructor tasks do not remove files. Inapplicable.
- `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`: guards against paraphrasing "verbatim" spec content without re-reading. Hook + reconstructor tasks involve verbatim citation of hook stdin contract, structured-header regexes, and JSON schema field names. Directly applicable.

## Implication

Setup task briefs (infrastructure setup group): all three mistakes in their tier-4 load list. Hook + reconstructor task briefs: Iron Law 7 mistake only in tier-4. Per-task additions allowed on top of this baseline.

## Related

- Planning session 1b26cf20 agent assignment table — LOCK #3 rationale (provenance)
- `planning-brief-mistake-load-directives-for-t1.md` (the setup-task bundle this narrows)
