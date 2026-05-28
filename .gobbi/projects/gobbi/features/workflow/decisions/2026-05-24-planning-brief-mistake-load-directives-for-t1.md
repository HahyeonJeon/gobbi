---
name: planning-brief-mistake-load-directives-for-t1
description: Planning must explicitly cite 3 project mistakes in the Load Directives block of every worktree-task brief, not rely on passive domain-filter loading.
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-05-23
session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [planning, load-directives, mistakes, worktree-tasks]
supersedes: null
superseded_by: null
decision_status: accepted
---

# Planning briefs must explicitly cite 3 mistakes in worktree-task Load Directives

## Context

T1 (worktree-first session architecture) touches `cwd` / worktree boundaries — Configuration row 5.5 worktree creation, `preparation/SKILL.md` narrow-exception `git -C "$worktreePath"` commit, `delegation/SKILL.md` main-tree boilerplate audit, and several adjacent edits. Two prior project mistakes are directly content-relevant to these surfaces (sandbox `cwd` write-path drift; `rm -rf` worktree cleanup safety), and one is procedural (manager Iron Law 7 brief construction discipline).

The default `mistake/SKILL.md` P1 load procedure tells executors to filter project mistakes by domain relevance — but T1's domain ("worktree" / "session-mechanics") doesn't exist as a tag on existing entries, so passive filtering may miss these. The Preparation adversarial-mode scan identified the three explicitly. The fix closes the gap by elevating from "passive load via domain filter" to "explicit citation in Planning brief Load Directives tier 4".

## Decision

Planning MUST include the following three mistake file paths in tier 4 (Mistakes) of the Load Directives block of EVERY worktree-task brief. Executors load them at Study phase before touching any worktree-task surface.

1. `.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md`
   - Relevance: T1 worktree-cwd routing. When `cwd` is inside the worktree, session writes must still resolve to the main-tree absolute path `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/{session-id}/…`. Executors editing `git/SKILL.md:33` qualified rule, `preparation/SKILL.md` narrow exception, or any session-write code path need this loaded.

2. `.gobbi/projects/gobbi/mistakes/manager-rm-rf-without-investigating-tracked-files.md`
   - Relevance: T1 worktree operations safety. Any executor or manager performing worktree cleanup MUST run `git status --short` + `git ls-files` before `rm -rf`. Cleanup paths in the rollback-semantics task and any related operational steps need this loaded.

3. `.gobbi/projects/gobbi/mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`
   - Relevance: Procedural — Planning brief construction. The manager constructing T1 task briefs MUST Read the Ideation artifact freshly when authoring any "verbatim" instruction. Memory-only briefs reconstructed from the long Planning draft drift. This mistake binds the brief-author (manager), not the executor — but it lives in tier 4 so the executor can also verify the brief against the artifact at Study phase.

## Rationale

The Preparation adversarial-mode scan found these three as the only mistakes with direct, content-relevant pull on T1 surfaces. The remaining process-tier mistakes (relevant only to specific phase rituals like evaluation finding routing, dual-system divergence, codex-rescue capture) remain loaded passively by tier 3 (mistake skill default) but do not need elevation.

This was the smallest possible intervention: no new mistake file, no new code, no new doc — just a binding load directive in the Planning brief template. User confirmed via AskUserQuestion ("Recommended: Yes — add explicit load directive in each T1 task brief").

## Alternatives considered

- **Rely on default mistake-skill P1 domain-filter load.** Rejected: T1 introduces a new domain ("worktree" / "session-mechanics") with no tagged precedent — the filter would not surface these three reliably.
- **Generate a new mistake file synthesizing the three.** Rejected: synthesis duplicates content already captured; the three originals carry full context and the corrected approach. Synthesis adds drift risk.
- **Add the load directive only to one or two T1 briefs.** Rejected: every T1 task brief touches at least one of (cwd routing / worktree operation / verbatim spec citation). Uniform inclusion eliminates filter-and-miss risk.

## Consequences

- Planning's per-task-brief template (constructed by manager during Planning Loop) gains a mandatory 3-line block under tier 4 of Load Directives for every T1 task.
- Executors loading T1 task briefs read the three mistakes at Study phase before any T1 surface edit.
- The Planning evaluator can mechanically check brief compliance: grep each T1 task brief for the three file basenames.

## Related

- Ideation artifact: `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/ideation/artifacts/bundle-b-ideation-pass.md` § Implementation Checklist T1
- Sub-step A → D findings: `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/preparation/rawdata/sub-steps-a-d-iter1.md` § Adversarial-mode scan § Mistakes flagged for Execution awareness
- AskUserQuestion exchange: user picked "Recommended: Yes" on adding the explicit load directive.
- The three cited mistake files in `.gobbi/projects/gobbi/mistakes/`.
