## Artifact Summary + Memory reads

What/Why/How: see project.md. Structure perspective lens: is the decomposition of iter3's surgical changes sound — staging paths correct, frontmatter consistent, decision-file H2 ordering preserved, no malformed templates.

Memory reads: same as project.md (omitted for brevity). Stage-1 tool check ran:
- `grep '^##' .../mirror-canonical-symlinks.md` → 8 H2 sections in canonical order (Context / Decision / Rationale / Alternatives considered / Consequences / Symlink-preservation edit contract / Empirical reference / Related)
- `wc -l` → 126 lines (matches leader's "78 → 126" claim)
- staging tree `find` → 9 files exact, matches "Generated this loop" enumeration
- `find .claude/skills/ -type l -name "*.md" | wc -l` → 53 (matches leader claim)
- `git ls-files -s` → 120000 + 100644 modes match leader's quoted output verbatim

## Locked Frame (Stage 1)

Scenario S1: The new H2 inserts at the documented position without breaking H2 ordering.
- S1.1: Decision file has 8 H2 sections in the order Context → Decision → Rationale → Alternatives considered → Consequences → Symlink-preservation edit contract → Empirical reference → Related.
- S1.2: The new H2 sits between Consequences and Empirical reference (the position the draft + WORK exit checklist claim).
- S1.3: No existing H2 was renamed, reordered, or deleted.

Scenario S2: Staged artifacts route to the correct staging subdirectories per the `wrap-up` routing table.
- S2.1: New CI backlog at `staging/backlogs/project/` (correct — project-tier deferral).
- S2.2: Edited mirror-policy decision remains at `staging/decisions/` (no path change).
- S2.3: All 9 staged files (5 backlogs + 3 decisions + 1 design) are at the expected paths per the Generated/Deferred sections.

Scenario S3: Frontmatter of new + edited files is well-formed.
- S3.1: ci-symlink-integrity-check.md frontmatter has `title / status / project / feature / task / anchor_session / created` — comparable to sibling backlog files.
- S3.2: mirror-canonical-symlinks.md frontmatter is unchanged from iter2 (date / session / status / feature / supersedes / superseded_by — verified).
- S3.3: No new file uses placeholders (`TODO` / `TBD` / `<...>`).

Scenario S4 (adversarial): A bulk-edit on the decision file via an unsafe tool (the very failure mode the new H2 warns against) would silently corrupt the decision file itself.
- S4.1: The new H2 names the safe edit methods (Edit / Write / vim / nano / git apply).
- S4.2: The new H2 names the unsafe methods (sed -i / perl -i / awk-redirect / formatter-backup) explicitly.
- S4.3: The post-edit verification gate (point 3) supplies an exact restore command (`rm + ln -sfn`) with depth-dependent prefix caveat.

Scenario S5: Draft `## WORK exit checklist (iter3)` enumerates iter3-specific verifications, not stale iter2 boilerplate.
- S5.1: Checklist names the new H2 section by name and counts H2 sections (8).
- S5.2: Checklist names the new ci-symlink backlog with status.
- S5.3: Empirical re-verification commands are iter3-stamped.

## Per-scenario per-check results

S1.1: Yes. `grep '^##'` output matches verbatim.
S1.2: Yes. H2 #6 (Symlink-preservation edit contract) sits between #5 (Consequences) and #7 (Empirical reference).
S1.3: Yes. The other 7 H2 names match iter2's set (verified via prior-iter Codex Stage-0 register, which listed Context/Decision/Rationale/Alternatives/Consequences/Empirical/Related).

S2.1: Yes. ci-symlink-integrity-check.md is at staging/backlogs/project/ (sibling of hooks-domain-mistakes-watchlist.md, session-lifecycle-..., gobbi-hook-authoring-skill.md, workspace-to-mirror-sync-mechanism.md).
S2.2: Yes. mirror-canonical-symlinks.md is at staging/decisions/ (verified via `find`).
S2.3: Yes. 9 staged files match the Generated this loop + Deferred enumeration (5 backlogs project + 3 decisions + 1 design = 9; the iter1 superseded mirror decision still counts as a decision file).

S3.1: Yes. Frontmatter fields: `title`, `status: deferred`, `project: gobbi`, `feature: null`, `task: null`, `anchor_session: ...`, `created: 2026-05-24`. Comparable to other project backlog files.
S3.2: Yes. Decision file frontmatter at lines 1-8 matches the iter2 set (date / session / status: accepted / feature: null / supersedes: mirror-propagation-policy-workspace-canonical.md / superseded_by: null).
S3.3: Yes. `grep TODO\|TBD\|<\.\.\.>` returns no hits in the new H2 section or the new backlog.

S4.1: Yes. Table rows 1-5 (decision file lines 76-80) mark Edit/Write/vim/nano/git apply as YES.
S4.2: Yes. Table rows 6-9 (lines 81-84) mark sed -i / perl -i / awk-redirect / formatter-backup as NO with the rewrite-by-rename reason.
S4.3: Yes. Decision file line 93 supplies the exact restore: `rm .claude/skills/<path> && ln -sfn ../../../.gobbi/projects/gobbi/skills/<path> .claude/skills/<path>` with the depth-dependent prefix caveat.

S5.1: Yes. WORK exit checklist line 286: "Mirror-policy decision file has the new '## Symlink-preservation edit contract' H2 section (verified: 8 H2 sections — Context / Decision / Rationale / Alternatives considered / Consequences / Symlink-preservation edit contract / Empirical reference / Related; file 78 → 126 lines)."
S5.2: Yes. Line 287: "CI symlink-integrity backlog staged with `deferred` status + Principle-10 rationale (zero current witnesses) + 3 pick-up triggers."
S5.3: Yes. Line 288: iter3-stamped empirical commands enumerated.

## Iter1+iter2 finding dispositions (inherited)

ID: COD-STRUCT-PREP2-001 (Codex iter2 Structure)
disposition: addressed
evidence: The new H2 section in the decision file is the "explicit symlink-preserving edit contract or canonical mirror-path edit rule" Codex requested. The safety table (10 rows) + 4-point discipline list directly answer the finding. Verified empirically that the H2 exists between Consequences and Empirical reference; verified `sed -i` reproduces the failure mode on this evaluator's machine.

ID: CL-STRUCT-PREP1-* / CL-STRUCT-PREP2-* (Claude prior-iter Structure)
disposition: addressed
evidence: Claude iter2 Structure was already PASS. No outstanding Claude Structure findings carried forward.

## Typed findings

ID: CL-STRUCT-PREP3-001
Type: design_flaw
Domain: docs-sync
Disposition: open
Confidence: 50
Severity: Low
Evidence: The decision file's "## Consequences" section (lines 54-61) is unchanged from iter2. Specifically line 57 still asserts "A single `Edit` against either path updates the canonical file" without the inode-preserving qualifier. The 5 Codex findings noted that the iter2 broad statement was the problem; the iter3 fix added a qualifier in the new H2 but did not amend the older H2 that still contains the broad statement. A consumer reading Consequences before reaching the new H2 (Consequences is H2 #5; the contract is H2 #6) gets the old broad mental model first.
Surfaced-by: claude
FP-check: not Pre-existing (this evaluator is judging the iter3 deliverable, not iter2). Not Out-of-scope (same file iter3 touched). Not Style. Not Linter. Not Speculative.
Why Severity Low: the new H2 immediately follows; readers progressing sequentially will see the qualifier within the same document. Coverage map (Consistency cell) acknowledges that the draft's Implication bullets were rewritten — but did not extend the rewrite into the decision file's Consequences. This is a documentation-internal inconsistency, not an executor-facing safety hole (the H2's discipline list is what executors will be pointed at by Planning briefs).

## Low-confidence appendix

None.

Verdict: **PASS**
