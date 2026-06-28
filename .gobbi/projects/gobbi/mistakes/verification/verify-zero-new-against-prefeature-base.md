---
name: verify-zero-new-against-prefeature-base
description: A "0 NEW" regression check diffed against a mid-feature commit, not the pre-feature base, cannot catch a regression from an earlier task in the same feature
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-27
session: 659a1b3f-0b70-419a-848b-a02db5dbbded
tags: [verification, process]
keywords: [regression-baseline, broken-links, branch-point, zero-new, finalize-gate]
author: claude
priority: high
domain: verification
---

# Regression baseline must be the pre-feature base, not a mid-feature commit

## What happened

A finalize step verified "0 NEW broken links" by diffing the broken-link set against a MID-feature commit — the immediately-prior task's commit. That commit already contained earlier tasks' changes. So the check could only see links broken by the LAST task; it could not detect a regression introduced by an EARLIER task in the same feature, because the earlier task's state was baked into the baseline being compared against.

## Why it happens

"Versus the parent commit" feels like the right baseline — it is the natural diff target and it isolates the most recent change. But a regression-property check ("no NEW broken links", "no NEW failures") must compare against the state BEFORE the whole feature — the branch point or the last shipped state — not against a commit from inside the feature. A mid-feature baseline silently absorbs every earlier in-feature regression, so the check passes while the regression is already present.

## Correct approach

Diff every regression-property check against the pre-feature base commit — the branch point (`git merge-base <base-branch> HEAD`) or the prior shipped state — never a mid-feature commit. State the baseline explicitly in the claim: "0 NEW broken links versus `<pre-feature-base-sha>`", so a reader can see what the "NEW" is measured against and confirm it is the branch point, not an intermediate task.

## How to detect

A "0 NEW X" / "no regression" / "no new failures" claim whose comparison baseline is a commit from WITHIN the same feature branch (the prior task, an intermediate checkpoint). The tell: the cited baseline sha is one of this feature's own commits, not the branch point or last-shipped state. Any regression check that names a same-branch intermediate as its baseline is blind to earlier-task regressions.

## Related

- [[verify-state-from-authoritative-source-not-proxy]] — sibling verification trap: a check that reads the wrong source/baseline confirms the wrong thing
- [[grep-absence-claim-needs-exact-pattern]] — another "the check looked right but measured the wrong thing" verification trap
