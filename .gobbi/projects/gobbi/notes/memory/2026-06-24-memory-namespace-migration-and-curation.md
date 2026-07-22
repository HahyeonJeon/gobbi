---
name: memory-namespace-migration-and-curation
description: Single-session 8-task campaign that migrated the 114 flat memory files into area namespaces and drove the validator from 689 to 0.
type: notes
scope: project
feature: null
status: active
created: 2026-06-24
session: 1cd48095-d745-4868-a5ac-f48326eb447f
tags: [memory, refactor, rename-sweep, verification, docs-sync]
keywords: [area-namespace-migration, two-family-guard, archive-not-delete, validator-zero, single-session, layer2-source]
author: claude
features_touched: [memory]
steps_completed: [ideation, preparation, planning, execution, wrap-up]
shipped: [memory-migration-curation-campaign, migration-execution-plan, family-a-allowlist-completeness, guard-revises-twice-means-scope-model-wrong, codex-eval-wrapper-vocab-grep-false-blocks-clean-pass, readiness-scan-must-disposition-out-of-worktree-writes, delegation-briefs-reference-nonexistent-rules-dir, verification-gate-must-be-runnable-not-placeholder, whole-file-allowlist-false-passes-same-file-residual, recurring-guard-root-closure-criterion, git-skill-move-attribution-docs-sync, no-match-area-resolution, reconcile-shared-described-as-current-in-active-carriers, strip-contract-dropped-required-extension-field]
---

# Memory area+tag migration + curation — single session

## What happened

The per-type areas+tags vocabulary redesign (#310/#312, `ef54f990`) had shipped the consumer plumbing but deferred the file migration, leaving the live tree in an intended interim RED: whole-tree `validate-frontmatter.sh` = 689 violations across 117 files, with 114 sitting flat (no `{area}/` segment). This session executed the deferred migration as a single-session, 8-task campaign — the user locked single-session over the leader-recommended 3-phase split (a ratified risk, mitigated by 8 individually-verified task gates).

The tasks ran strictly in order. **T01** (`594d1a45`) segmented `check-residual-vocab.sh` into two independent vocab-family triples — Family A (`memorization`, scan-surface `skills/`) and Family B (the migration's retired forms `_shared|.effective|.tagAreaMap.(spine|mistakes)`, scan-surface the memory tree, allowlist = 19 carriers measured from a fresh run) — and added the `layer2-source:` resolution check. This closed the recurring guard-false-PASS root that had REVISE'd the Ideation three times. **T02** (`c65872d8`) corrected 4 type-mismatch mistakes (`type: decisions` → `type: mistakes`) and recorded the one structural area no-match decision (`verification`, user-locked). **T03** (`affad3dc`) cleared 572 legacy frontmatter / tag / status violations while the files were still flat. T04 recomputed each file's area via `.tagAreaMap.{type}`. **T05** (`812c9091`) `git mv`-relocated 108 normal-move files into `{type}/{area}/` namespaces (history-preserving). **T06** (`6fc5cf97`) repointed all inbound reference classes — path, prose, in-fence links, the 3 live `layer2-source:` carriers, and `required-mistakes:` paths. **T07** (`7e1a1f4d`) dropped the 4 dangling `layer2-source:` refs, resolved the dup-backlog pair, and archived (never deleted) the 6 spent journals to `archive/notes/{area}/`. T08 drove the whole tree to green.

## What shipped

The campaign landed on branch `claude-2026-06-24-1cd48095-...` across 6 commits (T01 `594d1a45`, T02 `c65872d8`, T03 `affad3dc`, T05 `812c9091`, T06 `6fc5cf97`, T07 `7e1a1f4d`). Green result: whole-tree validator **689 → 0**; both guard families **exit 0**; markdown-link guard **23 broken / 869 checked — 0 NEW vs `ef54f990`**; `layer2-source:` check **0 dangling**; fresh `find` **0 flat by-area files**.

Wrap-up promoted 13 staging artifacts to memory (all cited by slug in `shipped`): 6 project mistakes (`mistakes/{verification,codex,assumption,docs-sync}/`), 3 process decisions (`decisions/process/2026-06-24-*`), the feature design + checklist + plan (`features/memory/{design,checklists,plans}/memory/`), and 1 project backlog (`backlogs/memory/`). The home `MEMORY.md` index was trimmed out-of-band (27556 → 11673 bytes) — outside the worktree and the PR.

## What got stuck

Nothing blocked to session end. One mid-Wrap-up snag: the manager's routing contract instructed stripping `domain` from the 6 promoted mistakes and `scope`/`feature`/`project-scope` from feature/backlog files, but those are REQUIRED frontmatter fields (validator FAILS without them). Wrap-up paused, surfaced the contract-vs-validator conflict, and the manager ruled to keep the required fields. The 13 promoted files validate clean (exit 0).

## What shifted

The recurring guard root (`guard-cited-as-runtozero-without-matching-vocab`) was finally closed — not by another count-patch, but by the structural insight that a run-to-zero guard REVISEing more than once means its SCOPE MODEL is wrong, not its count. The fix was to segment the guard by vocab family and derive each allowlist from a fresh measured run, so the gate is reachable by construction and a re-run reproduces the same zero. This insight generalized into the new `verification-gate-must-be-runnable-not-placeholder` and `whole-file-allowlist-false-passes-same-file-residual` mistakes.

## Decisions to respect

- **Area + `domain` are independent axes.** A mistake's `area` (trap-class filing axis) and its `domain` (nature of the mistake) are intentionally independent — e.g. `domain: process` coexists with `area: verification`. Do not force `domain` to match `area`. See [[no-match-area-resolution]].
- **Run-to-zero guards must be segmented + derived-from-run.** When a guard REVISEs more than once on the same root, segment it by vocab family and derive each allowlist from a fresh measured run. See [[guard-revises-twice-means-scope-model-wrong]] and [[recurring-guard-root-closure-criterion]].
- **Verification gates run as-is.** No `<...>` fill-in placeholders in a `verifies:` block; re-baseline every count/exit-code from a fresh live run. See [[verification-gate-must-be-runnable-not-placeholder]].
- **Archive, never delete.** Spent journals and dropped artifacts move to `archive/{type}/{area}/` with history preserved.

## Next session

React to the 3 deferred follow-ups in the handoff: (1) Layer-2 promotion of the guard-false-PASS mistakes to workspace skill storage (user's call); (2) reconcile the `legacy-frontmatter-migration` vs `legacy-frontmatter-mistakes-domain` dup-backlog pair; (3) F-CONSIST-1 — 7 pre-existing body-prose refs to never-created files in the `skills/mistake` Layer-2 corpus. Plus the `reconcile-shared-described-as-current-in-active-carriers` backlog once the PR lands.

## Related

- [[memory-migration-curation-campaign]] — the design this session executed
- [[migration-execution-plan]] — the 8-task plan this session ran
- [[guard-revises-twice-means-scope-model-wrong]] — the root-fix mistake the campaign produced
- [[recurring-guard-root-closure-criterion]] — why iter4 PASSed after 3 REVISEs
