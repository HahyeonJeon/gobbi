# Usage — T05 iter1 (commit 9f5229d)

## Verdict: PASS

## Actionability test

A manager reading any of the 5 inserts and following them verbatim can execute the cadence. Walking the steps:

1. Trigger: MEMORIZATION completes (PASS, REVISE, or FAIL). Explicit.
2. Command: heredoc-form `git -C "$worktreePath" commit -m "$(cat <<'EOF' … EOF\n)"`. Full command provided; substitutes `{session-id}`, `{n}`, and (for execution) `{task-id}` from session state. Specified.
3. Verify: `git -C "$worktreePath" log -1 --format=%B` confirms trailer landed. Specified.
4. Skip condition: `settings.git.workflow.mode == "direct"` → skip commit. Specified with cite to row 5.5 footnote.

All inputs are derivable from `session.json` (`worktreePath`, `sessionId`) or task context (`task-id`, iter `n`). No undefined symbols.

## Worktree state preconditions (implicit but recoverable)

The cadence assumes the working tree has uncommitted memorization outputs to commit. Not explicit in the inserts — but the surrounding MEMORIZATION section in each phase doc enumerates the staging writes that happen this iter, so the reader has context. Could be tightened with "after staging writes for this iter are flushed, run the commit"; reasonable to defer as polish — Low/25.

## Direct-mode hand-off

The opt-out sentence is correct: "The iteration's session-memory still lives under `sessions/{date}-{session-id}/{loop}/`, but the commit cadence is a worktree-pr-mode contract." A direct-mode user is not confused about where the data goes — it's just not git-committed.

## Cross-reference resolvability

- `orchestration/SKILL.md § Configuration Step 1` row 5.5 — exists at line 103, footnote at 107. Resolvable.
- `git/conventions.md:116-119` — section "Commit Trailers" + AI-Provenance-Record table. Resolvable.
- `preparation/SKILL.md` `chore(skills): promote {slug}` — exists at line 71. Resolvable.

## Per-loop variation usability

- Execution's `record execution-{task-id} iter{n} memory` is necessary: without `task-id`, all execution iters would collide in `git log --oneline`. Variation justified.
- Preparation's narrow-exception note is necessary: the generate-now commit and the session-memory commit can fire in the same Preparation iteration; without the distinguishing sentence, a reader might think they're alternatives. Variation justified.
- Wrap-up's `maxIterations` note is informational, not load-bearing. Slightly aesthetic, but it correctly tells the reader "this commit is the last commit before workflow.finish" — useful framing.

## Findings

None blocking.

## Preserve

- Heredoc form with single-quoted EOF delimiter prevents shell expansion of `$session-id` etc — correct for trailer literals.
- Verify-after-commit step prevents silent trailer drops (the T03 iter2 failure mode).

## Verdict: PASS
