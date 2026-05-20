# Risk Perspective — 5-Role Agent Taxonomy (iter8, claude — closing-iter)

## Stage 0 — Artifact Summary + Memory reads

See `project.md`. Risk = blast radius, reversibility, status/state contract integrity, Principle 2 enforcement, structural-contract integrity.

**Memory reads**:
- `iter7/claude/risk.md` (PASS — lost-step / resume-failure risk class structurally closed at the status/state surfaces, but the mapping table + metadata step enum were not inspected at iter7)
- `iter6/claude/risk.md` (PASS — sole-writer integrity restored, the top concern over iters 1-5)
- `skills/orchestration/SKILL.md` lines 236, 303-318 (mapping table block), 322-356 (Workflow Metadata block)
- `skills/memorization/SKILL.md` lines 87-131 (artifact frontmatter schema)
- `skills/memorization/templates/discussions.md` lines 30-50
- The 3-query grep verification output

## Locked Frame (Stage 1)

### S-R-iter8-NEW-1 (adversarial — primary): Does the iter8 patch close residual lost-step / wrong-route risk surfaces that iter7's narrow cell-sweep left exposed?

This is THE pivotal risk question for the closing iter. A 5-row mapping table at lines 305-312 (pre-iter8) is a **wrong-route bug seed** — a fresh manager spawning the Preparation specialist could fail to find a row and either fall through to a wrong agent type or silently skip. A `step` enum missing `preparation` at line 353 is a **runtime stamping bug seed** — an assistant role stamping the agent record could either omit the field or write a value that violates the documented enum. A `loop:` enum missing `preparation` at memorization/SKILL.md:93 is a **MEMORIZATION stamping bug seed** — the Preparation loop's assistant would stamp `staging/discussions/{slug}.md` with a `loop:` value that violates the schema.

### S-R-iter8-NEW-2 (adversarial): Does the iter8 patch over-correct or introduce a schema mismatch with state.template.json?
- The 6-key Schema shape on line 250 must match the keys in the (unchanged) state.template.json
- The per-agent `step` enum on line 354 must match the same key set

### S-R-iter8-NEW-3 (adversarial): Rollback path
- iter8 patch is 7 sites across 3 files — is rollback trivial?

### S-R-iter8-NEW-4 (adversarial): Does the iter8 patch reintroduce any closed stuck finding (F-P-01 / F-P-03 / F-R-06) via collateral edits?

### S-R-iter8-NEW-5 (adversarial — methodology): Is iter8 itself an over-correction (whole-file audit when surgical patch sufficed)?
- The justification for whole-file audit is that iter7's surgical patch + grep-aperture combination demonstrably missed 5+2 residual surfaces; the audit found exactly those, no scope drift
- If the audit had found 0 residual sites it would have been wasted effort; the 7-site discovery justifies the methodology shift

## Per-scenario per-check results (Stage 2)

### S-R-iter8-NEW-1 — verified, residual lost-step / wrong-route surfaces closed

Per-site spot check (the 7 iter8 patch sites):

- `orchestration/SKILL.md:236` — `steps 2-6` (was `steps 2-5`) — state-machine intro range now covers Preparation ✓
- `orchestration/SKILL.md:305-312` — 6-row mapping table — fresh manager spawning Preparation finds row 309: `| 3 — Preparation | \`leader\` |` unambiguously ✓
- `orchestration/SKILL.md:350` — `Steps 2-6 entries also carry \`iter\` and \`verdict\`` — workflow metadata fields apply to Preparation ✓
- `orchestration/SKILL.md:351` — `each loop iteration close (increment workflow.{step}.iter for steps 2-6); each step exit (stamp workflow.{step}.verdict for steps 2-6 ...)` — update-point clauses cover Preparation ✓
- `orchestration/SKILL.md:354` — `step` enum: `configuration | ideation | preparation | planning | execution | wrap-up` — assistant stamping a Preparation-spawn agent record produces a contract-valid value ✓
- `memorization/SKILL.md:93` — `loop: ideation | preparation | planning | execution | wrap-up` — Preparation MEMORIZATION assistant can stamp `loop: preparation` without violating schema ✓
- `memorization/templates/discussions.md:39` — same enum — template-driven writes for Preparation discussions stage correctly ✓

→ **All three identified bug-seed classes (wrong-route, runtime-stamping, MEMORIZATION-stamping) closed. The lost-step / wrong-route risk class is now structurally impossible against the documented contract.**

### S-R-iter8-NEW-2 — verified, no schema mismatch

- Schema shape on line 250: `configuration, ideation, preparation, planning, execution, wrap-up` (6 keys)
- Per-agent `step` enum on line 354: same 6 keys
- state.template.json (referenced from line 245, not modified in iter8): per iter6/iter7 inheritance carries all 6 keys; iter8 did not touch the template but the SKILL.md surfaces that describe its shape now correctly match

### S-R-iter8-NEW-3 — rollback path

- iter8 patch is 7 sites across 3 files
- Reverting requires: (a) remove the 1 new table row + renumber 4 rows in orchestration/SKILL.md, (b) revert 3 range edits in orchestration/SKILL.md (line 236 + lines 350-351), (c) remove `preparation | ` from 3 enum insertions (line 354 + memorization SKILL.md:93 + discussions.md:39)
- All edits are text-only — no migration, no build, no test infrastructure change
- Blast radius of the iter8 patch: 3 files, ~82 total characters changed (positive insertions + small range edits)
- Rollback is trivial and fully reversible

### S-R-iter8-NEW-4 — verified, no stuck-finding regression

- F-P-01 (retirement map) — iter8 did not touch `agents/manager.md` or any retirement-map surface; re-grep `"v0.4\|retire"` in `.gobbi/projects/gobbi/agents/manager.md` confirms iter5 Fix 3 phrasing intact
- F-P-03 (dual-stance cross-pollination) — iter8 did not touch the ideation skill's PI / stance language; iter5 Fix 4 intact
- F-R-06 (manager misroute / wrong-phase) — iter8 modified the Loop ↔ agent-type mapping table at lines 305-312 by inserting the Preparation row; the iter5 Fix 5 phrasing in `agents/manager.md` and the routing tables it touches are NOT in this file's scope and were not modified; re-grep of the manager.md routing surfaces confirms iter5 Fix 5 intact

### S-R-iter8-NEW-5 — verified, methodology shift justified

- The iter7 surgical patch's grep aperture (`"Step N of 5\|of 5 steps\|5-step\|five-step"`) was strict-string and missed the variant phrasings `"steps 2-5"` + the structural shape (5-row mapping table) + the per-agent step enum
- iter8's whole-file audit + broader grep aperture found exactly 7 residual sites
- Had the audit found 0 sites it would have been wasted effort — but the 7-site discovery (5 in the same file iter7 already touched + 2 in sibling files iter7 did not touch) justifies escalating from cell-sweep to whole-file audit for the closing iter
- The methodology lesson: surgical fixes are sufficient when the violating-site list is exhaustive and pre-named; when the iter7-style "name the cells Codex called" is the input, the audit is needed to find unnamed siblings

## Typed findings

No new in-scope findings. F-R-iter5-NEW-01 (re-dispatch cap, Low/50, NEW iter5) remains open as a deferred defensive enhancement.

## Disposition of inherited findings

| Finding | iter7 state | iter8 disposition |
|---|---|---|
| Codex iter6 High (status/state 5-step shape at lines 191-250) | addressed (iter7) | addressed (carry) — iter7 5-site patch preserved |
| **NEW iter8 residual 5-step bug-seed surfaces** (mapping table + intro range + metadata range + step enum + memorization loop enums) | open (latent) | **addressed (iter8 7-site patch — primary close)** |
| F-R-06 (manager misroute, stuck-4-iter) | addressed (carry) | addressed (carry) |
| F-R-iter5-NEW-01 (re-dispatch cap) | open (Low/50) | open (carry) — defensive enhancement deferred |
| F-R-iter4-NEW-01 / -02 | addressed (carry) | addressed (carry) |
| F-R-01 / F-R-02 / F-R-03 / F-R-04 / F-R-07 | open (Medium) / addressed | open / addressed (carry) |
| F-R-NEW-01 (Low) | open | open (carry) |
| Codex iter5 High (non-Wrap-up project-memory writes) | addressed (iter6) | addressed (carry) |

## Verdict

**PASS** — Risk perspective's iter8 top concerns (residual lost-step / wrong-route / runtime-stamping / MEMORIZATION-stamping bug seeds) are demonstrably closed by the 7-site whole-file-audit patch. Rollback path trivial; no over-correction; no schema mismatch; no stuck-finding regression; no collateral damage to iter6 sole-writer convergence or iter7 status/state convergence; methodology shift (cell-sweep → whole-file audit) justified by the 7-site discovery.

## Low-confidence appendix

- (none new in iter8)
