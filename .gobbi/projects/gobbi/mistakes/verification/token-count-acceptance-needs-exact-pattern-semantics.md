---
name: token-count-acceptance-needs-exact-pattern-semantics
description: A "grep = 0" acceptance criterion failed twice on negated mentions still containing the retired token; acceptance conditions must state the exact pattern and whether negated/verbatim-in-verification mentions count.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-16
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [process, verification]
keywords: [acceptance-criterion, grep-zero, negated-mention, exact-pattern, held-open]
author: claude
priority: high
domain: verification
related: [claimed-count-not-reproduced-by-scan]
---

# A "grep = 0" acceptance criterion must state whether negated/quoted mentions count

## What happened

The `CODEX-I1-PROJ-002` finding (retired branch-snapshot vocabulary) was fixed at iter 2, but Codex's iter-2 evaluator held it `open` at High/100 — the same acceptance criterion (a "the retired term no longer appears" check) failed a SECOND time, because the fix reworded the surrounding sentence but left the retired token itself surviving inside a NEGATED mention ("there is no longer a `FETCH_HEAD` race," "not on the other branch") rather than removing it. A plain "grep for the term returns 0" check would have passed the pre-fix text too if the reader-facing sentence structure were slightly different — the acceptance criterion never specified whether a negated or explanatory mention of the retired term counts as a violation.

## Why it happens

"The term no longer appears" reads as an unambiguous acceptance test, but it silently assumes the writer and the checker agree on what "appears" means: does a negated sentence ("there is no X") count as the term appearing? Does citing the term inside a verification note ("acceptance: grep for X returns 0") count? Two different readers — the fix author and the evaluator — can each honestly believe they satisfied "the term no longer appears" while disagreeing about negated or self-referential mentions, and the acceptance criterion as stated does not resolve the disagreement. This produced a genuine cross-system disposition split at iter 2 (Claude called the finding addressed; Codex held it open) that only closed at iter 3 once the criterion was rewritten as an exact-pattern scan.

## Correct approach

State acceptance conditions for a "term no longer appears" fix as an EXACT PATTERN scan (e.g., `grep -c '<literal-token>'` — case-sensitivity and word-boundary specified) AND explicitly say whether negated mentions, quoted mentions, and verification-note mentions of the token count toward the zero. When possible, prefer describing the target pattern in the acceptance criterion WITHOUT embedding the literal retired token in the surrounding prose (so the criterion itself doesn't accidentally reintroduce the thing it is checking the absence of) — this session's iter-3 fix adopted exactly this: "an exact-pattern scan of this draft for the branch-snapshot ref literal and the other-branch adjective (case-insensitive) each returns zero," describing the patterns by role rather than by literal token.

## How to detect

Any acceptance criterion phrased as "X no longer appears" or "the retired term is removed" without stating the exact scan pattern and its treatment of negated/quoted/self-referential mentions. The concrete tell that this trap already fired: the same finding-id is held `open` by one evaluator system across two or more iterations despite the fix author believing it was closed — a cross-system disposition split on a "term removed" acceptance claim is the signature of this exact gap.

## Related

- [[claimed-count-not-reproduced-by-scan]] — a second, independent instance of the same "claimed count/state not verified by an exact scan" family, surfaced by Codex at iter 3
- [[grep-absence-claim-needs-exact-pattern]] — the general project-mistake this is a specific, narrower instance of: any absence claim must be backed by the exact pattern that produces it
