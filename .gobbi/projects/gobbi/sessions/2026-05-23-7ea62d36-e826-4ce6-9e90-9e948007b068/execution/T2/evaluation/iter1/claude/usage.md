# Usage Perspective — T02 (commit 536d22f)

**Perspective:** usage (how agents/users find, read, and act on this content)
**Verdict:** PASS

## Assessment

Two reader pathways exist:

1. **memorization/SKILL.md reader** (typically an agent in the MEMORIZATION sub-phase or someone learning the skill): scans Core Principles, hits "Moment-of-capture", reads the body, understands that capture must happen during WORK and is pointed to mistake P2 for the *how*.
2. **mistake/SKILL.md reader** (any agent loading the mistake skill at session start, or hitting a correction during work): reaches P2 step 3, sees the immediacy mandate in bold, follows back-link to memorization for the *why*.

Both pathways converge on the same actionable mandate: write the candidate note now, do not defer.

The forward link cites a precise location (`§ P2`) and the back-link cites `§ Core Principles § Moment-of-capture` — both are findable without ambiguity even if the GitHub-render anchor wobbles (Structure F-STRUCT-01).

## Findings

### F-USAGE-01 — Cross-link is unidirectional in one sense: memorization → mistake names a *procedure* anchor (`§ P2`), mistake → memorization names a *principle* anchor (`§ Core Principles § Moment-of-capture`)

- **Type:** general
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 50
- **Severity:** Low
- **Evidence:** memorization link target text: "P2" (procedure). mistake link target text: "Core Principles § Moment-of-capture" (principle).
- **Why it matters:** The asymmetry is intentional and correct — each link points the reader where their need actually lives (procedure on one side, rationale on the other). Worth noting only because a "reciprocal" link sometimes implies symmetry. The plan called for "reciprocal" (idea.md Cross-Link Manifest 1+2) — semantically reciprocal but lexically asymmetric. No defect.
- **Suggested direction:** None — the asymmetry is the right call. Documented here for situational awareness only.

## Must-preserve list

- Both link texts state the destination section by name, not by URL fragment alone — readers can find the anchor even when slug rendering varies.

## Verdict

**PASS.** Both reader pathways are well-served; the bidirectional pointer is wired correctly with appropriate role-asymmetry (procedure ↔ rationale).
