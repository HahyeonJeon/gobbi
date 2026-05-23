# Risk Perspective

## Artifact Summary + Memory reads

What: evaluate blast radius if iter2 Preparation is accepted. Why: on PASS, generated skills can be promoted before Planning, so a wrong skeleton or schema becomes project memory input. How: check no premature write, check promotion target safety, apply known Codex absolute-path mistake, and disposition iter1 risk.

Memory reads:
- Target stub, draft iter2, iter1 audit copy.
- Design A locked H2 artifact.
- Prior iter `risk.md`.
- Project mistakes `codex-eval-session-write-path-nested-in-worktree.md` and `manager-rm-rf-without-investigating-tracked-files.md`.
- Existing project skill frontmatter baseline.
- No `session.json` read.

## Locked Frame (Stage 1)

Scenario 1: no direct project-memory write occurred before PASS.
- Check: `.gobbi/projects/gobbi/skills/codex` does not exist yet.
- Check: writes are only under main-tree session evaluation/staging paths.

Scenario 2: generated-skill promotion is safe if PASS is issued.
- Check: staged skill matches locked H2 contract.
- Check: staged skill matches frontmatter convention.

Scenario 3: known Codex path mistake does not recur.
- Check: evaluation files are written to the absolute main-tree session path.
- Check: no worktree-nested session path is used.

Scenario 4 (adversarial): a false PASS contaminates Planning.
- Check: Planning would not inherit manager-induced brief errors as source truth.
- Check: rollback remains simple because only session staging has been touched so far.

Coverage notes: privacy and license risk are not applicable. Cost risk is applicable because missing budget H2 weakens cost controls.

## Per-scenario per-check results

Scenario 1:
- PASS: `test -e .gobbi/projects/gobbi/skills/codex` returned exit 1.
- PASS: this Codex evaluation is writing under `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/.../preparation/evaluation/iter2/codex/`, the main-tree absolute path requested by the user.

Scenario 2:
- FAIL: H2 names/order mismatch Design A at positions 7 and 8.
- FAIL: frontmatter omits `allowed-tools` and adds `when-to-load`.

Scenario 3:
- PASS: no worktree-nested session write was introduced in this evaluation pass.

Scenario 4:
- FAIL: a false PASS would promote the manager-induced brief error and make Planning consume the wrong skeleton.
- PASS: rollback is still simple now because the invalid file is still session-staged, not promoted.

## Typed findings

### COD-PREP2-RISK-001

- Type: `assumption_risk`
- Domain: `process`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: draft line 169 says all gates pass, but the promotion target fails both locked H2 and frontmatter convention checks. If the manager advances on that claim, the nonconforming stub becomes the pre-Planning skill target.
- FP-check: no current project-memory corruption is claimed; the risk is the immediate PASS transition.

### COD-PREP2-RISK-002

- Type: `assumption_risk`
- Domain: `cost`
- Disposition: `open`
- Confidence: 75
- Severity: High
- Evidence: by removing the dedicated cost/budget H2, the stub weakens a cost-control guardrail for future `codex exec` usage. The cost content is present only as a sub-bullet under Use cases.
- FP-check: impact is downstream risk, not current runtime cost; confidence is 75 rather than 100 because Execution could still preserve content despite the wrong skeleton.

### Inherited finding dispositions

- `COD-PREP-RISK-001`: open with changed evidence. No premature project-memory write occurred, but the staged promotion target is still unsafe.

## Verdict

REVISE. The absolute-path mistake did not recur and rollback is still easy, but a PASS would promote a known-bad stub.

## Low-confidence appendix

No low-confidence findings.
