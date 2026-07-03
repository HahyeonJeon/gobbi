---
name: validation-commands-need-root-relative-pathspecs
description: iter1 Codex finding USAGE-VALIDATION-PATHS-001 — design-doc validation commands must use root-relative pathspecs with -- to be runnable from the worktree root
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [process, verification]
keywords: [usage-validation-paths, git-grep, pathspec]
author: claude
---

# Validation commands must use root-relative pathspecs with `--`

## Context

The iter1 draft's validation commands used bare pathspecs — `preparation`, `orchestration`,
`chat-mode.md`, `wrap-up/SKILL.md`, `gobbi/SKILL.md`, `record/SKILL.md` — without a canonical
root-relative prefix. The Codex evaluator (finding USAGE-VALIDATION-PATHS-001, High/100) ran
representative commands from the target worktree root and hit Git fatal pathspec errors for
`preparation`, `chat-mode.md`, and `record/SKILL.md`. An executor following the draft's validation
plan literally would hit these errors before testing any behavior — a false blocker that could also
mask a real residual defect if someone "fixes" the command ad hoc with the wrong current directory.

## Decision

Every validation command in the design package is rewritten with explicit root-relative pathspecs
under `.gobbi/projects/gobbi/skills/...` and the `--` pathspec separator, assuming a `cwd` of the
repo/worktree root. Where a command is intended to run from inside a skill directory instead, the
required `cwd` is stated next to the command.

## Rationale

Root-relative pathspecs with `--` are unambiguous regardless of the caller's current directory and
match the project's own git-discipline convention (see `git/mistakes.md` on absolute-path write
discipline). This closes the gap between "the validation plan looks executable" and "the validation
plan actually runs."

## Alternatives considered

- **State a required `cwd` for every command instead of using root-relative paths** — considered but
  rejected as the primary fix (adds a second thing an executor must get right); kept as a fallback
  note only for commands genuinely intended to run inside a skill directory.
- **Leave the commands as-is and rely on executor judgment** — rejected; the whole point of an
  executable validation is that it does not require judgment to run correctly.

## Consequences

The iter2 evaluator re-ran all 11 validation commands from the worktree root: every command exited
0 or 1 (a real grep miss/hit), zero exited 128 (git fatal-pathspec) — the defect is fully closed and
tool-verified.

## Related

- [[d1-001-drop-re-ideate-verdict]] — one of the designs whose validation commands this decision fixed
- [[d7-002-runtime-aware-transcript-audit-branch]] — another
