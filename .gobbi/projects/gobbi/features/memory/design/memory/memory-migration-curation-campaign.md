---
name: memory-migration-curation-campaign
description: Single-session 8-task design for the deferred memory area+tag migration plus aggressive archive-only curation.
type: design
scope: feature
feature: memory
status: active
created: 2026-06-24
session: 1cd48095-d745-4868-a5ac-f48326eb447f
tags: [memory, refactor, rename-sweep, docs-sync, verification]
keywords: [area-namespace-migration, legacy-frontmatter-fix, layer2-source-check, archive-not-delete, single-session]
author: claude
supersedes: null
superseded_by: null
related: [area-tag-migration-manifest, memory-namespace-migration, legacy-frontmatter-migration]
---

# Memory area+tag migration + curation — single-session 8-task design

## Problem

The per-type areas+tags vocabulary redesign (#310/#312, `ef54f990`) shipped the consumer plumbing before migrating the memory files (merge-ordering A: redesign-now / migrate-next). The live tree is in its intended interim RED: whole-tree `validate-frontmatter.sh` = 689 violations across 117 violation-bearing files (of 166 scanned). 114 files sit flat (no `{area}/` segment); 99 of those also carry off-pool tags, missing `keywords`/`author`, stray `decision_status`/`disposition`, and invalid `status`. The user's done-criterion ("validator → 0") requires fixing ALL 689, not just the 114 area-flat — only 15 of the 114 go green from the move alone.

## Scope

**In:** extend the residual-vocab guard into TWO vocab-family triples; resolve the gating decision items; fix 572 legacy-frontmatter/tag/status violations; per-file area recompute; move 108 normal-move files; repoint all reference classes incl. multi-target `layer2-source:`; aggressive archive-only curation (6 journals to a computed area + 4 dangling refs + 1 dup pair + home index out-of-PR); drive validator + both guard families to zero.
**Out:** the orphan worktree `claude-2026-06-19-06916ece…`; vocabulary CHANGES beyond the tag-fix; unrelated source/skill edits (the guard's two-family extension IS in-scope — it is the campaign's own gate).

## Approach

Single session (user Decision A), structured as 8 ordered, individually-verified tasks so each carries its own gate — the mitigation against the #307 3×-REVISE / false-PASS history. The decision-gate is ordered FIRST (it changes `type` + tag eligibility that downstream tasks depend on). The six directional decisions:

- **D1 — Guard-extension = TWO independent vocab-family triples, derived from a fresh run, Task 1 first.** This Ideation REVISE'd 3× on the same root — the guard cited as a run-to-zero gate while its real coverage didn't match (iter1 VOCAB gap → iter2 scan-surface gap → iter3 allowlist undersized). The structural root is that the guard CONFLATES two independent vocabularies with different scopes; the fix is to SEGMENT it, not re-patch the count. **Family A** — vocab `memorization|session[- ]memory|project[- ]memory`, scan-surface = its existing `skills/ agents/ hooks/ .claude/ .codex/ plugins/` roots, allowlist = the existing legitimate `memorization` carriers. **Family B** — vocab `_shared|\.effective|\.tagAreaMap\.(spine|mistakes)`, scan-surface = the MEMORY TREE (`mistakes/ notes/ features/ backlogs/ reports/` + the other by-area type dirs as they exist), allowlist = the 19 MEASURED legitimate carriers from a fresh run (14 `features/memory/` redesign docs + 2 campaign-cited mistakes + 3 project-tier redesign records; the `archive/` carrier is find-pruned), each with a per-entry reason. The fresh run proved the conflation: the current single vocab over the memory tree returns 243 hits, ALL Family-A `memorization`-family, ZERO Family-B. The exhaustive per-path allowlist is the Task-1 Execution deliverable; this design carries the method (segment + derive-from-run) + the measured set. *Validation:* PROPERTY — Family A over `skills/` → 0 non-allowlisted residual; Family B over the memory tree → 0 non-allowlisted residual (allowlist = the measured 19); a planted retired-form in a non-allowlisted memory file fails; re-running the same grep yields the same 19 carriers and the same zero.
- **D2 — Decision-gate → tag-fix → recompute ordering.** Task 2 (type/no-match) FIRST (changes `type` + tag eligibility); Task 3 (frontmatter/tag fix) next while files are flat; Task 4 (recompute) only after, because `.tagAreaMap.{type}` routes only on controlled tags. *Validation:* after Task 2 every gating decision recorded; after Task 3 only area-flat + dup remain; after Task 4 all 5 tag-driven no-matches resolve.
- **D3 — Move via `git mv`; counts reconcile to 108 + 6.** History-preserving; never `rm`+create. The USER-APPROVED active-mistake-move carve-out (`rules.md §1.5`) applies — slug identity is rename-robust. Task 5 normal-moves 108 (28 project + 80 feature); Task 7 archive-moves the 6 journals; 108 + 6 = the 114 flat files. *Validation:* `git log --follow` shows continuous history; after Task 5 only the 6 journals flat; after Task 7 `find` → 0 flat.
- **D4 — Reference-repoint covers ALL classes incl. the multi-target `layer2-source:` check.** Enumerate by write-vs-ref distinction; grep every path-form (placeholder / literal-`.md` / date-prefixed / repo-relative); a dedicated `layer2-source:` scan splits ` + `-joined multi-target fields and resolves each side (7 total: 3 live to repoint, 4 dangling to drop). *Validation:* `check-markdown-links.sh <PM>` 0-new vs 23/867 + per-form `grep -c` zero + `layer2-source:` 0 dangling across all targets.
- **D5 — Archive-not-delete curation; journal area computed; home index isolated + reversible as Task 7b.** Every "drop" is `git mv` to `archive/{type}/{area}/{YYYY-MM-DD}-{slug}.md` or a ref-edit; ZERO hard-deletes. The 6 journals archive to `archive/notes/{computed-area}/`, area via `.tagAreaMap.notes` (after the tag-fix; the existing `archive/decisions/memory/...` file confirms the shape). Task 7b backs up the home `MEMORY.md` before trimming, verifies `wc -c < 24986`, spot-checks one-line-per-entry; outside the worktree + PR, verified out-of-band. *Validation:* `archive/` gains the 6 under their computed area with history; P_live count unaffected by archive; a pre-edit backup exists AND `wc -c < ~/.claude/.../MEMORY.md` < 24986 recorded.
- **D6 — Write-safety.** Moves via `git mv`; ref-repoints via `perl -i`/`python3`/heredoc then verify on disk; absolute paths; re-`cd` worktree each turn; `git -C <worktree-abs>`. Guards against the worktree Edit-tool silent-write-failure. *Validation:* `git status`/`git diff` after each bulk edit confirms the write landed.

## Scenarios

Golden: clean-tag file recomputes + moves cleanly; off-tag file fixed then moved. Edge: multi-target `layer2-source:` repoint (split on ` + `); 4 type-mismatch batch ruling FIRST (Task 2, option A → `type: mistakes`); structural no-match Always-Ask; 3 cross-tier collisions auto-resolve (distinct paths / archive-pruning); journal archive to a computed area; guard segmentation keeps each vocab on its own surface. Failure: single-vocab guard floods the memory tree with 243 legitimate `memorization` mentions OR hides the migration's forms in an unscanned surface (two-family segmentation mitigates); Edit silent-write (perl-i mitigates); pattern-grep miss (enumerate-by-distinction mitigates); single-session context exhaustion (8 gated tasks + context-budget checkpoint mitigate). See `features/memory/scenarios/` for the full enumeration.

## Alternatives considered

- **3-phase (one phase per session)** — leader-recommended in Pass 1; the user reviewed it and LOCKED single-session anyway (Decision A) — a ratified risk, with the 8-gated-task structure + context-budget checkpoint as the agreed mitigation.
- **Skip the moves, fix only frontmatter** — rejected: the validator's fail-closed §1.5 area check FAILS any by-area file at a flat path.
- **Single-vocab guard (extend VOCAB / scan-surface / allowlist count without segmenting)** — rejected after 3 REVISEs (iter1→3): the guard conflates two vocabularies with different scopes, so any single-vocab extension either floods the memory tree with 243 legitimate prior-rename mentions or relocates the gap. The root fix is segmentation into two `(vocab, scan-surface, allowlist)` triples, each derived from a fresh run.
- **Conservative curation (archive nothing, index-only)** — superseded by the user's aggressive Decision B.

## Consequences

- Validator + both guard families (segmented, each derived from a run) + the new `layer2-source:` check reach zero; the memory tree is fully namespaced and scannable by area, and the guard is structurally sound (no conflated vocabulary).
- The 6 spent journals move to `archive/notes/{computed-area}/` (reversible; history preserved); the home index drops under its limit (out-of-band, Task 7b, with a backup).
- **Ratified-risk acknowledgement.** Single-session execution re-creates the #307 context-exhaustion / reviewer-fatigue false-PASS risk. The user accepted this trade-off after reviewing the 3-phase alternative; it is NOT re-phased. The 8 individually-verified task gates are the agreed mitigation — a failing gate REVISEs ONE task in isolation, not the whole campaign. Context-budget checkpoint: the manager checkpoints context budget between tasks and, if low, pauses + hands off at a task boundary (each gate is a clean resume point) rather than pushing through under pressure. The gates do not eliminate reviewer fatigue, so the checkpoint is the second line of defense. Planning should keep each task's diff reviewable.

## Related

- [[area-tag-migration-manifest]] — the row-level execution spec this campaign consumes
- [[memory-namespace-migration]] — the parent deferred backlog
- [[legacy-frontmatter-migration]] — the 572-violation legacy-tag/frontmatter fix folded into Task 3
