# Usage Perspective

## Artifact Summary + Memory reads

What: evaluate whether the manager, Planning leader, Execution executor, and Wrap-up assistant can use the iter2 Preparation outputs without guessing. Why: the generated `codex` skill is meant to become the pre-Planning source-of-truth target after Evaluation PASS. How: test the mental model a downstream consumer would form from the draft and stub.

Memory reads:
- Target stub, draft iter2, iter1 audit copy.
- Design A locked H2 artifact.
- Iter1 `usage.md`.
- Preparation skill generated-skill promotion exception context from prior iter.
- Project mistakes about absolute main-tree session writes.
- No `session.json` read.

## Locked Frame (Stage 1)

Scenario 1: the manager can decide PASS/REVISE from the draft.
- Check: unresolved Preparation defects are not described as resolved.
- Check: wrong manager brief instructions are not accepted over locked Idea artifacts.

Scenario 2: the Planning leader can decompose Item A against a stable file.
- Check: the H2 list exactly matches Design A.
- Check: frontmatter matches project skill convention.

Scenario 3: the Execution executor can fill content without redesigning the skeleton.
- Check: Execution can write into the locked sections.
- Check: Execution is not asked to decide whether cost belongs under Use cases or as its own H2.

Scenario 4 (adversarial): Wrap-up/promote copies the staged file as-is.
- Check: the copied file will be immediately consistent with other project skills.
- Check: promotion will not bake in a wrong schema or wrong H2 list.

Coverage notes: operator accessibility is relevant through headings and frontmatter discoverability. UI accessibility/i18n are not applicable.

## Per-scenario per-check results

Scenario 1:
- FAIL: draft line 169 says all gates pass and frontmatter is correct. Evidence shows two High defects remain.
- PASS: draft lines 19, 122, and 130 correctly move Concern #4 out of Planning in principle.

Scenario 2:
- FAIL: H2s at positions 7 and 8 do not match Design A.
- FAIL: `allowed-tools` is absent; `when-to-load` is non-baseline.

Scenario 3:
- FAIL: Execution would inherit a skeleton that tells it cost/budget awareness is a sub-bullet under Use cases, not a locked peer section.
- FAIL: Execution would have to undo `Constraints` as an H2 or carry forward an unauthorized section.

Scenario 4:
- FAIL: a generated-skill promotion on PASS would put a non-conforming `codex` skill into project memory before Planning.

## Typed findings

### COD-PREP2-USAGE-001

- Type: `design_flaw`
- Domain: `process`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: the draft marks Concern #4 resolved at line 130, but the actual stub still violates the locked section names and frontmatter convention. A downstream manager relying on the draft would make the wrong PASS decision.
- FP-check: not a disagreement about final prose. This is about whether the generated artifact is usable as the next loop's input.

### COD-PREP2-USAGE-002

- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: Design A requires a distinct `Cost + sandbox budget awareness` H2. The iter2 draft says Execution will write content into the existing locked sections, but the section does not exist.
- FP-check: comments under `Use cases` do not satisfy a downstream decomposition contract keyed on H2 names.

### Inherited finding dispositions

- `COD-PREP-USAGE-001`: open with changed evidence. The H2 count defect was addressed, but the promoted target remains unsafe due to H2 identity/order and frontmatter drift.

## Verdict

REVISE. The next consumer would be told the Preparation defect is resolved when it is not.

## Low-confidence appendix

No low-confidence findings.
