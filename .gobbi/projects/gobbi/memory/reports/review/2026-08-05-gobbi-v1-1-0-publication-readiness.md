# Gobbi v1.1.0 publication readiness

This review covers the completed local cleanup on branch
`codex-2026-08-05-gobbi-v1-1-0-b7877072-b969-4276-95c6-06a4ffb36060`, from base
`4e64aeff4f3154f11744d8c4eaff3b8c770f93b2` through accepted head
`986f17f2baa414daff362e417b386daf6119e698`.

## Result

**PASS for local publication readiness.** The runtime entry documents, canonical skills, generated package,
release metadata, and project-level checks agree at the accepted head.

## Accepted changes

- `.codex/AGENTS.md` and `.claude/CLAUDE.md` contain generated Principles sections sourced from
  `.gobbi/projects/gobbi/skills/principles/SKILL.md`.
- Gobbi, Cowork, and Workflow define immediate complete native TODO templates with stable titles; decision
  fields remain in evidence, assignments, checkpoints, and paths.
- `scripts/` contains only project-level checks and synchronization operations. The five skill-specific
  checker/test scripts and their active references are gone.
- The materialized plugin skills and agents are byte-equal to their canonical owners.

## Verification

- Runtime-entry synchronization passed.
- Package topology validation passed.
- All 127 package synchronization fixtures passed.
- Codex installed-cache smoke validation passed.
- Markdown validation passed for 914 relative paths and 67 anchors across 246 files.
- Plugin manifests, marketplace metadata, and changelog report version `1.1.0`.
- The isolated worktree and main checkout are clean.

## Limits and next action

No independent evaluation call was made, so this is self-verification rather than an independent PASS
verdict. The original session publication intent was local retention. Push, tag, pull request, merge, and
cleanup were not performed; the exact remote/ref action requires current user selection.
