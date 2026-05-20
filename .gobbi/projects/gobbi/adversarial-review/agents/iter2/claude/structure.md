# Structure Perspective — 5-Role Agent Taxonomy (iter2, claude)

## Artifact Summary + W/W/H

See `project.md`. Structure focuses on 5-file decomposition coherence + cross-file coupling + drift-detector presence.

## Memory reads

- `iter1/claude/structure.md` (inheritance — 5 findings)
- `iter1/claude/overall.md` § Cross-cutting findings
- `agents/*.md` (full, all 5)
- `skills/delegation/SKILL.md` (Agent Roster line 211-223, phase list line 213)
- `skills/mistake/SKILL.md` (new in iter2)

## Locked Frame (Stage 1)

### S-S-1: Inherited iter1 — Memorization phase owner single
- [ ] Exactly one role owns Memorization phase
- [ ] Skill specialty + role lifecycle align

### S-S-2: Inherited iter1 — Tool-vs-policy alignment for leader Write (F-S-02)
- [ ] leader.md tool surface either narrowed to match "no implementation" policy, OR the policy is enforced mechanically

### S-S-3: Inherited iter1 — Hub-and-spoke fragility (F-S-03)
- [ ] Manager phase-table completeness (now includes Preparation per F-P-06 fix)
- [ ] Recovery mechanism if manager misroutes

### S-S-4: Inherited iter1 — Drift detector (F-S-04, iter1 Critical)
- [ ] Mechanism (CI / lint / test / schema) that prevents `agents/*.md` ↔ `delegation/SKILL.md` Agent Roster ↔ phase docs ↔ `CLAUDE.md` from drifting

### S-S-5: Inherited iter1 — Implicit dependency on ideation skill sub-steps (F-S-05)
- [ ] leader.md no longer couples to "ideation Sub-step C" internal naming, OR the coupling is acceptable

### S-S-6 (adversarial inherited): Coordinator anti-pattern check
- [ ] Manager still avoids being a data-shuttle hub

### S-S-7 (adversarial NEW iter2): Mistake skill placement and shape
- [ ] New `skills/mistake/SKILL.md` follows peer-skill shape (frontmatter, sections, Memory Access Matrix style)
- [ ] Does it duplicate or contradict any other skill's procedures?

### S-S-8 (adversarial NEW iter2): Assistant role's two-mode shape
- [ ] Two modes (MEMORIZATION + lookup) cleanly separated in assistant.md or do they bleed?

## Per-scenario per-check results (Stage 2)

### S-S-1 (F-S-01)
- (a) Single owner for Memorization: **YES** — assistant.md:12 + manager.md:34-38 + manager.md:86 converge on `assistant`. No conflicting ownership claim in any other role file.
- (b) Skill+role aligned: **YES** — memorization skill exists at `skills/memorization/`; assistant.md:17 names load path. → **F-S-01 addressed**

### S-S-2 (F-S-02)
- (a) leader.md tool surface: **UNCHANGED** — frontmatter line 4 still includes `Write`; line 15 still policy-gates it. No tool-level guard added. → **disposition: open**

### S-S-3 (F-S-03 — hub fragility)
- (a) Manager phase table complete: **YES** now — Preparation included (line 35) per F-P-06 addressed
- (b) Recovery mechanism if manager misroutes: **STILL NONE** — no subagent self-escalate-on-wrong-phase status. F-R-06 (Risk) carry-forward
- Partial improvement; still hub-fragile but the worst gap (missing Preparation) is closed. → **disposition: open (downgraded effective severity)**

### S-S-4 (F-S-04 — drift detector, iter1 Critical)
- Drift detector: **STILL ABSENT** — grep for CI scripts, lint configs, schema validation targeting `agents/*.md` ↔ `delegation/SKILL.md` Agent Roster → 0 hits
- The fix is **verbal only**: both manager.md:40 and delegation/SKILL.md:213 now contain the prose "Drift from this list is a bug" — this is not a mechanical detector
- Convention sync remains manual. The exact failure mode iter1 named is unchanged
- → **disposition: open (stuck, Critical)**

### S-S-5 (F-S-05)
- (a) Implicit ideation Sub-step C coupling: **UNCHANGED** — leader.md:33 still says "loaded by ideation Sub-step C, or whenever the brief calls for it" → **open** (Low)

### S-S-6 (adversarial)
- (a) Manager direction-only: **UNCHANGED** — manager.md:15 single-line-edits exception persists (F-P-07)

### S-S-7 (NEW iter2 — mistake skill peer-conformance)
- Frontmatter present at `skills/mistake/SKILL.md:1-5` (name, description, allowed-tools)
- Sections: Memory Access Matrix ✓, Core Principles (blockquotes) ✓, Procedures (P1/P2/P3/P4) ✓, Constraints ✓, Output paths ✓
- Compare to `skills/evaluation/SKILL.md` shape: matches closely — same section ordering, same Memory Access Matrix idiom, same Output paths convention
- One peer-shape variance: `evaluation/SKILL.md` has "Three-Tier Memory Access Matrix" (3 rows including FORBIDDEN session.json) — `mistake/SKILL.md:19-23` has 3 rows but no FORBIDDEN row; acceptable since mistake skill has no analogous forbidden surface
- No duplication of `evaluation/SKILL.md` procedures. No contradiction with `wrap-up/SKILL.md` (referenced for promotion routing)
- → **F-S-NEW-01** (Low/100) — peer-conformance pass

### S-S-8 (NEW iter2 — assistant two-mode shape)
- assistant.md:10 declares two modes; subsequent sections (Out of scope, Before You Start, Lifecycle) interleave both modes
- Section 17-18: explicit Memorization-mode write surfaces stated
- Section 88-93 Memorize lifecycle: distinguishes lookup-mode (no write) vs Memorization-mode (per memorization skill)
- The bleed is mild — Lifecycle's Study/Plan/Execute/Verify sections (lines 50-85) describe lookup work; Memorization mode procedures are deferred to `memorization/SKILL.md` (which is not loaded by default at line 39-44 since "You almost never need workflow phase docs")
- **Smell**: Memorize lifecycle (lines 86-93) tries to cover both modes in ~7 lines and reads like an afterthought. The "load `memorization` skill" instruction at line 12 fixes this at delegation time but the file is harder to read because of it → **F-S-NEW-02** (Medium)

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-S-01** | `design_flaw` | `process` | **addressed** | 100 | High | manager.md:34-38 names assistant for Memorization in every phase; assistant.md:12 claims ownership | iter1 High resolved |
| **F-S-02** | `assumption_risk` | `security` | open | 75 | Medium | leader.md:4 still includes `Write`; line 15 policy-gates only | iter1 unchanged — still tool-vs-policy split |
| **F-S-03** | `design_flaw` | `process` | open (partial improvement) | 75 | High → effective Medium | Preparation now in phase table (manager.md:35); no recovery mechanism added | Worst gap closed; hub fragility partially mitigated |
| **F-S-04** | `scenario_gap` | `docs-sync` | **open (stuck, Critical)** | 100 | **Critical** | No CI/lint/schema syncs the 4+ places. Verbal "drift is a bug" sentence added but no mechanism | The most important iter1 Critical that REVISE did not address. Future drift between `agents/*.md` and `delegation/SKILL.md` Agent Roster has no mechanical guard |
| **F-S-05** | `assumption_risk` | `docs-sync` | open | 50 | Low | leader.md:33 unchanged | Same as iter1 |
| **F-S-NEW-01** | `general` | `docs-sync` | (verification finding) | 100 | n/a | `skills/mistake/SKILL.md` matches peer-skill shape; no contradictions | Task B clean — peer-conformance verified |
| **F-S-NEW-02** | `design_flaw` | `process` | open | 50 | Medium | assistant.md:88-93 Memorize lifecycle blends two modes in 7 lines | Two-mode role file is structurally noisier than four other 1-mode files; readability cost |

## Per-perspective verdict

**FAIL** — F-S-04 remains Critical/100, **unchanged from iter1**. This is a `stuck` finding: the iter1 Critical that the REVISE did not touch. Verbal "drift is a bug" is not a drift detector. iter2 sustains the iter1 FAIL on Structure.

F-S-01 (High) is addressed — meaningful progress. F-S-03 has partial improvement (Preparation included). Net structure quality: better than iter1 but still FAIL on the highest-impact finding.

## Low-confidence appendix

- F-S-05 (Low/50) — carry-forward
