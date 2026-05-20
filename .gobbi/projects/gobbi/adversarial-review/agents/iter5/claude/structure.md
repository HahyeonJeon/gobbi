# Structure Perspective — 5-Role Agent Taxonomy (iter5, claude)

## Artifact Summary + W/W/H

See `project.md`. Structure = 5-file decomposition + cross-file coupling + drift detection + sole-writer boundaries.

## Memory reads

- `iter4/claude/structure.md` (inheritance — F-S-iter4-NEW-01 + -02 High/100 regressions)
- `iter4/claude/overall.md` (META F-O-iter4-NEW-01)
- `agents/*.md` (full)
- `skills/{wrap-up,memorization,preparation,orchestration,git,mistake,gobbi,delegation}/SKILL.md`
- `skills/orchestration/workflow/preparation.md`
- `ls skills/` — 16 dirs

## Locked Frame (Stage 1)

### S-S-1 (inherited, addressed): Single Memorization owner

### S-S-2 (inherited, open): Leader Write tool policy-gate enforceability (F-S-02)

### S-S-3 (inherited, open partial): Hub-and-spoke fragility / misroute recovery (F-S-03)
- [ ] iter5 candidate close via Fix 5 (wrong-phase-dispatch BLOCKED status)

### S-S-4 (inherited, disputed per #258): Drift detector (F-S-04)

### S-S-5 (inherited, open Low): Implicit ideation Sub-step C coupling (F-S-05)

### S-S-6 (adversarial inherited): Coordinator anti-pattern

### S-S-7 (inherited): mistake skill placement + peer-conformance

### S-S-8 (inherited iter2): assistant two-mode shape (F-S-NEW-02)

### S-S-9 (iter4 carry, candidate close): Sole-writer cross-file coherence (F-S-iter4-NEW-01)
- [ ] preparation.md ↔ preparation/SKILL.md ↔ wrap-up/SKILL.md — 3 surfaces agree
- [ ] Memory Access Matrix READ-ONLY consistent with workflow procedure prose

### S-S-10 (iter4 carry, candidate close): Mistake skill structural coherence (F-S-iter4-NEW-02)
- [ ] gobbi/SKILL.md ↔ skills/mistake/ directory ↔ executor.md load directive

### S-S-11 (NEW iter5 adversarial): Did Fix 5 (wrong-phase-dispatch) introduce a parallel status pathway that's structurally inconsistent across the 4 subagent docs?

### S-S-12 (NEW iter5 adversarial): Did Fix 4 (cross-pollination note in delegation) sit at the right structural location, or does it duplicate manager.md retirement map content?

## Per-scenario per-check results (Stage 2)

### S-S-1 — addressed (carry)

### S-S-2 (F-S-02 — leader Write policy) — open (Medium, carry)

### S-S-3 (F-S-03 — hub fragility / misroute recovery)
- Fix 5 adds `wrong-phase-dispatch` BLOCKED sub-bullet to all 4 subagent docs + delegation/SKILL.md dispatch table row: "**Re-dispatch**, not abort. The subagent identified a role mismatch — re-delegate the task to the correct role without re-contracting with the user"
- This creates the **structural mechanism** for subagent self-escalation on phase mismatch + manager re-dispatch — the misroute recovery contract F-R-06 named was missing
- → **F-S-03 disposition: partially addressed via Fix 5** (the runtime mechanism exists now; the broader hub-fragility design point remains as a Medium concern, but the specific misroute-recovery sub-gap is closed)

### S-S-4 (F-S-04) — disputed per #258 contract ✓

### S-S-5 — open (Low, carry)

### S-S-6 (coordinator) — F-P-07 covers

### S-S-7 — see S-S-10

### S-S-8 — carry

### S-S-9 (F-S-iter4-NEW-01 — sole-writer 3-surface check)
- preparation.md:10: "Leader documents the readiness assessment AND stages approved gap fixes ... at staging/; Wrap-up promotes to project memory." ✓
- preparation.md:64: "the leader writes the draft ... AND stages the approved gap fixes at staging/. Wrap-up is the sole promoter of staged artifacts to project memory." ✓
- preparation.md:72: "Wrap-up promotes staged skills to project memory at session close per `preparation/SKILL.md` Memory Access Matrix" ✓
- preparation/SKILL.md:30: "Project memory ... **READ-ONLY** ... Wrap-up owns project-memory writes" ✓
- wrap-up/SKILL.md:33: "Project memory ... **WRITE + UPSERT** — Wrap-up promotes project-scope staging" ✓
- 4 surfaces agree on the sole-writer contract; no cross-file contradiction
- Bonus: preparation.md line 72 now also names `preparation/SKILL.md` as the canonical Memory Access Matrix reference → cross-link improves structural traceability
- → **F-S-iter4-NEW-01 disposition: addressed (Fix 1)**

### S-S-10 (F-S-iter4-NEW-02 — mistake skill structural coherence)
- `ls skills/mistake/SKILL.md` → exists ✓
- gobbi/SKILL.md:154 (post-Fix-2): "The `mistake` skill lives at `skills/mistake/SKILL.md`. Every agent MUST load it before starting work."
- delegation/templates/{leader,executor,evaluator,assistant}.md reference mistake skill load directive ✓
- executor.md:29 + other agent files reference mistake skill load ✓
- File system + 5+ documentation surfaces all agree; no structural drift
- → **F-S-iter4-NEW-02 disposition: addressed (Fix 2)**

### S-S-11 (iter5 adversarial — wrong-phase-dispatch structural consistency)
- 4 subagent docs each gained the same BLOCKED sub-bullet shape with role-specific redirect text:
  - leader.md:112 — "this task belongs to executor — please re-dispatch"
  - executor.md:101 — "this task belongs to leader — please re-dispatch"
  - evaluator.md:104 — "evaluators find problems; implementation belongs to executor — please re-dispatch"
  - assistant.md:105 — "this task requires direction-setting — please re-dispatch to leader"
- All four share `BLOCKED` enum entry + `reason: wrong-phase-dispatch` + one-line redirect — uniform shape
- delegation/SKILL.md:126 dispatch table row: `BLOCKED with reason: wrong-phase-dispatch` → "**Re-dispatch**, not abort. The subagent identified a role mismatch — re-delegate the task to the correct role without re-contracting with the user (unless the correct role is ambiguous)."
- The manager dispatch table row complements the subagent sub-bullets without duplicating them — the subagent doc says "how to emit"; the manager dispatch table says "how to handle when received"
- Structurally clean: producer doc + consumer doc share a contract identifier (`reason: wrong-phase-dispatch`) without prose duplication
- → no NEW finding; Fix 5 is structurally well-placed

### S-S-12 (iter5 adversarial — Fix 4 placement check)
- Fix 4 lives in `delegation/SKILL.md` § Per-role Templates immediately after the template table
- Fix 3 retirement map lives in `manager.md` immediately after the role definition section
- The two have a **complementary, non-duplicating** split: manager.md says **who** the v0.4.x → v0.5.0 mapping is; delegation/SKILL.md says **why** the dual-stance design was retired and what replaces it (the mechanism)
- manager.md retirement map row 1 Notes column cross-references delegation/SKILL.md § Anti-trust Block — small drift: the actual content lives at delegation/SKILL.md:52 (immediately after the template table), not under "Anti-trust Block" (which is at line 164). The cross-reference target name in manager.md is slightly off — the actual content sits before Anti-trust Block.
- Note: this is a minor cross-reference precision issue, not a structural failure. The reader who follows the cross-reference lands on the same file and can find the content. Low severity.
- → **F-S-iter5-NEW-01** (Low/50 — cross-reference target in manager.md retirement map points to "Anti-trust Block" but the content lives 100+ lines earlier under "Per-role Templates" → "Cross-pollination mechanism")

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-S-01** | `design_flaw` | `process` | addressed (carry) | 100 | n/a | Single Memorization owner | Carry |
| **F-S-02** | `assumption_risk` | `security` | open (carry) | 75 | Medium | leader.md Write granted + policy-only | Carry |
| **F-S-03** | `design_flaw` | `process` | **partially addressed (Fix 5)** | 75 | Medium (downgraded from effective Medium-High) | wrong-phase-dispatch mechanism added; broader hub-fragility carries | Misroute recovery sub-gap closed |
| **F-S-04** | `scenario_gap` | `docs-sync` | **disputed (contract)** | n/a | n/a | git/SKILL.md:123 + #258 | Locked |
| **F-S-05** | `assumption_risk` | `docs-sync` | open (carry) | 50 | Low | Sub-step C coupling | Carry |
| **F-S-NEW-01** | `general` | `docs-sync` | addressed (verification, carry) | 100 | n/a | mistake skill peer-conformant | Carry |
| **F-S-NEW-02** | `design_flaw` | `process` | open (carry) | 50 | Medium | Assistant two-mode bleed | Carry |
| **F-S-iter3-NEW-01** | `general` | `docs-sync` | addressed (carry) | 100 | n/a | dangling-refs cleanup | Carry |
| **F-S-iter4-NEW-01** | `design_flaw` | `process` | **addressed (Fix 1)** | 100 | n/a | preparation.md ↔ preparation/SKILL.md ↔ wrap-up/SKILL.md — 4 surfaces agree | iter4 regression closed |
| **F-S-iter4-NEW-02** | `design_flaw` | `docs-sync` | **addressed (Fix 2)** | 100 | n/a | gobbi/SKILL.md:154 + filesystem coherent | iter4 regression closed |
| **F-S-iter5-NEW-01** | `general` | `docs-sync` | open (NEW iter5, minor) | 50 | Low | manager.md retirement map row 1 cross-references "Anti-trust Block" but the cross-pollination content lives earlier under "Per-role Templates"; pointer is slightly off but still resolves to the same file | Reader-traceability minor — finds it but takes 1 extra scan |

## Per-perspective verdict

**PASS** — iter4 regressions closed via Fix 1 + Fix 2; Fix 5 partially addressed F-S-03 (a carry-forward); one Low-severity cross-reference precision issue introduced (F-S-iter5-NEW-01).

Per the rule: no Critical ≥ 75; no High ≥ 50 from `open` / newly-surfaced findings. → **PASS**.

iter3 was PASS, iter4 regressed to REVISE; iter5 restores PASS by closing both iter4 regressions cleanly. The one new finding (F-S-iter5-NEW-01) is Low/50 — a cross-reference precision tweak, not structural drift.

## Low-confidence appendix

(none below threshold)
