---
artifact_type: change-summary
task: 01-materialize-package-and-sync-script
session: 2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1
status: DONE
created: 2026-05-30
---

# Task 01 — Materialize Package and Sync Script

## What was implemented

`scripts/sync-plugin-package.sh` — bash script that materializes the bounded gobbi Claude Code plugin package and provides a `--check` guard.

**Default mode (materialize):** Uses `rsync -a --no-links --delete` to copy real files from three canonical sources into `plugins/gobbi/{skills,agents,hooks}/`:
- 18 skill dirs from `.gobbi/projects/gobbi/skills/*` → `plugins/gobbi/skills/`
- 5 agent `.md` files (excludes `.toml` wrappers) → `plugins/gobbi/agents/`
- 2 hook scripts from `.claude/hooks/` → `plugins/gobbi/hooks/` (permissions preserved)

**`--check` mode:** Validates (a) allow-set membership at `plugins/gobbi/` top level — exactly `{.claude-plugin, skills, agents, hooks}` (tolerates `.claude-plugin` absent or present, rejects anything else), and (b) byte-identical content sync between canonical sources and package via `diff -rq` + md5sum.

## Key design choices

- `rsync --no-links` materializes symlink targets as real files — critical because canonical `.gobbi/.../skills/` is real files but `.claude/skills/` is a symlink mirror (mistake `skills-mirror-symlinks-not-copies.md` applied: copied from canonical, not `.claude/skills/`).
- `rsync --delete` makes sync idempotent: removing a canonical file removes it from the package on next run.
- ROOT resolved via `$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)` — works from any cwd, no `cd` dependency.
- Pure bash + rsync + standard POSIX tools (rsync is system-installed on this host).

## Verification results (all pass)

1. `bash -n scripts/sync-plugin-package.sh` → syntax-exit=0
2. After `bash scripts/sync-plugin-package.sh`:
   - `ls plugins/gobbi/skills/ | wc -l` → 18
   - skills list diff → empty (exact match)
   - `ls plugins/gobbi/agents/` → 5 `.md` files only
   - `.toml` count in package agents → 0
   - `find ... -type l | wc -l` → 0 (no symlinks)
   - `diff -r plugins/gobbi/skills .gobbi/projects/gobbi/skills` → empty (byte-identical)
   - 5 agent `.md` diffs → all clean
   - 2 hook diffs → both clean; both `+x`
3. `bash scripts/sync-plugin-package.sh --check` → check-exit=0
4. Tamper test: appended byte → check-exit=1; re-sync → check-exit=0
5. Allow-set test: `mkdir plugins/gobbi/STRAY` → stray-exit=1; `rmdir` → post-cleanup-exit=0
6. `.claude-plugin` tolerance: `mkdir plugins/gobbi/.claude-plugin` → check-exit=0 (tolerated)

## Files created

- `scripts/sync-plugin-package.sh` (+x)
- `plugins/gobbi/skills/` (18 dirs, real files)
- `plugins/gobbi/agents/` (5 `.md`, 0 `.toml`)
- `plugins/gobbi/hooks/` (2 `.sh`, both +x)

## Out-of-scope observations

None encountered.
