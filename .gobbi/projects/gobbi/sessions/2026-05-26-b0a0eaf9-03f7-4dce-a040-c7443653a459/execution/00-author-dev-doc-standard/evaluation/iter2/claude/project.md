# Project — T0 iter2 reconciliation (claude)

**Target:** commit a258f4b — reconcile notes section-contract across §4.2 + templates/notes.md + design D4; align mistakes-row labels; extend set S with `addressed-by`/`addressed_by`.

**Brief intent:** close the iter1 dual-eval divergence (Codex REVISE on the §4.2-vs-D4 notes-contract mismatch) and the two Low findings (ST-1 mistakes labels, PR-1 addressed-by) the user ratified for RECONCILE. Stay inside the sanctioned 4-file scope.

## Verification (own commands)
- `git show --stat a258f4b` → exactly 4 files: design-options.md, rawdata/draft-iter2.md, rules.md, templates/notes.md. No `.claude` symlink edits, no other memory docs.
- iter1 Codex REVISE fix-options were "reconcile §4.2 to D4, OR revise the locked design through the workflow." The chosen path (reconcile all three to ONE canonical contract, with the divergence documented in D4 inline) satisfies the second option faithfully — D4 now carries a dated reconciliation note citing the divergence.

## Findings
None at Project severity. The delta matches the user-ratified RECONCILE scope (Iron Law 4 honored — no edits beyond the sanctioned 4 files). The iter1 PR-1 (`addressed-by` absent from S) is now closed: §4.4 table carries the row and §4.5 gate regex catches it.

VERDICT: PASS
