# Consistency Perspective

## Artifact Summary

This perspective checks cross-artifact coherence: report claims vs source files, Ideation locks vs staged stub, and vocabulary vs `evaluation/SKILL.md`. Verdict: REVISE.

## Memory reads

- Preparation report
- Staged `codex/SKILL.md`
- `ideation/artifacts/idea.md`
- `ideation/staging/design/item-a-codex-skill-structure.md`
- `evaluation/SKILL.md`
- Source anchors sampled from memorization, mistake, delegation, wrap-up, gobbi, and settings defaults

## Locked Frame (Stage 1)

Scenario 1: A-G readiness grades align with sampled cited source lines.
- Check: sampled paths exist.
- Check: sampled lines match the report claim.

Scenario 2: generated stub claims align with locked design.
- Check: locked H2 count matches actual H2 count.
- Check: frontmatter matches required verification keys.

Scenario 3: vocabulary uses the canonical 5 Types.
- Check: report uses `scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`.
- Check: report does not regress to `improvement` or `bug`.

Scenario 4 (adversarial): report-internal contradictions do not hide a failed check.
- Check: repeated claims about the same artifact agree with each other.

## Results

- Scenario 1: MIXED. Most sampled citations matched: `mistake/SKILL.md:68`, `delegation/SKILL.md:84`, `wrap-up/SKILL.md:118/137-138`, `evaluation/SKILL.md:98`, and `gobbi/SKILL.md:15/32/97-113`. One sampled citation did not: `memorization/SKILL.md` Path conventions is line 224, not line 226.
- Scenario 2: FAIL. Locked design says 8 H2; staged stub has 10. Required frontmatter key `when-to-load` is absent.
- Scenario 3: PASS. The report uses the 5 canonical Type values at lines 85 and 183. `rg -n "\b(improvement|bug)\b"` found no regression in the report.
- Scenario 4: FAIL. Report lines 29 and 133 say 8 locked H2 sections; line 119 says 12 H2 sections; actual count is 10.

## Findings

### COD-PREP-CONS-001

- Type: `general`
- Domain: `process`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: sampled citation mismatch: report line 58 says `memorization/SKILL.md` Path conventions subheading is at line 226, while `nl -ba` shows the heading at line 224 and line 226 is `- {date}`. The user explicitly required citation mismatches to be High findings.
- FP-check: the open concern later cites line 224 correctly, but the readiness table's exact citation remains wrong.

### COD-PREP-CONS-002

- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: report line 119 says the staged stub has 12 H2 sections, report line 133 says it has 8 locked H2 sections, and actual `grep -c "^## "` returns 10. The same artifact cannot be all three.
- FP-check: not a judgment about final content; this is a consistency failure in the readiness evidence.

## Verdict

REVISE. Vocabulary and most file anchors are correct, but the stub evidence and one sampled citation are inconsistent.

## Low-confidence appendix

No low-confidence findings.
