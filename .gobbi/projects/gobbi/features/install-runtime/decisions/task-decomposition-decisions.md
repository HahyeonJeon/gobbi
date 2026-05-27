---
name: task-decomposition-decisions
description: Locked decisions across Planning Loop iterations plus post-final-iteration manager polish for the env-var-audit + SessionStart hook feature — 3 iterations, 11 surgical fixes, PASS-equivalent outcome.
type: decisions
scope: feature
feature: install-runtime
status: active
created: 2026-05-22
session: 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d
tags: [planning, task-decomposition, decisions-log]
phase: memorization
session-id: 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d
verdict: pass
---

# Planning Decisions Log

## Iter1

Verdict: REVISE.

Claude eval: PASS-with-5-Medium (worktree creation underdocumented as discrete task).
Codex eval: REVISE — 5 High findings centered on the final verification task executor crossing the manager/executor boundary by doing `git push` + `gh pr create` (violation of `git/SKILL.md` Memory Access Matrix + Forbidden Operations + Procedures P4/P5).

User triage → 6 fixes accepted (FIX I–VI) for iter2.

## Iter2

Six fixes applied:
- **FIX I** — Added manager-direct pre-execution step for worktree creation per git Procedure P2.
- **FIX II** — Split final verification task into executor-only verification (no push/PR/merge); created manager-direct PR-merge step per git Procedures P4 + P5 + P7 for push, PR-open, CI watch, squash-merge, post-merge sync, worktree cleanup.
- **FIX III** — Manager session.json stamp step moved to AFTER squash-merge. Stamps on main-tree develop, not in worktree.
- **FIX IV** — All commit-message blocks added with canonical `AI-Provenance-Record:` trailer per `git/conventions.md` § Commit Trailers. No `Co-Authored-By:`.
- **FIX V** — Final verification block fully inlined; `<worktree-path>` placeholders replaced with `${WORKTREE_PATH}` env var; concrete runnable commands including P7 reword check + FIX C shell-safety fixture + `orchestration/SKILL.md` transcriptPath grep.
- **FIX VI** — PR-merge preconditions include `gh auth status` re-verify per Preparation finding δ disposition.

Verdict: REVISE (both Claude and Codex iter2 caught remaining grammar/template issues — commit subject lengths >72, M2 PR title >72, unresolved `<main-tree root>` placeholders, M2 PR body placeholder, missing M2 P5 pre-remove gate).

User triage → 5 fixes accepted (FIX α–ε) for iter3 final.

## Iter3 (final, max=3)

Five surgical fixes applied:
- **FIX α** — T4 (86→65 chars), T5 (78→66 chars), T6 (98→68 chars) commit subjects shortened to fit ≤72.
- **FIX β** — M2 PR title 99→64 chars.
- **FIX γ** — 5 `<main-tree root>` placeholders in M2/M1 replaced with concrete `/playinganalytics/git/gobbi`.
- **FIX δ** — M2 PR body rewritten per conventions.md PR template (4 sections + AI-Provenance-Record note).
- **FIX ε** — M2 cleanup adds explicit P5 pre-remove gate (`git status --short` empty + `git branch --contains HEAD develop`) per `git/SKILL.md` Procedure P5 step 3. No `--force`.

Third-iteration EVAL: Claude PASS-with-Low (PR body section order deviation); Codex REVISE (M2 PR body `--body "<placeholder>"` in bash command line).

## Post-iter3 manager polish (user-authorized; 2026-05-22)

Dual-system divergence + final-iter status → user authorized a manager-direct surgical fix to close Planning Loop cleanly. Two edits applied:
- Inlined M2 PR body via `$(cat <<'PRBODY' ... PRBODY)` HEREDOC in the verification command block (replacing the `<conventions-compliant body per How step 2>` placeholder). The bash command is now literally executable.
- Reordered PR body sections to canonical `conventions.md` order: **Summary → Changes → Test plan → Linked issues** (correcting F-CONS-04). Updated prose How step 2 description to match, citing the "Stamp the template; do not improvise structure" rule.

Effective Planning Loop verdict: **PASS-equivalent**.

## Out-of-scope items (deferred per Plan § Deferred Items)

- Plugin mirror sync (excluded by user setup answer).
- Runtime CLI code under `packages/cli/src/` (excluded by user setup answer).
- TS+bun port of the hook (deferred to a future session per user setup answer).
- F-STRUCT-01 (jq @sh env-passthrough quoting example) — staged in Ideation backlog.
- F-RISK-01 (subagent CCSI semantics) — staged in Ideation backlog.
- CLI automation of session.json transcriptPath stamping (deferred per FIX A disambiguation).

## Decision-class summary

All user-facing decisions classified per `discussion/SKILL.md` Decision Classification:
- 3 × `ask: design` (Plan-level structure, M2 PR body template, M0 worktree-creation framing)
- 4 × `ask: scope` (REVISE-vs-accept on each iter, iter3 manager-polish authorization)
- 0 × `user-challenge`
- 0 × `auto-decide`

## Open questions

None remaining for Planning. The Plan is Execution-ready. Manager dispatched M0 first (worktree creation) on advance to Execution Loop.
