---
title: Workspace → project-mirror sync mechanism for `.claude/skills/` → `.gobbi/projects/gobbi/skills/`
status: superseded
superseded_by: "no superseding file; backlog is closed as moot per iter2 corrected lock"
project: gobbi
feature: null
task: null
anchor_session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
created: 2026-05-23
---

# Workspace-to-mirror sync mechanism

## Context

The Preparation iter1 Sub-step D round 2 user lock established workspace-canonical mirror policy (see `staging/decisions/mirror-propagation-policy-workspace-canonical.md`): `.claude/skills/` is canonical; `.gobbi/projects/gobbi/skills/` is the derived mirror.

**Empirical check (this Preparation loop, sync-mechanism scan):**

- `ls -la /playinganalytics/git/gobbi/.claude/scripts/` → directory absent (`No such file or directory`).
- `grep -rln -E "sync.*mirror|mirror.*sync" /playinganalytics/git/gobbi/.claude/ /playinganalytics/git/gobbi/.gobbi/` → no script or documented procedure found; only finds session-staging files that happen to contain the words.
- `.claude/settings.json` `hooks` block → contains only `SessionStart` → `session-start.sh`. No sync-triggering hook (no PostToolUse / PreToolUse / Stop hook running a sync script).
- `ls -la /playinganalytics/git/gobbi/.gobbi/projects/gobbi/skills/` → 17 real directories (not symlinks; `drwxrwxr-x` perms).

**Conclusion: no auto-sync mechanism exists.** The mirror is currently a frozen historical copy that drifts on every workspace edit unless an executor manually mirror-edits.

## Why deferred

- Not in Bundle B scope. Bundle B is T1 (worktree-first session architecture) + T3 (PostToolUse hook + reconstructor). Adding a sync mechanism is orthogonal infrastructure.
- The user lock established **policy** ("workspace canonical, mirror auto-syncs"), not **implementation timing**. The policy can be honored in the interim by executors via (a) or (b) below; the mechanism is the durable form.

## Interim discipline (until mechanism ships)

Every executor touching files under `.claude/skills/` during Bundle B (or any other session) must do one of:

- **(a) Manually mirror-edit** — when editing a workspace file, also edit the corresponding mirror file in the same task. Use sibling paths: `.claude/skills/{skill}/...` ↔ `.gobbi/projects/gobbi/skills/{skill}/...`. Verify both touched via `git diff`.
- **(b) Flag mirror drift as a known risk** — explicitly note in the task's verification report that the workspace was edited and the mirror was deliberately not synced this iteration. The drift accumulates as a known-debt entry.

Bundle B's recommended interim choice — **(a) manually mirror-edit** for T1's skill file edits — because T1's edits are core session-architecture rules and mirror drift would be load-bearing. Add this as a Planning task-brief requirement.

For other (non-T1) sessions less critical, (b) may be acceptable.

## When to pick up

- **Soonest practical opportunity after Bundle B ships.** Mirror drift is currently load-bearing (the user lock makes the mirror downstream-of-truth, but no mechanism enforces that — a stale mirror is silently wrong). Every session run that touches a workspace skill widens the drift gap.
- Could be piggy-backed onto a future Bundle (Bundle C / equivalent) as a small infrastructure improvement task alongside other adjacent work.

## Suggested approach

Three implementation options ordered by simplicity:

### Option 1 — `gobbi sync` CLI subcommand + git pre-commit hook

- New CLI subcommand `gobbi sync` (or `gobbi mirror sync`) that rsync's `.claude/skills/` → `.gobbi/projects/gobbi/skills/` with `--delete --exclude=...`.
- Git pre-commit hook calls `gobbi sync` so any commit touching workspace skills automatically syncs the mirror.
- Pros: explicit, testable, auditable. CLI is the canonical entry point.
- Cons: requires CLI work; pre-commit hook is opt-in (developer must install `.git/hooks/pre-commit`).
- Effort: medium — small CLI command + docs + sample pre-commit hook.

### Option 2 — Symlink-based mirror

- Replace every directory under `.gobbi/projects/gobbi/skills/` with a symlink to the corresponding `.claude/skills/` directory.
- Pros: zero-runtime cost; impossible to drift.
- Cons: symlinks in git are sometimes fragile cross-OS (Windows, certain CI runners); requires one-time refactor of the mirror tree; loader behavior in `.gobbi/projects/gobbi/skills/` consumers needs to tolerate symlinks (verify before adopting).
- Effort: low (one-time refactor) but with cross-platform validation risk.

### Option 3 — `PostToolUse` hook on `Edit`/`Write` filtered by path

- `.claude/settings.json` adds a `PostToolUse` hook on `Edit` / `Write` that runs a sync script when the file path matches `.claude/skills/*`.
- Pros: zero developer ceremony; automatic.
- Cons: more complex to debug; hook latency on every edit; doesn't catch non-Claude-Code edits (manual vim, scripts, etc.).
- Effort: low-medium — script + settings entry; relies on `gobbi-hook-authoring` skill (which is deferred to its own backlog).

Recommended starting point: **Option 1** (`gobbi sync` CLI + optional pre-commit hook). Most maintainable and aligns with the existing CLI surface.

Effort estimate: **medium** (script + hook integration + docs + smoke test). Single focused session.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/`

Pointer: Preparation iter1 Sub-step D round 2 user lock on mirror policy. Empirical sync-mechanism scan during Preparation WORK phase found no existing mechanism, triggering this conditional backlog.

---

## Moot reason

**Closed as moot 2026-05-24 (iter2 corrected lock). No superseding file — backlog is not pursued.**

The premise of this backlog ("no auto-sync mechanism currently exists; until one ships, executors must manually mirror-edit") was based on the iter1 directory-level scan that missed the file-level symlink layer. Iter2 empirical re-verification:

```
$ find .claude/skills/ -type l -name "*.md" | wc -l
53

$ ls -la .claude/skills/orchestration/SKILL.md
lrwxrwxrwx ... orchestration/SKILL.md -> ../../../.gobbi/projects/gobbi/skills/orchestration/SKILL.md
```

The "sync mechanism" already exists, in the form of **53 file-level symlinks** that point workspace `.md` files into the canonical project mirror. Editing either path edits the same physical file; drift is impossible by construction.

Per the iter2 user lock (`mirror-propagation-policy-mirror-canonical-symlinks.md`): "**mirror canonical, workspace = symlink runtime layer; no sync needed.**" The symlink layer IS the sync mechanism.

This backlog is therefore **moot**:
- No new mechanism to build.
- No interim discipline ((a) manual mirror-edit / (b) flag drift) needed — both paths are the same file.
- The three "Suggested approach" options above are obsolete.

The file is preserved (not deleted) per `mistake/SKILL.md` supersede-never-delete discipline. The body is left verbatim as the iter1 record for audit.
