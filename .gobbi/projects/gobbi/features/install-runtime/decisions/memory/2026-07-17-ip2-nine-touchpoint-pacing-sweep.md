---
name: ip2-nine-touchpoint-pacing-sweep
description: IP-2 = Option IP-2-A — delete the six pure-pacing occurrences (clause-only), reframe two answer-classification sites, loosen the fixed prompt-selection count, and reframe the grading cadence predicate — nine touchpoints, no replacement pacing rule.
type: decisions
scope: feature
feature: install-runtime
status: accepted
created: 2026-07-17
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [design, process]
keywords: [ip-2, pacing-removal, clause-only, concept-sweep, agent-judgment, startup]
author: claude
supersedes: null
superseded_by: null
related: []
---

# IP-2 = Option IP-2-A: delete pacing (clause-only), reframe, loosen, plus the grading-layer predicate — no replacement cadence

## Context
The startup interview's "one question per turn" rule (six literal occurrences) mechanically paces the
interview even though the real value it delivers — clean per-answer classification — is already provided
structurally by the per-answer ledger (`recording.md §2`/§6, which tags each answer with its own `Answer
ID` regardless of turn grouping). A related fixed "choose two to four prompts from a branch's bank"
selection count (`topics.md:38-39`) constrains prompt breadth in the same mechanical spirit, and a cadence
predicate survives in the grading layer (`scenario.md:148`).

## Decision
IP-2 = Option IP-2-A, full sweep + reframe, covering the nine locked pacing touchpoints — (1) delete the six
pure-pacing `one question per turn` occurrences at `SKILL.md:13/113/195` and `topics.md:5/34/506` — CLAUSE
ONLY, preserving every co-located non-pacing rule (topic order, smart-skip, show-verified-fact-first,
anti-sycophancy) at the four sites where the pacing phrase is a mid-line clause co-located with a real rule;
(2) reframe the two `topics.md:37` and `:134` "one axis per turn" occurrences to answer-classification
wording (each axis is its own ledger event even when one response supplies several); (3) loosen
`topics.md:38-39`'s fixed "choose two to four prompts" selection heuristic to evidence-led agent judgment
(mandatory coverage unchanged) — adjudicated separately (E1, below) — nine sites in total (6+2+1) — PLUS,
as a tenth site beyond the nine, reframe the `scenario.md:148` grading-layer cadence predicate to
evidence-state so the grading layer cannot re-encode the pacing rule the source layer just removed. A
concept-sweep of all six files for pacing synonyms covers the whole set. No replacement pacing rule is
added anywhere.

## Rationale
Pacing is a MECHANISM (turn grouping), not the VALUE the user cares about (clean per-answer identity). The
ledger already delivers the value structurally (I4: stable `Answer ID` per answer, `Status` separate from
`Branch closure`), so removing the mechanism is structurally safe. The Mom Test and the survey-design
reference both support natural, judgment-led pacing over a fixed cadence: keeping conversations natural
rather than over-scripted (Mom Test), and cognitive load — not a literal per-turn/per-page rule — being the
real variable that matters (survey one-question-per-page). Clause-only deletion (not whole-line deletion) is
required because four of the six sites co-locate the pacing phrase with a real, unrelated rule the Idea does
NOT intend to remove (verified: `SKILL.md:195` co-locates smart-skip + anti-sycophancy; `topics.md:506`
co-locates topic-order + show-verified-fact-first) — this was corrected from a design_flaw finding
(CONS-F1, iter1) into an explicit preserve-guard.

## Alternatives considered
- **Option IP-2-B** — rejected at the design gate (D-3); not the full-sweep-and-reframe treatment the user
  selected.
- **Whole-line deletion at all six sites** — rejected after CONS-F1 (iter1): would silently drop
  smart-skip, show-verified-fact-first, and the anti-sycophancy contract at four sites — a real regression
  to the interview contract, not merely a pacing removal.
- **Leave `topics.md:38-39`'s fixed prompt-selection count untouched** — considered and then extended by
  user adjudication (E1) once the producer escalated it as an in-spirit but not literally-enumerated
  extension of the pacing sweep.

## Consequences
Success Criteria requires a concept-sweep for `one question per turn` / `one axis per turn` / a fixed
prompt-selection count / turn-count / question-count / cadence predicates to return zero live contradictions
in either the source or the grading layer, while every co-located non-pacing rule is independently verified
preserved (verified this loop: `SKILL.md:195`, `topics.md:506`).

## Related

(no direct `[[slug]]` decision links; the discussion-log D-3 + E1 entries are this decision's authority trail)
