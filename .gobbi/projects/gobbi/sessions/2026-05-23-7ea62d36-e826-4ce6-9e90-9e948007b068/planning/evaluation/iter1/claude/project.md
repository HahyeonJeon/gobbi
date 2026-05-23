---
loop: planning
iter: 1
system: claude
perspective: project
artifact_type: evaluation
created_at: 2026-05-23
session-id: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
---

# Project Perspective — Planning Iter 1

## Artifact Summary

**What** — Decomposes the 7-item locked Idea (Bundle A) + 15 checklist items into 7 ordered Execution tasks (01-gobbi-polish-fg → 07-cross-link-sweep). Per-task: scope, traces-to, file map, requires, inputs, outputs, grep/awk/sed verifies. Concerns 1/2/5 auto-resolved with file:line citations; Concern 3 surfaced for USER DECISION via AskUserQuestion at Task 05 WORK entry; Concern 4 already closed by Preparation (symlinks promoted at EXIT).

**Why** — Repair four orchestration/workflow discipline gaps (codex anchor, memorization moment-of-capture, memorization delegation hard gate, wrap-up Step 2.5) + two polish items in `gobbi/SKILL.md` — per `idea.md:31-38` goal and the empirical witness session `2026-05-22-bac669ad` staging gaps.

**How** — One worktree + one branch + one focused commit + one PR per task, sequential order 01→07. Bundling considered + rejected (3 alternatives reasoned through). Iron Law 7 carry-forward: every brief MUST `Read` Ideation source verbatim before authoring (Tasks 04 + 06 flagged extreme-discipline).

**W/W/H verdict:** all three clear and specific.

## Memory reads

- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/.../planning/rawdata/draft-iter1.md` (target)
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/.../ideation/artifacts/idea.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/.../preparation/artifacts/preparation.md`
- `.agents/skills/evaluation/SKILL.md` (schema + perspectives + Coverage Ownership Matrix)
- `.agents/skills/planning/evaluation.md` (phase child doc — seed scenarios)
- 4 concern stagings under `planning/staging/decisions/`
- `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` (session-staged mistake)
- `codex-eval-session-write-path-nested-in-worktree.md` (project mistake)
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md`
- Empirical: codex stub H2 count, symlinks, gobbi Skill Map structure, wrap-up procedure table, memorization Path conventions block

## Locked Frame (Stage 1)

### Scenarios with attached checklists

**S1 — Every task traces to ≥1 Ideation checklist item**
- C1.1 Each of Tasks 01-07 has a `traces-to:` field
- C1.2 Each `traces-to:` cites an Ideation checklist item that exists verbatim in `idea.md:245-261`
- C1.3 Verification commands in `verifies:` map back to validation method from the checklist item

**S2 — Every Ideation checklist item (1-15) is covered**
- C2.1 Spec coverage table at `draft-iter1.md:501-518` enumerates 15 → tasks mapping
- C2.2 No checklist item is left orphan
- C2.3 Backlog routing exists for in-scope-but-deferred items (none expected; Bundle A is fully in-scope this session)

**S3 — No task implements something outside the Ideation Scope Contract**
- C3.1 Scope Contract phrasing inherited verbatim (not paraphrased)
- C3.2 No new requirement introduced (e.g., no "while we're here" cross-skill normalization pulled in-scope)
- C3.3 Out-of-Scope items per `idea.md:54-61` honored (no `packages/cli/`, no pathology β work, no other-skill normalization)

**S4 — Plan's terminal state matches Ideation Success Criteria**
- C4.1 All 9 Success Criteria from `idea.md:75-84` satisfied after Task 07 completes
- C4.2 Each criterion is traceable to one or more task verifies

**S5 (adversarial) — A "while we're here" task slips into the plan**
- C5.1 Concern 2 spillover (normalize Path conventions across mistake/planning) properly routed to backlog (not pulled in-scope)
- C5.2 Concern 5 spillover (normalize Constraints H2 across all skills) properly routed to backlog
- C5.3 COD-CONS-003 micro-fix inline in Task 04 only if/when example is authored — does not pull other tasks in

## Per-scenario per-check results

| Check | Verdict | Evidence |
|---|---|---|
| C1.1 | yes | All 7 tasks have `traces-to:` (lines 145-148, 172-175, 197-201, 227-231, 257-261, 287-292, 333-335) |
| C1.2 | yes | `traces-to:` entries cite checklist items 1-15 verbatim (`idea.md:245-261`) |
| C1.3 | yes | Each verifies block aligns with the checklist item's validation method |
| C2.1 | yes | Spec coverage table at lines 501-518 enumerates 15/15 |
| C2.2 | yes | No orphans; checklist 2 (symlinks) routed to "Resolved at Preparation EXIT; verified by 06 + 07 (`test -L`)" |
| C2.3 | yes | n/a — Bundle A is fully in-scope; backlog routing only for explicit out-of-scope items |
| C3.1 | yes | Scope Contract block at `draft-iter1.md:24-37` is verbatim from `idea.md:31-38` |
| C3.2 | yes | No new requirements introduced |
| C3.3 | yes | Out-of-scope items honored: NOT in scope list at lines 552-563 mirrors `idea.md:54-61` + adds the two spillovers as backlog |
| C4.1 | yes | All 9 Success Criteria mapped to task verifies (codex 8 H2 → Task 06; memorization Core Principle → Task 02; delegation entries → Task 03; wrap-up Step 2.5 → Task 04; CovOwn row → Task 05; Glossary move + Step 4 → Task 01; no `packages/cli/` writes — none authored; mistake-discipline rule honored — Iron Law 7 carry-forward documented; codex empirical sandbox claims — Task 06 cites I1-I14) |
| C4.2 | yes | Each criterion has a corresponding verify command in a task |
| C5.1 | yes | "Normalize `Path conventions` to H3 across `mistake/SKILL.md:126` + `planning/SKILL.md:459`" listed at `draft-iter1.md:561` under NOT in scope and staged as backlog by Task 05 |
| C5.2 | yes | "Normalize `Constraints` to `## Constraints` H2 across all skills" at line 562 listed as backlog spillover |
| C5.3 | partial | COD-CONS-003 micro-fix is conditional in Task 04 ("if such an illustrative example is authored") — see finding F-PROJ-01 below |

## Typed findings

### F-PROJ-01 — COD-CONS-003 micro-fix is dead-code conditional

- **Type:** `checklist_gap`
- **Domain:** `docs-sync`
- **Disposition:** open
- **Confidence:** 75
- **Severity:** Low
- **Evidence:** `draft-iter1.md:226` — "Also apply COD-CONS-003 micro-fix in this same task: 'Domain=`testing`' → 'Domain=`test`' if such an illustrative example is authored." Verify at line 248: `! grep -q 'Domain=\`testing\`' wrap-up/SKILL.md`. The current `wrap-up/SKILL.md` contains no `Domain=\`testing\`` example (verified empirically). The negative grep passes trivially regardless of whether Task 04 actually addresses the issue. If no example is authored in Step 2.5, the micro-fix is a no-op — fine. If an example IS authored but uses `testing` instead of `test`, the verify gate catches it only if the executor reads the verify command and re-checks; this is a weak signal.
- **Why it matters:** Idea Decisions Locked specifies COD-CONS-003 as a deferred Low. The Plan's resolution is conditional, so it could be silently un-applied. Low impact, but worth surfacing.
- **Suggested direction:** strengthen Task 04 brief to either (a) explicitly REQUIRE an illustrative example using `Domain=\`test\`` if Step 2.5 prose includes per-finding examples, OR (b) document that Step 2.5 will NOT include per-Type/Domain examples and explicitly close COD-CONS-003 as "no surface for the typo to land on, micro-fix moot".

## Verdict

**PASS** — every Ideation checklist item is covered; scope honored; no creep; Success Criteria all mapped. One Low finding (F-PROJ-01) for a conditional micro-fix that may quietly pass without doing work.
