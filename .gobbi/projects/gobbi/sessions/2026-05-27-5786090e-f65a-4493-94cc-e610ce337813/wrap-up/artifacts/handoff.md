# HAND-OFF — gobbi dev-doc PROSE wave, checkpoint after P1 (PASS) + P2 (eval-pending)

Session `5786090e` (2026-05-27), continuation of the dev-doc-standard retrofit. Checkpointed on context budget at a clean committed boundary.

## Resume location (critical)
- **Continue on the existing worktree + branch — do NOT start fresh.**
  - Worktree: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6`
  - Branch: `chore/session-2026-05-25-a10c82d6` → PR #272 (open, NOT pushed this session — local tip is ahead of origin).
  - `develop` is clean at `82a5137` — leave it alone.
- When `/gobbi` bootstrap flags this worktree as "orphaned", recreate=no — adopt it (idempotency state 2: worktreePath set AND exists).
- This session's dir: `sessions/2026-05-27-5786090e-f65a-4493-94cc-e610ce337813/` (state.json, session.json, P1 full record, P2 status note).
- **`git push` is pending** — origin/chore/... is behind local. Push before/at next PR update. Local commits this session: `56089c1` → `999a403` → `7a6ecb4` → `caad41b` → `5c36142`.

## What's DONE this session (do not redo)
1. **Stranded prior-session residue committed** (`56089c1`): 5 promoted mistakes + design doc + notes + reviews + README edit that prior session b0a0eaf9 promoted to disk but never committed. Worktree is now clean of that residue.
2. **P1 (features/agents prose) — PASS, fully closed.** Work: `999a403` (iter1) + `7a6ecb4` (iter2). Session record: `caad41b`. Dual-system eval (both REVISE → 5 findings) → manager reconciliation (corrected 2 evaluator severity errors via git ground-truth) → iter2 surgical closure → manager-verified. Mistake-candidate staged: `prose-brief-light-pass-undersold-template-section-checks` (in P1 staging/decisions/).
3. **P2 (features/evaluation prose) — executor DONE + ground-truth-clean, dual-system eval PENDING.** Work: `5c36142`. See `execution/P2-evaluation-prose/rawdata/status-eval-pending.md` for the exact next steps. THE NEXT SESSION MUST EVALUATE P2 BEFORE TREATING IT AS DONE.

## What's NEXT (remaining prose-wave work)
- **P2 dual-system eval** (first thing — work is committed but unevaluated).
- Then in dependency order: **P3a → P3b → P4 → P5a → P5b → P6 → P7a → P7b → N1** (locked plan `features/project-memory/plans/2026-05-26-dev-doc-standard-retrofit.md`). P3a→P3b, P5a→P5b, P7a→P7b are chained; N1 requires all 10 prose tasks.

## Guardrails (hard-won — respect these)
1. **Apply the P1 brief lesson to EVERY prose brief:** instruct the executor to check each doc's body against its type template's COMPLETE required-section list — "looks shaped" ≠ "has all required sections." Known traps: `references`→body `## Related` (between Insight and Why-it-applies); `scenarios`→body `**Category:**`/`**Coverage:**`/`## Related`; `decisions`/`design`→all 5 ADR sections; `discussions`→body `## Related`. (P2's brief already baked this in; carry it forward.)
2. **Evaluators MUST diff the commit and ground-truth content preservation** — never assert "relocated/preserved" without reading the diff (`mistakes/evaluator-false-pass-without-diffing.md`). The MANAGER also ground-truth-verifies divergent findings before producing a verdict — this session caught TWO evaluator severity errors that way (a false "file now exists" premise; a "fresh deletion" that was pre-existing).
3. **Never delete narrative** — reclassify to `notes/` (§4.3). De-crypting a load-bearing `description:` VALUE is in-scope (P1 precedent); adding/removing frontmatter KEYS is not (that was the conformance wave).
4. **Executors:** `cd` worktree + `git -C <worktree-abs>` + verify `rev-parse --abbrev-ref HEAD` == chore branch BEFORE committing; write session files to ABSOLUTE worktree paths.
5. **Dual-system eval per task is mandatory (Decision 3)** — Codex via `codex exec` (foreground/background, `--cd <worktree>` since the commits live in the worktree, not develop). Codex 0.133.0 is available.
6. `session.json.lock` flock sidecar is now gitignored — don't commit it.

## Decisions to respect
Build-on-#272 / defer-merge; gobbi keeps its 13 doc types (no Diátaxis re-taxonomy); enforcement stays the §4.5 grep gate (no hook/CI); `archive/` excluded from standard + retrofit. Mode: Auto. Cadence: run-until-context-pressure then checkpoint at a committed boundary (user-ratified this session).

## Key pointers
- Locked plan: `features/project-memory/plans/2026-05-26-dev-doc-standard-retrofit.md`
- §4 standard (canonical): `skills/memorization/rules.md` §4 (never edit the `.claude/` symlink)
- P1 record: `sessions/2026-05-27-5786090e-.../execution/P1-agents-prose/`
- P2 status: `sessions/2026-05-27-5786090e-.../execution/P2-evaluation-prose/rawdata/status-eval-pending.md`
- Staged mistake-candidate (promote at eventual Wrap-up): P1 `staging/decisions/prose-brief-light-pass-undersold-template-section-checks.md`
