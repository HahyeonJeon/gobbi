VERDICT: PASS

## Summary

P6b reshaped 25 docs under `features/workflow/` (commit `fddc040`, +400/-225) to the §4 dev-doc
standard. I diffed every file in the commit, read each post-image, ran the D5 body scan and the
§4.5 leak gate, and resolved every cross-reference and `## Source` provenance pointer against the
live tree and originating session. The work is clean.

Highest-priority check — **content preservation** — passes: every reshape preserved its facts.
- 6 design ADR reshapes: all 5 LOCKs survive (`five-locked-decisions`); 13 files / 18 anchors / the
  4 follow-up items survive (`task-decomposition-10-tasks`); the empirical witness session
  `2026-05-22-bac669ad`, all 4 gap categories, and both Step-2.5 cross-links survive
  (`wrap-up-step-2-5-compliance-check`); the `05 → 07` / `06 → 07` edges, acyclic DAG, topo order,
  and file-overlap resolutions survive (`dependency-graph-strict-wave-ordering`).
- 5 decisions reshaped to ADR (Context/Decision/Rationale/Alternatives considered/Consequences):
  no fact dropped; the 4-step Design-D impact is preserved in `## Consequences` of
  `wrap-up-step-2-5-escalation-default`; the deferred-bundle provenance moved to a legitimate
  `## Source` footer pointing at the existing `archive/decisions/2026-05-23-iter1-user-redirects.md`.
- 4 checklists: each uses exactly ONE form (Form A per-scenario for `effort-field` + `task01-t1c`;
  Form B per-checklist for both `dq-anchor-*`), with only additive `## Source` footers. The two
  Form-B files swapped session-internal COD-id `## Related` pointers for a `## Source` path to the
  existing originating-session rawdata — the §4.3-conformant reclassification (provenance kept, body
  self-contained), verified honest (the cited session + its codex eval files exist).

§4.2 per-type contracts all hold: design = ADR (NOT the stale 8-section `templates/design.md`, per
spec §4.2:177 — correctly NOT flagged); 6 discussions = the 6-section Context/Question/Options
considered/User decision/Implication/Related shape (one with additive `## Source`); changelog carries
`**Task:**` + the 5 sections; backlog = Context/Why deferred/When to pick up/Suggested approach/
Originating session; README = Overview/Status/Subsystems/Subdirectories/Recent activity/Open items/
Related with the Subdirectories list matching the live tree (references/ genuinely absent).

§4.5 leak gate: clean (zero files). D5 body scan: every survivor is legitimate (frontmatter values,
quoted decision text, or a `## Source`/`## Related`/inline path to an existing artifact — never a
load-bearing unresolvable session coordinate). Every cross-ref resolves. Scope respected: only
`features/workflow/`, no archive, no other features touched.

## Findings

None at REVISE/FAIL threshold. Two LOW observations below (Confidence 75, advisory only — not
defects against the §4 contract; recorded for completeness, no action required):

- [general] [Low] [confidence 75] `decisions/wrap-up-step-2-5-escalation-default.md` uses a `## Source`
  footer in a `decisions/` (ADR) doc. §4.2's ADR contract ends at Consequences + Related; the spec's
  brief explicitly permits an additive `## Source`/`## Related` pointing at an existing artifact as
  legit provenance, and the target (`archive/decisions/2026-05-23-iter1-user-redirects.md`) exists
  (verified). Conformant; noted only because `## Source` is more common on checklists than ADRs.
- [general] [Low] [confidence 75] `design/wrap-up-step-2-5-compliance-check.md:44` and the decision's
  Consequences retain literal anchor `evaluation/SKILL.md § Slug + collision policy (lines 385-393)`.
  The line-number citation is a durable doc anchor into a live skill file, not a session coordinate —
  §4.3 permits it. No leak. Could optionally drop the brittle `(lines 385-393)` numerals, but that is
  preference, not a contract violation.

## Cross-ref resolution check

All cross-references and provenance pointers resolve against the live tree / originating session:

- design/* → decisions/*, design/*, backlogs/*: all 13 targets exist (dependency-graph,
  task-decomposition, glossary, drop-legacy-setup, wrap-up-step-2-5-compliance-check, the lock1
  decision, the lock2 backlog).
- decisions/* → design/*, discussions/*, archive/decisions/*: all exist (incl. the archived
  iter1-user-redirects bundle).
- discussions/* → decisions/*, design/*, plans/*, and project-level `../../../backlogs/skill-loading-discipline.md`:
  all exist; the `../../../backlogs/...` relative path resolves correctly from `features/workflow/discussions/`.
- checklists/* `## Source` → originating-session ideation rawdata (`sub-step-d-design-iter1.md`,
  `draft-iter3.md`): both exist; the cited codex eval files exist too — provenance honest.
- changelog → `plans/2026-05-23-orch-workflow-improvements.md` + `archive/decisions/...`: both exist.
- plan → `design/*`, `discussions/scope-bundle-selection.md`, session artifact_ref: all exist.
- README Subdirectories list = live dirs (archive/backlogs/changelogs/checklists/decisions/design/
  discussions/plans). references/ removed from README and genuinely absent from the tree (not touched
  by fddc040 — removed in an earlier commit). No dangling, no weakened, no removed-but-exists-elsewhere
  pointer found.

## Verification outputs

D5 body scan (`grep -rnE 'T[0-9]+-|iter[0-9]|draft-iter|COD-[0-9]|row-[0-9]'` over
features/workflow/, archive-excluded) — all survivors adjudicated legitimate:

- drop-legacy-setup-questions.md:25 — "row-2 walk-through" → durable anchor into orchestration/SKILL.md § Step 1, not a session coord. OK.
- matrix-location-ambiguity-defers-t2.md:11 — `discussion-id: T2-matrix-deferral` (frontmatter, not body; §4.3 exempts frontmatter). OK.
- wrap-up-step-2-5-escalation-shape.md:51 — `## Source` path to existing archive bundle. OK.
- 2026-05-24-iter2-fix-direction-...md:2,3,10,11,12 — frontmatter (name/description/tags/topic/outcome), not body. OK.
- five-locked-decisions.md:45,76 — quoted decision text citing the Iron-Law-7 mistake filename + "row-5.5 footnote" durable doc anchor. OK.
- wrap-up-step-2-5-escalation-default.md:49 — `## Source` to existing archive bundle. OK.
- dq-anchor-traceability.md:34 / dq-anchor-readability.md:34 — `## Source` path to existing session rawdata. OK.
- changelogs/2026-05-26-bundle-a-rehome.md:30 — quoted artifact name in "What changed" list, path-qualified to existing archive file. OK.
- 2026-05-24-planning-brief-...md:34,58 — mistake filename (exists) + `## Source` path to existing preparation rawdata. OK.

§4.5 leak gate (find features/workflow -not archive | xargs grep -lE '^(mistake[-_]candidate|finding[-_]id|confidence|severity|surfaced[-_]by|promoted[-_]from|promoted[-_]at|addressed[-_]by|task|loop|scenario|iter|slug|finding[-_]source|phase|loop[-_]iter|sub[-_]step|session[-_]id):'):

  (zero output — clean gate, no leak files)

## Must-preserve list

- The design = ADR reshape is correct per spec §4.2:177 — do NOT "fix" it back toward the stale
  8-section `templates/design.md`.
- The checklist Form A vs Form B split is correct (per-scenario vs per-checklist), each file internally
  consistent — do not homogenize.
- The §4.3 reclassification of session-internal COD-id pointers into `## Source` footers (provenance
  kept, body self-contained) is exactly right — do not restore the old session-coordinate `## Related`.
- README Subdirectories accurately mirrors the live tree (references/ correctly absent).
- All content preserved across every reshape — any remediation must keep the 5 LOCKs, 13-files/18-anchors,
  witness session bac669ad, the 4 gap categories, and the dependency edges intact.

## Overall verdict

PASS — no Critical (conf ≥75) and no High (conf ≥50) findings. Two Low advisory observations only.
