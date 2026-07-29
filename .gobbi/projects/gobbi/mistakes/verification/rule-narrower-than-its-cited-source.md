---
name: rule-narrower-than-its-cited-source
description: A rule can be narrower than the primary source it cites, and only re-reading the source — never reasoning about the rule text — finds the gap.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-26
session: bae334bf-c3df-4155-bbd0-92d5a36f3feb
tags: [verification, docs-sync]
keywords: [rule-narrowing, primary-source, citation-fidelity, react-skill]
author: claude
priority: high
domain: verification
related: [verify-rule-scope-before-citing, verify-dont-assert-taught-facts]
---

# A rule can be narrower than its own cited source, and only re-reading the source finds it

## What happened

Across one skill's Ideation and Execution evaluations, six independent instances of the same
defect shape surfaced, each caught only by an evaluator re-opening the primary source the rule
itself named: `H8` was written for the compiler-enabled case and pushed the compiler-off case
into a trailing exception clause, inverting which case is common; `H6` quoted half of a two-part
disjunction from its source; `H9` dropped one of three named circumstances the first time, then
— after that fix — was found to omit a *different* condition from its *other* cited source
(the APG modal-dialog pattern's `unless either` exceptions), showing the repair had targeted the
finding, not the rule; `H16` cited four checklist items from its source but carried the
obligation of only two, silently dropping the sandbox item; `H4` named the intent of a
three-part "Rules of keys" section but omitted the uniqueness clause. A sixth instance ran the
other way — `H9`'s stated focus obligation was unconditional where the cited source states it
conditionally, so the rule was *broader* than its source, not narrower, and a corresponding
checklist gate then failed a source-sanctioned implementation.

## Why it happens

Writing a rule from a source is naturally checked by re-reading the RULE — does it read clearly,
does it cover the obvious case, does it cite something. That check cannot detect a narrowing
because the narrowing is a property of the RELATIONSHIP between the rule text and the source
text, invisible from either side alone. A rule that reads complete and a citation that resolves
are both necessary conditions and neither is sufficient. This is made worse when the source
itself is multi-part (a numbered list, an `unless either` clause, several checklist items): the
rule-author's summary naturally keeps the parts that come first or read most centrally and drops
the qualifying parts, because a summary is a compression and compression drops the parts that
feel secondary — which are exactly the parts a source author added because they mattered.

## Correct approach

A rule that cites a primary source is a claim about that source's CONTENT, not just its
existence. Before shipping a rule with a citation, re-fetch or re-read the cited source in full
and diff the rule's obligation against every clause, condition, and list item the source states
— not just the sentence the rule-author remembered. When a rule cites more than one source (as
`H9` does), audit each cited source independently; fixing a narrowing found against one source
does not clear the rule against its other sources. When a source is structured (a numbered list,
an `unless`/exception clause, an enumerated checklist), treat every element as a candidate
obligation until confirmed out of scope, not the reverse.

## How to detect

A rule/citation pair where the citation names a specific page, section, or numbered list, and no
one has diffed the rule's stated obligation against every element that list or page contains
since the rule was last edited. A rule with more than one cited source that was corrected against
only one of them is a strong trigger — the correction proves the rule was written against
authorial memory of the source, not against a fresh read, and that same authorial-memory gap is
still live against the other source. A rule using conditional language ("when", "unless",
"except") that its own citation does not use the same way in either direction is also a signal —
the rule may have added a condition the source lacks, or dropped one the source states.

## Related

- [[verify-rule-scope-before-citing]] — sibling trap: a citation can be scoped wrong (governs a
  different document class than claimed); this trap is the citation resolving to the right
  document but the rule text still diverging from what that document says
- [[verify-dont-assert-taught-facts]] — the general family: a claim is verified by reading its
  owner, not by observing that the claim reads plausibly
