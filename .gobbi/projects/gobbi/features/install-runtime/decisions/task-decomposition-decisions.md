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
verdict: pass
---

# Planning Decisions — Env-Var Audit + SessionStart Hook task decomposition

## Context

The Planning loop decomposed the env-var-audit + SessionStart-hook feature into an Execution-ready task plan. The plan went through three dual-system evaluation rounds plus a final user-authorized manager polish before it was Execution-ready. This record captures the final decision, the fixes that shaped it, and the deferred scope.

## Decision

**The Planning loop closed at PASS-equivalent — the plan is Execution-ready.** The decomposition splits the work into executor tasks plus manager-direct steps (worktree creation, PR-merge, post-merge stamping) that respect the manager/executor boundary in `git/SKILL.md`. The plan reached its final shape after three evaluation rounds and a user-authorized closing polish.

## Rationale

The plan was refined across three evaluation rounds:

**First round — REVISE.** Claude returned PASS-with-5-Medium (worktree creation underdocumented as a discrete task); Codex returned REVISE on 5 High findings, all centered on the final verification task crossing the manager/executor boundary by doing `git push` + `gh pr create` (a violation of `git/SKILL.md` Memory Access Matrix + Forbidden Operations + Procedures P4/P5). User triage accepted 6 fixes (FIX I–VI):

- **FIX I** — Added a manager-direct pre-execution step for worktree creation (git Procedure P2).
- **FIX II** — Split the final verification task into executor-only verification (no push/PR/merge) and created a manager-direct PR-merge step (git Procedures P4 + P5 + P7: push, PR-open, CI watch, squash-merge, post-merge sync, worktree cleanup).
- **FIX III** — Moved the manager session.json stamp step to AFTER squash-merge; it stamps on main-tree develop, not in the worktree.
- **FIX IV** — Added the canonical `AI-Provenance-Record:` trailer to all commit-message blocks (`git/conventions.md` § Commit Trailers); no `Co-Authored-By:`.
- **FIX V** — Fully inlined the final verification block; replaced `<worktree-path>` placeholders with a `${WORKTREE_PATH}` env var; added concrete runnable commands (the transcript-path reword check, the FIX C shell-safety fixture, and the `orchestration/SKILL.md` transcriptPath grep).
- **FIX VI** — Added a `gh auth status` re-verify to the PR-merge preconditions (per the Preparation `gh auth` dispute disposition).

**Second round — REVISE.** Both Claude and Codex caught remaining grammar/template issues: commit subject lengths >72, the merge PR title >72, unresolved `<main-tree root>` placeholders, a PR-body placeholder, and a missing pre-remove gate. User triage accepted 5 fixes (FIX α–ε):

- **FIX α** — Three commit subjects shortened to fit ≤72 chars.
- **FIX β** — Merge PR title shortened (99→64 chars).
- **FIX γ** — 5 `<main-tree root>` placeholders replaced with the concrete path `/playinganalytics/git/gobbi`.
- **FIX δ** — Merge PR body rewritten per the `conventions.md` PR template (4 sections + AI-Provenance-Record note).
- **FIX ε** — Added an explicit pre-remove gate to the cleanup step (`git status --short` empty + `git branch --contains HEAD develop`, per `git/SKILL.md` Procedure P5 step 3); no `--force`.

**Third round (final).** Claude returned PASS-with-Low (a PR-body section-order deviation); Codex returned REVISE (a `--body "<placeholder>"` left in a bash command line).

**Closing manager polish (user-authorized).** Given the dual-system divergence at the final round, the user authorized a manager-direct surgical fix to close the loop: the PR body was inlined via a HEREDOC (making the bash command literally executable), and the PR-body sections were reordered to the canonical `conventions.md` order (Summary → Changes → Test plan → Linked issues). The effective Planning verdict is PASS-equivalent.

## Alternatives considered

The following were explicitly deferred out of the plan's scope (per the Plan's Deferred Items):

- Plugin mirror sync — excluded by the user's setup answer.
- Runtime CLI code under `packages/cli/src/` — excluded by the user's setup answer.
- TS+bun port of the hook — deferred to a future session per the user's setup answer.
- The jq @sh env-passthrough quoting example — staged in the Ideation backlog.
- The subagent CCSI-semantics finding — staged in the Ideation backlog.
- CLI automation of `session.json` transcriptPath stamping — deferred per the stamping-mechanism disambiguation (FIX A in `env-file-load-semantics-decisions.md`).

## Consequences

- The plan is Execution-ready with no open Planning questions; the manager dispatches the worktree-creation step first on advance to Execution.
- All user-facing Planning decisions classified (per `discussion/SKILL.md` Decision Classification) as: 3 × `ask: design` (plan-level structure, merge PR body template, worktree-creation framing); 4 × `ask: scope` (the REVISE-vs-accept call on each round plus the closing manager-polish authorization); 0 × `user-challenge`; 0 × `auto-decide`.
- The manager/executor boundary is baked into the plan: executors verify only; the manager performs push, PR-open, merge, stamping, and cleanup.

## Related

- `decisions/env-file-load-semantics-decisions.md` — the Ideation design decisions this plan implements.
- `decisions/pre-planning-readiness-decisions.md` — the Preparation readiness gate (the `gh auth` disposition FIX VI carries forward).
- `notes/2026-05-22-env-var-audit-sessionstart-hook.md` — the project session journal for this work.
