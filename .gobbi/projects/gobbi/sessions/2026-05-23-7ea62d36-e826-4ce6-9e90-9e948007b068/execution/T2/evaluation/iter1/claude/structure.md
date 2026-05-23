# Structure Perspective — T02 (commit 536d22f)

**Perspective:** structure (placement, sectioning, anchors, file layout)
**Verdict:** PASS

## Gate outputs

- Memorization SKILL.md section order (lines 54-92): `## Core Principles` → 7 blockquoted principles → next H2 `## Artifact frontmatter schema`. New principle slots in at position 7 of 8, between "Store what survives" (line 78) and "Templates over freeform" (line 86). **Correct slot.**
- Each principle in this skill follows the pattern: `> **Title.**` blockquote, blank line, then 1-3 sentence body. The new principle conforms.
- The mistake/SKILL.md `### P2 — Detect a correction during work` section retains its three numbered steps; only step 3 was rewritten. Numbering preserved.

## Findings

### F-STRUCT-01 — Anchor slug for mistake P2 forward link likely won't resolve in browser rendering

- **Type:** design_flaw
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 75
- **Severity:** Low
- **Evidence:** memorization/SKILL.md line 82 link target: `../mistake/SKILL.md#p2----detect-a-correction-during-work` (4 hyphens between `p2` and `detect`). The source heading is `### P2 — Detect a correction during work` where `—` is U+2014 (em-dash). GitHub's slugger strips non-alphanumeric chars and converts surrounding spaces to single hyphens, producing `p2--detect-a-correction-during-work` (2 hyphens, not 4). Same risk in the reverse link: `../memorization/SKILL.md#core-principles` resolves cleanly (PASS for that one).
- **Why it matters:** If these docs are ever browsed on GitHub or via a Markdown renderer, the forward link from memorization → mistake P2 may 404 within the file (jumps to top of file instead of the P2 section). For agent-time loading (file is read as text, link is informational), the target file is still found, so the effective penalty is small.
- **Suggested direction:** Replace with `#p2--detect-a-correction-during-work` (2 hyphens) — verify by viewing the rendered mistake/SKILL.md on GitHub after merge. Alternatively, the convention used elsewhere in the codebase (check existing cross-skill links) takes precedence.

### F-STRUCT-02 — Sibling-principle voice is 1-2 sentences; new entry is 4

- **Type:** general
- **Domain:** docs
- **Disposition:** open
- **Confidence:** 50
- **Severity:** Low
- **Evidence:** memorization/SKILL.md lines 56-91: existing Core Principles bodies range from 1 sentence ("Run after every…", 2 sentences) to 2 sentences ("Idempotent CREATE…", "Cumulative staging…"). The new principle body has 4 sentences and embeds an inline witness with three parenthesized counts. It is the longest body in the section by a meaningful margin.
- **Why it matters:** Voice/length drift can dilute the blockquote-as-headline pattern. The witness specificity is valuable (Project perspective marks it must-preserve); the question is whether the witness belongs in the body or in a footnote.
- **Suggested direction:** Optional polish — consider moving the per-task eval-file counts ("T1 (8 eval files)…") to a parenthetical or footnote so the principle body reads in 2-3 sentences. Defer to author preference; the current form is acceptable.

## Must-preserve list

- Section slot (between "Store what survives" and "Templates over freeform") matches Design B placement directive (idea.md:279).
- Blockquote `>` header style preserved.
- mistake P2 step 3 retains its position as step 3 of 3.

## Verdict

**PASS.** Structure is sound. Two Low findings — one anchor-slug concern (Confidence 75, browser-render only), one voice-length nit (Confidence 50).
