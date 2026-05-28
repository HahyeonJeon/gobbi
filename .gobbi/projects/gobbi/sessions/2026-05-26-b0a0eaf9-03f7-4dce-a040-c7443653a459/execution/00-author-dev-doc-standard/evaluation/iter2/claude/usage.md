# Usage — T0 iter2 (claude)

**Focus:** does the extended gate run, and does it surface the intended leaks?

## Verification (ran §4.5 gate verbatim)
- Gate exit 0; archive-safe (`-not -path '*/archive/*'` present); underscore-aware. Printed ~65 live leak files — non-empty, as expected when leaks exist.
- The 4 docs carrying `addressed-by:` are now flagged by the extended regex:
  - features/git-workflow/checklists/phase-doc-count-verification.md
  - features/install-runtime/scenarios/consumer-mental-model-symlink-topology.md
  - features/install-runtime/scenarios/mirror-policy-workspace-canonical-false-premise.md
  - features/install-runtime/checklists/mirror-policy-empirical-verification.md
- These were the exact 4-file provenance leak the iter1 PR-1/RK-1 finding said the gate would miss. Now caught.

## Findings
None. The iter1 US-1 (conditional-disposition sub-check is prose not canned) is unchanged — out of iter2 ratified scope, Low, not a regression.

VERDICT: PASS
