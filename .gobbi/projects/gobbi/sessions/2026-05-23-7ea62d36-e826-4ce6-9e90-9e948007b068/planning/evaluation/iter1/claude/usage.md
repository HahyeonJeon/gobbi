---
loop: planning
iter: 1
system: claude
perspective: usage
---

# Usage Perspective — Planning Iter 1

## Locked Frame (Stage 1)

### Scenarios with attached checklists

**S1 — Fresh Executor for task N can execute from task spec alone**
- C1.1 Task spec contains files to open
- C1.2 Task spec contains success criteria
- C1.3 Task spec contains verifies that run as-is

**S2 — Executor knows which file/function/test to touch**
- C2.1 Files paths concrete (not `<your test path>`)
- C2.2 Section anchors cited where relevant

**S3 — Failure modes per task communicated**
- C3.1 Required mistakes (Required mistakes field) cite preventive context
- C3.2 Pre-conditions in `inputs:` field

**S4 — Inter-task handoff explicit**
- C4.1 Task N output is task N+k input — name match
- C4.2 User-input mid-execution explicitly flagged (Task 05's user-decision dependency from Concern 3)

**S5 (adversarial) — Executor must ask "what does X mean here"**
- C5.1 Project glossary terms used as-is
- C5.2 No new acronyms introduced without expansion
- C5.3 5-Type vocabulary cited verbatim where used (Tasks 04, 05, 07)
- C5.4 8 H2 section names for codex skill cited verbatim where used (Task 06)

**S6 (cross-cutting accessibility — Coverage Matrix: Usage) — Plan structure scannable**
- C6.1 Plan has section H2/H3 hierarchy
- C6.2 Per-task YAML block is readable + greppable
- C6.3 Cross-references use full paths (not "see above")

## Per-scenario per-check results

| Check | Verdict | Evidence |
|---|---|---|
| C1.1 | yes | Each task `files:` block enumerates paths |
| C1.2 | yes | Each task `verifies:` provides binary pass/fail criteria |
| C1.3 | yes | Verifies are runnable as-is |
| C2.1 | yes | Concrete paths |
| C2.2 | yes | Anchors cited (e.g., "lines 99-114" for gobbi Step 4, "line 224" for memorization Path conventions, "lines 79-104" for delegation Load Directives Block) |
| C3.1 | yes | Required mistakes field per task identifies preventive context (codex-eval-session-write-path + manager-iter2-brief mistakes) |
| C3.2 | yes | Inputs field cites pre-conditions |
| C4.1 | yes | Outputs of upstream tasks consumed by downstream — e.g., Task 06 rebases on Task 01 (gobbi/SKILL.md state) |
| C4.2 | yes | Task 05's user-decision dependency explicit at lines 268-269 ("User-confirmed cell text from AskUserQuestion (manager-resolved at WORK entry)") |
| C5.1 | yes | Glossary terms intact |
| C5.2 | yes | No new acronyms |
| C5.3 | yes | 5-Type vocab cited verbatim in Task 04 (line 243) — `scenario_gap.*checklist_gap.*design_flaw.*assumption_risk.*general` |
| C5.4 | yes | 8 H2 section names cited verbatim in Task 06 (lines 305-313) |
| C6.1 | yes | Plan has clean H1/H2/H3 hierarchy |
| C6.2 | yes | YAML blocks are scannable |
| C6.3 | partial | Most cross-references full-path. See F-USAGE-01 |

## Typed findings

### F-USAGE-01 — Task 05 file path in verifies uses `sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/...` truncated relative path

- **Type:** `general`
- **Domain:** `docs-sync`
- **Disposition:** open
- **Confidence:** 75
- **Severity:** Low
- **Evidence:** `draft-iter1.md:278` — `test -f sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/staging/backlogs/project/normalize-path-conventions-h3.md`. The `test -f` will only succeed if the CWD is `/playinganalytics/git/gobbi`. Other tasks use either canonical `.agents/skills/` repo-relative paths or absolute `.gobbi/projects/...`. The CWD-dependence is the well-known worktree-vs-main-tree write-path failure mode (per the codex-eval-session-write-path mistake).
- **Why it matters:** Task 05 executor will run in a worktree (per session git workflow mode). The worktree-CWD-relative path differs from main-tree CWD. The verifies could pass in a worktree without actually staging the backlog file at the canonical main-tree location.
- **Suggested direction:** make all session-path verifies use the absolute prefix `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/...` to avoid the worktree-CWD-relative trap recorded in the codex-eval-session-write-path mistake.

### F-USAGE-02 — Task 07 verifies block uses absolute-relative mix

- **Type:** `general`
- **Domain:** `docs-sync`
- **Disposition:** open
- **Confidence:** 50
- **Severity:** Low
- **Evidence:** Task 07 verifies (lines 344-359) use `.agents/skills/...` repo-relative paths. Per `git/SKILL.md` worktree CWD discipline, repo-relative paths resolve correctly within either main-tree CWD or worktree CWD because both have `.agents/skills/` at the relative location. However the Plan-wide path style preference (per Preparation `preparation.md:73-86` confirms all source-of-truth paths are absolute) is inconsistent.
- **Why it matters:** Aesthetic-consistency, but also the documented disciplines preference absolute paths for session writes (mistake-driven).
- **Suggested direction:** stay with repo-relative for `.agents/skills/*` reads since both worktree and main-tree have identical relative path. Use absolute for any `sessions/...` write or check (resolved via F-USAGE-01).

### F-USAGE-03 — Task 06 brief discipline mentions "dogfood gate not required — content can cite the standard from claude/SKILL.md if it exists at .claude/skills/..."

- **Type:** `assumption_risk`
- **Domain:** `process`
- **Disposition:** open
- **Confidence:** 50
- **Severity:** Low
- **Evidence:** `draft-iter1.md:466` — "Stage codex skill content per `_claude` writing standard via the **codex** skill being authored (dogfood gate not required — content can cite the standard from `claude/SKILL.md` if it exists at `.claude/skills/...`)." Concern 5 resolution at the same Plan (lines 102-104) states "The `_claude/SKILL.md` cited in the stub does NOT exist (`ls .agents/skills/_claude/` → not found; `ls .claude/skills/claude/` → not found)." The brief discipline language conflicts with the Concern 5 finding — it tells the executor to "cite the standard from `claude/SKILL.md`" while Concern 5 says that file doesn't exist at `.claude/skills/`. (Note: `_claude` IS bundled in the gobbi v0.4.5 plugin under `~/.claude/plugins/marketplaces/gobbi/.claude/skills/_claude/` — workspace-level, not in this repo's `.claude/skills/`. The bundled location may be what gobbi/SKILL.md's Skill Map references at line 192.)
- **Why it matters:** Conflicting brief guidance → Task 06 executor may either drop the `_claude` reference (per Concern 5) or cite it (per brief discipline #5).
- **Suggested direction:** clarify the brief sketch — either (a) confirm `_claude` is referenced as a workspace-level plugin skill (and cite that path), or (b) drop the citation entirely per Concern 5.

## Verdict

**PASS** — 3 Low findings; Task 05/06/07 verifies could be tightened for worktree-CWD safety + Task 06 brief clarity.
