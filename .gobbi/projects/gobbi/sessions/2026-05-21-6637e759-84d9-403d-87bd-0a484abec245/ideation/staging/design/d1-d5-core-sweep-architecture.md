---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
feature: repo-reset
topic: core-sweep-architecture
design-decisions: [D1, D2, D3, D4, D5]
---

# Core Sweep Architecture: Stage Shape, Verification Gates, Commit Model, Stubs, Survivor Set

## D1 — Stage Shape (Stages 0, A–G)

The sweep is decomposed into 8 stages:
- **Stage 0**: Pre-sweep safety (tag `pre-reset-2026-05-21` at `487fc35`, push to origin; worktree pre-flight checks)
- **Stage A**: Gitignore policy edits (`sessions/` un-ignore in both `.gitignore` and `.gobbi/.gitignore`)
- **Stage B**: In-place content edits (surgical CLAUDE.md 2-line excision, README stub rewrite)
- **Stage C**: Tracked-file deletion via `git rm -r` (packages/, plugins/, test/, .codex/, .agents/, .claude/project/gobbi/, root manifests, project memory placeholder content, session dirs E.1 batch)
- **Stage D**: Untracked-file deletion via `rm -rf` (node_modules/, untracked stragglers)
- **Stage E**: Session dir cleanup — E.1 (in-commit: legacy session dirs including c676684d) + E.2 (post-commit terminal: bare-UUID `6637e759-...` dir only after sweep commit verified)
- **Stage F**: Branch cleanup (4 branches: 2 via `git branch -d`, 2 via pre-authorized `git branch -D`)
- **Stage G**: PR open + atomic merge (`gh pr merge --match-head-commit "$HEAD_SHA"`) + local cleanup (M-2)

Critical ordering invariants (7):
1. Tag BEFORE any deletion
2. `git worktree remove` BEFORE `git branch -d/-D`
3. Stage E.2 (bare-UUID delete) only AFTER sweep commit exists on branch (non-circular gate)
4. Stage E.1 (legacy session dirs) in-commit; Stage E.2 terminal/FS-only
5. `git rm` for tracked files; `rm -rf` for untracked files; never conflate
6. HEAD_SHA capture BEFORE `gh pr merge`
7. `gh pr merge` atomic guard BEFORE local branch cleanup

## D2 — Verification Gate Enumeration (20 gates)

D2 enumerates all 20 post-sweep verification commands as a checksum against Success Criteria. Gates cover: symlink validity, session dir count, worktree count, gitignore state, tag existence, branch existence, commit history shape, placeholder README presence, and atomic-guard exit code. Commands use line-count semantics (`wc -l`) for stable counts, not occurrence-count (`grep -c`) where lines might collide. The `manager-mispec-grep-c-for-occurrence-count.md` mistake is cited at D2 #15 annotation.

## D3 — Commit Model: Sweep-Branch Commits vs. Develop Squash

All sweep content lives on a named sweep branch (e.g., `sweep/pre-rebuild-reset`). The branch accumulates multiple commits (sweep-branch commits 1-N) for bisectability. The final `gh pr merge --squash` produces exactly one commit on `develop`. Success Criterion #2 measures the post-merge develop state, not the sweep-branch state.

## D4 — Placeholder Stub Template

The 13 placeholdered project-memory subdirs each get a stub `README.md` using the inline template (not `rules/stub-redirect-format.md`, which covers supersession stubs not placeholder stubs):

```
# <dir-name>/

This directory is a placeholder. Content was wiped in the 2026-05-21 pre-rebuild sweep.
See session `2026-05-21-6637e759-84d9-403d-87bd-0a484abec245` for the swept content.
Rebuild session will populate this directory.
```

The `rules/stub-redirect-format.md` extension with "Variant C — placeholder stub" is a deferred follow-up (F-U-02).

## D5 — Survivor Set (Q-A)

Three `.gobbi/projects/gobbi/` subdirs keep ALL content:
- `agents/` — symlink target for `.claude/agents/*`
- `skills/` — symlink target for `.claude/skills/*`
- `rules/` — custom project rules referenced by redesigned skills

The current session dir `sessions/2026-05-21-6637e759-84d9-403d-87bd-0a484abec245/` also survives intact. All other content under `.gobbi/projects/gobbi/` is either placeholdered (content wiped, stub README) or deleted entirely (`adversarial-review/`).

## Related

- `ideation/artifacts/design-direction.md` § D1-D5
- `ideation/artifacts/scope-contract.md` § Success Criteria 1-14
- `ideation/rawdata/discussion-log.md` § Q-A, Q3
