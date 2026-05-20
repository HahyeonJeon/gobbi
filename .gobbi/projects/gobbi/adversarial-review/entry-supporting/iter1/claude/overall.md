# Overall (Stage 3) — Batch 4 iter1 (Claude)

## Artifact Summary + Memory reads

(See `project.md` § Artifact Summary.)

## Per-perspective verdict roll-up

| Perspective | Verdict | In-scope findings (Crit / High / Med / Low) | Notes |
|---|---|---|---|
| Project | PASS | 0 / 0 / 1 / 2 | P-P-01 sparse-check, P-P-02 AI-Provenance discoverability, P-P-03 witness trailer |
| Structure | PASS | 0 / 0 / 1 / 2 | S-S-01 Iron Law index gap (Medium); two Low |
| Performance | PASS | 0 / 0 / 0 / 2 | Both Low; no real cost concerns |
| Aesthetics | PASS | 0 / 0 / 0 / 3 | All Low; A-A-01 "Future work" tail in principles |
| Usage | PASS | 0 / 0 / 2 / 1 | U-U-01 "Wrap-up" overloaded; U-U-02 stash rule scope |
| Consistency | **REVISE** | 0 / 1 / 2 / 1 | C-C-01 Principle 2 wording vs evaluation topology (High) |
| Risk | PASS | 0 / 0 / 1 / 3 | R-R-02 project-name sanitization (Medium) |

Out-of-scope findings: 1 (C-C-03, `.claude/CLAUDE.md` step-count drift → issue #259).

## Stage 3 — Cross-cutting findings + Karpathy 4-modes

### Cross-perspective tensions

**Tension 1: Structure says PASS but Consistency says REVISE — what does that reveal?**

C-C-01 (Principle 2 wording overloaded with two senses of "perspective") is a single-skill, single-line wording issue. Structure judges the *organization* of the three files clean; Consistency catches that the term "perspective" carries two semantic loads. The tension reveals that *structural* soundness (clean section boundaries, navigable headings) doesn't catch *terminological* drift. This is the right outcome — the perspectives complement.

**Tension 2: Project and Usage both flag "Wrap-up" overload (P-P-02 + U-U-01)**

Two perspectives caught a related discoverability issue (the AI-Provenance trailer being absent from gobbi/SKILL.md is parallel to the Wrap-up term being overloaded in gobbi/SKILL.md). Both findings converge on: gobbi/SKILL.md is the entry-tier and could carry one or two more pieces of vocabulary in a glossary table.

### O-O-01 — Cross-perspective convergence on a "Glossary + cross-skill index" gap in gobbi/SKILL.md

- **Type**: general
- **Domain**: docs-sync
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence**: Findings P-P-02 (AI-Provenance discoverability), U-U-01 ("Wrap-up" overloaded), and S-S-03 (principles miscategorized in Skill Map) all converge on the same root cause: gobbi/SKILL.md is the front door but does not anchor key vocabulary in a glossary. A 5-row glossary table (e.g., for "Wrap-up Loop / Wrap-up's MEMORIZATION / Wrap-up's promotion pass / AI-Provenance-Record / mistake promotion two layers") would close all three findings simultaneously.
- **Remediation**: Add a "## Glossary" section to gobbi/SKILL.md (between Workflow Overview and Agent Taxonomy) with 5–8 rows. Cost: ~20 lines. Closes P-P-02, U-U-01, U-U-03, and partially S-S-03.

### Karpathy 4-mode check

| Mode | Found in Batch 4? |
|---|---|
| **Wrong assumptions** | No critical wrong-assumption findings. Principle 2's "perspective" wording (C-C-01) is closer to terminological drift than a wrong assumption — the underlying topology is sound; the wording lags. |
| **Overcomplexity** | No. The three skills are deliberately spare: gobbi/SKILL.md is the front door with a skill map; principles is 12 disciplined sections; git is procedure-named. No novel structural devices, no premature abstractions. |
| **Orthogonal edits** | Borderline. The "Future work: Red Flags table" in principles/SKILL.md (A-A-01) is technically a deferred enhancement bundled inside a release skill — orthogonal to the skill's current scope. Severity Low because it's clearly labeled as future. |
| **Imperative-over-declarative** | Mostly absent. The 12 Iron Laws are *declarative* ("NO ACTION WITHOUT THINKING") rather than imperative ("you must think this many seconds before acting"). Good. Counter-example: gobbi/SKILL.md Step 1 lists 5 specific skills in a fixed order — could be more declarative ("load the session-start skill bundle defined in delegation/SKILL.md") but the explicit list is acceptable because it's the contract itself. |

No Karpathy-mode failure rises to a new finding.

### Preserve list (what to leave alone on REVISE iterations)

If a REVISE iteration is performed (e.g., to address C-C-01), preserve:

1. **gobbi/SKILL.md "Session Bootstrap Order" 6-step sequence** — the order is deliberate (load skills → env vars → settings check → setup questions → memory check → enter workflow) and matches the runtime hook sequence. Don't reorder.
2. **principles/SKILL.md 12-principle structure** — each principle's Why + Anti-rationalizations + Mechanism is the canonical pattern. Don't restructure.
3. **principles/SKILL.md Iron Law wording for principles 1, 3-12** — these are quoted across the agent and skill tree (cross-grepped Principles 1, 2, 3, 4, 6, 7, 8 in agents/ and skills/). Only Principle 2 needs the wording tweak per C-C-01.
4. **git/SKILL.md Procedure numbering (P1-P7)** — referenced internally; renumbering would break cross-references in conventions.md.
5. **conventions.md regex strings** — the branch and commit regexes are deliberate. Don't tweak unless C-C-04 (length cap) is being addressed.
6. **The AI-Provenance-Record trailer format and rationale** — locked Batch 1 decision; the GitHub Copilot Co-Authored-By controversy citation is the historical witness.
7. **Forbidden Operations table structure** — extending it with new rows (per R-R-03) is fine, but the table format and the existing rows should stay.

## Overall verdict

**REVISE** — Per Stage 2 rule (any `High` finding with confidence ≥ 50 → REVISE), the **Consistency** perspective's C-C-01 (Principle 2 wording vs evaluation topology, confidence 75, severity High) lifts the Overall verdict to **REVISE**.

The fix is small: one explanatory clause added to Principle 2's body (option (b) in C-C-01's remediation). Everything else is Medium or Low.

### Loop verdict

**REVISE** (driven by C-C-01).

### What a REVISE iteration would address

Sorted by leverage:

1. **C-C-01** (High) — one-clause fix to Principle 2 body clarifying "perspective" sense.
2. **O-O-01** (Medium, cross-perspective converged) — add Glossary to gobbi/SKILL.md; closes P-P-02, U-U-01, U-U-03, partially S-S-03.
3. **S-S-01** (Medium) — Iron Law summary table in principles/SKILL.md.
4. **C-C-02** (Medium) — clarify mistake-promotion two-layer mechanism in gobbi/SKILL.md line 154.
5. **C-C-04** (Medium) — clarify subject regex enforces shape, not total length.
6. **U-U-02** (Medium) — clarify `git stash` rule's scope (worktree-only vs all modes).
7. **R-R-02** (Medium) — note project-name validation precondition.
8. **P-P-01** (Medium) — tighten sparse-check predicate.

Combined remediation footprint: ~50-80 lines of edits across the four files. No structural rework needed.

### Out-of-scope finding count

1 — C-C-03 (`.claude/CLAUDE.md` step-count drift, deferred to issue #259 per Batch 3 F-U-01 lock).
