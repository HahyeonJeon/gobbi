---
name: migration-execution-plan
description: Executor task decomposition for the single-session memory area+tag migration + curation campaign — 8 sequential tasks + 1 manager step.
type: plans
scope: feature
feature: memory
status: active
created: 2026-06-24
session: 1cd48095-d745-4868-a5ac-f48326eb447f
tags: [memory, refactor, rename-sweep, verification, docs-sync]
keywords: [executor-tasks, two-family-guard, area-recompute, git-mv-moves, archive-curation, single-session]
author: claude
task: 8-task single-session whole-tree memory normalization + curation campaign
supersedes: null
superseded_by: null
task_count: 8
---

# Migration execution plan — 8 sequential executor tasks + 1 manager step

## Idea anchor

Implements the campaign design [[memory-migration-curation-campaign]] (the locked Ideation plan, PASS iter4). Consumes the row-level move spec in `features/memory/plans/memory/2026-06-23-area-tag-migration-manifest.md`.

## Scope Contract reference

Project = gobbi · Feature = `memory` · Task = the 8-task single-session whole-tree memory normalization + curation campaign. Done = validator + both guard families + `layer2-source:` check → 0; 114 flat files relocated (108 normal-moves + 6 archive-journals); aggressive archive-only curation. Locked Scope Contract in the session's Ideation canonical artifact.

## Sub-tasks

The order is LOCKED from Ideation F2 (the decision-gate precedes the data-fixes) — strictly sequential, no reordering. `<PM>` = `.gobbi/projects/gobbi`; `<WT>` = the worktree abs root. Every gate is a runnable command re-baselined against a fresh run (iter2/iter3); every gate runs as-is, zero placeholders. Required mistakes load by recursive-glob + slug filter (rename-robust to the migration's own moves).

| # | Sub-task | Depends on | Verification (runnable gate, fresh-run baseline) | Owner type |
|---|---|---|---|---|
| 1 | Segment `check-residual-vocab.sh` into two (vocab, scan-surface, allowlist) triples — Family A (memorization / `skills/`, allowlist covers existing + the 2 skills-side carriers) + Family B (retired forms / memory tree / 19-carrier allowlist from a fresh run); create the `layer2-source:` resolution check | — | `check-residual-vocab.sh` → exit 0 (was exit 1 / 4 residuals / 2 files); Family-B over the memory tree → exit 0; planted `_shared` → exit 1; `check-layer2-source.sh <WT>` runs (baseline 3 LIVE + 4 DANGLING) | executor |
| 2 | Type-mismatch batch ruling (4 `mistakes/` files `type: decisions` → `type: mistakes`) + resolve the 1 structural no-match area | #1 | `git -C <WT> grep -c '^type: decisions' -- '*/mistakes/*.md'` → 0; the no-match file carries a recorded area decision (Always-Ask via NEEDS_CONTEXT) | executor |
| 3 | Fix all non-area frontmatter classes (tags, keywords, author, status, decision_status, related, disposition, domain, name-stem) — files stay flat | #2 | re-run `validate-frontmatter.sh`; per-field counts → 0: tags (was 284), keywords (101), author (101), status (34), decision_status (27), related (12), disposition (7), domain (2), name!=stem (4). ONLY `area` (114) + duplicate-slug (3) remain RED | executor |
| 4 | Recompute the 108 normal-move files' area via `.tagAreaMap.{type}` (featureDirNormalization first), AFTER the tag-fix; confirm the 5 tag-driven no-matches resolve; reads `memory-vocabulary.json` (does NOT modify it) | #3 | the map covers exactly 108 files, each a real area; zero `_shared`; zero unresolved no-match (Always-Ask via NEEDS_CONTEXT if any residual) | executor |
| 5 | `git mv` the 108 normal-move files (28 project + 80 feature) into `{type}/{area}/{slug}`; the 6 journals NOT moved here | #4 | `find <PM>/features/{git-workflow,workflow} -mindepth 2 -maxdepth 2 -name '*.md'` → empty; `find <PM>/{mistakes,backlogs,reports} -maxdepth 1 -name '*.md'` → empty; only the 6 journals stay flat in `notes/`; `git log --follow` shows continuous history | executor |
| 6 | Repoint inbound refs — path/prose/in-fence links; the 3 LIVE `layer2-source:` carriers (`layer2-sweep-grep-form-specific-blindspot`, `layer2-planning-asserted-skill-without-verifying`, `layer2-file-move-needs-link-resolution-check`); re-scan `required-mistakes:` | #5 | `check-markdown-links.sh <PM>` → 0 NEW vs the 23 broken / 869 checked baseline; per-form `grep -c` of old flat paths → 0; the 3 LIVE `layer2-source:` targets resolve at their new path | executor |
| 7 | Drop the 4 DANGLING `layer2-source:` refs (in carriers `layer2-cotouch-enumeration-must-cover-semantic-equivalents`, `layer2-planning-leader-asserted-file-type-without-verifying`, `layer2-verify-state-from-authoritative-source-not-proxy` — the last has BOTH `+`-joined targets dangling); resolve the 1 dup-backlog pair; compute each journal's notes-area via `.tagAreaMap.notes` + `git mv` 6 journals → `archive/notes/{area}/` | #6 | `check-layer2-source.sh <WT>` → exit 0 (0 dangling); 6 journals under `archive/notes/{area}/` with history; `find <PM>/notes -maxdepth 1 -name '*.md'` → 0 | executor |
| 8 | Drive-to-green final verify — validator + both guard families + `layer2-source:` check + links + `find` all at target; no new edits | #7 | `validate-frontmatter.sh` → 0 (exit 0); Family-A guard → exit 0; Family-B guard → exit 0; `check-markdown-links.sh <PM>` → 0 NEW vs 23/869; `check-layer2-source.sh <WT>` → exit 0; fresh `find` → 0 flat by-area files (full stop) | executor |

**Manager step (NOT an executor sub-task) — T7b home-index trim (out-of-band).** After #8, the manager (or a home-access Claude agent) backs up + trims `~/.claude/projects/-playinganalytics-git-gobbi/memory/MEMORY.md`, then verifies `wc -c < ~/.claude/.../MEMORY.md` < 24986 (live 27026). Outside the worktree + PR; confirmed-writable; reversible. NOT a worktree-sandboxed executor task.

## Dependency graph

Strictly linear: `#1 → #2 → #3 → #4 → #5 → #6 → #7 → #8 → T7b(manager)`. The decision-gate (#2) precedes the data-fixes (#3/#4/#5) because it changes `type` + tag eligibility that the recompute depends on (Ideation F2 — locked). No parallel lanes: #3-#7 form a strict data-dependency chain over the same memory tree; #8 gates on all.

## Verification strategy summary

The campaign is complete when, run from the worktree: (a) `validate-frontmatter.sh` → 0 violations; (b) the Family-A guard (`skills/`) → exit 0 and the Family-B guard (memory tree, derived 19-carrier allowlist) → exit 0; (c) `check-markdown-links.sh <PM>` → 0 NEW vs the 23 broken / 869 checked baseline; (d) the `layer2-source:` resolution check (`check-layer2-source.sh <WT>`) → 0 dangling; (e) a fresh `find` → 0 flat by-area files. The out-of-band home-index trim (T7b, manager) is verified separately by `wc -c < ~/.claude/.../MEMORY.md` < 24986, decoupled from the in-repo gate. Each task ends in its own deterministic gate (one executor spawn + one commit + one objective check) so a residual loops back to the owning task rather than the whole campaign.

## Related

- [[memory-migration-curation-campaign]] — the locked Ideation design this plan decomposes
- [[area-tag-migration-manifest]] — the row-level move spec executors consult
- [[execute-area-tag-migration-114-files]] — the parent deferred backlog
