# Structure Perspective — iter2 re-eval (Claude)

## Frame

Scenarios:
1. Section skeleton matches the Idea-locked 8-section list.
2. Frontmatter shape matches Idea + project convention.
3. Iter2 draft structure (sections, tables, changelog) coheres internally.

## Verification

- Stub `grep -n "^## "` shows 8 sections in this order: When to load / Invocation patterns / Why subagents must use `codex exec` / Sandbox + CWD discipline / Hang + timeout discipline / Use cases / Anti-patterns / Constraints.
- Idea Design A (line 15-23) locked order: ...6 Use cases / **7 Cost + sandbox budget awareness** / **8 Anti-patterns**. Constraints is NOT in the 8 (Idea draft-iter3:349: "Plus Constraints block" — separate from the 8 H2).
- Section #7 in iter2 stub is `## Anti-patterns` (Idea #8), section #8 is `## Constraints` (not in Idea 8).

## Findings

### F-S-01 — Locked section #7 "Cost + sandbox budget awareness" missing
- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: Critical
- Evidence: see F-P-01 in `project.md`. Stub line 104 acknowledges the fold-in explicitly: `Cost + sandbox budget awareness sub-bullet (folded in here, NOT a separate section)`. Iter2 draft line 94 also confirms the fold-in as deliberate.
- Why it matters: structural drift from the locked Idea spec. Execution and Planning will key off the H2 list; a missing H2 = missing Execution-phase task target.
- Suggested direction: restore as locked H2 #7 (between `## Use cases` and `## Anti-patterns`); demote "Constraints" to a body block per Idea draft-iter3:349.

### F-S-02 — Section #8 "Constraints" elevated to H2 against Idea spec
- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: Idea drafts (iter2:356, iter3:349) say "8 H2 sections: ...(8) Anti-patterns. Plus Constraints block" — Constraints is a separate body block, not one of the 8 locked H2 sections. iter2 stub line 126 has `## Constraints` as an H2.
- Why it matters: same Iron Law 4 violation as F-S-01; symmetric error.
- Suggested direction: demote to a body block (e.g., trailing `> Constraints:` blockquote or unnumbered list).

### F-S-03 — Frontmatter `when-to-load:` substituted for `allowed-tools:`
- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: see F-P-02. Project-convention survey: 0 of 16 existing `.gobbi/projects/gobbi/skills/*/SKILL.md` files use `when-to-load:` frontmatter; 16/16 use `allowed-tools:`. Idea draft-iter3:349 locks `(name, description, allowed-tools)`.
- Why it matters: convention drift + spec drift in a single field. Loader/permission compatibility risk.
- Suggested direction: re-instate `allowed-tools: Read, Grep, Glob, Bash, AskUserQuestion`; remove `when-to-load:` line (content already in H2 #1).

### F-S-04 — Iter2 draft cohesion (positive observation)
- Type: `general`
- Domain: `docs-sync`
- Disposition: `addressed`
- Confidence: 100
- Severity: Low
- Evidence: iter2 draft `Changelog` table lines 14-19 clearly enumerates the 4 iter2 fixes; `Open concerns` section correctly strikes Concern #4 with explanation (line 130).
- Why it matters: structural transparency of what changed iter1 → iter2.

## Must-preserve

- 8 H2 count arithmetic.
- 6 of 8 locked section names (1-6).
- Anti-patterns section content (already correct).
- Iter2 draft's clear changelog + Open concerns reclassification structure.

## Verdict

REVISE — F-S-01 Critical Confidence 100, F-S-02 + F-S-03 High Confidence 100.
