# Consistency Perspective — T02 (commit 536d22f)

**Perspective:** consistency (alignment with surrounding skills, principles, conventions, and prior art)
**Verdict:** PASS

## Assessment

### Sibling principle voice

The new Core Principle adopts the established X-not-Y pattern:

| Existing | New |
|---|---|
| "Staging, not immediate promote." | "Moment-of-capture, not end-of-loop." |
| "Store what survives, not what's transient." | (mirrors the same form) |

Title cadence matches.

### Cross-skill cross-link convention

Spot-check: memorization/SKILL.md previously referenced `evaluation/SKILL.md` (line 76 area) and `wrap-up/SKILL.md` — same `../{skill}/SKILL.md#anchor` form. The new links match this convention.

### Iron Law alignment

The principle materializes Iron Law 7 (NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE) at the meta-level: it requires writing the *evidence of correction* immediately, not as a deferred completion claim. Also aligns with Principle 12 (NO TASK STARTS WITHOUT CLEAR WHAT/WHY/HOW) by making the capture moment explicit. No principle is contradicted.

### mistake/SKILL.md P2 internal consistency

Step 3's rewritten language ("Write the candidate note **immediately**") is now stronger than steps 1-2 ("Stop and acknowledge", "Note it as a mistake-candidate"). The escalation is monotonic and reads as an intensifying sequence — consistent.

## Findings

### F-CONS-01 — Reciprocal link convention is project-novel

- **Type:** general
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 25
- **Severity:** Low
- **Evidence:** I did not find an existing pair of skills with explicit bidirectional cross-links to specific sections elsewhere in `.gobbi/projects/gobbi/skills/` (didn't grep exhaustively). The pattern is good but may be project-first.
- **Why it matters:** If this pattern is project-first, future task families (T03 delegation, T04 wrap-up) should adopt the same `[skill/SKILL.md § Section](../path#anchor)` form for consistency. Worth noting for the campaign-level retrospective, not as a blocker.
- **Suggested direction:** None. If subsequent tasks adopt the same convention, the pattern locks in organically.

## Must-preserve list

- X-not-Y title pattern.
- `../{skill}/SKILL.md#anchor` link form.
- Sentence-level escalation in mistake P2 (Stop → Note → **Immediately write**).

## Verdict

**PASS.** Consistent with sibling principles, cross-skill link conventions, Iron Laws, and the mistake skill's internal structure.
