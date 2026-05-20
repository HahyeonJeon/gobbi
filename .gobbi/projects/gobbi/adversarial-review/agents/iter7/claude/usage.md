# Usage Perspective — 5-Role Agent Taxonomy (iter7, claude — TRULY-TRULY-FINAL)

## Stage 0 — Artifact Summary + Memory reads

See `project.md`. Usage = next-consumer (manager / fresh-subagent) usability.

**Memory reads**:
- `iter6/claude/usage.md` (PASS; one Low/50 cross-ref nit)
- `skills/orchestration/SKILL.md` lines 187–230 (status display block), 240–250 (state-persistence schema sentence)

## Locked Frame (Stage 1)

### S-U-iter7-NEW-1 (adversarial — primary): Can a fresh manager subagent read the status table and know exactly what Preparation expects?
- The Preparation row at line 197 must be self-explanatory at the table level (state value + columns)
- The reader must be able to follow the cross-ref into Step 3 — Preparation Loop section (line 102) for procedure detail
- The schema-shape sentence must give the writer enough to populate `state.json` correctly when entering Preparation

### S-U-iter7-NEW-2 (adversarial): Does a fresh manager who reads only the status-display section get the wrong impression of the workflow?
- Header line says "Step 2 of 6" — a fresh reader must understand "of 6" refers to the full workflow including all loops
- The status table must include enough cues (em-dashes, `… Pending`) that a not-yet-reached step is obviously not the active one

### S-U-iter7-NEW-3 (adversarial): Does the schema-shape sentence give a manager-on-resume enough to reconstruct state across the 6-key shape?
- The sentence must enumerate all 6 keys in display order
- The sentence must clarify the active-step derivation (the key whose `state` is `Active` or `Revising`) — verify this clause is preserved

## Per-scenario per-check results (Stage 2)

### S-U-iter7-NEW-1 — verified
- Preparation row at line 197 carries `… Pending` + `—` + `—` — same columns and same placeholders as the other not-yet-reached steps
- A fresh manager reading the table at any point before Preparation activates sees the row in `… Pending` and follows the convention
- Cross-ref to Step 3 — Preparation Loop section (line 102) exists in the procedure block; the table does not re-state procedure detail, which is correct (table = projection, procedure section = source-of-truth)

### S-U-iter7-NEW-2 — verified
- Header line "Step 2 of 6" + table row count = 6 + step labels enumerated in field rules (line 217) — three independent cues all give the same answer
- `… Pending` rows clearly distinguish not-yet-reached from active

### S-U-iter7-NEW-3 — verified
- Schema-shape sentence at line 250 enumerates all 6 keys: `configuration`, `ideation`, `preparation`, `planning`, `execution`, `wrap-up`
- Active-step derivation clause preserved: "The current active step is derived (the entry whose `state` is `Active` or `Revising`); there is no separate `active` key."
- Display order phrase preserved: "Configuration → Ideation → Preparation → Planning → Execution → Wrap-up"

## Typed findings

No new in-scope findings.

## Disposition of inherited findings

| Finding | iter6 state | iter7 disposition |
|---|---|---|
| F-U-iter5-NEW-01 (cross-ref precision; same root as F-S-iter5-NEW-01) | open (Low/50) | open (carry) — not in iter7 scope |
| F-U-iter4-NEW-01 / -02 | addressed (carry) | addressed (carry) |
| F-U-04 / F-U-03 | open / addressed | open / addressed (carry) |

## Verdict

**PASS** — fresh-manager-on-resume reading the status display + state-persistence schema can correctly identify position and active step across all six workflow steps.

## Low-confidence appendix

- (none new in iter7)
