---
name: find-misses-symlinked-mirror-dirs
description: plain find/grep do not follow symlinked mirror dirs, producing a false "incomplete mirror" verification fact
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-29
session: 40b9a93e-5ec4-43d7-bd16-075b0c7fa303
tags: [verification, tooling]
keywords: [symlink, find-L, readlink, mirror-parity, false-absence, claude-skills, agents-skills]
author: claude
priority: high
domain: verification
supersedes: null
superseded_by: null
---

# Plain find/grep misses symlinked mirror dirs (false "incomplete mirror" fact)

## What happened
While verifying `.claude/skills/` ↔ `.agents/skills/` runtime-mirror parity during Ideation iter1,
a plain `find` / `grep` over the mirror dirs reported `.agents/skills` as missing its skill
subdirs, producing a FALSE "incomplete mirror" fact that was recorded as a finding. The
`.agents/skills` entries are whole-directory SYMLINKS; plain `find` / `grep -r` did not descend
into them, so they looked empty or absent. Re-checking with `find -L` / `readlink` showed the
truth: `.agents/skills` = 22 skill dirs (incl. `coding`) vs `.claude/skills` = 21 (no `coding`)
— the corrected fact (integration log row 13). The original false fact had to be retracted.

## Why it happens
`find` and `grep -r` do NOT traverse INTO symlinked directories by default — `find` needs `-L`
(or `-follow`) to dereference, and `grep` needs `-R` (capital) rather than `-r`. A mirror built
from directory symlinks therefore looks empty to a non-dereferencing scan, so an "absence" is
reported for files the symlink would supply. The scan silently under-reports instead of erroring,
so the false absence looks like a verified fact.

## Correct approach
When verifying a mirror / parity claim whose entries MAY be symlinks, use `find -L <dir>` (follow
symlinks) or resolve each entry with `readlink -f` / `test -e` before asserting absence; confirm
with `ls -l` (a `->` marks a symlink). Never claim a mirror is incomplete from a bare `find` /
`grep -r` that does not dereference. This is the symlink sibling of
`grep-absence-claim-needs-exact-pattern`: an absence claim needs the right TOOL (dereferencing),
not just the right pattern. Re-verify and retract any absence fact gathered with a non-dereferencing
scan.

## How to detect
You are about to claim a directory or mirror is "missing" / "incomplete" AND the directory may be
(or is) populated by symlinks — gobbi's `.agents/skills` and parts of `.claude/skills` are
symlinked. Trigger signals: an `ls -l` showing `->`; a parity count that is suspiciously low or
zero; a "mirror is incomplete" conclusion drawn from a bare `find` / `grep -r`. Cross-check with
`find -L` (or `readlink`) before recording the fact.

## Related

- [[grep-absence-claim-needs-exact-pattern]] — the sibling absence-claim verification trap (right pattern); this one is the right-tool (dereference symlinks) variant
