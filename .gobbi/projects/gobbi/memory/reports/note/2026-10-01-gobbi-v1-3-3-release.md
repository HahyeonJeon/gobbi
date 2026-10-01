# Gobbi v1.3.3 release preparation

**Completed at:** 2026-10-01T17:20:13Z

## Result

Prepared Gobbi 1.3.3 in `a9846f8cb7b9ae56af43103ec1ed5ceaa25a5681`. The marketplace, four runtime manifests,
README badge, and dated changelog agree on 1.3.3. Unreleased stays open. Historical release entries are
unchanged.

## Decisions and migration

The user chose 1.3.3 over the recommended 2.0.0 and the 1.4.0 alternative. The README and changelog explicitly
state that keeping a patch number despite feature additions and removed public roles is a Semantic
Versioning exception for this release.

Consumers replace `developer`, `author`, and `designer` with the phase roles in `coding-*`, `authoring-*`, and
`design-*`. Leader is ideation, planner is planning, executor is execution, and reviewer is review. The
matching runtime setup adds `memory/ontology/`; Codex setup also adds its role files. Claude and Grok load
roles from the updated plugin. Cursor project adapters need an update from the new Cursor contracts. Setup
preserves existing Claude settings and obsolete project role files, so consumers migrate their permissions
and callers before removing obsolete files.

## Verification

- `bash scripts/sync-plugin-package.sh --check` passed: package matches the canonical projection.
- `bash scripts/prove-gobbi-setup.sh` passed all seven proofs, including fourteen roles and four permission
  skills.
- `python3 scripts/prove-ontology-cli.py` reported zero failed proofs on Python 3.13.5, including the PyYAML
  cross-checks.
- All five version manifests parsed and declared 1.3.3. The Codex marketplace still targets `plugins/gobbi`.
- All 42 published Markdown role frontmatters and all fourteen Codex role TOMLs parsed. All eight shipped
  shell scripts passed `bash -n`.
- Direct startup hook checks for Claude, Codex, and Cursor completed and emitted their structured reports.
  Grok startup stored the report and an eligible Stop delivered it once. All hook checks exited zero with
  empty stderr; a settings failure reported inside the payload is distinct from a hook failure.
- Independent readiness review found no bounded package integrity blocker. Independent release-document
  review caught a shared setup claim that applied only to Codex; the corrected candidate received PASS.
  Approved release tree: `5aa11049bf0629a619c3c381c0ba9d14c187d7a1`.
- The release commit contains exactly the seven approved public release files and the approved tree.

## Remaining limits

This work prepares the release; it creates no `v1.3.3` tag or GitHub Release. Runtime hook checks were direct
script checks, not end-to-end host sessions. Cursor plugin loading remains unproven. Python 3.9 and actual
runtime model invocation were not tested. Authoring and Design Execution remain pre-existing placeholders.

Net change: [Gobbi v1.3.3 prepared](../../history/2026-10-01-gobbi-v1-3-3.md).
