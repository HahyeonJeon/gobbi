---
name: manager-must-verify-scope-dependency-claims-before-user-gate
description: The manager must verify any out-of-scope / no-dependency / no-other-file claim against the live tree before presenting it as a user-gate rationale
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [process, verification]
keywords: [scope-dependency, user-gate, unverified-rationale, false-premise]
author: claude
priority: high
domain: process
---

# Manager must verify scope-dependency claims before presenting them as a user-gate rationale

## What happened

The manager relayed the leader's rationale that GEN-D1-003 model (b) "(b) avoids out-of-scope
GEN-D7-004 / wrap-up unchanged" as the decisive reason for the user to lock (b) over (a) — without
independently verifying the claim against the live tree. The iter1 Ideation-loop Claude evaluator
(Project perspective, finding F-PROJ-1, Critical/75) found the claim false: (b), as designed, still
required a Wrap-up-side change (an inventory extension) to actually work, so it was NOT a true
no-dependency, wrap-up-unchanged option. This forced the whole Ideation loop to FAIL at iter1 —
a decision the user had already locked was, in effect, made on a false premise.

## Why it happens

A leader's design rationale is treated as authoritative once it reaches the manager, especially when
it is used to frame a binary choice for the user (option (a) has a dependency, option (b) does not —
pick (b)). The manager's job in a user-gate is to relay the choice clearly, and there's an implicit
assumption that the leader has already verified any "no dependency" / "unchanged" / "out-of-scope"
claim before it reaches that framing. When that assumption is wrong, the user is asked to decide
using a rationale that sounds decisive but is not actually true — and the error only surfaces later,
in evaluation, after the decision is already locked and work has proceeded on it.

## Correct approach

Before presenting any "out-of-scope" / "no dependency" / "unchanged" / "no other file needs to
change" claim as a user-gate rationale, the manager verifies it against the live docs/tree in the
current turn (e.g., actually read the target file's current content, or run the cited validation
grep) rather than relaying the leader's or proposer's claim as-is. If verification is not feasible in
the moment, the manager flags the claim as unverified when presenting the choice to the user, rather
than stating it as settled fact.

## How to detect

Any user-gate framing where one option is preferred specifically BECAUSE it claims "no dependency
on X" / "file Y stays unchanged" / "this is out of scope for that option." These are exactly the
claims most likely to be wrong, because they are negative/absence claims about a system the manager
has not directly inspected in the current turn — and a wrong absence claim silently tips the whole
decision toward the option that only APPEARS cheaper.

## Related

- [[d1-003-recommended-b-false-noop-rationale]] — the decision record of the false claim + correction
- [[verify-mirror-and-cross-tree-paths-from-live-tree]] — the sibling verification mistake from the same recurrence
- [[manager-locked-decision-without-audit-trail-sync]] — a related manager-verification trap
