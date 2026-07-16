---
name: no-touch-git-gate-has-many-fail-open-modes
description: A "nothing protected changed" git gate was fail-open in six distinct, independently-plausible ways across write states, control flow, and symlink traversal — each needed its own fix.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-16
session: 59694f66-422a-4fd5-b93b-625c2f354fc3
tags: [verification, git]
keywords: [no-touch-gate, fail-open, symlink, git-diff-exit-code, git-ls-files, set-euo-pipefail]
author: claude
priority: high
domain: verification
related: [git-gate-blind-to-gitignored-writes, gitignore-aware-residual-gate]
---

# A "no-touch" git gate is fail-open in six distinct, independently-plausible ways

## What happened

Designing the Success Criterion self-failing gate for the scenario+checklist Ideation work — a gate
that must assert "no protected file under `.gobbi/projects/gobbi/skills/` changed" — surfaced six
separate fail-open modes across the gate's iterations, each individually plausible-looking and each
caught by a distinct evaluation round or a tool-run counterexample:

1. **No `--exit-code`.** A plain `git diff` prints a diff but exits 0 whether or not there is one; used
   as a gate condition it always reports "clean."
2. **Wrong path prefix.** An early draft's protected pathspecs used `skills/…` while the tracked files
   actually live at `.gobbi/projects/gobbi/skills/…`; the pathspec matched zero files, so the gate
   trivially "passed" no matter what changed.
3. **Undefined `fail` + no `set -e`.** A `... || fail "message"` construct with no `fail` function
   defined and no `set -e` continues past a failed leg to the next line instead of stopping — the script
   prints an error-looking message but still reaches `echo PASS` and exits 0.
4. **No `--cached` leg.** Checking only `git diff` (unstaged) and `git diff BASE...HEAD` (committed)
   misses a STAGED-but-not-committed edit — `git add`ed but not yet committed changes are invisible to
   both.
5. **`--exclude-standard` hides gitignored files.** An untracked-file check using
   `git ls-files --others --exclude-standard` by design excludes gitignored paths — exactly wrong for a
   leg meant to catch an untracked file dropped into a gitignored spot under the protected root.
6. **Symlink traversal.** Git pathspecs do not traverse symlinks, so a symlinked PARENT DIRECTORY placed
   under the protected root exposes a real protected-looking file (`skills/alias/scenario.md` resolves
   via the filesystem) that every path-based leg (tracked, staged, unstaged, untracked, ignored-untracked)
   reports as a non-match — the gate passes while a protected pathname is genuinely reachable.

## Why it happens

A "nothing changed" gate is only as strong as its weakest observability assumption, and each of the six
modes above is a DIFFERENT observability assumption: what `--exit-code` guarantees, what a pathspec
prefix must match against the tracked tree, what shell control flow guarantees when a leg fails, which
git states (committed / staged / unstaged / untracked / ignored) exist, what `--exclude-standard` is
FOR, and what a pathspec can and cannot see through a symlink. Each mode was independently plausible in
isolation — a reviewer checking any ONE of them in isolation would find it correctly implemented — but a
gate is not the AND of independently-plausible legs; it is only as strong as the union of everything it
fails to check.

## Correct approach

Build the gate with all of the following simultaneously, and tool-verify each:

- `set -euo pipefail` at the top, plus an explicitly DEFINED `fail(){ echo "..." >&2; exit 1; }` — so any
  failing leg aborts before reaching `echo PASS`.
- Every diff-based leg uses `--exit-code` (never a bare `git diff` for its exit status).
- The protected pathspecs use the ACTUAL tracked path prefix, verified with a runtime non-empty
  assertion (`git ls-files -- "${P[@]}"` must return ≥1 file, else the gate itself is misconfigured).
- Legs for every distinct git state: committed (`diff BASE...HEAD --exit-code`), staged
  (`diff --cached --exit-code`), unstaged (`diff --exit-code`), untracked
  (`ls-files --others --exclude-standard`), and ignored-untracked
  (`ls-files --others --ignored --exclude-standard`).
- A symlink-aware leg: `find <protected-root> -type l` and, for each symlink found, confirm it is a
  TRACKED path (`git ls-files --error-unmatch`) — an untracked symlink under the protected root fails
  the gate regardless of what the other legs report, because git pathspecs cannot traverse it to check
  what it exposes.
- TOOL-VERIFY fail-closed on every one of these edit states by constructing the actual counterexample
  (a real committed/staged/unstaged/untracked/ignored/symlinked write) in a scratch repo and confirming
  the gate exits 1 — do not accept "looks correct on inspection" for a security/confinement gate.

## How to detect

Any "assert nothing changed" / "confinement" / "no-touch" gate built on git commands. Specifically:
a gate description or draft that (a) uses a bare `git diff` without `--exit-code`, (b) uses `|| fail`
without a defined `fail` function and without `set -e`, (c) checks only one or two of
committed/staged/unstaged/untracked/ignored, (d) uses `--exclude-standard` on a leg meant to catch
gitignored writes, or (e) has no leg that accounts for symlinked directories/files under the protected
root. Each of these is individually a "looks fine" pattern until tool-verified against a constructed
counterexample.

## Related

- [[git-gate-blind-to-gitignored-writes]] — a prior, narrower instance of the same root cause (a
  git-based gate cannot see writes inside a gitignored path; `git diff --stat` also misses untracked
  files) — this session's finding EXTENDS that trap with four additional independent fail-open modes
  (missing `--exit-code`, wrong path prefix, undefined `fail` + no `set -e`, missing `--cached` leg) plus
  the symlink-traversal mode, none of which the prior mistake covered
- [[gitignore-aware-residual-gate]] — the companion trap from the opposite direction: a residual-grep
  gate over a worktree session must use `git grep`, for the same "know what the tool can and cannot see"
  reason
