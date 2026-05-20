# Usage Perspective — 5-Role Agent Taxonomy (iter8, claude — closing-iter)

## Stage 0 — Artifact Summary + Memory reads

See `project.md`. Usage = next-consumer (manager / fresh-subagent / assistant role on MEMORIZATION) usability.

**Memory reads**:
- `iter7/claude/usage.md` (PASS — fresh-manager-on-resume can correctly identify position; status display + state-persistence schema sufficient)
- `skills/orchestration/SKILL.md` lines 303-318 (mapping table), 322-356 (Workflow Metadata)
- `skills/memorization/SKILL.md` lines 87-131 (artifact frontmatter schema)
- `skills/memorization/templates/discussions.md` lines 30-50 (template frontmatter)

## Locked Frame (Stage 1)

### S-U-iter8-NEW-1 (adversarial — primary): Can a fresh manager spawning the Preparation specialist look up the agent type without ambiguity?
- The Loop ↔ agent-type mapping table at lines 305-312 must give a single unambiguous answer for "what agent type owns Preparation" — verify the row at 309 says `leader`
- A fresh manager that skips the procedure section and jumps to the mapping table must NOT find a 5-row table that omits Preparation

### S-U-iter8-NEW-2 (adversarial): Can an assistant role on MEMORIZATION stamp the correct `loop:` frontmatter value when working in a Preparation loop?
- The memorization frontmatter schema at line 93 must list `preparation` as one of the allowed `loop:` values
- The discussions template's `loop:` enum must match the SKILL.md schema enum

### S-U-iter8-NEW-3 (adversarial): Can a fresh agent reading the Workflow Metadata `step` enum on line 354 correctly stamp a Preparation specialist's agent record?
- The `step` enum must include `preparation` so the assistant role doesn't have to guess or skip-stamp the field

### S-U-iter8-NEW-4 (adversarial): Does any usage path through the doc set the reader up for a contradiction?
- A reader who reads only the Workflow Status Display block (lines 186-230) sees 6 steps
- A reader who reads only the Loop ↔ agent-type mapping (lines 305-312) sees 6 steps (post-iter8)
- A reader who reads only the Workflow Metadata block (lines 322-356) sees 6 steps in both range references and the enum (post-iter8)
- No 5-vs-6 contradiction surfaces to any reader path

## Per-scenario per-check results (Stage 2)

### S-U-iter8-NEW-1 — verified, mapping-table answer unambiguous

Line 309: `| 3 — Preparation | \`leader\` |` — a fresh manager spawning the Preparation specialist has a single, unambiguous answer (`leader`). This matches the Step 3 — Preparation Loop section (line 102) which references `leader` in the `WORK` and `EVALUATION` action rows.

### S-U-iter8-NEW-2 — verified, MEMORIZATION assistant can stamp `loop: preparation`

- `memorization/SKILL.md:93` lists `preparation` as an allowed `loop:` value
- `memorization/templates/discussions.md:39` matches byte-for-byte
- An assistant role stamping a Preparation-loop's `staging/discussions/{slug}.md` will correctly produce `loop: preparation` because both the schema and the template authorize it

### S-U-iter8-NEW-3 — verified, agent record stamping

`orchestration/SKILL.md:354` per-agent record `step` enum includes `preparation`. An assistant role appending to `session.json.agents[]` after a Preparation specialist completes can stamp `step: "preparation"` without violating the documented enum contract.

### S-U-iter8-NEW-4 — verified, no contradiction surfaces

- Status Display block (lines 186-230): 6 steps (post-iter7) ✓
- Loop ↔ agent-type mapping (lines 303-318): 6 steps (post-iter8) ✓
- Workflow Metadata block (lines 322-356): `Steps 2-6` range + 6-key step enum (post-iter8) ✓
- All three surfaces consistent — a reader following any single path arrives at the same 6-step contract

## Typed findings

No new in-scope findings.

## Disposition of inherited findings

| Finding | iter7 state | iter8 disposition |
|---|---|---|
| F-U-iter5-NEW-01 (cross-ref precision; shared root with F-S/F-C) | open (Low/50) | open (carry) — not in iter8 scope |
| F-U-iter4-NEW-01 / -02 | addressed (carry) | addressed (carry) |
| F-U-04 / F-U-03 | open / addressed | open / addressed (carry) |

## Verdict

**PASS** — fresh manager spawning the Preparation specialist has unambiguous mapping-table answer; MEMORIZATION assistant can stamp `loop: preparation`; agent record `step` enum permits `preparation`; no contradiction surfaces to any single-block reader path.

## Low-confidence appendix

- (none new in iter8)
