---
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
loop: execution
task: task-02
system: codex
iter: 1
perspective: usage
verdict: REVISE
---

## Artifact Summary

Commit `97ae373` changes instructions consumed by managers and subagents during git-active Gobbi sessions. The consumer-facing question is whether a tired future agent can open `git/SKILL.md`, find the relevant quick-reference section, and write session notes / mistakes to the correct root without reconciling conflicting instructions manually.

### Memory reads

- `.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/execution/task-02/evaluation/iter1/codex/.prompt.md`
- `.agents/skills/principles/SKILL.md`
- `.agents/skills/mistake/SKILL.md`
- `.agents/skills/gobbi/SKILL.md`
- `.agents/skills/orchestration/SKILL.md`
- `.agents/skills/discussion/SKILL.md`
- `.agents/skills/delegation/SKILL.md`
- `.agents/skills/git/SKILL.md`
- `.agents/skills/codex/SKILL.md`
- `.agents/skills/evaluation/SKILL.md`
- `.agents/skills/execution/evaluation.md`
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md`
- `.gobbi/projects/gobbi/mistakes/codex-rescue-agent-fire-and-forget-without-result-capture.md`
- `.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md`
- `.gobbi/projects/gobbi/mistakes/evaluator-returned-verdict-inline-no-per-perspective-files.md`
- `.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/session.json`
- Commit metadata, diff, and committed `git/SKILL.md` content via `git show`.

### Verification evidence

- `session.json.transcriptPath` in this session is `~/.claude/projects/-playinganalytics-git-gobbi/1b26cf20-677b-498c-8c1b-7d7e971597ac.jsonl`, supporting the new transcript-path note.
- `rg -n "Session notes|MUST write|never the worktree|worktreePath"` on the committed file shows both new and old write-path instructions.

## Locked Frame (Stage 1)

Scenario U1: A manager follows the top Memory Access Matrix.
- Checklist: manager can determine worktree-first behavior.
- Checklist: manager can determine direct-mode fallback behavior.
- Checklist: manager understands transcript path is outside the git trees.

Scenario U2: A manager follows the bottom Constraints checklist.
- Checklist: the same destination rule is present there.
- Checklist: there is no stale "never the worktree path" instruction.

Scenario U3: A manager follows the P2 procedure directly.
- Checklist: the procedure states when it is invoked.
- Checklist: the procedure body does not imply a different invocation point.
- Checklist: executors receive an existing `session.json.git.worktreePath` rather than creating new worktrees.

Scenario U4 (adversarial): A subagent only skims the Constraints section before writing a note.
- Checklist: skimming the quick-reference section still leads to the correct root.
- Checklist: no section requires reading another section to avoid an incorrect destination.

Scenario U5: Accessibility / i18n not applicable.
- not-applicable: This is an English-only internal process doc and no UI, user-facing strings, keyboard path, locale-sensitive formatting, or screen-reader surface changed.

## Stage 2 Findings

Scenario U1 results:
- yes: the top rule is usable.

Scenario U2 results:
- no: bottom Constraints still says the old rule.

Scenario U3 results:
- no: P2 note and P2 body disagree about the invocation phase.

Scenario U4 results:
- no: a skimming subagent can pick the wrong rule from the Constraints section.

Scenario U5 results:
- not-applicable as framed.

### Findings

ID: USAGE-001
type: assumption_risk
domain: operator-guidance
confidence: 94
severity: High
disposition: open
evidence: `git/SKILL.md` line 278 still says notes and mistakes must be written to the main tree absolute path and never the worktree path, while line 33 says to use `session.json.git.worktreePath` when set.
impact: The document forces consumers to choose between two normative rules. The most likely failure is an agent following the lower Constraints checklist and violating the new worktree-first contract.
recommendation: Update the Constraints and Output paths sections so every skimmable quick-reference path gives the same `worktreePath` / direct-mode fallback rule.

## Per-perspective verdict

REVISE. Consumer-facing instructions are not safe because quick-reference sections still encode the old behavior.
