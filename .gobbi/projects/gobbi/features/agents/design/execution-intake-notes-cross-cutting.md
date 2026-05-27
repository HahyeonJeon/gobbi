---
name: execution-intake-notes-cross-cutting
description: Mandatory boilerplate every manager must include in every executor task brief — symlink-edit contract, mistake load directives, branch naming, commit trailers.
type: design
scope: feature
feature: agents
status: active
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [delegation, executor-brief, intake, cross-cutting]
related:
  - planning/artifacts/plan.md
---

# Execution intake notes — cross-cutting requirements

## Context

When a manager delegates work into the Execution loop, each executor task brief needs the same handful of cross-cutting requirements: how to edit symlinked workspace files without breaking the symlink, which mistakes to load, how to name the branch, and how to stamp commits. These are not per-task decisions — they are standing conventions that apply to every executor delegation. Without a single home for them, each manager re-derives the same boilerplate (and occasionally omits a load-bearing piece, such as the symlink-preservation contract or a required mistake-load directive), causing repeat failures the project has already paid for once.

## Decision

Every executor task brief MUST embed the following cross-cutting requirements as mandatory boilerplate. They are listed here once so the manager copies them into each brief rather than reinventing them.

### Edit-tool default for `.claude/skills/` workspace paths

The `.claude/skills/` workspace paths are symlinks resolving to the canonical mirror under `.gobbi/projects/gobbi/skills/`. To avoid breaking the symlink:

- **Default**: use the Edit tool for every modification to a `.claude/skills/...` workspace path.
- **Forbidden on workspace**: `sed -i`, `perl -i`, or any in-place stream editor that re-creates the file and replaces the symlink with a regular file.
- **Bulk rewrites**: target the canonical mirror `.gobbi/projects/gobbi/skills/...` directly rather than the workspace symlink.
- **Post-edit verification gate**: run `test -L .claude/skills/<path>`. A non-zero exit means the symlink was broken and must be restored.
- **Restore command** (empirically verified 2026-05-24): `rm -f .claude/skills/<path> && ln -sfn ../../../.gobbi/projects/gobbi/skills/<path> .claude/skills/<path>`.
- **Depth disclaimer**: use `../../../` for a `SKILL.md` directly under `.claude/skills/<topic>/`, and `../../../../` for files one level deeper. Always verify the relative depth against an adjacent untouched symlink with `ls -la`.

### Mistake load directives

Briefs that create or move session/worktree files must load the worktree-safety and verbatim-spec-recheck mistakes so the executor avoids the cwd-reset, rm-rf, and spec-drift traps the project has already hit:

```
.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md
.gobbi/projects/gobbi/mistakes/manager-rm-rf-without-investigating-tracked-files.md
.gobbi/projects/gobbi/mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md
```

Briefs for lighter procedural tasks (script edits, small additions) load at minimum the verbatim-spec-recheck mistake:

```
.gobbi/projects/gobbi/mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md
```

### Branch naming convention

The session branch is `chore/session-{date}-{ssid-short}`. The manager creates it at session bootstrap (the worktree-create config step); executors never create the branch — they commit onto the branch the manager already prepared.

### Per-iteration commit subject

`chore(session): record <loop> iter{n} memory`.

### AI-Provenance-Record trailer

Every commit emitted by Execution MUST carry the provenance trailer:

```
AI-Provenance-Record: gobbi://session/{ssid}/task/{task-id}
```

The trailer goes at the bottom of the commit message body, separated from the prose by a blank line. `{ssid}` is the full session ID; `{task-id}` is the planning task ID (for example, `01-orchestration-worktree-create`).

### Shell-script syntax gate

For tasks that author or modify shell scripts:

- `bash -n <script>` is ALWAYS run as the syntax gate (bash is universally available).
- `shellcheck` is CONDITIONAL: run it only if `command -v shellcheck` succeeds. When `shellcheck` is absent, note the omission in the commit body ("shellcheck not available in this workspace; CI re-gate when available").

## Rationale

These requirements are collected in one design doc because each one encodes a failure the project already paid for: the symlink-edit contract prevents `sed -i` from silently converting a symlink into a regular file; the mistake-load directives front-load the cwd-reset and spec-recheck traps so a fresh executor does not rediscover them; the branch and trailer conventions keep every commit attributable and on the correct branch. Centralizing them means the manager copies a known-good block instead of reconstructing it (and risking omission) per delegation.

## Alternatives considered

- **Leave the requirements implicit in each manager's judgment.** Rejected: implicit requirements are the exact failure mode that produced the symlink-break and wrong-branch-commit mistakes. A standing checklist is the cheaper insurance.
- **Encode each requirement as a runtime validator instead of brief boilerplate.** Deferred: a Load-Directives validator is tracked separately (see the validator-scope discussion); until it exists, the boilerplate is the enforcement surface.

## Consequences

- Every executor delegation prompt carries this block (or the relevant subset), so the manager's brief-construction step has a fixed source rather than per-session recall.
- When a new cross-cutting requirement is discovered, it is added here once and inherited by all future briefs.
- Adding a runtime validator later would let the manager reference this doc as the validator's rule source rather than re-specifying the rules.

## Source

Session 1b26cf20 Preparation — symlink-preservation policy and per-tier mistake-load directives established during the session-foundations-bundle-b planning. The restore command was empirically verified on 2026-05-24.
