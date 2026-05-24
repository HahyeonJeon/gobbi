## Artifact Summary + Memory reads

Task 04 evaluates commit `79b8925e5eef7937b3ddabae9ae9cd45774c6407`, which makes row 5.5 discoverable from `gobbi/SKILL.md` and makes session-write path discipline discoverable from `delegation/SKILL.md`. The consumer is a future manager or subagent-prompt author, possibly during a tired resume/compact session where the write-root distinction matters. The usage question is whether those consumers can act correctly without reverse-engineering the skill tree.

Memory reads:
- Exact commit diff and full modified files
- Plan Task 04, Scope Contract, evaluation skill, execution child doc
- Mistakes: `codex-eval-session-write-path-nested-in-worktree.md`, `claude-evaluator-step4-only-vs-codex-whole-file-grep.md`, `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`, and `memorization-delegation-prompts-must-load-memorization-skill.md`
- Project rule `stub-redirect-format.md` (not applicable)

W/W/H gate: clear. No phase mismatch.

## Locked Frame (Stage 1)

Scenario U1: A manager reading gobbi bootstrap instructions can find row 5.5.
- Check U1.1: The cross-reference names the owning skill and section.
- Check U1.2: It explains the relevant row-order relationship.
- Check U1.3: It names the operational output, `git.worktreePath`.

Scenario U2: A manager writing a delegation prompt can apply write-root discipline.
- Check U2.1: The note says what to do when `session.json.git.worktreePath` is set.
- Check U2.2: The note says what to do when `worktreePath` is null.
- Check U2.3: The note connects to the full rule for details.

Scenario U3: Known process mistakes are guarded against.
- Check U3.1: The delegation note helps prevent worktree-nested session writes.
- Check U3.2: The evaluation itself uses exact-commit, whole-file grep for docs wording instead of only changed-line review.
- Check U3.3: The outputs are written as eight files, not returned inline.

Scenario U4 (adversarial): A reader follows the note and still writes to the wrong root.
- Check U4.1: The fallback condition is explicit enough to avoid always-main-tree behavior.
- Check U4.2: The worktree condition is explicit enough to avoid relative-CWD writes.

Coverage matrix: Accessibility applies as agent/operator readability; i18n is not applicable because no UI/user-facing locale strings changed.

## Per-scenario per-check results

U1.1: yes. The gobbi addition links to `orchestration/SKILL.md § Step 1`.
U1.2: yes. It states row 5.5 runs after `state.json` initialization and before `session.json` stamping.
U1.3: yes. It names `git.worktreePath` directly.

U2.1: yes. The delegation note says to use `session.json.git.worktreePath` as the absolute root when set.
U2.2: yes. The note says to fall back to the main tree only when `worktreePath` is null.
U2.3: yes. It links to `git/SKILL.md § Memory Access Matrix`.

U3.1: yes. The new delegation note directly addresses the mistake class in `codex-eval-session-write-path-nested-in-worktree.md`.
U3.2: yes. Exact-commit grep covered the whole relevant files and checked parent/post `main.tree` sites.
U3.3: yes. This evaluation writes the contracted per-perspective files.

U4.1: yes. The direct-mode fallback is conditional, not absolute.
U4.2: yes. The note says "absolute root" and names `session.json.git.worktreePath`.

## Typed findings

No open Usage findings.

## Verdict

PASS

## Low-confidence appendix

None.
