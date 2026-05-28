# T0 iter2 — reconcile draft notes

REVISE of T0 iter1 (commit be43c43). iter1 dual eval diverged: Claude PASS, Codex REVISE
on a notes section-contract divergence. User decision: RECONCILE all three sources
(standard §4.2, `templates/notes.md`, design D4) onto ONE canonical notes contract.

## The divergence (as filed)

- **Codex (REVISE, High):** locked design D4 said notes =
  `What-happened / What-shipped / Deferred / Decisions-to-respect`. iter1 §4.2 instead wrote
  `What happened / What shipped / What got stuck / What shifted / Next session` (tracking the
  real notes template). Two checklists; downstream retrofit would verify against the wrong one.
- **Claude (PASS, Low ST-1):** §4.2 mistakes row labels (`How to recognize` / `Corrected`)
  diverge from template (`How to detect` / `Correct`).
- **Claude (PASS, Low PR-1/RK-1):** `addressed-by`/`addressed_by` absent from set S — a real
  4-file provenance leak that survives normalization because S never enumerated the key.

## Canonical notes contract (my reconcile, best judgment)

`## What happened` → `## What shipped` → `## What got stuck` → `## What shifted`
→ `## Decisions to respect` → `## Next session`

Rationale for the merge:
- Both source sets share `What happened` + `What shipped` — kept verbatim.
- D4's `Deferred` folds into the template's `What got stuck` (in-flight stuck); the template's
  own prose already routes truly-deferred work to `backlogs/`, so a separate `Deferred` heading
  would duplicate backlog. Keep the clearer `What got stuck`.
- D4's `Decisions-to-respect` is a distinct handoff need the template lacked — ADDED as
  `## Decisions to respect` (the standing-decisions shortlist a future session must not re-litigate;
  cites the durable `decisions/` slug where one exists).
- Template's `What shifted` (motion) + `Next session` (handoff pointer) kept — D4 lacked both,
  but they serve the journal+handoff purpose the user described.

Result: a 6-heading journal+handoff contract that absorbs BOTH source sets with no redundancy.

## Mistakes-label reconcile

§4.2 aligned TO the template (template is the staging shape real docs follow; §4.2 explicitly
tracks the templates): `## Correct approach` + `## How to detect`. Order also follows the
template (`Why it happens → Correct approach → How to detect`).

## Set-S extension (addressed-by)

Added `addressed-by` / `addressed_by` to the §4.4 table and the §4.5 gate regex
(`addressed[-_]by`, both spellings). Load-bearing at the per-key strip level: the 4 leak files
also carry `finding-id`/`confidence`/`severity`, so they already appeared in the file-LIST gate;
but without `addressed-by` in S, an operator normalizing them via the type-aware allowlist (§4.4)
would strip the other keys and LEAVE `addressed-by` behind. Now S clears it.

The 4 files:
- features/git-workflow/checklists/phase-doc-count-verification.md
- features/install-runtime/scenarios/consumer-mental-model-symlink-topology.md
- features/install-runtime/scenarios/mirror-policy-workspace-canonical-false-premise.md
- features/install-runtime/checklists/mirror-policy-empirical-verification.md

## Preserved (per eval must-preserve)

- §1-3 untouched (§4 only).
- Positive-guidance framing + before/after table intact.
- Conditional-`disposition` safety invariant intact — gate still omits a blanket `disposition`
  match, so the 41 legit backlog files are preserved.
- Archive exclusion on every §4 command intact.

## Other §4.2-vs-template scan (verified)

- notes: NOW aligned (all 3 sources).
- mistakes: NOW aligned (standard ↔ template).
- learnings: already matched (`Insight/Context/Why it matters/How to apply/Counter-cases`).
- decisions: already matched (`Context/Decision/Rationale/Alternatives considered/Consequences`).
- design: §4.2 assigns ADR shape, but the design TEMPLATE is `Problem/Scope/Approach/Scenarios/
  Validation/Trade-offs/Open issues` — NOT ADR. §4.2 softens this with "(or `## Approach`)" and the
  "Other types follow their own template" clause, so it is not a hard contradiction. Out of the
  user-sanctioned reconcile scope (notes + mistakes-label only) — flagged as observation, NOT fixed.

## Verification (verbatim) — see final report.
