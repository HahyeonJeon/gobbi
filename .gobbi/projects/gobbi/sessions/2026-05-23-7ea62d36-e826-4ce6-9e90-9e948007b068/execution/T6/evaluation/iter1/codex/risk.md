# Risk Perspective - Execution Evaluation T6

Verdict: REVISE

## Artifact Summary (Stage 0)

Risk review checks the blast radius if this codex skill is followed literally by future managers and assistants. The main risks are false DONE during evaluation, wrong write roots, unbounded Codex execution, and discovery failures through missing repo-local skill paths.

Memory reads are the same as `project.md`.

W/W/H gate: clear. Phase tag matches execution.

## Locked Frame (Stage 1)

Scenario 1: Sandbox and CWD risks are controlled.
- Check: absolute main-tree session path is mandated.
- Check: `--cd /playinganalytics/git/gobbi` is recommended where needed.
- Check: `--add-dir` is included for cross-tree writes.
- Check: the recorded mistake is quoted or cited concretely.

Scenario 2: Hang and cost runaway risks are controlled.
- Check: `timeout 600` is mandatory.
- Check: background notification timing is documented.
- Check: files-as-truth verification replaces stdout/broker polling.

Scenario 3: Discovery and dogfood risks are documented.
- Check: missing `.agents/skills/codex` is covered as a known failure mode.
- Check: Skill Map row points readers at codex.

Scenario 4 (adversarial): A future assistant reports DONE on partial output.
- Check: the recommended example cannot pass with only one output file.
- Check: the recommended example cannot pass without 5-Type vocabulary evidence.

Coverage declarations: privacy and licensing are not applicable. Cost and sandbox blast radius are applicable and covered.

## Stage 2 Results

Scenario 1: PASS. The sandbox/CWD section quotes the recorded mistake at lines 149-160 and repeats the absolute-path mandate in Constraints at line 375. Cross-tree write examples include `--cd` and `--add-dir`.

Scenario 2: PASS. Timeout, notification timing, companion controls, and files-as-truth are covered at `codex/SKILL.md:187-239`.

Scenario 3: PARTIAL. The Skill Map row exists. The missing-symlink failure mode is not documented in codex/SKILL.md despite the ideation adversarial scenario and checklist 15.

Scenario 4: FAIL. The worked example validates one file and one verdict string, so the highest-value guardrail against partial evaluation output is incomplete.

## Findings

### T6-RISK-001 - Assistant-wrapper example can produce false confidence on partial evaluation output

Type: assumption_risk
Domain: process
Confidence: 75
Severity: High
Disposition: open

Evidence: The decision record lines 55-60 require all expected output files and content checks, including perspective files and 5-Type vocabulary. The implemented example at `codex/SKILL.md:272-274` checks one file and one `VERDICT:` match. The current requested output contract for this evaluation itself is 8 files under `execution/T6/evaluation/iter1/codex/`.

Why it matters: This skill will be copied into future dual-system evaluation prompts. If the copied example under-validates outputs, the manager can advance with incomplete evaluation evidence.

FP-check: Not a false positive. The risk is not theoretical; the assistant-wrapper decision was created from observed fire-and-forget and notification timing failures in this session.

### T6-RISK-002 - Target worktree does not contain the pre-resolved codex skill symlinks

Type: assumption_risk
Domain: process
Confidence: 75
Severity: Medium
Disposition: open

Evidence: In the target worktree, `test -L .agents/skills/codex` and `test -L .claude/skills/codex/SKILL.md` both exited 1, and `ls .agents/skills/ | wc -l` returned `16`. Planning says Concern 4 symlinks were resolved at Preparation EXIT and Task 06 only verifies them (`plan.md:526`, `plan.md:563`), so this may be an integration-state issue rather than a Task 06 content edit.

Why it matters: Repo-local skill loading depends on `.agents/skills/codex`. If the integration branch lacks that symlink, the codex skill may be present in source-of-truth storage but absent from the official Codex skill path.

FP-check: Medium severity because user gate 12 correctly constrains this commit to two source files. Do not add symlink files in a Task 06 content revision unless the manager revises scope; ensure the branch integrates the preparation symlink state before final sweep.

## Low-confidence Appendix

No suppressed Risk findings.
