# Consistency Perspective — iter2 re-eval (Claude)

## Frame

Scenarios:
1. iter2 stub vs Idea spec consistency.
2. iter2 stub frontmatter vs project skill convention.
3. iter2 draft narrative vs stub-as-delivered.
4. iter1 → iter2 changelog completeness.

## Verification

- Stub H2 list (line 19, 29, 47, 55, 76, 88, 111, 126) vs Idea Design A 8-section list (line 16-23) and Idea drafts (iter2:356, iter3:349): **MISMATCH at positions 7 and 8**.
- Stub frontmatter (line 1-5: name + description + when-to-load) vs Idea draft-iter3:349 (`name, description, allowed-tools`): **MISMATCH**.
- 16 of 16 surveyed project SKILL.md files use `allowed-tools:`, 0 use `when-to-load:` frontmatter: **convention MISMATCH**.
- iter2 draft line 18 says "iter2 corrected the stub from 10 sections to 8 by folding 'Cost + sandbox budget awareness' into the `## Use cases` body (sub-bullets)" — the draft is internally consistent with the stub-as-shipped, but both diverge from the Idea.

## Findings

### F-C-01 — Iter2 stub diverges from Idea-locked section list (positions 7, 8)
- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: Critical
- Evidence: see F-P-01 in project.md and F-S-01 in structure.md. Position 7 should be `## Cost + sandbox budget awareness`, position 8 should be `## Anti-patterns`. iter2 has 7 = Anti-patterns, 8 = Constraints.
- Why it matters: Iron Law 4 + Iron Law 8 (every implementation change must be reflected in documentation) — iter2 changed the section list without amending the Idea, breaking the contract between locked-Idea and Preparation-staged.
- Suggested direction: covered by F-S-01.

### F-C-02 — Iter2 stub frontmatter diverges from Idea spec and project convention
- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: see F-P-02 + F-S-03 + F-U-02. Convention sample: `git/SKILL.md`, `delegation/SKILL.md`, `principles/SKILL.md`, `mistake/SKILL.md`, `gobbi/SKILL.md`, `memorization/SKILL.md`, `wrap-up/SKILL.md`, `ideation/SKILL.md`, `planning/SKILL.md`, `execution/SKILL.md`, `preparation/SKILL.md` — all use `allowed-tools:`. None have `when-to-load:` as a frontmatter field.
- Why it matters: same Iron Law 4 violation as F-C-01. Additionally Karpathy-style "wrong-assumption" failure mode: iter1 codex assumed `when-to-load:` was canonical and the iter2 leader brief did not verify against the project sample.
- Suggested direction: covered by F-S-03.

### F-C-03 — Iter2 draft narrative correctly self-describes the deviation
- Type: `general`
- Domain: `docs-sync`
- Disposition: `addressed`
- Confidence: 100
- Severity: Low
- Evidence: iter2 draft line 18 + line 94 explicitly describe the fold-in. The draft is internally honest about what changed; the issue is that "what changed" was the wrong change.
- Why it matters: positive — no hiding. Future evaluators can audit the deviation easily.

### F-C-04 — Line 224 / lowercase "Path conventions" fix verified
- Type: `general`
- Domain: `docs-sync`
- Disposition: `addressed`
- Confidence: 100
- Severity: Low
- Evidence: `grep -n "Path conventions" memorization/SKILL.md` → `224:**Path conventions**`. iter2 draft line 60 + 126 cite `line 224 (lowercase 'c')`. Correct.
- Why it matters: positive — iter1 codex Finding-002 surgical fix landed cleanly.

## Must-preserve

- iter2 draft's internal honesty about what changed.
- Lowercase `Path conventions` correction.
- Concern #4 reclassification rationale.

## Verdict

REVISE — F-C-01 Critical Confidence 100, F-C-02 High Confidence 100.
