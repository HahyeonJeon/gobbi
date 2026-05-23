# Structure — T06 codex skill content

## Artifact Summary
Same as project.md.

## Locked Frame (Stage 1)

Structure lens — organization, decomposition, dependencies, testability, maintainability.

- **S-S-1** Top-down decomposition is sound (8 H2 contract preserved; subsections under each H2 are appropriate slices).
  - C-S-1.1 Section 2 has named subsections (a, b, c, d) — priority order legible.
  - C-S-1.2 Section 4 splits into mode table / CWD / absolute-path mandate / cross-tree / post-eval / manager-proxy — each subsection is a single concern.
  - C-S-1.3 Section 5 splits into timeout / foreground-vs-background / companion controls / files-as-truth — coherent.
  - C-S-1.4 Section 6 has named subsections (a, b, c) matching use-case labels.
- **S-S-2** Constraints body block coheres with the H2 bodies (no contradictory MUST/NEVER between them).
- **S-S-3** Boring-by-default — innovation only where Iron Law floor demands it.
- **S-S-4 (adversarial)** Dependency-graph implications: does this skill correctly point outward (delegation, mistake, git) without circular dependence?

## Stage 2 — Per-check evidence

- C-S-1.1 ✓ 2(a)/(b)/(c)/(d) headers + clean priority statement at top of Section 2.
- C-S-1.2 ✓ Section 4 has 6 H3 subsections — each one concern.
- C-S-1.3 ✓ Section 5 has 4 H3 subsections — each one concern.
- C-S-1.4 ✓ Section 6 has 3 H3 subsections matching the three use cases.
- C-S-2 ✓ Constraints block (lines 372-386) does not contradict body — e.g., `MUST use --sandbox workspace-write (or more restrictive) for any write` matches Section 4 mode-table guidance.
- C-S-3 ✓ Skill is mostly tabular + bullet — no clever abstraction over the basic invocation patterns.
- C-S-4 Section 5's companion-plugin-controls block names `/codex:status` and `/codex:cancel` as user-only — directionally consistent. Section 6(b) references `Agent(subagent_type="codex:codex-rescue", ...)` — clean outward pointer. **However:** the brief required a cross-link to `git/SKILL.md` (Cross-Link Manifest #9) for the background-mode discipline; that pointer is absent (see project.md F-P-02).

## New findings (Structure-specific)

### F-S-01 — Two adjacent sources of truth on the foreground/background tradeoff
- Type: `design_flaw` | Domain: `docs-sync` | Disposition: `open` | Confidence: 50 | Severity: Medium
- Evidence: Section 5 (Hang + timeout discipline) lines 202-215 describes foreground vs background tradeoff; Section 2(d) (Invocation patterns — assistant-wrapper) lines 70-72 describes the same notification-timing problem from a different angle. Without an explicit cross-link between them, a reader hits the same conceptual content twice with subtly different framings.
- Why it matters: Two sources of truth on the same fact is a maintenance hazard — when the harness behavior changes, both spots must be updated. A reader who reads only Section 2(d) does not see the foreground-vs-background tradeoff table from Section 5.
- Suggested direction: Add a one-line cross-link from each section to the other ("see Section 5's foreground/background table" inside Section 2(d), and "see Section 2(d) for the topology fix" inside Section 5).

### F-S-02 — Section 2(d) numbering convention drifts from Section 6
- Type: `general` | Domain: `docs-sync` | Disposition: `open` | Confidence: 75 | Severity: Low
- Evidence: Section 2 uses `### (a)`, `### (b)`, `### (c)`, `### (d)`; Section 6 uses `### (a) Dual-system evaluator spawn`, `### (b) Codex-rescue for stuck Claude work`, `### (c) User-initiated /codex:adversarial-review`. Both use parenthesized lower-case letters — actually consistent on inspection.
- After closer reading this is **not a finding**; documenting that I checked. Drop.

## Verdict
- Critical/≥75: 0; High/≥50: 0; Medium: 1 (F-S-01 at 50)
- **Structure verdict: PASS** (one open Medium F-S-01 recorded for context; does not gate verdict per evaluation/SKILL.md threshold).
