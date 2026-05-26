---
title: Execution intake notes — cross-cutting requirements for every task brief
status: accepted
feature: agents
related:
  - planning/artifacts/plan.md
  - preparation/staging/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md
  - preparation/staging/decisions/planning-brief-mistake-load-directives-for-t1.md
---

# Execution intake notes — cross-cutting requirements

Requirements the manager MUST include in every executor task brief when delegating into the Execution loop. These are not tasks — they are mandatory boilerplate.

## Edit-tool default for `.claude/skills/` workspace paths

Per `preparation/staging/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md` § Symlink-preservation edit contract:

- **Default**: Edit tool for every modification to `.claude/skills/...` workspace paths (symlinks resolving to canonical mirror).
- **Forbidden on workspace**: `sed -i`, `perl -i`, any in-place stream editor that re-creates the file and breaks the symlink.
- **Bulk rewrites**: target canonical mirror `.gobbi/projects/gobbi/skills/...` directly.
- **Post-edit verification gate**: `test -L .claude/skills/<path>`. If non-zero, symlink was broken.
- **Restore command (empirically verified 2026-05-24)**: `rm -f .claude/skills/<path> && ln -sfn ../../../.gobbi/projects/gobbi/skills/<path> .claude/skills/<path>`
- **Depth disclaimer**: `../../../` for `SKILL.md` directly under `.claude/skills/<topic>/`; `../../../../` for files one level deeper. Always verify against adjacent untouched symlink with `ls -la`.

## 3-mistake load directive for T1 task briefs (Tasks 01-06)

Per Preparation D-3 decision:

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
