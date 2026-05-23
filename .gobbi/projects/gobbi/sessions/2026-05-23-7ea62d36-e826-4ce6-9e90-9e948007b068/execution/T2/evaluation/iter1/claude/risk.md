# Risk Perspective — T02 (commit 536d22f)

**Perspective:** risk (failure modes the change introduces or fails to prevent)
**Verdict:** PASS

## Assessment

### Risks the change *addresses*

- **Pathology γ recurrence** (staging-empty when full evaluations exist, witness session 2026-05-22-bac669ad): the new principle directly names this failure mode and prescribes the prevention.
- **Mistake P2 silent-deferral**: previous P2 step 3 said "Do not defer to MEMORIZATION" but lacked the immediacy emphasis and the rationale. Strengthened.

### Risks the change does *not* address

The principle is a docs change. It cannot enforce itself. Agents must load the skill, read it, and apply it. The risk surface around enforcement is unchanged — this is by design (the discipline lives in the agent, not in a gate).

### New risks introduced

None of substance. The bidirectional link creates a maintenance coupling: if either anchor moves or section renames, both files need update. The risk magnitude is small (both files are co-edited in the same skill ecosystem).

## Findings

### F-RISK-01 — Anchor-link maintenance coupling

- **Type:** assumption_risk
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 75
- **Severity:** Low
- **Evidence:** memorization/SKILL.md line 82 forward-links to `#p2----detect-a-correction-during-work`; mistake/SKILL.md line 80 back-links to `#core-principles`. Either side can decay if section renamed.
- **Why it matters:** Without a docs drift detector that follows cross-skill anchors, this coupling can rot silently. The same risk exists for every cross-skill link in the codebase — this PR doesn't change the magnitude, but it adds two more such links.
- **Suggested direction:** Defer — out of scope for T02. If a future docs-health pass adds cross-anchor validation, these two links should be in the first batch.

### F-RISK-02 — Principle-without-enforcement risk

- **Type:** design_flaw
- **Domain:** process
- **Disposition:** open
- **Confidence:** 50
- **Severity:** Low
- **Evidence:** The principle codifies a behavioral expectation but introduces no mechanical gate that fails when violated. An agent that doesn't load memorization/SKILL.md at the right moment (or skims past Core Principles) can still defer captures and the session can still go empty-staging on interrupt.
- **Why it matters:** The witness session (2026-05-22-bac669ad) failed despite the agent presumably having access to existing guidance. Adding stronger guidance helps but doesn't guarantee adoption. T05 wrap-up auto-backfill in this campaign is the partial mechanical countermeasure — moment-of-capture (T02) + mechanical backfill (T05) are complementary halves.
- **Suggested direction:** Defer — T02 scope is the principle itself. The mechanical countermeasure is T05 per plan.md (Design D — Wrap-up Step 2.5). This finding is informational/contextual.

## Must-preserve list

- Inline witness (anchors the principle to a concrete failure).
- Both directions of the cross-link.
- Bold `**immediately**` in mistake P2.

## Verdict

**PASS.** No Critical/High risks introduced; two Low findings concern long-term maintenance coupling and the principle-without-enforcement pattern. The enforcement gap is acknowledged and partially addressed by T05 in this same campaign.
