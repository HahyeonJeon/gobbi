---
name: claude-skills-mirror-is-symlink-not-copy
description: The .claude/skills mirror is git symlinks to canonical skills/, not byte-copies — edit the canonical file only, never the mirror path.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-25
session: 463a1c96-f75c-4a14-80b4-f4d6815679cd
tags: [docs-sync, links]
keywords: [claude-skills, symlink, mirror, parity-check, write-vs-edit]
author: claude
priority: high
domain: docs-sync
supersedes: null
superseded_by: null
related: null
---

# The `.claude/skills` mirror is symlinks, not byte-copies

## What happened

Three Ideation design iterations plus the first Planning draft all modeled
`.claude/skills/{skill}` as a byte-identical COPY of the canonical
`.gobbi/projects/gobbi/skills/{skill}` — prescribing "edit BOTH trees; verify
`diff -q` parity" on every skill change. The model was wrong, and the dual-system
EVALUATION caught it before it shipped.

## Why it happens

Tool-verified, the `.claude/skills/*` entries are git SYMLINKS, not copies:

- `git ls-files -s` reports mode `120000` (symlink), not `100644`.
- `readlink` resolves to `../../../.gobbi/projects/gobbi/skills/...` — the same inode
  as the canonical file.

Editing the canonical file updates the `.claude/` path automatically (it is the same
file). The "byte-copy" assumption produces three concrete defects:

1. "Edit both" is redundant — a second find-replace on the mirror fails (the change
   is already there).
2. A `diff -q canonical mirror` guard is VACUOUS — same inode means it can never
   fail — a guard that gives false assurance.
3. A full-file `Write` to a `.claude/` path converts the symlink to a regular file
   (mode `120000` → `100644`), BREAKING the mirror and causing the exact drift the
   model tried to prevent.

## Correct approach

Edit the CANONICAL `.gobbi/projects/gobbi/skills/...` path ONLY — the `.claude/`
symlink reflects it for free. Use `Edit` (in-place), never `Write` (full-replace),
and never target the `.claude/...` symlink path. Verification is: the canonical edit
landed AND the mirror symlink is still intact (`git ls-files -s` still mode
`120000`) — NOT a content `diff`.

## How to detect

Any plan or design that says "edit both the canonical and the `.claude/` mirror" or
"verify byte-identical parity between trees" is built on the wrong model. Before
assuming copies, check `git ls-files -s <mirror-path>` for mode `120000`.

## Related

- [[delegation-briefs-reference-nonexistent-rules-dir]] — another docs-sync trap from mis-modeling the runtime mirror layout
