---
name: mirror-topology-needs-inode-not-md5
description: md5 content-identity does not distinguish a symlinked-mirror from an independent physical copy — use inode + an edit-propagation test to decide whether a co-touch is needed.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-06
session: fe6cbcd3-5e63-46fb-a62e-93308b687d1f
tags: [verification]
keywords: [mirror-sync, symlink, inode, md5, edit-propagation, co-touch, plugins]
author: claude
priority: high
domain: verification
supersedes: null
superseded_by: null
---

# md5 identity is not file identity — inode + propagation test decides co-touch

## What happened
While scoping a mirror-wide doc fix, I ran `md5sum` across the canonical file and its
`.agents/` and `plugins/gobbi/` mirror paths, saw identical hashes, and concluded they
were "physical copies" that must each be co-edited separately. The Codex proposer instead
claimed all mirror paths resolve to the same canonical files. I resolved the
disagreement with evidence: `ls -i` (inode) showed all three template paths share ONE
inode, and an edit-propagation test (append a probe to canonical, re-hash the mirror
views, revert) showed the canonical edit changed every mirror view. The truth:
`.agents/skills/delegation` and `plugins/gobbi/skills` are DIRECTORY symlinks to
canonical, so editing canonical ONCE updates every alias — no separate co-touch. My
"physical copies" claim was wrong and would have prescribed unnecessary (and potentially
divergent) N-way edits.

## Why it happens
`md5sum` proves CONTENT identity, not FILE identity. Two independent copies and one
file reached via a symlink are byte-identical, so md5 cannot tell them apart. gobbi's
runtime mirrors (`.claude`, `.agents`, `.codex`, `plugins/gobbi`) are wired with a MIX of
file symlinks and directory symlinks into `.gobbi/projects/gobbi/{skills,agents}/`, so a
content-only check reads "identical" and invites the wrong "physical copy" conclusion.

## Correct approach
To decide whether a mirror needs a separate co-touch, use FILE-identity evidence, not
content identity: (1) `ls -i` / `stat -c %i` to compare inodes; (2) `readlink` / `readlink
-f` on the file AND each intermediate path segment to find directory symlinks; (3) a
one-shot edit-propagation test (append a probe to canonical, re-check the mirror view,
revert) when still unsure. If inodes match or a segment is a symlink, editing canonical
once suffices — verify aliases with a symlink-following scan (`rg --follow` / `find -L`).
Only genuinely distinct inodes are physical copies needing co-touch.

## How to detect
The task is a mirror-wide edit and you are about to conclude "physical copies, edit each"
based on md5 / byte-identity alone. Red flag: no inode comparison and no `readlink` on the
intermediate path segments. Trigger phrase to catch: "md5-identical, so they are separate
copies."

## Related

- [[verify-mirror-and-cross-tree-paths-from-live-tree]] — verify mirror/cross-tree paths from the live tree
- [[find-misses-symlinked-mirror-dirs]] — symlink-blind scans miss mirror content (the verification companion)
