# Risk Perspective — 5-Role Agent Taxonomy (iter7, claude — TRULY-TRULY-FINAL)

## Stage 0 — Artifact Summary + Memory reads

See `project.md`. Risk = blast radius, reversibility, status/state contract integrity, Principle 2 enforcement.

**Memory reads**:
- `iter6/claude/risk.md` (PASS — sole-writer integrity restored, the 5-iter top concern)
- `skills/orchestration/SKILL.md` lines 186–230 (status display) + 234–315 (state machine block)
- `templates/state.template.json` (referenced from line 245 — verified separately that the template carries all 6 keys, but iter7 did not modify the template; template is the seed shape the manager copies on session init)

## Locked Frame (Stage 1)

### S-R-iter7-NEW-1 (adversarial — primary): Does the iter7 patch close Codex iter6's High finding (status/state 5-step shape)?

This is THE pivotal risk question for the final iter. The status display IS the user-facing projection of `state.json`. The state-persistence schema IS the contract the manager writes against during every state transition. A 5-step shape in either surface creates:
- **Lost-step bug** — the manager could fail to initialize the `preparation` key in `state.json` because the schema-shape sentence doesn't list it, leading to a runtime KeyError or, worse, silent skip of the Preparation Loop
- **User confusion** — the status display showing "Step 2 of 5" tells the user the workflow has 5 steps, contradicting the frontmatter / intro / procedure section's "six-step" framing
- **Resume-from-`/clear` failure** — if the schema-shape sentence omits `preparation`, a manager replaying from `state.json` after `/clear` could fail to detect the Preparation step's active/done state

### S-R-iter7-NEW-2 (adversarial): Did the iter7 patch over-correct and break the schema-shape contract elsewhere (e.g., orphaning the `preparation` key without a corresponding state-values entry)?

### S-R-iter7-NEW-3 (adversarial): Rollback path

### S-R-iter7-NEW-4 (adversarial): Does the iter7 patch reintroduce any closed stuck finding (F-P-01 retirement map / F-P-03 cross-pollination / F-R-06 wrong-phase) via collateral edits?

## Per-scenario per-check results (Stage 2)

### S-R-iter7-NEW-1 — verified, Codex iter6 High closed

Direct grep evidence (within worktree):
```
grep -rn "Step N of 5\|of 5 steps\|5-step\|five-step" .gobbi/projects/gobbi/agents/ .gobbi/projects/gobbi/skills/
→ 0 hits

grep -n "workflow\.\(configuration\|ideation\|preparation\|planning\|execution\|wrap-up\)" .gobbi/projects/gobbi/skills/orchestration/SKILL.md
→ all 6 keys present, including line 250 schema-shape sentence
```

Per-site spot check (the 5 iter7 patch sites):
- Line 191 status display header: "Step 2 of 6" ✓
- Line 197 status table row 3: "Preparation Loop | `… Pending`" ✓
- Line 217 field rule: "fixed (1–6; Configuration / Ideation Loop / Preparation Loop / Planning Loop / Execution Loop / Wrap-up Loop)" ✓
- Line 221 field rule: "Active: Step N of 6" ✓
- Line 250 schema shape: 6 keys + 6-step display order ✓

→ **Codex iter6 High finding addressed; the lost-step / resume-failure risk class is now structurally impossible against this contract.**

### S-R-iter7-NEW-2 — verified, no schema orphan
- The `preparation` key in the schema-shape sentence corresponds to a real Step 3 — Preparation Loop section (line 102) and a real entry in the loop ↔ agent-type mapping table — no orphan
- State-values table (lines 207–215) uses the same value set the other steps use (`Pending` / phase verbs / `Done` / `Skipped` / `Aborted` / `Revising`) — Preparation needs no new state value
- The `templates/state.template.json` referenced from line 245 must carry all 6 keys for the manager's init copy to be correct — this was iter6's responsibility (template already at 6-key shape per iter6 inheritance); iter7 did not touch it but the schema-shape sentence in orchestration/SKILL.md now correctly describes what the template provides

### S-R-iter7-NEW-3 — rollback path
- The iter7 patch is a 5-site text edit inside a single file (orchestration/SKILL.md)
- Reverting requires restoring 5 sites: header line, one table row removal, one field-rule range edit, one field-rule header edit, schema-shape sentence edit
- Rollback is trivial and reversible; blast radius of the patch itself is small (1 file, ~110 character delta)
- No build / test / migration step is required to roll back (text-only)

### S-R-iter7-NEW-4 — verified, no stuck-finding regression
- F-P-01 (retirement map) — iter7 did not touch any retirement-map surface (lives in `agents/manager.md` and feature-pass docs, not orchestration/SKILL.md status/state blocks); re-grep `grep -rn "v0.4\|retire" .gobbi/projects/gobbi/agents/manager.md` confirms iter5 Fix 3 phrasing intact
- F-P-03 (dual-stance cross-pollination) — iter7 did not touch the ideation skill's PI / stance language; iter5 Fix 4 intact
- F-R-06 (manager misroute / wrong-phase) — iter7 did not touch the manager.md routing tables or the loop ↔ agent-type mapping table at lines 305–313; iter5 Fix 5 intact

## Typed findings

No new in-scope findings. F-R-iter5-NEW-01 (re-dispatch cap, Low/50, NEW iter5) remains open as a deferred defensive enhancement.

## Disposition of inherited findings

| Finding | iter6 state | iter7 disposition |
|---|---|---|
| **Codex iter6 High** (status/state 5-step shape) | open (Codex side) | **addressed (iter7 surgical patch — primary close)** |
| F-R-06 (manager misroute, stuck-4-iter) | addressed (carry) | addressed (carry) |
| F-R-iter5-NEW-01 (re-dispatch cap) | open (Low/50) | open (carry) — defensive enhancement deferred |
| F-R-iter4-NEW-01 / -02 | addressed (carry) | addressed (carry) |
| F-R-01 / F-R-02 / F-R-03 / F-R-04 / F-R-07 | open (Medium) / addressed | open / addressed (carry) |
| F-R-NEW-01 (Low) | open | open (carry) |
| Codex iter5 High (non-Wrap-up project-memory writes) | addressed (iter6) | addressed (carry) |

## Verdict

**PASS** — Risk perspective's iter7 top concern (status/state contract integrity) is now demonstrably closed; rollback path trivial; no over-correction; no stuck-finding regression; iter6 sole-writer convergence preserved with no collateral damage.

## Low-confidence appendix

- (none new in iter7)
