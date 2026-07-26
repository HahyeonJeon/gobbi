---
name: reresolve-release-state-at-authoring-time
description: A verified research claim about a fast-moving package's version, release channel, or rule roster can be stale by authoring time; re-resolve the current release before shipping it.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-25
session: bae334bf-c3df-4155-bbd0-92d5a36f3feb
tags: [verification]
keywords: [dist-tag, release-channel, rule-roster, staleness]
author: claude
priority: high
domain: verification
---

# Re-resolve a fast-moving package's release state at authoring time, not at research time

## What happened

A research report framed a lint plugin as a still-in-progress Release Candidate and reproduced a
roster of its rules. Both were stale by the time the design was written: the current stable release
had already shipped, and one rule in the reproduced roster had already been deprecated to a no-op
in that stable release. A skill authored straight from the research framing would have shipped a
wrong recommendation and a rule roster naming a dead rule.

## Why it happens

A research pass can verify a claim honestly and still leave a superseded framing behind — for
example by verifying against a prerelease channel rather than the latest stable release, or by
reproducing a roster from a secondary listing that was accurate when written. The claim carries a
VERIFIED marker, which makes it look settled, but what was verified was a channel or a snapshot,
not the current stable state. The gap then survives every downstream read, because a VERIFIED
marker discourages re-checking.

## Correct approach

At authoring time — not only at research time — re-resolve the package's current stable release
and diff any reproduced roster (rules, flags, exports) against the shipped artifact before using
it. State which release channel a version claim came from when it matters. Do not reproduce a
rule, flag, or export list from a secondary listing without checking it against the release that
will actually be installed.

## How to detect

Any claim naming a package's major version, release channel (release-candidate, beta, next,
canary), preset membership, or a reproduced list of that package's rules, flags, or exports —
especially when it arrives already marked VERIFIED. The tell: the claim names a version but not
which release channel it came from.

## Related

- [[resolve-preset-conflict-via-published-artifact]] — same incident, the sibling trap: a prose
  contradiction about the same package's preset membership was settled only by reading the
  published artifact directly
