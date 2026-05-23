# Codex Evaluation Iter2 - Consistency

## Artifact Summary + Memory reads

Artifact: `ideation/rawdata/draft-iter2.md`, Bundle A Ideation draft. Consistency lens checks whether the draft's internal claims, citations, and empirical evidence align with each other and with live project files. Memory reads included the required Gobbi skill docs, iter1 Codex Consistency finding, the target draft, and live filesystem checks.

Fresh verification:
- T-count command returned `8/13/3/2/9/2/2`.
- `find /playinganalytics/git/gobbi/.agents/skills -maxdepth 1 -type l | wc -l` returned `16`.
- `find /playinganalytics/git/gobbi/.agents/skills -maxdepth 1 -type l -printf '%f -> %l\n' | sort` listed 16 symlinks, all targeting `../../.gobbi/projects/gobbi/skills/<skill>`.

## Locked Frame (Stage 1)

Scenario C1: Prior-session witness wording is consistent everywhere it appears.
- Check: Top changelog, Framed Problem, Research Insights, Implementation Checklist, and Decisions Log use the same T-by-T counts.
- Check: Full-evaluation versus partial-evaluation loops are not conflated.

Scenario C2: Live filesystem evidence matches the draft's empirical claims.
- Check: `.agents/skills` symlink pattern and count are reported accurately.
- Check: Claims about current files distinguish "current baseline" from "target after adding codex".

Scenario C3 (adversarial): The draft creates a new contradiction while fixing an old one.
- Check: New empirical assertions introduced in iter2 survive live commands.

## Per-scenario per-check results

C1: PASS. Iter2 lines 30, 126-129, 204-205, 229, and 576 consistently state T1/T2/T5 as memorization-gap witnesses and T3/T4/T6/T7 as eval-also-skipped witnesses. The live count command matches the numeric values.

C2: FAIL on a Medium precision issue. Iter2 lines 31, 236-238, 385, and 578 repeatedly say the current `.agents/skills/` pattern has 17 directory symlinks. The live count is 16 before codex exists. The intended target after adding `.agents/skills/codex` would be 17, but the draft describes the baseline as already 17.

C3: PARTIAL. The main iter1 High witness issue is fixed, but the new symlink-count claim is a fresh empirical mismatch.

## Typed findings

### COD-CONS-001 - False "full evaluation content" claim is repeated across sections
- Type: `general`
- Domain: `docs-sync`
- Disposition: `addressed`
- Confidence: 100
- Severity: High
- Evidence: Iter2 lines 126-129, 204-205, 229, and 576 use the corrected T1/T2/T5 versus T3/T4/T6/T7 distinction, confirmed by fresh `find ... -type f | wc -l` counts.
- Resolution status: RESOLVED.

### COD-CONS-002 - `.agents/skills` baseline count is overstated as 17 when the live count is 16
- Type: `general`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: Medium
- Evidence: Iter2 lines 31, 236-238, 385, and 578 say `.agents/skills/` contains 17 directory symlinks. Fresh `find /playinganalytics/git/gobbi/.agents/skills -maxdepth 1 -type l | wc -l` returned `16`, listing delegation, discussion, evaluation, execution, git, gobbi, ideation, interview, memorization, mistake, orchestration, planning, preparation, principles, research, and wrap-up. The draft should say the existing baseline is 16 and adding codex will make 17.
- Impact: Non-blocking for the symlink design, but it repeats the kind of empirical overstatement iter2 was supposed to remove.

Counts: Critical 0 / High 0 / Medium 1 / Low 0 / Nit 0.

Verdict: PASS

## Low-confidence appendix

None.
