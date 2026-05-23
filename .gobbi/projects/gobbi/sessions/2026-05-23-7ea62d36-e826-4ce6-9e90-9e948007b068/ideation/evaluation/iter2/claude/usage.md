---
artifact_type: evaluation
phase: ideation
iter: 2
perspective: usage
system: claude
verdict: REVISE
session-id: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
loop: ideation
---

# Iter2 Re-evaluation — Usage Perspective (Claude)

## Frame

Mode default (COD-USAGE-001) reconciled to settings; bootstrap UX (F-CLAUDE-U-02) cited correctly.

## Findings

### F-CLAUDE-USAGE2-01 [LOW] — Mode default reconciled to "auto" matching settings.default.json

- **Type**: `general`
- **Domain**: `docs-sync`
- **Disposition**: `addressed`
- **Confidence**: 100
- **Severity**: Low

**Evidence**: Verified via `jq '.mode' settings.default.json` → `"auto"`. Iter2 line 33 (changelog), line 67 row G (Scope Contract), line 100 (Success Criteria #6: "default **auto**, matching `orchestration/templates/settings.default.json:3`"), line 219-221 (I10), line 367 (Checklist row 12: "default auto"), line 542 (Design G Question 1: "**Default auto**"), line 573 (Decisions Log row 10). All consistent. COD-USAGE-001 resolved.

### F-CLAUDE-USAGE2-02 [MEDIUM] — Success Criterion 8 weakened to a CLAUDE.md:50 citation; original principle 5 spirit lost

- **Type**: `general`
- **Domain**: `process`
- **Disposition**: `open`
- **Confidence**: 60
- **Severity**: Medium

**Evidence**: Iter1 Success Criterion 8 (line 76) read "All edits respect `.claude/CLAUDE.md` 'Never edit gobbi skills without asking the user with AskUserQuestion'". Iter2 line 102 changes this to "User has pre-approved the 7-item scope via DISCUSSION lock... the bundle respects the mistake-discipline rule per `.claude/CLAUDE.md:50` ('Every agent MUST load the `mistake` skill... When the user corrects any approach, immediately record it as a mistake...')". The cited line 50 rule is about *mistake-recording*, not about *asking-before-editing-gobbi-skills*.

**Why it matters**: The iter1 wording (which F-CLAUDE-U-02 flagged for wrong line citation) had a clear semantics: ask before editing gobbi skills. The iter2 fix changed the cited rule entirely to a different rule (mistake recording). This is not citation repair — it's substitution. The original ask-before-editing-gobbi-skills semantics may still apply but is now uncited in the draft. Either (a) the rule actually doesn't exist in CLAUDE.md and the criterion was conceptually wrong (in which case the leader should have removed it), or (b) the rule exists at a different line and the criterion should cite that. The leader didn't disambiguate. F-CLAUDE-U-02 nominally resolved but introduces a semantic drift.

**Confidence rationale**: 60 — the leader-cited rule does exist verbatim at CLAUDE.md:50, but it's a different rule from what Success Criterion 8 was originally trying to express. Without seeing the original brief language I can't be 100% certain the semantic drift is harmful; the iter2 wording is at least internally consistent.

### F-CLAUDE-USAGE2-03 [MEDIUM] — Post-eval `find` sanity check added; F-CLAUDE-O-01 / R-02 resolved

- **Type**: `general`
- **Domain**: `process`
- **Disposition**: `addressed`
- **Confidence**: 100
- **Severity**: Low

**Evidence**: Iter2 line 38 (changelog), line 95(c) (Success Criteria #1 "+ a `find` post-eval sanity check"), line 196 (I4 enumerates THREE correctives including post-eval `find`), line 278 (Golden scenario step 5), line 302 (Edge scenario step 6), line 369 (Checklist row 14 "post-eval `find` sanity check"), line 415 (Design A § Sandbox + CWD discipline), line 425 (Design A § Use cases (a) post-eval verification step). All consistent. The 3rd corrective from the mistake file is now explicit across draft.

## Resolution status per iter1 finding

- COD-USAGE-001: **resolved** at iter2 lines 33, 67, 100, 219, 367, 542, 573.
- F-CLAUDE-U-02: **partially resolved** — citation now points at the correct line 50 but cites a semantically different rule than the criterion originally expressed (see F-CLAUDE-USAGE2-02).
- F-CLAUDE-O-01 / F-CLAUDE-R-02: **resolved** at iter2 lines 38, 95, 196, 278, 302, 369, 415, 425.

## Verdict

**REVISE** — F-CLAUDE-USAGE2-02 is Medium with Confidence 60. Not blocking, but worth re-stating Success Criterion 8 with cleaner intent. No High/Critical here.
