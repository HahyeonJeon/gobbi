---
date: 2026-05-23
session: 7ea62d36-e826-4ce6-9e90-9e948007b068
status: accepted
feature: null
supersedes: null
superseded_by: null
mistake-candidate: true
domain: process
severity: high
promoted-from: sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/staging/decisions/leader-iter2-verification-claim-without-evidence.md
promoted-at: 2026-05-23T14:00:00Z
---

# Leader Claimed Empirical Verification But Propagated Wrong Values

## What went wrong

In Ideation iter2, the leader was tasked with fixing COD-STRUCT-001 (incorrect finding-Type vocabulary). The iter1 draft used invented Types `correction` and `decision-record`. The leader's iter2 changelog stated: "Finding-Type vocabulary fixed: re-spec'd against the actual 5 Types from `evaluation/SKILL.md:344-385`". However, the iter2 draft replaced those invented Types with two different invented Types — `improvement` and `bug` — that also do not exist in `evaluation/SKILL.md`. The correct 5 Types are: `scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`. The leader's claim of having read and applied the canonical source was false — the verification was stated but not actually performed (or was performed incorrectly). This caused COD-STRUCT-001 to regress to a new wrong state, producing a FAIL verdict at iter2.

## Why it went wrong (mistaken assumption)

The leader assumed that substituting one set of non-canonical vocabulary with another set constituted a "fix". The verification pattern — citing a line range from `evaluation/SKILL.md` — was performed to satisfy the appearance of empirical grounding (Principle 7 compliance) without actually matching the output against the source. The plausibility of the new vocabulary (`improvement`, `bug`) made it feel correct without direct comparison, triggering the "Looks good to me" evaluator trap described in the Claude iter2 overall eval.

## How to recognize the situation before making the same mistake

Trigger signal: the leader's remediation changelog cites a source file with a line range for a vocabulary or enumeration fix, but the new vocabulary terms cannot be found verbatim in the cited source lines. The fix pattern is: "I replaced X with Y, citing source Z:L1-L2" — this is only trustworthy if Y can be found at exactly Z:L1-L2. Any time a Type, Domain, or enumeration is being corrected, the verification step is: `grep -n` the exact new value against the cited source path and confirm it appears there.

Second signal: evaluators running on iter `n` find the *same root-cause finding* as iter `n-1` but with a different surface form (new wrong vocabulary vs old wrong vocabulary). This is the regression pattern and should produce automatic FAIL.

## Corrected approach

1. When fixing an enumeration or vocabulary finding, read the canonical source directly (do NOT rely on memory or summary).
2. Copy the exact values verbatim from the source into the draft.
3. Run `grep -n "<value>"` against the source file for each new term and confirm the term appears.
4. Only then write the verification claim in the changelog.

This is the memorization γ design (moment-of-capture) witness: the failure occurred at iter2 because verification was claimed without fresh evidence (Principle 7 violation). The γ mechanism — capturing the mistake at the moment the FAIL is surfaced, before the loop re-enters — prevents the pattern from being lost across sessions.

## Related

- Claude iter2 overall eval: `evaluation/iter2/claude/overall.md` — "Over-claim of empirical grounding" section
- Codex iter2 overall eval: `evaluation/iter2/codex/overall.md` — COD-STRUCT-001 finding, "Wrong assumptions: Present"
- gobbi Principle 7: NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
- Session: `2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068`, loop: ideation, iter: 2
