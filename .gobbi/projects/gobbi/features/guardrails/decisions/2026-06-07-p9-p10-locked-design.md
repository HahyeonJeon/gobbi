---
name: p9-p10-locked-design
description: Locked design decisions for adding Principles 9 and 10 to the gobbi principles skill (8 → 10)
type: decisions
scope: feature
feature: guardrails
status: active
created: 2026-06-07
session: b02c3111-68be-4558-a19f-fabf9627602f
tags: [principles, p9, p10, crud, 5w1h, scope-contract, design]
supersedes: null
superseded_by: null
decision_status: accepted
---

# P9 + P10 Locked Design — Add Principles 9 and 10 to the Principles Skill

## Context

The principles skill currently defines 8 principles. The user identified two missing behavioral disciplines: (1) agents edit target files without checking dependency and consistency with affected files (the blast-radius problem); (2) agents defer in-scope work, calling tasks done while leaving agreed deliverables unfinished. Adding Principles 9 and 10 addresses these failure modes.

Eight decisions were made during Ideation. Six are locked (D1–D6). Two are deferred to backlog (D7, D8).

## Decision

### D1 — P9 title: "Think CRUD-and-5W1H Before Editing" (user's choice)

**Decided:** P9 title is `Think CRUD-and-5W1H Before Editing` (user's choice over the recommended "Think Project-Wide Before Editing"). The hyphenated mnemonic form keeps the user's preferred acronym pair while scanning as one compound tool.

**Rationale:** User explicitly preferred the CRUD-and-5W1H mnemonic for memorability. The hyphenated compound avoids reading the title as two separate things.

### D2 — Gloss both acronyms on first use (auto-decided)

**Decided:** Gloss "CRUD (Create / Read / Update / Delete)" and "5W1H (Who / What / When / Where / Why / How)" on first use inside P9's Why paragraph.

**Rationale:** Principle 7 mandates defining jargon/abbreviations on first use. P6 already spells out CRUD inline (`principles/SKILL.md:114`). Consistency and compliance require the same treatment here.

### D3 — P9 sits beside P6 with a one-line forward cross-reference; P6 is not rewritten this session

**Decided:** P9 sits beside P6. P9 carries a forward cross-reference to P6 ("For documentation work, Principle 6 adds the spec and the start-with-docs / finish-with-docs discipline on top of this"). P6 is not modified this session. Reciprocal back-pointer from P6 to P9 is deferred (D7). (Update 2026-06-07: the user later revised P9 to remove the forward cross-ref to P6 entirely — P9 as shipped carries no P6 reference. This decision records the original lock; the cross-ref was removed per user revision.)

**Rationale:** P6 is doc-specific CRUD-think; P9 generalizes the thinking pattern to all edits (code included). The 14→8 consolidation deliberately absorbed old P13 into P6 (`2026-06-05-principles-redesign-14-to-8.md:57`). Absorbing P6 into P9 would undo that merge and rewrite P6 — out of scope. Mistake `design-literal-retire-instruction-without-replacement.md` confirms: do not retire a live facet without a verified replacement.

### D4 — P9 stays distinct from P1 on the "this specific edit's blast radius" axis (auto-decided)

**Decided:** P9 is kept distinct from P1 on the edit-level blast-radius axis. P1 = study the problem before you start (early, problem-level). P9 = think the blast radius of this specific edit before you make it (late, edit-level). P9's Why states this seam explicitly.

**Rationale:** P1's "map what the change will touch before designing" is study-before-start. P9's "check what this edit touches before you make it" is think-before-edit. Different time, different granularity — the principles address non-overlapping failure modes.

### D5 — P10 polices the lower bound; out-of-scope deferral via P5 backlog remains legitimate

**Decided:** P10 is framed as the floor of the scope contract. P5 = do not go BEYOND scope (ceiling). P10 = do not fall SHORT of it (floor). P10 explicitly states this pairing. Legitimately out-of-scope work still routes to backlog per P5 — not a P10 violation.

**Rationale:** The project uses backlogs legitimately and extensively (e.g., `principles-external-renumber-reword-sweep.md`). P10 must not contradict P5's sanctioned follow-up practice. The seam is the word "in-scope": P10 forbids deferral of items inside the agreed contract, not the filing of backlogs for genuinely out-of-scope work.

### D6 — P10 title: "Finish In-Scope Work — Do Not Defer It" (matched recommended)

**Decided:** P10 title is `Finish In-Scope Work — Do Not Defer It` (recommended form; matches the user's selection). This names the in-scope boundary explicitly in the title, preventing the misread that P10 bans all deferral.

**Rationale:** User's alternative ("Complete the tasks and avoid deferring") risked being read as "never defer anything," which would contradict P5's backlog practice. The recommended form carries the "In-Scope" qualifier that blocks the misread. Matches the imperative style of P8.

### D7 — Reciprocal back-pointers from P5/P6/P1 to P9/P10: DEFERRED

**Decided:** Adding back-pointers from P6 ("see P9 for non-doc edits"), P5 ("see P10 for the floor"), and P1 to P9/P10 is DEFERRED. This session ships P9/P10 with forward references only.

**Rationale:** Reciprocal back-pointers would require rewriting existing principle bodies — out of scope per the locked PR scope. Deferred to project backlog `backlogs/reciprocal-principle-cross-refs.md`.

### D8 — Guardrails README count drift: DEFERRED

**Decided:** `features/guardrails/README.md` hard-codes "13 Iron Laws" in 5 places (`:3,11,17,25,29`) — already stale vs the current count before this change. Reconciling this is out of scope for this session. Deferred to project backlog `backlogs/guardrails-readme-iron-law-count-drift.md`.

**Rationale:** The drift is pre-existing (wrong by 5 even before this change). Including it would mix two separate fixes. The backlog doc notes whether the fix should reconcile to the live count or rewrite the README to stop hard-coding it.

## Alternatives considered

- D1: Recommended "Think Project-Wide Before Editing" (names the value, not the tool — P7-compliant). User preferred the CRUD-and-5W1H mnemonic form.
- D3: Absorb P6 into P9 (consolidate). Rejected — would undo the 14→8 consolidation, out of scope.
- D5: Restrict out-of-scope deferral too (every backlog needs owner + "why deferred"). Flagged as a stronger rule; not chosen.
- D6: User's literal "Complete the tasks and avoid deferring." Rejected — risks misread as banning all deferral.

## Consequences

- `principles/SKILL.md` gains P9 and P10 sections (full 4-part format) after P8.
- 11 count-references across 5 real files update "8 → 10" (CRUD scope map in ideation-design.md § 4).
- Evaluation runs dual-system at Execution only.
- Preparation loop is skipped.
- D7 and D8 are deferred to project backlog (no project-memory writes this session).

## Related

- `sessions/2026-06-07-b02c3111-68be-4558-a19f-fabf9627602f/ideation/artifacts/ideation-design.md` — full CRUD scope map, P9/P10 full text, overlap resolution, executor grep
- `features/guardrails/discussions/2026-06-07-p9-p10-title-boundary-scope.md` — AskUserQuestion exchange log
- `backlogs/reciprocal-principle-cross-refs.md` — D7 backlog
- `backlogs/guardrails-readme-iron-law-count-drift.md` — D8 backlog
