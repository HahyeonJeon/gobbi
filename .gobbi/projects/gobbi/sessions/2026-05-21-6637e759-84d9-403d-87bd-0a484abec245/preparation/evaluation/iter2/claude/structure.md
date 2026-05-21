# Structure Perspective — iter2

## Stage 0

iter2 inserts one new H2 section (`## Pre-routed gaps for Planning`) with two H3 subsections (per finding), and one new H3 subsection (`### iter2 round outcome`) inside the existing `## Decisions log`. Ordering: the new H2 sits between "Out of scope gaps" and "Decisions log", which is a sensible adjacency (Out-of-scope → Pre-routed → Decisions log narrates the routing chain).

## Stage 1 Frame

Checklist: (a) section ordering is logically consistent; (b) heading levels are correct; (c) the new section is internally well-structured (per-finding subheadings, severity in titles, concrete recommendation per finding); (d) no orphaned references or broken cross-pointers.

## Stage 2 Findings

- **Section ordering is sound.** Pre-routed gaps logically follows Out-of-scope and precedes the Decisions log — this matches the document's existing narrative arc (what we did → what we punted → what we decided).
- **Heading hierarchy is consistent.** H2 for the new section, H3 for per-finding entries, matches the existing pattern (Decisions log uses H2 + H3 sub-step headings).
- **Per-finding structure is well-formed.** Each finding has: Codex finding (verbatim relevance), Why H-2 does not fully cover this / Empirical confirmation, Planning constraint (binding), Recommendation, Out-of-scope-for-iter2 note. Symmetric across both findings.
- **One minor structural awkwardness, Low severity.** F-CX-PREP-O-01 mixes its "Planning constraint (binding)" with two options (a) and (b), and then has a separate "Recommendation: (a)" sentence. This reads as the constraint requiring all consumers BEFORE Stage C, but option (a) (single-executor sweep) does NOT have consumers "before Stage C" — it has one consumer that spans Stage C with mistakes loaded into context before Stage 0. The binding-constraint phrasing could be tightened to "all `mistake`-skill loads happen BEFORE Stage C executes" rather than "all consumers run BEFORE Stage C". Cognitive-only; Planning's leader will read both options and the recommendation together and pick correctly. Confidence 75 / Severity Low.

## Stage 2 step 3 — iter1 inherited finding disposition

- F-CX-PREP-O-01: **addressed** structurally; binding-constraint phrasing has a minor imprecision (above).
- F-CX-PREP-O-02: **addressed** structurally; per-finding template applied consistently.

## Verdict

**PASS.** Structure is sound; the one finding is Low severity / cognitive-only.

## Must-preserve

- The Pre-routed → Decisions log adjacency.
- The per-finding template symmetry across F-CX-PREP-O-01 and F-CX-PREP-O-02.
