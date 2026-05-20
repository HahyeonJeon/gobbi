# Usage Perspective — 5-Role Agent Taxonomy (iter6, claude — TRULY FINAL)

## Stage 0 — Artifact Summary + Memory reads

See `project.md`. Usage = next-consumer (manager / assistant / fresh-subagent) usability.

**Memory reads**:
- `iter5/claude/usage.md` (PASS; one Low/50 cross-ref nit)
- `skills/orchestration/SKILL.md` rows 99 / 117 / 135 / 153 / 171 / 258
- `skills/orchestration/workflow/{planning,preparation}.md`
- `agents/assistant.md:18`

## Locked Frame (Stage 1)

### S-U-iter6-NEW-1 (adversarial): Can a fresh assistant subagent at non-Wrap-up MEMORIZATION read the row and know exactly what is permitted?
- The new prose says "Write session staging only" + names "Wrap-up" as the sole project-memory promoter
- The cross-ref `[memorization.md](workflow/memorization.md)` is preserved
- Assistant frontmatter `tools: ...` (in assistant.md) still names the write tools the assistant needs for the session-staging surface

### S-U-iter6-NEW-2 (adversarial): Does the new prose cause a fresh assistant subagent at Wrap-up MEMORIZATION to under-write?
- Wrap-up row 171 explicitly says "Write session and project memory for this iteration" — unambiguous
- assistant.md:18 + wrap-up/SKILL.md:3 reinforce "sole project-memory writer at Wrap-up"

## Per-scenario per-check results (Stage 2)

### S-U-iter6-NEW-1 — verified
- The contract is operational: "write to session staging, don't promote to project memory; the Wrap-up assistant will promote your stage"
- The full operational procedure lives in `memorization.md` (delegated correctly)

### S-U-iter6-NEW-2 — verified
- Wrap-up row 171 retains its full project-memory authority
- Cross-doc reinforcement (assistant.md:18 "sole project-memory write surface" + wrap-up/SKILL.md:3 "SOLE writer to project memory") preserved

## Typed findings

No new in-scope findings.

## Disposition of inherited findings

| Finding | iter5 state | iter6 disposition |
|---|---|---|
| F-U-iter5-NEW-01 (cross-ref precision; same root as F-S-iter5-NEW-01) | open (Low/50) | open (carry) — not in iter6 scope |
| F-U-iter4-NEW-01 / -02 | addressed (iter5 Fix 1+2) | addressed (carry) |
| F-U-04 / F-U-03 | open / addressed | open / addressed (carry) |

## Verdict

**PASS** — fresh-subagent contract clear in both directions (staged-only at non-Wrap-up; project-memory write at Wrap-up).

## Low-confidence appendix

- (none new in iter6)
