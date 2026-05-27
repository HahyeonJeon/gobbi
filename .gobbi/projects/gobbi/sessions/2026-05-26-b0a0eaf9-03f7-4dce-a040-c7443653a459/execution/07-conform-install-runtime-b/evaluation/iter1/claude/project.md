# Project — T7 conform install-runtime-b (commit 6f9dbf9)

## Artifact Summary + Memory reads
**What**: Conform install-runtime remaining subdirs (backlogs, checklists, references, scenarios) + README — 20 docs — to the §4 dev-doc standard: 9 base frontmatter keys, S-set staging-key strip, disposition preserved on backlogs, inline session-coordinate de-crypt, concept-first headings, no body reshaping. **Why**: T7 task in the dev-doc-standard waved retrofit (planning/artifacts/task-list.md id 07). **How**: frontmatter rewrite + inline de-crypt + heading rename, scoped to the 4 non-T6 subdirs + README, cumulative 44-doc verify.
Memory reads: planning/artifacts/task-list.md (T7 spec + verifies); skills/memorization/rules.md §1-§4 (the standard); mistakes executor-main-tree-edit-near-miss, design-literal-retire, naming-standard-positive-guidance; execution/evaluation.md child; principles P4/P8/P9/P11.

## Locked Frame (Stage 1)
**Right task, whole task, only the task**
- [ ] Change-set touches only T7's scoped subdirs (backlogs/checklists/references/scenarios/README) — not T6 (discussions/design/decisions/changelogs)
- [ ] All 20 contracted docs conformed; cumulative 44-doc gate covered
- [ ] No file outside features/install-runtime/ touched
**Verifies command passes (adversarial: gate gamed by partial strip)**
- [ ] §4.5 cumulative leak gate (both spellings, archive-safe) = 0 over all 44
- [ ] All 44 carry 9 base keys
- [ ] disposition preserved on 7 backlogs; absent on non-backlogs
not-applicable: no adversarial scope-creep scenario beyond the gate-gaming check — this is a pure docs-frontmatter conformance change with no code surface.

## Per-scenario per-check results
- T6 subdirs untouched: YES — `git show --name-only` lists 0 files under discussions/design/decisions/changelogs (evidence: subdir breakdown = 7 backlogs + 7 checklists + 3 references + 2 scenarios + 1 README).
- 20 contracted docs: YES — exactly 20 .md files, all under install-runtime.
- No out-of-feature file: YES — grep -v install-runtime/ returns NONE.
- Leak gate = 0 over 44: YES — find+grep (both spellings, -not archive) printed nothing; 44 P_live, 1 archive excluded.
- 9 base keys on 44: YES — 0 missing occurrences across 44×9 checks.
- disposition on 7 backlogs: YES (6 open, 1 deferred); non-backlogs: 0 disposition leaks.

## Typed findings
None at Critical/High. Scope is exact; verifies pass freshly. The change maps 1:1 to T7's stated outputs with no scope creep.

## Low-confidence appendix
- (Confidence 25) The README `session:` frontmatter value `a10c82d6-03f7-4dce-a040-c7443653a459` is a malformed/spliced id (branch token + current-session suffix); correct current session is `b0a0eaf9-...`. Tracked in detail under Consistency. Low severity (provenance only), not a scope-contract violation. Type: general / Domain: docs-sync / Disposition: open.

VERDICT: PASS
