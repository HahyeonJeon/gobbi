---
title: Session lifecycle and worktree boundaries
status: accepted
feature: null
related:
  - features/session-foundations-bundle-b/design/d-1-worktree-row-5-5.md
  - features/session-foundations-bundle-b/design/d-2-qualified-git-rule.md
  - features/session-foundations-bundle-b/design/d-4-per-iter-session-commit.md
  - features/session-foundations-bundle-b/design/d-5-direct-mode-retained.md
---

# Session lifecycle and worktree boundaries

## Problem

Before the v0.5.0 worktree-first redesign, session writes were ambiguous: session
notes, project memory drafts, and mistake files could land in either the main tree
or a worktree depending on which path the agent constructed. This produced two
documented failure modes:

- **Concurrent-session corruption.** Without per-session worktrees, two sessions
  working in the same main tree produced overlapping diffs. The manager could not
  tell which file changes belonged to which session, and legitimate work was
  reverted as scope creep at review.
- **Main-tree vs. worktree write-path ambiguity.** The `git/SKILL.md` rule at
  line 33 formerly said "use the main-tree absolute path" unconditionally. A
  worktree-aware agent following that rule would write session artifacts into the
  main tree rather than the worktree, leaving the worktree branch empty and
  producing a PR diff missing the session memory. The inverse failure
  (`codex-eval-session-write-path-nested-in-worktree.md`) produced the opposite
  problem — all writes inside the worktree, including transcript paths that live
  in `~/.claude/projects/` and are outside both trees.
- **Session directory placement uncertainty.** Without a canonical rule for where
  the session directory (`sessions/{date}-{session-id}/`) is rooted, agents had to
  guess. Guesses diverged.

The root cause was that no single rule captured "where does the write go when a
worktree exists?" and "where does it go when one does not?"

## Approach

The v0.5.0 worktree-first model resolves the ambiguity with a single canonical
decision made at Configuration Step 1 before any loop work begins.

**Worktree creation precedes session.json init (D-1).** Row 5.5 of the
Configuration Step 1 table in `orchestration/SKILL.md` creates the per-session
worktree via `git/SKILL.md § P2` and stamps `session.json.git.worktreePath` and
`session.json.git.branch` before row 6 (session.json full stamp) runs. Branch
naming follows the convention: `chore/session-{date}-{ssid-short}` (e.g.,
`chore/session-2026-05-24-45388fa9`), where `{ssid-short}` is the first 8
characters of `$CLAUDE_CODE_SESSION_ID`. The branch name satisfies the
`git/conventions.md` shape regex and the 3-50 character length constraint (27
characters).

**`worktreePath` is the absolute write-root (D-2).** The qualified rule in
`git/SKILL.md` Memory Access Matrix and Constraints reads: "Use
`session.json.git.worktreePath` as the absolute root when set; fall back to the
main tree absolute path when `worktreePath` is null (direct mode)." Transcript
paths (`session.json.transcriptPath`) live in `~/.claude/projects/` — outside
both trees — and are never redirected.

**Per-iteration session-memory commit cadence (D-4).** After each MEMORIZATION
sub-phase completes, the manager commits the iteration's session-memory deltas to
the worktree branch via `git -C "$worktreePath" commit`. Subject:
`chore(session): record {loop} iter{n} memory`. This ensures session memory
survives mid-session abort before Wrap-up runs — `git worktree remove` (Procedure
P5) discards uncommitted state; committed state survives.

**Direct-mode opt-out retained (D-5).** Row 5.5 is guarded: when
`settings.git.workflow.mode == "direct"`, the row is skipped entirely — no
worktree is created, `session.json.git.worktreePath` stays `null`, and
`git.branch` is stamped from the current HEAD in row 6. Direct mode is the
documented escape hatch for emergency hotfixes (where the PR lifecycle overhead is
unacceptable) and pure-read sessions (no shippable artifact). Outside these two
situations the default is `worktree-pr`.

## Surfaces

The worktree-first model is distributed across nine edited surfaces in the skill
tree and session template:

| Surface | What it carries |
|---|---|
| `orchestration/SKILL.md` Step 1 rows 5/5.5/6 | Row 5.5 definition: P2 invocation, idempotency 3-state machine, direct-mode guard, branch naming, `worktreePath` stamp order. Row 6: `git.branch` + `git.worktreePath` stamp source. Row 5.5 footnote: direct-mode opt-out prose (LOCK #5). Smoke-test gate prose. |
| `orchestration/SKILL.md` Step 1 — smoke-test gate | Post-merge verification: `jq -r '.git.branch'` matches `^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$`; `jq -r '.git.worktreePath'` returns non-null for `worktree-pr` sessions. |
| `git/SKILL.md` Memory Access Matrix | Critical rule (last row): qualified write-path rule — `session.json.git.worktreePath` as absolute root when set; main-tree fallback when null; transcript paths outside both trees. |
| `git/SKILL.md` § P2 — Create worktree | P2 is invoked from Configuration row 5.5, not from Execution start. Steps for sync, re-verify, create, install, pass path. |
| `git/SKILL.md` § Constraints + Output paths | Constraint: "MUST root session notes and mistakes at `session.json.git.worktreePath` when set." Output paths table: session notes/mistakes row reflects worktree-first vs direct-mode distinction. |
| Five workflow phase docs (`orchestration/workflow/`) | `execution.md`, `ideation.md`, `planning.md`, `preparation.md`, `wrap-up.md` each carry the per-iter session-memory commit cadence (D-4): heredoc commit subject + `AI-Provenance-Record:` trailer + direct-mode opt-out note. |
| `delegation/SKILL.md` | Main-tree boilerplate corrected — delegation prompts reference `session.json.git.worktreePath` rather than a main-tree-absolute path. |
| `orchestration/templates/session.template.json` | `git.worktreePath` and `git.branch` fields present in the template; `git.worktreePath` initializes to `null` (stamped by row 5.5 at runtime). |
| `preparation/SKILL.md` | Narrow exception extension: executor commits on the worktree branch via `git -C "$worktreePath"` even for promote-now skills (the exception that applies within Preparation). |

## Validation

The model is checked at two levels:

**Smoke-test gate (post-merge check).** After the feature merges to `develop`,
every new `worktree-pr` session must satisfy both of the following checks at
Memorization phase:

```
# Branch name matches the canonical shape regex
jq -r '.git.branch' .gobbi/projects/gobbi/sessions/<latest>/session.json
# Expected: ^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$

# worktreePath is non-null for worktree-pr sessions
jq -r '.git.worktreePath' .gobbi/projects/gobbi/sessions/<latest>/session.json
# Expected: a non-null absolute path
```

A null `worktreePath` on a `worktree-pr` session indicates row 5.5 was skipped
or P2 failed without surfacing an error.

**Session writes landing under `worktreePath`.** For any `worktree-pr` session,
verify that `sessions/{date}-{session-id}/` is rooted inside the worktree, not
in the main tree. Cross-check: `git -C "$worktreePath" log --oneline` should show
`chore(session): record * iter* memory` commits appearing on the worktree branch.

**Direct-mode consistency check.** When `settings.git.workflow.mode == "direct"`,
`session.json.git.worktreePath` must be `null` and `git.branch` must match the
current HEAD at session start. Both `orchestration/SKILL.md` and `git/SKILL.md`
reference `settings.git.workflow.mode` identically (D-5 validation).

**This session as N=2 witness.** Session `2026-05-24-45388fa9` (the session that
authored this doc) runs in `worktree-pr` mode; its worktree lives at
`.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9`. Verifying
that this session's writes land inside that path and that its branch name matches
the regex constitutes the N=2 empirical pass of the smoke-test gate (Bundle B
T1.h, `d-1-worktree-row-5-5.md` § Validation).

## Lessons

Lessons section is intentionally sparse as of 2026-05-24 — authored before
Wrap-up ran per Bundle C DL-1 (β-1). Deepen after subsequent worktree-pr sessions
per R-7.

Two early observations grounded in the two sessions that have exercised the model
(Bundle B ship session `2026-05-23-1b26cf20` as N=1; this session as N=2):

- **The `chore` branch-type is the right choice for session branches.** The
  rejected alternative `session/{date}-{ssid-short}` (iter2 of D-1) was not in
  the `git/conventions.md` type registry and caused a REVISE verdict from the
  Codex evaluator. The `chore` type correctly signals "housekeeping, not a product
  feature" and has been in the registry from the start. Future sessions should not
  re-examine the branch-type question; it is closed at D-1.
- **Per-iteration commit cadence pays off on abort-recovery.** The once-at-Wrap-up
  alternative was rejected at D-4 because `git worktree remove` discards
  uncommitted state. In practice the per-iter cadence means each task's session
  memory is committed immediately after its MEMORIZATION phase — a session aborted
  mid-loop loses at most one iteration's worth of staging, not an entire session.
