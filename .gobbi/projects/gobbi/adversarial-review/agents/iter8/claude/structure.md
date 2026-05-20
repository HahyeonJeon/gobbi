# Structure Perspective — 5-Role Agent Taxonomy (iter8, claude — closing-iter)

## Stage 0 — Artifact Summary + Memory reads

See `project.md`. Structure = decomposition, coupling, layering, testability — at iter8 the structural question is whether the Loop ↔ agent-type mapping table and the Workflow Metadata schema enum cohere with the rest of the doc's 6-step decomposition after the iter8 insertions.

**Memory reads**:
- `iter7/claude/structure.md` (PASS — at iter7 the mapping table was claimed to "already include Preparation (carried from iter6 — already in this section pre-iter7)". iter8 disproves this claim: pre-iter8 the mapping table had Configuration / Ideation / Planning / Execution / Wrap-up in 5 rows; iter8 inserted the Preparation row at index 3 and renumbered Planning/Execution/Wrap-up. This is recorded here as an iter7 inheritance-error observation, NOT a new in-scope finding, because iter8 closed it.)
- `skills/orchestration/SKILL.md` lines 303-318 (Loop ↔ agent-type mapping table block), 322-356 (Workflow Metadata block)
- `skills/memorization/SKILL.md` lines 87-101 (artifact frontmatter schema)

## Locked Frame (Stage 1)

### S-S-iter8-NEW-1 (adversarial — primary): Does the Loop ↔ agent-type mapping table now decompose 1:1 with the procedure-section step headings?
- Each Step N — `<Name>` heading (lines 65/84/102/120/138/156) must have exactly one matching row in the mapping table (Configuration→manager, Ideation→leader, Preparation→leader, Planning→leader, Execution→executor, Wrap-up→assistant)
- The mapping table's `EVALUATION` and `MEMORIZATION` cross-loop rows must remain (lines 313-314 — evaluator and assistant respectively)
- No structural orphan — no agent-type column value (manager / leader / executor / evaluator / assistant) introduced that doesn't appear elsewhere in the 5-role taxonomy

### S-S-iter8-NEW-2 (adversarial): Does the Workflow Metadata step enum match the state.json key set?
- The per-agent record's `step` enum on line 354 must enumerate exactly the same 6 keys as the state-persistence Schema shape on line 250: `configuration | ideation | preparation | planning | execution | wrap-up`
- The two enums must be in the same display order

### S-S-iter8-NEW-3 (adversarial): Does the memorization frontmatter `loop:` enum match the procedure-section loops?
- The artifact frontmatter schema's `loop:` field at memorization/SKILL.md:93 lists `ideation | preparation | planning | execution | wrap-up` (5 productive loops — Configuration is not a loop, has no MEMORIZATION run, so its absence is correct)
- The `discussions.md` template's `loop:` enum at line 39 must match the SKILL.md frontmatter enum exactly

### S-S-iter8-NEW-4 (adversarial): Did the table-row insertion + enum extension break any structural reference elsewhere?
- No prose elsewhere in `orchestration/SKILL.md` hardcodes "5 steps" or "2-5" after iter8's "steps 2-6" edit at line 236
- No prose elsewhere in `memorization/SKILL.md` lists the 4-loop subset (`ideation | planning | execution | wrap-up`) when the 5-loop set is correct

## Per-scenario per-check results (Stage 2)

### S-S-iter8-NEW-1 — verified, 1:1 procedure ↔ mapping decomposition

| Step heading (line) | Mapping table row (line) | Owning agent type |
|---|---|---|
| Step 1 — Workflow Configuration (line 65) | row 307: `1 — Configuration` | manager (direct) ✓ |
| Step 2 — Ideation Loop (line 84) | row 308: `2 — Ideation` | `leader` ✓ |
| Step 3 — Preparation Loop (line 102) | row 309: `3 — Preparation` | `leader` ✓ |
| Step 4 — Planning Loop (line 120) | row 310: `4 — Planning` | `leader` ✓ |
| Step 5 — Execution Loop (line 138) | row 311: `5 — Execution` | `executor` ✓ |
| Step 6 — Wrap-up Loop (line 156) | row 312: `6 — Wrap-up` | `assistant` ✓ |

Cross-loop rows preserved: `EVALUATION` → `evaluator` (line 313); `MEMORIZATION` → `assistant` (line 314). No new agent-type value introduced; the 5-role taxonomy (manager / leader / executor / evaluator / assistant) is fully covered.

→ **1:1 decomposition holds; no structural orphan.**

### S-S-iter8-NEW-2 — verified, step enum matches state.json keys

- Schema shape (line 250) enum: `configuration, ideation, preparation, planning, execution, wrap-up`
- Per-agent record `step` enum (line 354): `configuration | ideation | preparation | planning | execution | wrap-up`
- Same set, same display order. ✓

### S-S-iter8-NEW-3 — verified, memorization loop enum matches procedure

- `memorization/SKILL.md:93`: `loop: ideation | preparation | planning | execution | wrap-up` — 5 productive loops ✓
- `memorization/templates/discussions.md:39`: same enum, byte-identical ✓
- Configuration is correctly absent from both — Configuration has no MEMORIZATION phase per `orchestration/SKILL.md` Step 1 procedure (single-pass, manager-only)

### S-S-iter8-NEW-4 — verified, no broken structural references

- `grep -n "5 steps\|2-5\|step 2-5\|five.step\|5.step" .gobbi/projects/gobbi/skills/orchestration/SKILL.md` → 0 hits
- `grep -n "ideation | planning | execution | wrap-up" .gobbi/projects/gobbi/skills/memorization/SKILL.md` (the 4-loop subset, looking for any surface still using it) → 0 hits

## Typed findings

No new in-scope findings.

## Disposition of inherited findings

| Finding | iter7 state | iter8 disposition |
|---|---|---|
| F-S-iter5-NEW-01 (manager.md retirement map cross-ref imprecise) | open (Low/50) | open (carry) — not in iter8 scope |
| F-S-iter4-NEW-01 / -02 | addressed (carry) | addressed (carry) |
| F-S-04 (drift detector) | disputed (per #258) | **disputed (carry)** — see overall.md final disposition |
| F-S-02 / F-S-05 / F-S-NEW-02 | open (Medium / Low) | open (carry) |
| **iter7 inheritance-error observation** (mapping table claim) | n/a — surfaced retroactively in iter8 | n/a — resolved by iter8 mapping-table fix; not promoted to a finding because the iter8 patch already closes it |

## Verdict

**PASS** — Loop ↔ agent-type mapping table decomposes 1:1 with the procedure section's 6 step headings; Workflow Metadata `step` enum matches the state-persistence Schema-shape enum byte-for-byte; memorization `loop:` enum matches the 5 productive loops; no broken structural references.

## Low-confidence appendix

- (none new in iter8)
