# Focused Iter-2 Re-check — Codex Overall

Scope: verify only the iter-1 Codex REVISE drivers COD-OVERALL-001 and COD-OVERALL-002, plus requested count-drift/new-inconsistency sweep. Evidence uses repo-relative paths.

## 1. COD-OVERALL-001 — cache allow-set gates

RESOLVED.

Evidence:
- `planning/rawdata/plan.md:119-121`: "ALLOW-SET MEMBERSHIP — the top level of plugins/gobbi/ is EXACTLY {.claude-plugin, skills, agents, hooks}"; "no .gobbi, sessions, node_modules, .git, repo docs, or session memory"; "AUTONOMOUS source-package half ... (runs with no install)."
- `planning/rawdata/plan.md:197-202`: "installed-cache allow-set assertion that lists the installed cache top level and FAILS if it is not exactly {.claude-plugin, skills, agents, hooks}"; "any of .gobbi/sessions/project-memory/repo-doc entries"; "assert the installed-cache allow-set holds."
- `planning/staging/decisions/plugin-plan-decomposition-and-ordering.md:25`: "the R1 guard is asserted with executable clauses in both halves: T1's `--check` ... pre-install (AUTONOMOUS, source-package); the T5 install step asserts the installed cache top level equals the same allow-set (OPERATOR-RUN)."

Assessment: T1 now has the autonomous no-install source-package allow-set assertion with negative checks. T5 now carries the installed-cache allow-set assertion.

## 2. COD-OVERALL-002a — T5 harness pinning

RESOLVED.

Evidence:
- `planning/rawdata/plan.md:205-207`: "INSTALL SOURCE: from the worktree-faithful git-ref marketplace ... commit & push the SESSION branch ... then `claude plugin marketplace add <git-ref-source pointing at that branch>` followed by `claude plugin install gobbi@<marketplace>`; confirm with `claude plugin validate`."
- `planning/rawdata/plan.md:207-210`: "MARKER FILE: each packaged hook script writes one line to \"$GOBBI_HOOK_MARKER_DIR/${hook_event_name}\""; "PER-EVENT DETERMINISTIC TRIGGERS ... PostToolUseFailure = issue one Task/Agent tool call ENGINEERED to exit non-zero."
- `planning/rawdata/plan.md:211-214`: "CLEANUP / ISOLATION BOUNDARY: run against an ISOLATED Claude config/HOME when possible"; otherwise "run `claude plugin uninstall gobbi` + `claude plugin marketplace remove <id>` + clear the install cache afterward."
- `planning/staging/decisions/plugin-plan-decomposition-and-ordering.md:31`: "Install source = worktree-faithful git-ref marketplace from the SESSION branch"; "marker file ... keyed on `hook_event_name`"; "PostToolUseFailure (Task engineered to exit non-zero)"; "isolated temp Claude config/HOME ... uninstall ... marketplace remove ... cache clear."

Assessment: the install CLI sequence, marker key, event triggers including PostToolUseFailure, and cleanup/isolation boundary are pinned.

## 3. COD-OVERALL-002b — T7 19th-skill consistency

RESOLVED.

Evidence:
- `planning/rawdata/plan.md:10`: "18" refers to "materialization time at T1"; "19" refers to "the final shipped package after the T7 resync."
- `planning/rawdata/plan.md:115-116`: T1 verifier checks "all canonical packaged-skill dirs present at materialization time (18 at T1)", not final package count.
- `planning/rawdata/plan.md:250-270`: T7 authors "the 19th canonical skill"; re-runs `scripts/sync-plugin-package.sh`; verifies `plugins/gobbi/skills/` "now has 19 dirs" and `--check` still exits 0.
- `planning/rawdata/plan.md:390`: "Skill count: \"18 at materialization (T1)\" and \"19 final after T7 resync\" used consistently."
- `planning/staging/decisions/package-includes-claude-plugin-skill-resync-after-t7.md:24`: "The final shipped package therefore contains **19 skills**, not 18."
- `planning/staging/decisions/package-includes-claude-plugin-skill-resync-after-t7.md:38-39`: T1 verifier is reworded to "all canonical packaged-skill dirs present at materialization time (18 at T1)"; T7 verifies the package "now has 19 dirs."

Assessment: include-and-ship is consistently applied. Historical references to the iter-1 "exactly 18" contradiction are explicitly explanatory/superseded, not active task requirements.

## 4. T5/T6 operator-assisted split

RESOLVED.

Evidence:
- `planning/rawdata/plan.md:179-184`: T5 is "OPERATOR-ASSISTED"; autonomous portion is script + marker/assertion logic + written procedure; operator-run portion is install + clean session + event triggers + evidence return; "MUST NOT claim autonomous executor verification of the installed state."
- `planning/rawdata/plan.md:223-228`: T6 is "OPERATOR-ASSISTED"; autonomous portion is script + TRUE/FALSE extraction + operator procedure + conditional-edit logic; operator-run portion performs post-install invocations and returns TRUE/FALSE.
- `planning/rawdata/plan.md:334`: "The executor does NOT claim autonomous verification of the installed state — doing so would stall Execution or fabricate evidence."
- `planning/staging/plans/gobbi-claude-code-plugin-build.md:32-33`: T5 and T6 are labelled "OPERATOR-ASSISTED"; each separates AUTONOMOUS script/procedure work from OPERATOR-RUN live install/invocation.

Assessment: a spawned executor has an autonomous deliverable and a clear operator evidence boundary, so it should not stall or fabricate installed-state verification.

## 5. New inconsistency / count drift

RESOLVED.

Evidence:
- `planning/rawdata/plan.md:390`: "18 at materialization (T1)" and "19 final after T7 resync" are "used consistently."
- `planning/staging/plans/gobbi-claude-code-plugin-build.md:24`: "18 canonical skills materialized at T1"; T7 authors a 19th and "the final package ships 19 skills."
- `planning/staging/plans/gobbi-claude-code-plugin-build.md:34-35`: T7 resyncs "package 18 → 19"; T8 documents "19 packaged skills."
- `planning/staging/decisions/package-includes-claude-plugin-skill-resync-after-t7.md:45`: the old "18-skill inventory is frozen and excludes it" deferral "no longer holds: D-8 ships it in this plan."

Assessment: no new count drift found. The only remaining "exactly 18"/"frozen 18" wording is in a section describing and superseding the iter-1 contradiction.

## NEW-ISSUES

None.

VERDICT: PASS
