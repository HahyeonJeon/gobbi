# Project — Planning iter1 (Claude)

**Verdict:** PASS

## Artifact Summary

- **Target:** `<session>/planning/rawdata/draft-iter1.md` (561 lines), a mini-Plan decomposing the iter2 Idea doc into 7 tasks plus a Plan-level acceptance test.
- **W/W/H:** WHAT = 7 ordered Execution tasks + cross-task acceptance test. WHY = Execution needs anchored, verifiable per-task contracts that honor the iter2 Idea-doc locks. HOW = T1→T2→T4→T5→T3→T7 user-confirmed order; T6 runs in Wrap-up; T3 amends SKILL.md after sub-docs exist so anchors resolve at write-time.

## Frame (Project — locked Scope-Contract scenarios)

- **S-P1 Canonical Scope-Contract schema** — Frontmatter + 5 body sections (In-Scope / Out-of-Scope / Decisions Locked / Success Criteria / Deferred), per `evaluation/SKILL.md § Scope Contract Schema`.
- **S-P2 7-task completeness** — Every Idea §7.3 row covered exactly once, no invented tasks.
- **S-P3 Lock fidelity** — Plan re-states (does not re-litigate) the locked decisions: 9 brief locks + R1 + R2/R3 + R5 + D-A + D-B.
- **S-P4 Plan-level acceptance test soundness** — 9-check acceptance test corresponds to verifiable post-Execution state.
- **S-P5 Bounded counterfactual** — Plan declines to author Execution-stage prose; remains at task-contract layer.

## Per-scenario Findings

- **S-P1 ✓** — §2 has the canonical frontmatter (artifact_type / feature / goal / created-by / created-at, lines 24-29) and all five required body H3s (lines 31-83): In-Scope, Out-of-Scope, Decisions Locked, Success Criteria, Deferred. Matches `evaluation/SKILL.md § Scope Contract Schema` exactly.
- **S-P2 ✓** — Idea §7.3 rows: 8 SKILL.md anchors → T3; settings.default.json → T4; state.template.json + session.template.json → T5; chat-mode.md → T1; auto-mode.md → T2; 2 backlog frontmatter+archive rows → T6. Plus T7 is anchored to §2 Deferred + §8 Finding #8 (a Create, not Update — Plan §Self-review acknowledges this). All 7 tasks accounted; no invented eighth task. Plan-level acceptance covers cross-task gates not in any single task.
- **S-P3 ✓** — Locks table at §2 (lines 59-67) accurately re-states 9 brief locks + R1 + R2/R3 + R5 + D-A + D-B. Each task's `pre-resolved-decisions:` block re-states the locks that bind it; none re-litigated.
- **S-P4 ✓** — All 9 acceptance checks map to observable post-Execution states: symlinks (#1+2), JSON parse (#3), cross-doc links (#4), R1 lock present in two places (#5), `workflow.chat.tasks[]` present (#6), no-bleed (#7+8), new backlog landed (#9). Tooling chain (test, find, jq, grep, git diff) is available; commands quoted as shell-ready.
- **S-P5 ✓** — Plan stays at task-contract layer; success criteria call out body landmarks (e.g., "exactly one canonical Chat MEMORIZATION statement matching the §3.3 four-bullet structure") rather than dictating verbatim prose. Honors Idea §6 "shape only" boundary per F-P1.

## New typed findings (none Critical/High)

- **F-PROJ-1 (Medium · Confidence 50 · `scenario_gap` · `process`)** — Plan §4 acceptance test runs `git -C "$WT" diff --name-only main..HEAD | grep -E 'memorization/SKILL.md$'`. The base branch in this work is `develop` (per `gitStatus`, `Main branch (you will usually use this for PRs): main` but current branch is `develop` and active commits since main include Bundle-C waves). Comparing `main..HEAD` will surface every change since main, not just this session's changes — including commits from PR #272 etc. that legitimately touched docs but NOT memorization/SKILL.md. The grep is precise enough to false-flag only if a prior PR touched memorization/SKILL.md (unlikely but unverified). Direction (don't prescribe): consider `develop..HEAD` or session-branch-base as the diff range. Confidence 50 because I did not run the diff to verify whether any landed commit on develop touches memorization/SKILL.md.
- **F-PROJ-2 (Low · Confidence 75 · `checklist_gap` · `process`)** — T6's verification command `rg -l '...' | grep -v archive` (line 442) catches kebab-slug substring matches but NOT prose pointers like "the chat-mode-tiki-taka backlog" or `[[chat-mode-tiki-taka-redesign]]` style links rendered through indirection. Plan §5 P-R4 acknowledges this as accepted residual risk; finding is informational rather than blocking.
- **F-PROJ-3 (Low · Confidence 75 · `general` · `process`)** — T1 success-criterion "chat-mode.md ≥ 200 lines" is heuristic, not contract — long-form content can compress below 200 lines and still cover all §3 sections. The grep-based criteria (term lock count ≥ 5, four-bullet skeleton phrases ≥ 4, etc.) are the real content gates. Direction (informational): the line-count check is fine as a smoke-signal — flag for transparency, not a fix.

## Verdict & Must-preserve

- **Verdict: PASS.** Plan honors `evaluation/SKILL.md § Scope Contract Schema`, covers all Idea §7.3 update rows with no invention, re-states locks without re-litigation, ships a runnable cross-task acceptance test.
- **Must-preserve:**
  - The 5-body-section Scope Contract shape (§2).
  - The per-task `pre-resolved-decisions:` block (each task carries its lock context inline — no cross-doc lookup needed at Execution time).
  - Plan-level acceptance test §4 — esp. checks #5 (R1 lock in two anchored places) and #6 (`workflow.chat.tasks[]` in both templates).
  - User-confirmed task order T1→T2→T4→T5→T3→T7; T6 in Wrap-up.

## Low-confidence appendix

- The `main..HEAD` choice in §4 check #7/#8 might be intentional (session branch is `chore/session-2026-05-28-8eed14fb`, presumably forked off develop or main); but the more-correct comparison base for this session's diffs is the session-branch fork point. Confidence 50.
