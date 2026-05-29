# Usage — T3 iter1

## Locked Frame
- U1: Reader of SKILL.md can navigate to chat-mode.md / auto-mode.md without dead links
- U2: A fresh manager picking up the file mid-session understands what changed and why
- U3 (adversarial): Can a reader misinterpret the strike-through as deleted (vs superseded)?

## Stage 2 Findings
- Links to `chat-mode.md` and `auto-mode.md` resolve: both files exist at the worktree path (28258 / 12267 bytes) plus mirror symlinks at `.claude/skills/orchestration/`. ✓
- CORRECTION block at line 66 explicitly preserves the original wording in quotes and says "has been superseded by the mode-dispatched state-machine design ratified in session …" — supersession (not deletion) is unambiguous.
- Inline CORRECTION at line 247 reinforces with "see the CORRECTION block at § Orchestration Mode" — cross-reference good.
- 4th Chat gate at line 405 names the three options (Next task / Revise / Wrap up) — a manager reading it at 3am knows exactly what to AskUserQuestion.

### Findings
- **Finding U-1 — `general` / `docs-sync`**: The Mode-specific gates table lead-in "**Chat Mode** pauses at three points:" misleads the reader who will count and find four. This collides with U2's "reader understands". Confidence: 100. Severity: Low. Disposition: open. (Same as Structure S-1.)

## Verdict: PASS
