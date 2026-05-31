# Structure Perspective

## Finding S1

Type: checklist_gap
Severity: Medium
Confidence: 100
Evidence: `planning/artifacts/plan.md:378` says the T1 source-package half of the R1 guard asserts the `plugins/gobbi/` top level is exactly `{.claude-plugin, skills, agents, hooks}`. `scripts/sync-plugin-package.sh:47` labels the allow set as `present-or-absent OK`; `scripts/sync-plugin-package.sh:147-158` only rejects unexpected actual entries; `scripts/sync-plugin-package.sh:176-180` requires only `skills`, `agents`, and `hooks` dirs. Fresh stray test did prove unexpected entries fail: adding `plugins/gobbi/STRAY` made `--check` print `FAIL allow-set: unexpected entry in plugins/gobbi/: STRAY` and `exit=1`.
Why-it-matters: The source-package guard is a real stray/leak guard, but it is not the exact-set assertion the plan claims. A missing `.claude-plugin/` would not be caught by `sync-plugin-package.sh --check`; it would rely on the separate `claude plugin validate` gate instead.
Suggested-direction: Make `--check` compare the sorted actual top-level entries against the sorted allow-set, or explicitly require every allow-set member before printing allow-set OK.
