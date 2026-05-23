# Consistency Perspective

## Artifact Summary + Memory reads

What: check cross-artifact coherence between iter2 draft claims, the staged stub, Design A, iter1 audit, and project skill conventions. Why: Preparation can only PASS if claims, evidence, and locked sources agree. How: verify H2s, frontmatter, line citation, iter1 audit preservation, and Concern #4 disposition.

Memory reads:
- Target stub with line numbers.
- Draft iter2 with line numbers.
- `rawdata/skill-stub-iter1.md`.
- Design A lines 15-23.
- `memorization/SKILL.md` lines 220-228.
- Prior iter `consistency.md` and `overall.md`.
- Project skill frontmatter grep across 16 existing skills.
- No `session.json` read.

## Locked Frame (Stage 1)

Scenario 1: draft claims match actual stub content.
- Check: generated H2 list in the draft matches the actual H2 list.
- Check: generated frontmatter claim in the draft matches actual frontmatter.

Scenario 2: draft/stub claims match locked Design A.
- Check: H2 names and order match lines 15-23 of Design A.
- Check: Design A is treated as higher authority than the iter2 manager brief.

Scenario 3: line-citation repair is correct.
- Check: `Path conventions` is cited at line 224 with lowercase `c`.
- Check: stale line 226 is not used as the current citation.

Scenario 4: iter1 audit and open concern status are coherent.
- Check: `skill-stub-iter1.md` exists and preserves the prior bad stub.
- Check: Concern #4 is reclassified to Preparation but not falsely closed if the fix failed.

Scenario 5 (adversarial): a reader cross-checks only one source and gets the wrong state.
- Check: no single checked source says PASS while another authoritative source says REVISE.

Coverage notes: privacy/licensing/dependencies are not applicable. Docs-sync is the primary consistency domain.

## Per-scenario per-check results

Scenario 1:
- PASS: draft lines 106 and actual stub agree that the iter2 stub contains `name`, `description`, and `when-to-load`, with no `allowed-tools`.
- PASS: draft line 106 and actual stub agree on the actual 8 H2 names including `Anti-patterns / Constraints`.
- FAIL: the draft calls that list "per Idea Design A locked order"; it is not.

Scenario 2:
- FAIL: Design A locked #7 `Cost + sandbox budget awareness` and #8 `Anti-patterns`; actual/draft use #7 `Anti-patterns` and #8 `Constraints`.
- FAIL: Design A line 22's cost section has been demoted to a `Use cases` comment in the stub.

Scenario 3:
- PASS: `memorization/SKILL.md` line 224 is `**Path conventions**`.
- PASS: draft lines 60, 126, and 151 use line 224 with lowercase `c`.
- PASS with note: draft line 18 mentions old `line 226` only as historical correction context, not as the current citation.

Scenario 4:
- PASS: `rawdata/skill-stub-iter1.md` exists and preserves the old Cost H2 at line 70 and old STUB metadata H2 at line 107.
- PASS: Concern #4 is reclassified to Preparation in draft lines 19, 122, and 130.
- FAIL: Concern #4 is marked resolved even though the actual stub still fails the locked structure.

Scenario 5:
- FAIL: draft line 169 says all gates pass; Design A and frontmatter baseline say two gates fail.

## Typed findings

### COD-PREP2-CONS-001

- Type: `general`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: draft line 106 says the stub has "EXACTLY 8 H2 sections per Idea Design A locked order" and then lists a sequence ending `Use cases / Anti-patterns / Constraints`. Design A lines 21-23 require `Use cases / Cost + sandbox budget awareness / Anti-patterns`.
- FP-check: not an inferred contradiction. The exact sequences are textually different.

### COD-PREP2-CONS-002

- Type: `general`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: draft line 17 says `allowed-tools` is non-canonical and no other gobbi skill uses it. Grep shows all 16 existing project skills use `allowed-tools`, and none use `when-to-load`.
- FP-check: not a partial sample; all 16 existing project skill files were enumerated.

### Inherited finding dispositions

- `COD-PREP-CONS-001`: addressed. The current Path conventions citation is line 224 lowercase `c`.
- `COD-PREP-CONS-002`: superseded by `COD-PREP2-CONS-001` and `COD-PREP2-CONS-002`. Count contradictions were fixed, but cross-artifact truth is still wrong.

## Verdict

REVISE. The line citation drift is fixed, but the iter2 draft is now inconsistent with the higher-authority locked design and project frontmatter convention.

## Low-confidence appendix

No low-confidence findings.
