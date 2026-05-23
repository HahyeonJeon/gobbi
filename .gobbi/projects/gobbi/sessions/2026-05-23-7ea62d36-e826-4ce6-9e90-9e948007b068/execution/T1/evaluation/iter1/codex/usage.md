# Execution Evaluation - Usage - Codex Iter 1

## Artifact Summary + Memory reads

Artifact under evaluation: commit `2eafe569c5a0963110e844bf12284fc06ec61bd2`, changing `.gobbi/projects/gobbi/skills/gobbi/SKILL.md` for Task `01-gobbi-polish-fg`.

The downstream consumers are a fresh manager loading `/gobbi`, future executors that rely on bootstrap setup wording, and later Task 06/Task 07 authors rebasing onto this Gobbi skill state.

Memory reads: repo-local principles, mistake, evaluation, execution/evaluation skills; project mistakes/rule; ideation Item F/G designs; preparation and planning artifacts; target file/diff; target verification commands. Current execution `claude/` evaluation contents were not read.

## Locked Frame (Stage 1)

Scenario U1: A fresh manager can execute bootstrap setup without ambiguity.
- Check U1.1: Step 4 tells the manager what one setup mode question to ask.
- Check U1.2: Step 4 tells the manager where customization lives.
- Check U1.3: The file does not direct the manager to ask removed standalone evaluation/git workflow questions.

Scenario U2: Glossary placement helps rather than interrupts the operator flow.
- Check U2.1: The actionable bootstrap appears before the Glossary.
- Check U2.2: The Glossary prose no longer tells the reader to treat it as pre-bootstrap reading.

Scenario U3: Accessibility/i18n for this text artifact.
- Check U3.1: Headings are skimmable and stable.
- Check U3.2: New user-facing strings are plain English, not locale-sensitive.

Scenario U4 (adversarial): A tired operator follows a stale sentence and asks the wrong question set.
- Check U4.1: Introductory and overview text do not contradict Step 4.
- Check U4.2: References to `setup Q1`, `Question 1`, or `Question 2` are not stale in the changed file.

Cross-cutting coverage:
- Accessibility: applicable as operator-readable markdown; headings and bullets pass.
- I18n: no date/number/sort behavior or locale-dependent output changed.

## Per-scenario per-check results

U1.1: PASS. Step 4 lines 80-89 define the orchestration mode question and options.
U1.2: PASS. Step 4 line 89 points customization to `orchestration/SKILL.md` Step 1 rows 1-2.
U1.3: PASS within Step 4. The supplied grep over Step 4 output `0` for `evaluation mode|git workflow mode`.

U2.1: PASS. Session Bootstrap Order line 15 is before Glossary line 104.
U2.2: FAIL. Glossary line 106 still says `Load this section first`, but the locked Item F rationale says the Glossary becomes an orientation map after running bootstrap, not before.

U3.1: PASS. The section order and headings remain scannable.
U3.2: PASS. The new prompt text is plain English and not locale-sensitive.

U4.1: FAIL. Same-file lines 11 and 134 still describe the old setup-question model. The threshold finding is recorded under Consistency.
U4.2: FAIL. `rg` found `setup Q1` at line 134.

## Typed findings

### COD-USAGE-001 - Glossary still instructs readers to load it first after being moved below bootstrap

- Type: general
- Domain: docs-sync
- Disposition: open
- Confidence: 100
- Severity: Medium
- Evidence: Target file line 104 has `## Glossary` after Session Bootstrap Order; line 106 says `Load this section first`. Ideation Item F says the Glossary should become the orientation map a fresh manager reads after running bootstrap.
- FP-check: Not a false positive from line-number drift; the same target file contains both the moved heading and the stale instruction.
- Suggested correction: Change the sentence to post-bootstrap orientation wording, for example: `Gobbi-specific terms used throughout the skill tree. Use this glossary as a vocabulary anchor after the bootstrap order is loaded.`

Perspective verdict: PASS.

## Low-confidence appendix

None.
