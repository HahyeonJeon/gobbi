# Consistency Perspective — 5-Role Agent Taxonomy (iter5, claude)

## Artifact Summary + W/W/H

See `project.md`. Consistency = cross-artifact sync, internal contradictions, references resolve.

## Memory reads

- `iter4/claude/consistency.md` (REVISE — F-C-iter4-NEW-01 + -02 High/100)
- `agents/*.md`
- `skills/{wrap-up,memorization,evaluation,gobbi,delegation,git,principles}/SKILL.md`
- `skills/orchestration/workflow/preparation.md`
- `skills/preparation/SKILL.md`
- `ls skills/`

## Locked Frame (Stage 1)

### S-C-1..S-C-9 — inherited from iter3/4 (most addressed/deferred)
### S-C-10 (iter4): Sweep 1 sweep completeness — frontmatter + prose + skill files all aligned (still holds)
### S-C-11 (iter4 carry, candidate close): preparation orchestration ↔ preparation role skill ↔ wrap-up sole-writer (F-C-iter4-NEW-01)
### S-C-12 (iter4 carry, candidate close): gobbi/SKILL.md mistake-skill claim ↔ skills/mistake/ ↔ load directives (F-C-iter4-NEW-02)
### S-C-13 (iter4): Sweep 5 polish (carry)
### S-C-14 (Privacy / Licensing): not-applicable
### S-C-15 (NEW iter5): Cross-doc consistency for Fix 3 retirement map ↔ delegation cross-pollination note ↔ evaluation docs
### S-C-16 (NEW iter5): Cross-doc consistency for Fix 5 wrong-phase-dispatch — 4 subagent docs + delegation dispatch table

## Per-scenario per-check results (Stage 2)

### S-C-1 through S-C-9 — addressed/carry

### S-C-10 — Sweep 1 holds (no AskUserQuestion regression in any frontmatter)

### S-C-11 (F-C-iter4-NEW-01 — preparation 4-surface coherence)
- Surface 1 — wrap-up/SKILL.md:33: "Project memory ... **WRITE + UPSERT** — Wrap-up promotes" (sole writer) ✓
- Surface 2 — preparation/SKILL.md:30: "Project memory ... **READ-ONLY** ... Wrap-up owns project-memory writes" ✓
- Surface 3 — orchestration/workflow/preparation.md:64: "the leader writes the draft ... AND stages the approved gap fixes at staging/. Wrap-up is the sole promoter of staged artifacts to project memory" ✓
- Surface 4 — orchestration/workflow/preparation.md:72: "Wrap-up promotes staged skills to project memory at session close per `preparation/SKILL.md` Memory Access Matrix" ✓ + cross-link added to role matrix
- All 4 surfaces agree. The iter4 contradiction is fully resolved.
- grep verification: `grep -n "stamp missing skills\|apply missed memory\|actually stamped\|leader.*write.*project memory"` → 0 hits ✓
- → **F-C-iter4-NEW-01 disposition: addressed (Fix 1)**

### S-C-12 (F-C-iter4-NEW-02 — mistake-skill 6-surface coherence)
- gobbi/SKILL.md:154 (post-Fix-2): "The `mistake` skill lives at `skills/mistake/SKILL.md`. Every agent MUST load it before starting work." ✓
- skills/mistake/SKILL.md exists on disk ✓
- delegation/templates/{leader,executor,evaluator,assistant}.md reference mistake skill ✓
- 4 agent files (executor.md:29, leader.md, evaluator.md, assistant.md) load mistake skill ✓
- CLAUDE.md mandates loading the mistake skill ✓
- 6+ surfaces all affirm; file system confirms. No surface denies.
- grep verification: `grep -n "no separate.*mistake\|There is no separate" gobbi/SKILL.md` → 0 hits ✓
- → **F-C-iter4-NEW-02 disposition: addressed (Fix 2)**

### S-C-13 — Sweep 5 holds (carry)

### S-C-14 — not-applicable

### S-C-15 (NEW iter5 — Fix 3 + Fix 4 cross-doc consistency)
- manager.md:46 retirement map row 1: "`pi` (innovative + best stances) → `leader` | Dual-stance retired; single leader per dispatch. Cross-pollination now comes from dual-system evaluation — see `delegation/SKILL.md` § Anti-trust Block."
- delegation/SKILL.md:52: "Cross-pollination mechanism: the v0.4.x dual-stance design ... See `orchestration/workflow/evaluation.md` § Why dual-system is mandatory."
- Cross-reference target precision: manager.md row 1 cross-references "Anti-trust Block" — Anti-trust Block lives at delegation/SKILL.md:164 (Stage 0 read). The cross-pollination content lives at delegation/SKILL.md:52, NOT under Anti-trust Block.
- Reader following the cross-ref reads about the evaluator anti-trust contract, not the cross-pollination mechanism. They have to scroll up to find the right section.
- The two docs DO agree on the substance (dual-stance retired, dual-system eval is the replacement) — only the cross-reference target is slightly off
- This is a minor cross-reference precision issue (also flagged in Structure F-S-iter5-NEW-01 and Usage F-U-iter5-NEW-01) — same root cause from a Consistency lens
- → **F-C-iter5-NEW-01** (Low/50 — same finding as F-S-iter5-NEW-01 / F-U-iter5-NEW-01 viewed from Consistency lens; manager.md cross-ref to delegation/SKILL.md § Anti-trust Block should be § Per-role Templates or § Cross-pollination mechanism)

### S-C-16 (NEW iter5 — Fix 5 4-doc consistency)
- leader.md:112, executor.md:101, evaluator.md:104, assistant.md:105 all emit `BLOCKED` with `reason: wrong-phase-dispatch` shape
- delegation/SKILL.md:126 dispatch table row uses `BLOCKED` with `reason: wrong-phase-dispatch` token — identical
- The 5 surfaces share an exact contract identifier; no synonym drift, no shape drift
- → no NEW finding; Fix 5 is highly consistent

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-C-01..06** | various | various | addressed (carry) | 100 | n/a | iter3 inheritance | Carry |
| **F-C-NEW-01** | `design_flaw` | `docs-sync` | addressed (carry) | 100 | n/a | manager ↔ assistant aligned | Carry |
| **F-C-iter3-NEW-01** | `general` | `docs-sync` | addressed (carry) | 100 | n/a | Fix 3 sweep | Carry |
| **F-C-iter3-NEW-02** | `design_flaw` | `docs-sync` | addressed (Sweep 1, carry) | 100 | n/a | Frontmatter clean | Carry |
| **F-C-iter3-NEW-03** | `design_flaw` | `docs-sync` | addressed (Sweep 1, carry) | 100 | n/a | wrap-up consistency | Carry |
| **F-C-iter4-NEW-01** | `design_flaw` | `docs-sync` | **addressed (Fix 1)** | 100 | n/a | 4-surface preparation coherence verified | iter4 regression closed |
| **F-C-iter4-NEW-02** | `design_flaw` | `docs-sync` | **addressed (Fix 2)** | 100 | n/a | 6-surface mistake-skill coherence verified | iter4 regression closed |
| **F-C-DEF-01 + DEF-02** | `general` | `docs-sync`/`process` | deferred (carry) | 75 | Medium | User-locked carries | Carry |
| **F-C-iter5-NEW-01** | `general` | `docs-sync` | open (NEW iter5, minor) | 50 | Low | manager.md retirement map row 1 cross-references "Anti-trust Block" but the cross-pollination content lives elsewhere in delegation/SKILL.md | Same root cause as F-S-iter5-NEW-01 + F-U-iter5-NEW-01 |

## Per-perspective verdict

**PASS** — Both iter4 High/100 cross-file contradictions closed cleanly (F-C-iter4-NEW-01 + -02). Fix 5 introduces a contract identifier shared across 5 docs without drift. One Low/50 cross-reference precision finding (shared with Structure and Usage).

Per the rule: no Critical ≥ 75; no High ≥ 50 in open / newly-surfaced. → **PASS**.

iter4 was REVISE; iter5 restores PASS. The partial-sweep regression shape that recurred for 4 iters does NOT recur in iter5 — Fix 1 and Fix 2 closed both iter4 root-cause contradictions across all surfaces, verified by grep.

## Low-confidence appendix

(none)
