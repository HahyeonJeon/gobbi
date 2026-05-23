# Aesthetics Perspective

## Artifact Summary + Memory reads

What: evaluate readability, naming, and polish of the iter2 draft and staged stub. Why: the Preparation output should be scannable and should not overclaim compliance when the visible headings contradict the locked design. How: compare visible H2s, frontmatter wording, and draft claims.

Memory reads:
- Target stub, draft iter2, iter1 stub audit.
- Design A locked H2 artifact.
- Iter1 `aesthetics.md`.
- Memorization line check for `Path conventions`.
- No `session.json` read.

## Locked Frame (Stage 1)

Scenario 1: a new reader can visually verify the stub skeleton.
- Check: H2 labels are the locked labels.
- Check: temporary Preparation-only scaffolding is not a peer H2.

Scenario 2: draft wording does not overclaim.
- Check: "EXACTLY 8 H2 sections per Idea Design A locked order" is true.
- Check: frontmatter claims use the actual project convention.

Scenario 3 (adversarial): future readers grep headings instead of reading comments.
- Check: grep by `Cost + sandbox budget awareness` finds the section.
- Check: grep by `Constraints` does not produce an unauthorized locked section.

Coverage notes: accessibility/i18n are not applicable to this internal markdown except for scannable headings, which are covered here.

## Per-scenario per-check results

Scenario 1:
- PASS: the stub is short and uses obvious placeholder comments.
- FAIL: `## Constraints` appears as a peer H2 even though it is not in the locked set.
- FAIL: `## Cost + sandbox budget awareness` is absent as a visible heading.

Scenario 2:
- FAIL: draft line 106 claims the stub has exactly 8 H2 sections per Idea Design A but lists `Use cases / Anti-patterns / Constraints` for positions 6-8, which is not Design A.
- FAIL: draft lines 17, 42, 94, and 106 call `when-to-load` correct and `allowed-tools` non-canonical, contrary to the 16-skill baseline.

Scenario 3:
- FAIL: `rg '^## Cost \+ sandbox budget awareness'` finds the section in iter1 audit at line 70 but not in the iter2 stub.
- FAIL: `rg '^## Constraints'` finds an unauthorized iter2 H2 at line 126.

## Typed findings

### COD-PREP2-AESTH-001

- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: the visible H2 hierarchy no longer matches Design A: cost/budget disappeared from the heading scan, and `Constraints` appears as a final H2. The draft nonetheless states the stub is at the locked shape.
- FP-check: visual polish alone would be Medium/Low, but this exact heading mismatch is user-classified High because the H2 list is locked.

### COD-PREP2-AESTH-002

- Type: `general`
- Domain: `process`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: draft line 169 says "correct frontmatter", while the stub omits `allowed-tools` and uses `when-to-load`; the empirical baseline says the opposite convention.
- FP-check: not stylistic frontmatter ordering. This is a wrong claim about repository convention.

### Inherited finding dispositions

- `COD-PREP-AESTH-001`: superseded by `COD-PREP2-AESTH-001`. Iter1's `STUB metadata` H2 is gone, but a different unauthorized H2 (`Constraints`) remains and the locked cost H2 is missing.

## Verdict

REVISE. The draft and stub are readable, but the visible shape misleads a reader into accepting a non-Design-A skeleton.

## Low-confidence appendix

No low-confidence findings.
