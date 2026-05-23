# T2 Evaluation — Consistency Perspective — iter1

Date: 2026-05-22
Perspective: consistency
Evaluator: claude/sonnet-4-6
Target: commit 6a575f2 — `.claude/settings.json` SessionStart hook registration

## Stage 0 — What / Why / How

Consistency checks: does the hook registration align with prior established patterns in this codebase? Specifically: matcher value against PR #229 precedent; commit trailer format against project conventions; hook naming against any existing hook entries in settings.json history.

## Stage 1 — Frame

Scenarios:
1. Matcher value consistency with PR #229 (756c155)
2. Commit trailer format consistency with project convention
3. Hook schema consistency with any prior hooks entries in the codebase

## Stage 2 — Sequential Evaluation

### Scenario 1: Matcher value vs PR #229

PR #229 commit (756c155) was the "include clear in SessionStart matcher" fix. That commit's `.claude/settings.json` had matcher: `"startup|resume|clear|compact"` (confirmed via `git show 756c155:.claude/settings.json | jq '.hooks.SessionStart[0].matcher'` = `"startup|resume|clear|compact"`).

T2's matcher: `"startup|resume|clear|compact"`. Exact byte-for-byte match. PASS.

### Scenario 2: Commit trailer format

Project convention (from memory entries and PR #229 precedent): commits in this project authored by agents carry `AI-Provenance-Record:` trailer, not `Co-Authored-By:`. T2 commit has `AI-Provenance-Record: gobbi://session/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/task/T2` and no `Co-Authored-By`. Consistent. PASS.

### Scenario 3: Hook schema consistency

No prior `hooks` key existed in `.claude/settings.json` before this commit (diff shows only additions; prior state was `{ permissions: {...}, enabledPlugins: {...} }`). This is the first hook entry. The schema introduced (`SessionStart` → array of `{matcher, hooks: [{type, command}]}`) is the canonical Claude Code hooks format. No inconsistency with a prior pattern since none existed. PASS.

**Spot-check: regex escaping in matcher.** The value `startup|resume|clear|compact` uses `|` as alternation. None of the four tokens (`startup`, `resume`, `clear`, `compact`) contain regex metacharacters. No escaping needed. Consistent with how Claude Code regex matchers work. PASS.

## Findings

No findings. All consistency checks pass.

## Must-preserve

- Matcher value `startup|resume|clear|compact` — must not deviate from this established cross-PR canonical value.

## Verdict

PASS
