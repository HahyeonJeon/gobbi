---
name: claimed-count-not-reproduced-by-scan
description: A draft's claimed occurrence count (2) was not reproduced by a fresh exact scan (actual 3) — a second, independent witness of the exact-pattern-acceptance family.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-16
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [process, verification]
keywords: [claimed-count, fresh-scan, exact-match, evaluator-finding]
author: claude
priority: medium
domain: process
related: [token-count-acceptance-needs-exact-pattern-semantics]
---

# A claimed occurrence count must be reproduced by a fresh exact scan before being written down

## What happened

Codex's iter-3 evaluator (`CODEX-I3-CONS-002`, Low/100, `general`/`process`) found that the draft's own claimed phrase-expansion count — "2 occurrences" — was not reproduced by a fresh literal scan of the current text, which returned 3 (two occurrences in the line-5 legend, one at line 273). The author had counted correctly at the moment of writing but did not re-verify the count against the final, fully-edited text before stating it.

## Why it happens

A count claim written mid-edit is only accurate as of that moment; if the surrounding text changes afterward (a legend gets a duplicate mention added, a log line references the same token), the earlier count silently goes stale unless re-verified against the FINAL text right before the claim is committed. This is the same root cause as `grep-absence-claim-needs-exact-pattern` (an absence/count claim is only as good as the exact command that produced it, run at the right moment) but manifests here as a stale-count rather than a wrong-pattern defect — the pattern was right, the timing of the count was not.

## Correct approach

Any claimed occurrence count in a draft (or a fix's own verification note) must be produced by running the exact scan against the FINAL text — after all other edits in the same pass are complete — not carried forward from an earlier count taken mid-edit. When in doubt, re-run the count as the very last step before the draft is declared done.

## How to detect

A draft or fix description states a specific occurrence count ("N occurrences," "appears twice") for a token or phrase. Re-run the literal scan against the current file and compare; any mismatch between the claimed count and the fresh scan's result is this trap, regardless of whether the original count was correct at some earlier point in the editing process.

## Related

- [[token-count-acceptance-needs-exact-pattern-semantics]] — the sibling instance of the same family: an acceptance criterion held open across iterations because a "term removed" claim wasn't checked with an exact-pattern scan
- [[grep-absence-claim-needs-exact-pattern]] — the general project mistake both instances specialize
