---
name: principles-anti-rationalizations-label-residue
description: "The frontmatter description field and closing paragraph of principles/SKILL.md still say 'anti-rationalizations' while the body field is now 'Anti-pattern' — cosmetic label consistency tidy."
type: backlogs
scope: feature
feature: guardrails
status: active
created: 2026-06-01
session: a30b7a6e-164f-49ac-a857-ee225e831a7c
tags: [principles, cosmetic, label-consistency]
priority: null
disposition: open
shipped_in: null
---

# Anti-rationalizations label residue in principles/SKILL.md

The 4-field principles redesign (PR #283, commit `a629bf8`) renamed the per-principle field from "Anti-rationalizations" to "Anti-pattern" in all 14 principle bodies. However, two references still use the old label:

1. The SKILL.md frontmatter `description:` field — references "Anti-rationalizations" in its summary of what the skill contains.
2. The closing paragraph / navigation section — also references "anti-rationalizations."

These are cosmetic inconsistencies. The normative content (the field bodies themselves) was fully converted. Fixing these references was explicitly out of scope for PR #283.

## Acceptance criteria

- `grep -i "anti-rationalizations" .claude/skills/principles/SKILL.md` returns no results.
- Frontmatter description and closing paragraph use "Anti-pattern" (or omit the label reference).
- No normative content changed.
