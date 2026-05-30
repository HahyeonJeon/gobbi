# T2 auto-mode.md — Aesthetics Perspective (iter1, claude)

## Artifact Summary

(See `project.md`.)

## Memory reads

- Companion `chat-mode.md` (style baseline)
- `.claude/CLAUDE.md` (project doc-authoring standard)

## Locked Frame (Stage 1)

**Scenario A1.** Heading hierarchy and naming.
- [x] `# Auto Mode` H1 → `## §N` H2 → `### N.M` H3 — three levels, clean
- [x] Section labels are noun-phrased and self-explanatory ("Mode posture", "Always-Ask codification", "Banner conditioning")
- [x] Numbered §1–§6 + `## Cross-references` foot section — symmetric to chat-mode.md style

**Scenario A2.** Backtick-formatting of paths and identifiers (mistake-aware: project convention).
- [x] `discussion/SKILL.md` / `planning/SKILL.md` / `memorization/SKILL.md` / `mistake/SKILL.md` — all backtick-formatted
- [x] `discuss.mode` / `evaluate.mode` / `maxIterations` / `AskUserQuestion` — all backticked

**Scenario A3.** Prose density / scannability (Krug + Rams lens).
- [x] Each §N opens with a one-line role declaration before details
- [x] Tables used for enumerable data (categories, defaults) rather than prose
- [x] Bold inline emphasis used sparingly for normative statements

**Scenario A4 (adversarial).** "Earns-its-pixels" test on every paragraph.
- [x] §1's last paragraph ("The manager does NOT pause for any other reason…") is normative discipline, not filler
- [x] §4 third paragraph ("Operationally: when the manager faces…") restates §2 in workflow-time language — defensible because banner-rationalization is a known anti-pattern in the project history

## Stage 2 — Aesthetics verdict

- **Verdict: PASS.**

## Findings

### F-A1 (Low / Conf 50, open) — §6 duplication breaks the "no waste" Rams test

**Evidence.** Lines 159–178 (§6) repeat §3's defaults table with no new column or annotation. The §6 lead-in ("The full Chat-vs-Auto settings comparison lives in the Idea doc…") suggests §6 is a courtesy recap, but inside a 202-line doc with §3 right above, the courtesy reads as redundancy.

**Why it matters.** Aesthetic discipline says every section must earn its space. A purely-duplicative §6 is the doc's only non-earning paragraph.

**Type/Domain/Confidence/Severity/Disposition.** general / docs-sync / 50 / Low / open. (Severity Low because the duplication does not mislead a reader — but a discriminating reader will ask "why two tables?")

## Low-confidence appendix

None.
