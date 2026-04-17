# Project Gotchas: Code Edits

Project-specific gotchas for editing code in the gobbi CLI (TypeScript + bun).

---

### JSDoc `*/` inside docblock content terminates the block early
---
priority: medium
tech-stack: typescript, docblock
enforcement: advisory
---

**Priority:** Medium

**What happened:** The v0.5.0 Phase 2 PR C Wave 6 executor (C.5 `gobbi workflow guard` command) embedded a file path containing the literal sequence `*/` inside a JSDoc block — for example a reference such as `* .claude/project/gobbi/note/20260416-2225-.../research/research.md` when the path or a URL actually included `*/`, or a sample docstring that itself contained the characters. TypeScript interpreted the first `*/` as the end of the docblock and started parsing the remainder as code, producing a cascade of `TS1127` (invalid character) and `TS1443` (unterminated block comment) errors pointing at lines far from the true cause. The error messages did not name the offending `*/` sequence, so the root cause was non-obvious.

**User feedback:** Surfaced in the Wave 6 execution report; flagged by the overall-perspective PR C evaluator (m1) as an unrecorded gotcha that should be captured so future executors skip the debugging round.

**Correct approach:** Never write a literal `*/` inside the body of a JSDoc / block comment (`/** ... */` or `/* ... */`). Substitutes when the sequence is unavoidable:

- Split the characters with a zero-width escape: `*\/` (TypeScript accepts the backslash; the rendered doc reads as `*/`).
- Rephrase the prose — cite the reference descriptively without quoting the exact path containing `*/` (e.g. `research.md §Wave 6` instead of the glob-style path).
- Move the literal into a regular `//` line comment, which has no terminator semantics.
- If it must appear in a code sample inside the docblock, wrap the sample in a template-literal fenced block and escape the slash the same way (`*\/`).

When `TS1127` / `TS1443` fires on a line that looks syntactically fine, `grep -n '\*/' <file>` for every occurrence inside the preceding JSDoc and inspect each — the first one inside a docblock body is the culprit.
