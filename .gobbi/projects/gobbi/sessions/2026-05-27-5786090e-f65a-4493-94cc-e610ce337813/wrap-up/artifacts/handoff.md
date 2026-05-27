# HAND-OFF — gobbi dev-doc PROSE wave (session 5786090e, 2026-05-27)

Continuation of the dev-doc-standard retrofit. Driving the wave to completion ("go to the end"). **P1, P2, P3a, P3b, P4, P5a, P5b all PASS (fully closed) — all 5 feature dirs (agents, evaluation, git-workflow, guardrails, install-runtime) now prose-conformant. Remaining: P6 (features/project-memory + features/workflow) → P7a → P7b → N1, then Wrap-up.**

Task-record commits (all local, unpushed): residue `56089c1` → P1 `caad41b` → P2 `db50af6` → P3a `69a089f` → P3b `f899480` → P4 `31d099a` → P5a `7cce3bf` → P5b `0f1ffc3`. git push still PENDING. **5 staged mistake-candidates + 1 deferred backlog await Wrap-up promotion** (prose-brief-light-pass; subagent-stray-recurred; prose-reclassification-target-project-notes; dual-system-codex-caught-template-form-gaps; evaluator-revise-may-contradict-the-standard; backlog frontmatter-completeness-followup).

## Resume location (critical)
- **Continue on the existing worktree + branch — do NOT start fresh.**
  - Worktree: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6`
  - Branch: `chore/session-2026-05-25-a10c82d6` → PR #272 (open). **`git push` PENDING** — origin is behind local.
  - `develop` clean at `82a5137` — leave it alone.
- `/gobbi` bootstrap will flag this worktree "orphaned" → recreate=no, adopt it (idempotency state 2).
- This session's dir: `sessions/2026-05-27-5786090e-f65a-4493-94cc-e610ce337813/`.
- **Commit chain this session (all local, unpushed):** `56089c1` (residue) → `999a403`+`7a6ecb4`+`caad41b` (P1) → `5c36142`+`db50af6` (P2) → `183dbfb`+`dc0e5a9` (P3a work + notes-placement fix) + 2 checkpoint commits.

## What's DONE this session (do not redo)
1. **Stranded prior-session residue committed** (`56089c1`).
2. **P1 (features/agents prose) — PASS.** `999a403`+iter2 `7a6ecb4`, record `caad41b`. Dual-system eval (both REVISE→5 findings) → manager reconciliation (corrected 2 evaluator severity errors) → iter2 → verified.
3. **P2 (features/evaluation prose) — PASS.** `5c36142`, record `db50af6`. Dual-system eval both PASS first iter (the P1 "complete-section-list" lesson, baked into the brief, produced a first-pass PASS).
4. **P3a (features/git-workflow A: discussions+design+decisions, 20 docs) — executor DONE + placement-fixed, dual-system eval PENDING.** Work `183dbfb` (20 docs reshaped + 1 reclassified note) + `dc0e5a9` (relocated that note to project-level `notes/` — see guardrail 3). NEXT SESSION MUST EVALUATE P3a BEFORE TREATING IT DONE.

## What's NEXT
- **P3a dual-system eval first** (work committed at `183dbfb`+`dc0e5a9`, unevaluated). Same pattern as P1/P2: Codex via `codex exec --cd <worktree>` (commits live in the worktree, not develop) + a Claude evaluator subagent, both MUST diff the commits and ground-truth content preservation. On PASS → memorize + commit. If REVISE → surgical iter2.
- Then in dependency order: **P3b → P4 → P5a → P5b → P6 → P7a → P7b → N1** (locked plan `features/project-memory/plans/2026-05-26-dev-doc-standard-retrofit.md`). P3b depends on P3a; P5a→P5b, P7a→P7b chained; N1 requires all 10 prose tasks.

## Guardrails (hard-won — respect these)
1. **Every prose brief MUST require checking each doc's body against its type template's COMPLETE required-section list** — "looks shaped" ≠ "has all sections." Known traps: `references`→body `## Related` (between Insight and Why-it-applies); `scenarios`→body `**Category:**`/`**Coverage:**`/`## Related`; `decisions`/`design`→all 5 ADR sections (+Related); `discussions`→body `## Related`. (P2 & P3a briefs baked this in → clean executor passes.)
2. **Evaluators MUST diff the commit and ground-truth content preservation** (`mistakes/evaluator-false-pass-without-diffing.md`). The MANAGER ground-truths divergent findings before verdict — caught 2 evaluator severity errors on P1.
3. **Reclassification target is PROJECT-level `notes/`, never feature-level** — `notes` is project-only (memory-map: `notes`→Project-only; no `features/{f}/notes/` tier). Set `scope: project`, `feature: null`, `features_touched: [{feature}]`. P3a hit this (brief said feature-level); fixed in `dc0e5a9`. Staged mistake-candidate: `prose-reclassification-target-is-project-level-notes`. **Verify with `find features -type d -name notes` (must be empty).**
4. **Subagent writes stray to the MAIN tree even with an absolute-path instruction** — make every write-subagent `cd <worktree>` FIRST and verify `git rev-parse --show-toplevel` before writing; manager `ls` the expected worktree paths post-hoc (don't trust DONE). P2's memorization assistant strayed; manager relocated. Staged: `subagent-stray-recurred-despite-absolute-path-instruction`.
5. **Executors:** `cd` worktree + `git -C <worktree-abs>` + verify branch before committing.
6. **Dual-system eval per task is mandatory (Decision 3).** Codex 0.133.0 available. `session.json.lock` is gitignored.

## Staged mistake-candidates / backlogs (promote at eventual Wrap-up — NOT yet in project memory)
- P1: `prose-brief-light-pass-undersold-template-section-checks` (process)
- P2: `subagent-stray-recurred-despite-absolute-path-instruction` (process) + backlog `frontmatter-completeness-followup` (deferred: README `subsystems:` key, changelog `status:` value — frontmatter sweep across features)
- P3a: `prose-reclassification-target-is-project-level-notes` (process)

## Decisions to respect
Build-on-#272 / defer-merge; gobbi keeps its 13 doc types (no Diátaxis re-taxonomy); enforcement = §4.5 grep gate (no hook/CI); `archive/` excluded. Mode: Auto. Cadence: run-until-context-pressure then checkpoint at a committed boundary (user-ratified). Observed rate: ~1-2 prose tasks fully closed per session under mandatory dual-system rigor.

## Key pointers
- Locked plan: `features/project-memory/plans/2026-05-26-dev-doc-standard-retrofit.md`
- §4 standard (canonical): `skills/memorization/rules.md` §4 (never edit the `.claude/` symlink)
- Per-task records: `sessions/2026-05-27-5786090e-.../execution/{P1-agents-prose,P2-evaluation-prose,P3a-git-workflow-a-prose}/`
- P3a is the eval-pending boundary; its executor report (per-doc verdict table) is in the P3a transcript (agentId a24db9b449b8949a7).
