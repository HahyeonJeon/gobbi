## Artifact Summary + Memory reads

What/Why/How: see project.md. Usage lens: can the Planning leader + T1/T3 executors + Wrap-up assistant consume iter3 outputs without re-asking the user.

Memory reads: see project.md. Additional check: read the "Notes for Planning intake" section (draft lines 263-272) end-to-end to assess if Planning can craft T1/T3 task briefs from this artifact alone.

## Locked Frame (Stage 1)

Scenario U1: A Planning leader can construct a T1 task brief that cites the safe edit method without re-reading iter2 transcripts.
- U1.1: "Notes for Planning intake" cites the new H2 section by name + relative path.
- U1.2: The note tells Planning what executors MUST do (cite Edit tool default; canonical mirror for bulk; `test -L` post-edit gate).
- U1.3: The note explicitly rescinds the iter2 broad "either path" claim that the 5 Codex findings flagged.

Scenario U2: A T1 executor reading the decision file alone can follow the discipline without seeing the draft.
- U2.1: The H2 names the safe + unsafe edit methods.
- U2.2: The verification gate command is given verbatim (not "verify per docs").
- U2.3: The restore command is given verbatim with the depth-prefix caveat.

Scenario U3 (adversarial, "3am operator"): A tired executor following the Planning brief at 3am can recover from accidentally running `sed -i` on a workspace path.
- U3.1: The decision file provides the recovery procedure.
- U3.2: The recovery procedure works without consulting external docs.
- U3.3: The CI/pre-commit backlog (deferred) is named as the durable defense — sets correct expectations.

Scenario U4: Wrap-up routes the 9 staged files correctly.
- U4.1: All 9 files at canonical staging paths per the wrap-up routing table.
- U4.2: The new ci-symlink backlog has `feature: null` → routes to project backlogs (not feature backlogs).
- U4.3: The decision file with `supersedes:` will be routed to project decisions (same as iter2 lock).

not-applicable: Accessibility / I18n — internal markdown.

Observability/3am: the new H2 *is* the 3am diagnostic surface.

## Per-scenario per-check results

U1.1: Yes. Draft line 268 cites the section by name + relative path with markdown link syntax.
U1.2: Yes. Draft line 268: "Planning briefs MUST cite the Edit tool as the default edit method. For bulk rewrites, executors MUST use the canonical mirror path."
U1.3: Yes. Draft line 268: "the iter2 broad 'editing either path edits the same physical file' claim is qualified by the iter3 edit contract."

U2.1: Yes. Decision file lines 74-85 (10-row safety table).
U2.2: Yes. Decision file line 93: "run `test -L .claude/skills/<path>` and confirm exit code 0".
U2.3: Yes. Decision file line 93: "rm .claude/skills/<path> && ln -sfn ../../../.gobbi/projects/gobbi/skills/<path> .claude/skills/<path>" + "The exact `../../../` prefix depends on the file's depth — verify against an adjacent untouched symlink with `ls -la`".

U3.1: Yes. Line 93 verbatim restore.
U3.2: Yes. The restore + verify can be run in isolation; only depends on `rm`, `ln`, `ls`, `test`.
U3.3: Yes. Line 94: "A repository-level guard ... is the right durable defense. See `staging/backlogs/project/ci-symlink-integrity-check.md` for the deferred follow-up."

U4.1: Yes (cross-verified against staging tree `find`).
U4.2: Yes (frontmatter line 6 `feature: null`).
U4.3: Yes (iter2 supersession already routes to project decisions per existing wrap-up logic; iter3 in-place addition preserves this).

## Iter1+iter2 finding dispositions (inherited)

ID: COD-USAGE-PREP2-001 (Codex iter2 Usage)
disposition: addressed
evidence: The iter2 Codex finding was "A Planning brief copied from the current artifact can still be wrong at 3am unless it says how to preserve the symlink layer." The iter3 fix: (a) the new H2 section in the decision file is the symlink-preservation contract; (b) the draft "Notes for Planning intake" (line 268) explicitly says "MUST cite the Edit tool" + "MUST use the canonical mirror path" for bulk rewrites; (c) the restore command is given verbatim with the depth-prefix caveat. The 3am-operator scenario (U3) is genuinely addressed — discipline list + restore command + deferred CI durable defense, in increasing-defense order.

ID: COD-USAGE-PREP1-* (Codex iter1 Usage)
disposition: addressed (already addressed in iter2; iter3 does not regress).

## Typed findings

None at the threshold. (The earlier CL-PROJ-PREP3-001 concern about the Consequences section's old broad statement is a docs-sync finding tracked under Project/Structure — not a Usage finding because the consumer's actionable path is via Planning briefs that reference the new H2, not via reading Consequences directly.)

## Low-confidence appendix

None.

Verdict: **PASS**
