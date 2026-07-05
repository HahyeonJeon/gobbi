---
name: verify-mirror-and-cross-tree-paths-from-live-tree
description: Verify mirror topology and cross-tree record paths from the live tree, never from a brief or a peer proposal
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [docs-sync, verification]
keywords: [mirror-topology, symlink, chat-mode, cross-tree-path, live-tree]
author: claude
priority: high
domain: docs-sync
---

# Verify mirror topology and cross-tree record paths from the live tree, not from a brief or a peer proposal

## What happened

Two independent things were assumed rather than verified from the live tree, and both were wrong:
(1) both the manager's leader brief AND the Codex proposal initially asserted that fixing a canonical
skill file requires re-syncing `.claude/skills/{skill}/*.md` copies — wrong; those are per-file
symlinks to the canonical file (verified by dereferencing the inode: identical across
`.claude`/`.agents`/canonical), so editing the canonical file auto-propagates with no re-sync step.
(2) the iter1 Ideation draft's D1-003 recommended (b) assumed Wrap-up's promotion inventory already
reached Chat's per-slice staging subtree — wrong; the live Chat slice layout
(`chat-mode.md:356-367`) places staging under `chat/tasks/{NN}-{slug}/{N}-{loop}/staging/`, which
`wrap-up/SKILL.md`'s inventory never enumerated, forcing an iter1 Critical FAIL.

## Why it happens

A brief or a peer's independent proposal is a convenient, cheap source of a topology/layout claim,
and when two independent sources agree (the manager's brief and the Codex proposal both said
"re-sync needed"), agreement itself feels like corroboration — but neither source had actually
inspected the live filesystem. The same failure mode recurred on a second, unrelated claim in the
same session (the Chat staging subtree), showing this is a pattern, not a one-off: an assumption
about how paths/mirrors/subtrees are wired is treated as settled because it appears in the
prompt/brief, rather than checked against the actual tree.

## Correct approach

Before asserting or acting on a mirror-topology or cross-tree-path claim, verify it directly from the
live tree in the current session: `test -L` / `ls -iL` / `find -L` to confirm symlink vs. real file
and dereferenced-inode identity; `Read`/`Glob` the actual directory layout a design depends on (e.g.,
the real Chat slice dirs, the real Wrap-up inventory glob list) rather than trusting a written
description of it. Do this even when a brief and a peer proposal already agree — agreement between
two unverified sources is not verification.

## How to detect

Any claim about (a) which files are real vs. symlinked/mirrored, or (b) where a cross-loop or
cross-mode record subtree actually lives on disk, that is sourced ONLY from a delegation brief, a
peer agent's proposal, or a prior session's notes — with no `test -L` / `find -L` / direct directory
read in the current turn. If two independent sources (a brief and a peer proposal) agree on a
topology claim but neither cites a live-tree check, treat the agreement as unverified, not
corroborated.

## Related

- [[d1-003-chat-staging-wrapup-inventory-extension-shipped]] — the design this mistake's second instance corrected
- [[manager-must-verify-scope-dependency-claims-before-user-gate]] — the sibling process mistake from the same recurrence
- [[find-misses-symlinked-mirror-dirs]] — a related mirror-verification trap
