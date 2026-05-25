---
evaluator: codex
model: gpt-5-codex
iter: 3
verbatim: true
phase: planning-eval
perspective: p4-specificity
---

# Planning iter3 EVAL - Codex Specificity Perspective

## Findings

The H1 fix is specific enough. The plan states that macros are prose-only, executable commands are worktree-relative, and the two formerly broken commands now name concrete worktree-relative paths. Running both commands produced pass output.

The H2 fix is specific enough in the second T06 SC-5 spot-check. It names the three semantic clauses directly and validates each file against hardcoded patterns rather than a mutable sweep target. The `>= 7 of 10` threshold is also specific: it permits at most 3 polished/non-exact files and rejects 4 or more wrong files.

SC-3.2's awk terminator is acceptable for `mistake/SKILL.md`. The Path conventions block is at the end of the file; the extracted block had 8 lines and no later `###` header was present. Running to EOF does not pull in unrelated sections in the current file shape.

### Codex-Iter3-H3

Type: `design_flaw/test`

Severity: High

Confidence: 100

Evidence:
The plan says the canonical M2 row is locked, and the quoted row contains the backticked token `` `$CLAUDE_CODE_SESSION_ID` ``. The older M2 clause-2 regex used in T03 SC-3.2, T04 SC-2.2, and the first T06 SC-5 entry is not specific enough for that punctuation: `old_pattern_matches_canonical=0`. The iter3 spot-check regex is specific to the intended semantics while tolerating punctuation: `iter3_pattern_matches_canonical=1`.

Why it matters:
The plan's verification language is more precise in one place than in the others. That lets the same intended M2 wording be accepted by the spot-check and rejected by the per-file gates.

Suggested direction:
Make the M2 clause-2 verification pattern explicit and shared across all affected checks. The simplest repair is to use `[Dd]o NOT read .*CLAUDE_CODE_SESSION_ID.* for this value` in T03 SC-3.2, T04 SC-2.2, and both T06 SC-5 entries.

VERDICT: REVISE
