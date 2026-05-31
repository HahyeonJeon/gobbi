# Evaluation — Structure perspective (Claude, iter1)

**Verdict:** REVISE

## P14 format conformance
P14 (SKILL.md:382-400) matches the established principle section format:
- `## Principle 14 — Write Plainly and Literally` heading ✓
- `**Iron Law:**` (384) ✓
- `**Why:**` (386) ✓
- `**Discipline — how to write plainly:**` (388) — a labeled-Discipline variant consistent with house style (cf. P5 "Before any design:", P9 "Apply at every level:"). ✓
- `**Anti-rationalizations:**` (394) ✓
- `**Mechanism:**` (400) ✓
Internal ordering matches the canonical Iron Law / Why / Discipline / Anti-rationalizations / Mechanism shape.

## Markdown integrity
No broken markdown: bold labels closed, bullet lists well-formed, no stray code fence.

## FINDINGS

### S-1 — Missing `---` section separator before Principle 14
- **Type:** design_flaw / **Domain:** docs-structure / **Disposition:** open
- **Severity:** Medium / **Confidence:** 100
- **Evidence:** SKILL.md:380-382 (verified by `cat -A` and Read) — line 380 is P13's Mechanism tail ("...rejected at review."), line 381 is blank, line 382 is `## Principle 14 — Write Plainly and Literally`. There is NO `---` rule between P13 and P14. Every other principle is preceded by a `---` separator exactly 2 lines above its heading: P1@15←---@13, P2@46←---@44, P3@71←---@69, ... P12@276←---@274, P13@309←---@307. P14@382 is the ONLY principle heading whose 2-lines-prior position (380) holds body text instead of `---`. The leading `---` separator was dropped when P14 was appended.
- **Why it matters:** breaks the per-principle section rhythm; P13 and P14 render as one continuous block in a doc whose entire purpose is scannable per-principle sections. It is also a co-author tell that P14 was appended without matching the section template.
- **Suggested direction:** the inter-principle `---` separator is part of the principle-section template; P14 needs the same leading separator as P1-P13.

## Note on the file outro
P13's section additionally lacks a trailing `---` *as part of* this same gap — i.e., the single missing rule sits between the end of P13's body and the P14 heading. There is exactly one separator missing, located before P14.

## Must-preserve
- P14's label ordering (Iron Law / Why / Discipline / Anti-rationalizations / Mechanism) — correct.
