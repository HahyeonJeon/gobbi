## Artifact Summary + Memory reads

What: Preparation iter3 surgically adds the symlink-preservation edit contract to address the 5 convergent Codex iter2 REVISE findings (COD-STRUCT/USAGE/CONS/RISK/OVERALL-PREP2-001) that share one root cause: the iter2 "editing either path edits the same physical file" claim was unguarded against rewrite-by-rename edit tools.
Why: Bundle B Planning needs an unambiguous, empirically-anchored contract that prevents T1/T3 executors from silently breaking the workspace→canonical symlink layer via `sed -i`/`perl -i`-style writes.
How: 3 surgical changes (Fix 1: new H2 "## Symlink-preservation edit contract" inserted in the mirror-policy decision file between Consequences and Empirical reference; Fix 2: draft updated to record the change + iter3-specific Decisions log row 20 + coverage map; Fix 3: judged necessary — staged a deferred ci-symlink-integrity-check backlog).
Scope: T1+T3 (Bundle B) only. T2 deferred. Memory Access Matrix cleanup explicitly out of scope.
Consumers: Planning leader, T1/T3 executors, Wrap-up promotion.

Memory reads:
- `preparation/rawdata/draft-iter3.md` (310 lines) — primary target
- `preparation/rawdata/draft-iter2.md` (256 lines) — for scope-discipline diff
- `preparation/staging/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md` (126 lines, 8 H2 sections)
- `preparation/staging/backlogs/project/ci-symlink-integrity-check.md` (60 lines, NEW iter3)
- `preparation/evaluation/iter2/codex/{structure,usage,consistency,risk,overall}.md` — the 5 convergent findings being addressed
- `preparation/evaluation/iter2/claude/*.md` — iter2 Claude PASS verdicts (no inheritance pressure from this side)
- `preparation/evaluation/iter1/{claude,codex}/*.md` — for double-supersession audit
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md` — only project rule
- `.gobbi/projects/gobbi/mistakes/leader-iter2-verification-claim-without-evidence.md` — directly relevant to this iter (empirical-claim-without-evidence trap)
- `.gobbi/projects/gobbi/mistakes/claude-evaluator-step4-only-vs-codex-whole-file-grep.md` — whole-file vs slice-grep evaluator trap
- `.claude/skills/preparation/SKILL.md` + `.claude/skills/preparation/evaluation.md` + `.claude/skills/evaluation/SKILL.md` + `.claude/skills/principles/SKILL.md`
- Tool checks: `find .claude/skills/ -type l -name "*.md" | wc -l` → 53; `git ls-files -s .claude/skills/orchestration/SKILL.md` → 120000; `git ls-files -s .gobbi/projects/gobbi/skills/orchestration/SKILL.md` → 100644; `/tmp/sym-test-eval/` `sed -i` reproduction → link.md became regular file with MODIFIED, canonical.md unchanged with orig (failure mode confirmed end-to-end on this evaluator's machine).

W/W/H gate: PASS. What is concrete (3 named fixes against 5 named prior-iter findings). Why is concrete (the 5 convergent Codex findings + their shared root cause). How is concrete (insert H2 between two named existing H2s; append draft Decisions row + coverage map; stage a named backlog file with named pick-up triggers).

## Locked Frame (Stage 1)

Scenario P1: The iter3 fixes trace to the Scope Contract and inherited findings, not new self-invented scope.
- P1.1: Each of the 3 named iter3 fixes maps to either an iter2 Codex finding ID or to the iter3 brief's surgical scope.
- P1.2: No iter3 fix expands scope beyond Bundle B (T1+T3).
- P1.3: Memory Access Matrix cleanup is explicitly kept out of scope.

Scenario P2: The 5 convergent Codex iter2 findings are addressed at root, not cosmetically.
- P2.1: The new H2 section actually constrains edit-tool selection (not just adds prose).
- P2.2: The "Implication for Bundle B Execution" bullets in the draft body have been rewritten to add the inode-preserving qualifier (matching the new H2).
- P2.3: The Coverage map in the draft maps each of the 5 findings to a specific point in the new H2.

Scenario P3 (adversarial): The deferred CI backlog (Fix 3) was self-authorized scope creep.
- P3.1: Fix 3 has a stated witness/trigger basis (not "while we're here" / "for consistency" speculation per Principle 10).
- P3.2: The deferred status is consistent with the zero-witness count.
- P3.3: A scope drift diff (draft-iter3 vs draft-iter2) shows only intended iter3 changes.

Scenario P4: Decisions log captures the iter3 user-authorization.
- P4.1: Row 20 exists and names the user-lock + the 5 convergent findings.
- P4.2: Decisions log header says "20 decisions ... iter1 base 15 + iter2 surgical 4 + iter3 surgical 1".
- P4.3: No iter3 decision is missing from the log.

## Per-scenario per-check results

P1.1: Yes. Coverage map (draft lines 296-307) maps each of COD-STRUCT/USAGE/CONS/RISK/OVERALL-PREP2-001 to a specific point in the new H2 section. Fix 1+2+3 enumerated in the iter3 header (line 8).
P1.2: Yes. Out of scope gaps section (draft lines 254-259) preserves T2 + Memory Access Matrix deferral verbatim from iter2; Memory Access Matrix gap explicitly notes the iter3 edit contract creates further drift but is still out of scope. No skill outside `.claude/skills/orchestration/...` is touched.
P1.3: Yes. Draft line 258 explicitly says "Not in Bundle B scope; capture as informal follow-up only."

P2.1: Yes. The new H2 (decision file lines 63-109) names 10 edit methods with binary safe/unsafe verdicts, gives 4 numbered discipline points (prefer Edit; canonical mirror for bulk; `test -L` post-edit gate; CI hook deferred), and cites the empirical witness inline.
P2.2: Yes. Decision file's "Consequences" section (lines 54-61) is unchanged (iter2 preserved); however, the **draft's** "Implication for Bundle B Execution" bullets (lines 215-219) were rewritten to add the inode-preserving qualifier — verified line-by-line in the diff. (Note for caveat: the **decision file** Consequences bullets at lines 56-58 still say "Editing either path edits the same physical file" without the qualifier — see Finding P-001 below.)
P2.3: Yes. Draft Coverage map table (lines 300-306) names each finding ID, its perspective, the root concern verbatim from iter2 codex, and the specific iter3 mechanism that addresses it.

P3.1: Yes. ci-symlink-integrity-check.md lines 22-31 cite (a) iter2 Codex's empirical `/tmp` reproduction as the risk witness, (b) zero current witness count for the actual defect, (c) Principle 10 rationale for deferral, (d) 3 explicit pick-up triggers.
P3.2: Yes. `status: deferred` in frontmatter (line 3) matches the body's zero-witness rationale.
P3.3: Yes. Diff iter2→iter3 shows only: header prefix change (iter2→iter3); Decisions log row 20 added; iter3 net-deltas paragraph added; "iter3 outputs" subsection added under Generated this loop; CI backlog entry added to Deferred section; coverage map appended; WORK exit checklist updated with iter3-specific items. No incidental other-file edits.

P4.1: Yes. Row 20 (draft line 248) cites "iter3 AskUserQuestion user lock: 'iter3 surgical add edit contract'" and names all 5 Codex finding IDs.
P4.2: Yes. Draft line 225: "20 decisions below capture every AskUserQuestion outcome ... iter1 base 15 + iter2 surgical 4 + iter3 surgical 1".
P4.3: Yes. The single iter3 AskUserQuestion ("iter3 surgical add edit contract") is row 20; the iter3 brief lists Fix 1+2+3 as a single authorization unit.

## Iter1+iter2 finding dispositions (inherited)

(Project perspective — iter1 Claude had no Critical/High findings; iter2 Claude was PASS across the board. Iter2 Codex Project was PASS. No prior-iter Project finding needs disposition tracking here. The 5 iter2 Codex findings that drove iter3 are inherited under their owning perspectives — Structure / Usage / Consistency / Risk / Overall — not Project.)

## Typed findings

ID: CL-PROJ-PREP3-001
Type: assumption_risk
Domain: docs-sync
Disposition: open
Confidence: 50
Severity: Low
Evidence: The mirror-policy decision file's "## Consequences" section (lines 54-61) still asserts "A single `Edit` against either path updates the canonical file" without the inode-preserving qualifier. The iter3 fix added the qualifier in the **draft body** (lines 215-219) and in the new H2 section (lines 63-109), but the Consequences section is unchanged. A reader landing in Consequences first (it precedes the new H2 by 2 sections) could form the old-broad mental model before reaching the constraint. The Coverage map (Consistency cell) acknowledges the draft-body rewrite but does NOT mention rewriting the decision file's Consequences section.
Surfaced-by: claude
FP-check: not Pre-existing (iter2 file body unchanged is correct relative to iter2 lock; iter3's choice not to amend Consequences is the issue). Not Out-of-scope (it's the same file iter3 touched). Not Style. Not Linter-catchable. Not Speculative (the Consequences text is verifiable in the file).
Why Confidence 50: The H2 section appears 5 sections later and references the qualifier; a careful reader will reconcile. The risk is real but mitigated by the new H2 + the explicit cross-reference from the draft's mirror-policy section.

## Low-confidence appendix

None.

Verdict: **PASS**
