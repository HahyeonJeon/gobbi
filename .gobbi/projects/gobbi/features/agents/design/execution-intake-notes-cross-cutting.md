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

Requirements the manager MUST include in every executor task brief when delegating into the Execution loop. These are not tasks — they are mandatory boilerplate.

## Edit-tool default for `.claude/skills/` workspace paths

Per the mirror-propagation symlink-preservation policy (session 1b26cf20 Preparation): edit-tool default for workspace symlink paths, `sed -i` forbidden on `.claude/` symlinks, bulk rewrites target canonical mirror directly:

- **Default**: Edit tool for every modification to `.claude/skills/...` workspace paths (symlinks resolving to canonical mirror).
- **Forbidden on workspace**: `sed -i`, `perl -i`, any in-place stream editor that re-creates the file and breaks the symlink.
- **Bulk rewrites**: target canonical mirror `.gobbi/projects/gobbi/skills/...` directly.
- **Post-edit verification gate**: `test -L .claude/skills/<path>`. If non-zero, symlink was broken.
- **Restore command (empirically verified 2026-05-24)**: `rm -f .claude/skills/<path> && ln -sfn ../../../.gobbi/projects/gobbi/skills/<path> .claude/skills/<path>`
- **Depth disclaimer**: `../../../` for `SKILL.md` directly under `.claude/skills/<topic>/`; `../../../../` for files one level deeper. Always verify against adjacent untouched symlink with `ls -la`.

## 3-mistake load directive for T1 task briefs (Tasks 01-06)

Per session 1b26cf20 Preparation decision: every T1 task brief (Tasks 01-06) must load these three mistakes:

```
.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md
.gobbi/projects/gobbi/mistakes/manager-rm-rf-without-investigating-tracked-files.md
.gobbi/projects/gobbi/mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md
```

## 1-mistake procedural extension for T3 task briefs (Tasks 07-10) — LOCK #3

```
.gobbi/projects/gobbi/mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md
```

## Branch naming convention

`chore/session-{date}-{ssid-short}` — manager creates at session bootstrap row 5.5 invocation. Executors do not create the branch.

## Per-iter commit subject

`chore(session): record <loop> iter{n} memory`

## AI-Provenance-Record trailer

Every commit emitted by Execution MUST carry:
```
AI-Provenance-Record: gobbi://session/{ssid}/task/{task-id}
```

Trailer placed at bottom of commit message body, blank-line separated from prose. `{ssid}` = full session ID; `{task-id}` = planning task ID (e.g., `01-orchestration-row-5-5-worktree-create`).

## bash -n / conditional shellcheck (Tasks 07+08)

- `bash -n <script>` is ALWAYS run as the syntax gate (bash is universally available).
- `shellcheck` is CONDITIONAL: run only if `command -v shellcheck` succeeds. If absent, note the omission in the commit body ("shellcheck not available in this workspace; CI re-gate when available").
