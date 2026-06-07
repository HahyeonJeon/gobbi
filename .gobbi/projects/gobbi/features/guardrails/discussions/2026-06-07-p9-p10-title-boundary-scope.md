---
name: p9-p10-title-boundary-scope
description: AskUserQuestion exchanges resolving P9 title, P10 title, P9-P6 boundary, PR scope, eval depth, and Preparation skip
type: discussions
scope: feature
feature: guardrails
status: active
created: 2026-06-07
session: b02c3111-68be-4558-a19f-fabf9627602f
tags: [principles, p9, p10, title, scope, eval-policy, ideation]
outcome: Six questions resolved across two AskUserQuestion calls; all decisions locked
---

# P9 + P10 Title, Boundary, and Scope — User Discussion

## Context

The Ideation leader drafted P9 and P10 wording with 8 open decisions (D1–D8). Six required user input before Planning could proceed: (1) P9 title choice among three options, (2) P10 title choice, (3) P9↔P6 boundary treatment, (4) PR scope (tight vs expanded), (5) evaluation depth (execution-only vs all-loops), (6) Preparation loop skip decision.

Two AskUserQuestion calls were made across the Ideation loop. This file records both exchanges.

---

## Exchange 1 — First AskUserQuestion call

### Question

Presented D1 (P9 title), D6 (P10 title), and D3 (P9↔P6 boundary) to the user. Three options for P9 title:
- Option A: "Think Project-Wide Before Editing" (recommended — names value/behavior, not tool)
- Option B: "Think CRUD and 5W1H before Editing" (user's original phrasing)
- Option C: "Think CRUD-and-5W1H Before Editing" (hyphenated compound)

Two options for P10 title:
- Option A: "Finish In-Scope Work — Do Not Defer It" (recommended — names in-scope boundary)
- Option B: "Complete the tasks and avoid deferring" (user's original phrasing)

### Options considered

For P9: Option A names the behavior (project-wide thinking); Options B/C name the tool (the checklists). P7 warns against cryptic abbreviations in titles; however the user may prefer mnemonic memorability. Option C is a hybrid.

For P10: Option A explicitly states the in-scope qualifier preventing misread as "never defer." Option B risks being read as banning all deferral.

For P9↔P6 boundary: "beside with forward-xref only" vs "absorb P6 into P9" (would rewrite P6 and re-open the 14→8 consolidation).

### User decision

- P9 title: Option C — "Think CRUD-and-5W1H Before Editing" (user preferred the mnemonic form with hyphen).
- P10 title: Option A — "Finish In-Scope Work — Do Not Defer It" (matched recommended).
- P9↔P6 boundary: P9 sits beside P6 with forward cross-reference only; P6 is not rewritten this session. Reciprocal back-pointers deferred (D7).

### Implication

D1 locked to "Think CRUD-and-5W1H Before Editing." The hyphenated form keeps the user's mnemonic while scanning as one compound tool per the title style convention. P9's Iron-Law one-liner and table rows use this exact title. D3 locked to beside-with-forward-xref. D7 deferred to backlog — no writes to P6 body this session.

---

## Exchange 2 — Second AskUserQuestion call

### Question

Presented PR scope options, evaluation depth, and Preparation loop skip:
- PR scope Option A (tight): add P9 + P10 to `principles/SKILL.md` + update the 11 count-references across 5 real files only. D7 (reciprocal back-refs) and D8 (guardrails README) deferred.
- PR scope Option B (expanded): also add reciprocal back-pointers to P5/P6/P1 and fix the guardrails README in the same PR.
- Evaluation depth: skip for ideation/preparation/planning; dual-system at execution only — or full eval at all loops.
- Preparation loop: skip (go directly Ideation → Planning) or run Preparation.

### Options considered

Tight scope reduces PR size and review surface. Expanded scope risks "while we're here" scope creep (P5 breach). D7 and D8 are self-contained follow-ups. For eval depth: execution-only is lower overhead for a straightforward doc update; full eval at all loops is higher confidence but more cycle time. For Preparation: skipping it is appropriate when the CRUD scope is clear and the executor can proceed directly from the Planning artifact.

### User decision

- PR scope: Option A (tight). D7 and D8 deferred to project backlog.
- Evaluation depth: skip for ideation / preparation / planning; dual-system (`always`) for execution only.
- Preparation loop: SKIP. Planning follows Ideation directly.

### Implication

The execution plan targets exactly 5 real files and 11 count-references. No additional scope. Execution evaluation is dual-system (Claude + Codex), mandatory. The Planning loop will produce the task list from `ideation/artifacts/ideation-design.md` without a Preparation loop in between.

---

## Related

- `sessions/2026-06-07-b02c3111-68be-4558-a19f-fabf9627602f/ideation/artifacts/ideation-design.md` — full CRUD scope map and locked wording
- `features/guardrails/decisions/2026-06-07-p9-p10-locked-design.md` — formal decision records (D1–D8)
- `backlogs/reciprocal-principle-cross-refs.md` — D7 deferred
- `backlogs/guardrails-readme-iron-law-count-drift.md` — D8 deferred
