# Planning iter3 — Usage perspective (Claude)

## Stage 0 — Artifact summary

Usage perspective: can a fresh sonnet executor + the manager use the iter3 Plan headless without ambiguity?

## Stage 1 — Locked frame

- U-S1 Will the executor's Task 01 NOT trigger `$EDITOR` on the tag command?
- U-S2 Will the manager have an unambiguous §5a precheck → remove path?
- U-S3 Does main.md alone (without draft-iter3.md) carry the necessary executor context, or does it correctly defer to draft-iter3.md for full audit?
- U-S4 Is the NEEDS_CONTEXT escape vocabulary explicit + actionable?

## Stage 2

### U-S1 — Tag command headless-safe
- Line 462: `git tag pre-reset-2026-05-21 487fc35` (lightweight). No `-a`, no `-m`, no `$EDITOR`. Sonnet executor runs headless without prompt.
- Verdict: addressed (Conf 100).

### U-S2 — Manager §5a path
- Step ordering explicit: precheck first → check empty → either NEEDS_CONTEXT (non-empty) OR proceed to remove (empty).
- Two worktrees enumerated explicitly with literal paths.
- Verdict: addressed (Conf 95).

### U-S3 — main.md vs draft-iter3.md
- main.md is the "summary + sub-task list" surface; draft-iter3.md is the audit/command source. iter3 Fix 3 fixes main.md:98 wording; iter3 fix-table at main.md:42-45 summarizes all 4 fixes; cross-reference to draft-iter3.md is explicit.
- Verdict: addressed (Conf 90).

### U-S4 — NEEDS_CONTEXT vocabulary
- §5a NEEDS_CONTEXT trigger explicit (line 348 + 353): "worktree <path> has uncommitted changes <listing>; investigate or accept loss?".
- "MUST NOT auto-`--force`" reinforces no-bypass.
- Verdict: addressed (Conf 95).

## Findings

No new Usage findings.

## Must-preserve list

- Headless-safe tag command form.
- NEEDS_CONTEXT escape vocabulary.
- main.md summary cross-references draft-iter3.md.

## Verdict

**PASS.**
