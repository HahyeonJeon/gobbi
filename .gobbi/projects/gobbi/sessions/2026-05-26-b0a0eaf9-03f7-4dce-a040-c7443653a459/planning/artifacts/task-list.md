---
loop: planning
iter: 2
artifact_type: task-list
created_at: 2026-05-26
status: final
supersedes: []
related:
  - planning/rawdata/draft-iter2.md
  - planning/staging/plans/main.md
  - ideation/artifacts/idea.md
  - ideation/artifacts/scope-contract.md
  - ideation/artifacts/design-options.md
  - preparation/artifacts/handoff.md
---

# Task List — dev-doc-level project-memory standard + waved retrofit

25 executable task records. All ship this session (Decision 1). Dual-system evaluation on every task (Decision 3). Source: `planning/rawdata/draft-iter2.md`.

## Population baseline (TRUE, count-corrected at HEAD d2b5b37)

| Metric | Value |
|---|---|
| P_live all files | 222 |
| READMEs | 18 |
| Content docs | 204 |
| Hyphen-form leak files (FIX-1) | 63 |
| Underscore-form leak files (FIX-1 extension, install-runtime) | 5 |
| Backlog-disposition legit (preserved) | 28 |

Note: the locked Ideation/Preparation baseline (208/191/59) was computed with a `find` predicate that wrongly excluded in-scope `features/agents/` (14 docs, 4 leaks). This is a count correction (Decision 4), not a scope change.

## Wave summary

| Wave | Tasks | Count |
|---|---|---|
| Foundation | T0 | 1 |
| Wave 1 — Conformance (mechanical) | T1, T2, T3, T4, T5, T6, T7, T8, T9a, T9b, T9c | 11 |
| Reconciliation | T10 | 1 |
| Enforcement (grep gate) | T11 | 1 |
| Wave 2 — Prose | P1, P2, P3a, P3b, P4, P5a, P5b, P6, P7a, P7b | 10 |
| Wave 3 — Nav | N1 | 1 |
| **Total** | | **25** |

## Task records

### FOUNDATION

| Field | Value |
|---|---|
| id | 00-author-dev-doc-standard |
| what | Add §4 "Dev-document quality standard" to `.gobbi/projects/gobbi/skills/memorization/rules.md`: positive quality bar (D3), per-type section contracts (D4), self-contained-prose rule (D5), FIX-1 type-aware predicate (D6) with BOTH hyphen and underscore spellings of every staging-routing key, and the archive-safe grep-gate command. Lead with positive guidance + before/after examples. |
| agent | executor (sonnet) |
| files | `.gobbi/projects/gobbi/skills/memorization/rules.md` — modify (CANONICAL; `.claude/skills/memorization/rules.md` is a symlink mirror — never edit the symlink) |
| verifies | `grep -nE '^## .*[Dd]ev-document quality' …/rules.md` returns the section; git diff confirms `skills/memorization/rules.md` (NOT the `.claude/` symlink); section contains positive definition + before/after table + FIX-1 predicate (both spellings) + archive-safe grep-gate command |
| requires | [] |

### WAVE 1 — CONFORMANCE

| id | what (summary) | docs | baseline leaks | requires | verifies (key) | agent |
|---|---|---|---|---|---|---|
| 01-conform-agents | Conform `features/agents` content docs + README: base schema + FIX-1 strip (hyphen+underscore) + de-crypt cryptic body refs. Archive-safe by exclusion (no nested archive). | 14 | 4 | T0 | leak gate (hyphen+underscore, -not archive) = 0; all 14 carry 9 base keys (was 1 conformant); `disposition` preserved on 1 backlog; git diff only `features/agents/` | executor |
| 02-conform-evaluation | Conform `features/evaluation` content docs + README: base schema + FIX-1 strip. Archive-safe by exclusion. | 15 | 8 | T0 | leak gate = 0 (was 8); all 15 carry 9 base keys (was 2); git diff only `features/evaluation/` | executor |
| 03-conform-git-workflow-a | Conform `features/git-workflow` discussions + design + decisions: base schema + FIX-1 strip. Explicit subdir enumeration — archive-clean by construction. | 20 | — | T0 | leak gate = 0; all 20 carry 9 base keys; git diff only those 3 subdirs | executor |
| 04-conform-git-workflow-b | Conform `features/git-workflow` remaining subdirs + README: base schema + FIX-1 strip; `disposition` preserved on backlogs. Cumulative verify covers full feature (41 docs). | 21 | — | T0, T3 | leak gate over whole feature = 0; all 41 carry 9 base keys; disposition preserved; git diff only `features/git-workflow/` | executor |
| 05-conform-guardrails | Conform `features/guardrails` content docs + README: base schema + FIX-1 strip; `disposition` preserved on 3 backlogs. Archive-safe by exclusion. | 10 | 5 | T0 | leak gate = 0 (was 5); all 10 carry 9 base keys (was 1); disposition preserved on 3 backlogs; git diff only `features/guardrails/` | executor |
| 06-conform-install-runtime-a | Conform `features/install-runtime` discussions + design + decisions + changelogs: base schema + FIX-1 strip (hyphen+underscore — catches 4/5 underscore-key docs). Explicit subdir enumeration — archive-clean. | 24 | 0 hyphen; 4 underscore | T0 | leak gate (hyphen+underscore) = 0; the 4 underscore-key docs in this subgroup carry no staging key after strip; all 24 carry 9 base keys | executor |
| 07-conform-install-runtime-b | Conform `features/install-runtime` remaining subdirs + README: base schema + FIX-1 strip; `disposition` preserved on backlogs. Archive-safe (excludes `archive/references/`). Cumulative verify covers full feature (44 docs, no archive). | 20 | 0 hyphen; 1 underscore | T0, T6 | leak gate (hyphen+underscore, -not archive) = 0 — all 5 underscore-key docs cleared; all 44 carry 9 base keys; disposition preserved; git diff only `features/install-runtime/` | executor |
| 08-conform-project-memory | Conform `features/project-memory` content docs + README: base schema + FIX-1 strip. Archive-safe by exclusion. | 4 | 2 | T0 | leak gate = 0 (was 2); all 4 carry 9 base keys (was 0); git diff only `features/project-memory/` | executor |
| 09a-conform-workflow | Conform `features/workflow` content docs + README: base schema + FIX-1 strip; `disposition` preserved on backlogs. ARCHIVE-SAFE — excludes `features/workflow/archive/` (the +1 the naive `**` glob leaked). | 26 | 14 | T0 | find -not archive = 26 (NOT 27); leak gate = 0 (was 14); all 26 carry 9 base keys (was 2); disposition preserved; git diff only worktree `features/workflow/` no archive | executor |
| 09b-conform-project-tier-high-touch | Conform project-tier decisions + design + learnings + notes + backlogs: base schema + FIX-1 strip; `disposition` preserved on backlogs. Single-level glob — does not descend into `PM/archive/`. | 35 | — | T0 | leak gate = 0; all 35 carry 9 base keys; disposition preserved; git diff only worktree project-tier paths | executor |
| 09c-conform-project-tier-remainder | Conform project-tier references + reviews + rules + plans + mistakes + `features/README.md` + `PM/README.md`: base schema + FIX-1 strip; preserve legitimate per-type keys (`priority`/`domain` on mistakes, `verdict`/`review_kind`/`subject` on reviews). Single-level glob. | 33 | 1 | T0 | leak gate = 0 (was 1); all 33 carry 9 base keys; per-type keys preserved; git diff only those paths | executor |

### RECONCILIATION

| Field | Value |
|---|---|
| id | 10-reconcile-agents-md-principle-count |
| what | Update REAL file `.codex/AGENTS.md` from "12 principles" to "13 principles" and add P13 row. AGENTS.md (repo root) is a SYMLINK → `.codex/AGENTS.md` — edit ONLY the WORKTREE copy of `.codex/AGENTS.md`; never the symlink path. |
| agent | executor (sonnet) |
| files | `.codex/AGENTS.md` — modify (WORKTREE copy; AGENTS.md is a symlink and auto-reflects) |
| verifies | `readlink AGENTS.md` = `.codex/AGENTS.md`; `grep -c '13 principles' .codex/AGENTS.md` ≥ 1 AND via the symlink `AGENTS.md`; P13 row present; `grep -c '12 principles' .codex/AGENTS.md` = 0; git diff lists ONLY `.codex/AGENTS.md` (not a second AGENTS.md entry) |
| requires | [T0] |

### ENFORCEMENT

| Field | Value |
|---|---|
| id | 11-wire-grep-gate |
| what | Add the minimal mechanical type-aware grep-gate command to `memorization/rules.md` (or a referenced verification doc): covers features/ + project-tier, key-set S includes BOTH hyphen and underscore spellings of every staging-routing key, carries `-not -path '*/archive/*'`. A runnable verification command, NOT a behavior change. |
| agent | executor (sonnet) |
| files | `.gobbi/projects/gobbi/skills/memorization/rules.md` — modify |
| verifies | Running the documented grep-gate command (hyphen+underscore key-set, archive-safe) over all P_live returns 0 leaks — clears both the 63 hyphen-form baseline AND the 5 underscore-form install-runtime docs; git diff only `skills/memorization/rules.md` |
| requires | [T0, T1, T2, T4, T5, T7, T8, T9a, T9b, T9c] (10 direct edges; T3 via T4, T6 via T7 → all 11 conformance records by transitive closure) |

### WAVE 2 — PROSE

| id | what (summary) | docs | requires | verifies (key) | agent |
|---|---|---|---|---|---|
| P1-prose-agents | Per-type prose rewrite of `features/agents` toward quality bar: D1/Diátaxis type-purity, D4 section contracts, D5 self-contained prose. Reclassify mislabeled session-journals to `notes/` (D9), never delete. Archive-safe. | 14 | T1 | §4 section-contract checklist pass; D5 cryptic-coord scan = 0 for confirmed cases; git diff only `features/agents/` (no archive) | executor |
| P2-prose-evaluation | Per-type prose rewrite of `features/evaluation`. D1/D4/D5. Archive-safe. | 15 | T2 | §4 checklist pass; D5 scan = 0; git diff only `features/evaluation/` | executor |
| P3a-prose-git-workflow-a | Per-type prose rewrite of `features/git-workflow` discussions + design + decisions (mirrors T3 boundary). D1/D4/D5. Explicit subdir enumeration — archive-clean. | 20 | T3 | §4 checklist pass; D5 scan = 0; git diff only `{discussions,design,decisions}/` | executor |
| P3b-prose-git-workflow-b | Per-type prose rewrite of `features/git-workflow` remaining subdirs + README (mirrors T4 boundary). D1/D4/D5. Explicit subdir enumeration — archive-clean. | 21 | T4, P3a | §4 checklist pass; D5 scan = 0; git diff only `{backlogs,changelogs,checklists,plans,references,scenarios,README}` | executor |
| P4-prose-guardrails | Per-type prose rewrite of `features/guardrails`. D1/D4/D5. Archive-safe. | 10 | T5 | §4 checklist pass; D5 scan = 0; git diff only `features/guardrails/` | executor |
| P5a-prose-install-runtime-a | Per-type prose rewrite of `features/install-runtime` discussions + design + decisions + changelogs (mirrors T6 boundary). D1/D4/D5. Explicit subdir enumeration — archive-clean. | 24 | T6 | §4 checklist pass; D5 scan = 0; git diff only those 4 subdirs | executor |
| P5b-prose-install-runtime-b | Per-type prose rewrite of `features/install-runtime` remaining subdirs + README (mirrors T7 boundary). D1/D4/D5. Explicit subdir enumeration — archive-clean (excludes `archive/references/`). | 20 | T7, P5a | §4 checklist pass; D5 scan = 0; git diff only `{backlogs,checklists,references,scenarios,README}` | executor |
| P6-prose-project-memory-and-workflow | Per-type prose rewrite of `features/project-memory` (4) + `features/workflow` (26). D1/D4/D5. ARCHIVE-SAFE — both paths carry `exclude: "**/archive/**"`. | 30 | T8, T9a | §4 checklist pass; D5 scan = 0; find over the two trees -not archive = 30; git diff only those paths | executor |
| P7a-prose-project-tier-high-touch | Per-type prose rewrite of project-tier decisions + design + learnings + notes + backlogs (mirrors T9b boundary). D1/D4/D5; legitimate per-type keys preserved. Single-level glob. | 35 | T9b | §4 checklist pass; D5 scan = 0; disposition preserved on backlogs; git diff only those 5 dirs | executor |
| P7b-prose-project-tier-remainder | Per-type prose rewrite of project-tier references + reviews + rules + plans + mistakes + 2 index READMEs (mirrors T9c boundary). D1/D4/D5; `priority`/`domain` on mistakes + `verdict`/`review_kind`/`subject` on reviews preserved. Single-level glob. | 33 | T9c, P7a | §4 checklist pass; D5 scan = 0; per-type keys intact; git diff only those paths | executor |

### WAVE 3 — NAV

| Field | Value |
|---|---|
| id | N1-readme-subdirs-nav |
| what | Verify each of the 18 feature/index READMEs' "Subdirectories" sections lists the subdirs that actually exist; optional top-level index pointer. ARCHIVE-SAFE — excludes the 5 frozen `archive/` READMEs. |
| agent | executor (sonnet) |
| files | `.gobbi/projects/gobbi/**/README.md` — modify; `exclude: "**/archive/**"` |
| verifies | `find PM -name README.md -not -path '*/archive/*' -not -path '*/sessions/*' -not -path '*/skills/*' -not -path '*/tmp/*'` returns 18 (NOT 23); each README Subdirectories list matches `ls -d <feature>/*/`; no missing or phantom subdir entries; git diff only worktree README.md paths (no archive) |
| requires | [P1, P2, P3a, P3b, P4, P5a, P5b, P6, P7a, P7b] (all 10 prose tasks) |

## Required skills and mistakes (all tasks)

- **Skills:** `principles`, `mistake`, `execution`, `memorization`, `git`, plus dev-doc quality standard §4 from `memorization/rules.md` (T0 authors it; all others read it)
- **Mistakes (key):**
  - `skills-mirror-symlinks-not-copies` + `edit-tool-refuses-symlink-paths` — edit CANONICAL `rules.md` / REAL `.codex/AGENTS.md`, never the `.claude/` symlink paths
  - `executor-main-tree-edit` — every edit targets the WORKTREE-physical path; verified via `git diff --name-only` in the worktree
  - `sendmessage-continued-cwd-resets-to-main-tree` — re-`cd` to the worktree root at the start of every Bash call
  - `naming-standard-needs-positive-guidance-not-just-blocklist` — T0 leads with positive guidance
  - `design-literal-retire-instruction-without-replacement` — never delete narrative; reclassify to `notes/` (D9)
  - `manager-context-overflow-with-large-bundle` — informs the ≤35-doc wave-bounding and the prose splits

## Recommended execution order

T0 → T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8 → T9a → T9b → T9c → T10 → T11 → P1 → P2 → P3a → P3b → P4 → P5a → P5b → P6 → P7a → P7b → N1
