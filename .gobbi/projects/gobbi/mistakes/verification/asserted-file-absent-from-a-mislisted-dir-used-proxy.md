---
name: asserted-file-absent-from-a-mislisted-dir-used-proxy
description: Verify a file's absence with ls -la / test -f before substituting a self-derived proxy for a named authoritative artifact.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-13
session: 2026-07-13-0bbb7c63-919c-45c2-81ea-b86406c8b75b
tags: [verification]
keywords: [directory-listing, proxy-substitution, load-directive, authoritative-source]
author: claude
priority: high
domain: verification
supersedes: null
superseded_by: null
---

# Don't assert a file is absent from a partial dir read, then silently fall back to a proxy

## What happened

An executor reported that `skills/skill-writing/checklists.md` "does not exist — the dir
holds only SKILL.md + mistakes.md," and therefore DERIVED its own conformance checklist
instead of reading the canonical `checklists.md`. The file (and a `templates/` dir)
actually existed. The manager's `ls -la` confirmed both. The deliverable still came out
conformant, but it was validated against a self-derived proxy, not the authoritative gate —
a silent quality risk.

## Why it happens

A single incomplete directory glance was treated as ground truth for a file's absence, and
"absent" was resolved by inventing a substitute rather than by re-checking. The
authoritative artifact was named in the brief AND referenced by `skill-writing/SKILL.md`,
so its absence should have triggered doubt, not a fallback.

## Correct approach

Before asserting a path is absent: run `ls -la <exact-dir>` AND `test -f <exact-path>` (not
a partial `ls` or memory of the dir). If a named authoritative artifact truly seems
missing, STOP and surface it (`NEEDS_CONTEXT`) rather than substituting a self-derived
proxy — a derived checklist can silently omit an item the canonical one enforces.

## How to detect

Any time you're about to conclude "file X does not exist" — especially a Load-Directive or
verification-anchor path that a skill/brief explicitly names — that conclusion is
suspicious. A named gate that "doesn't exist" is usually a mis-look, not a real gap.

## Related

- [[verify-state-from-authoritative-source-not-proxy]] — live source evidence overrides proxy assumptions
- [[offered-memory-home-without-verifying-type-schema]] — a sibling proxy-substitution trap
- [[grep-absence-claim-needs-exact-pattern]] — an absence claim must be backed by the exact check that produces it
