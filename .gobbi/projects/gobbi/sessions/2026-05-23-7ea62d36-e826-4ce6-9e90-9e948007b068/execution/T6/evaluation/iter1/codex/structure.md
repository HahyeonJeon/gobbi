# Structure Perspective - Execution Evaluation T6

Verdict: REVISE

## Artifact Summary (Stage 0)

The artifact is a documentation/process change: a new full codex skill body plus a Gobbi Skill Map row. The structure should make the skill easy to load, scan, and apply: frontmatter, one title, exactly 8 H2 sections, body Constraints block, and examples that match Gobbi's per-perspective evaluation output shape.

Memory reads are the same as `project.md`: AGENTS, repo-local Gobbi skills, the execution evaluation frame, project mistake/rule files, planning artifact, idea artifact, assistant-wrapper decision record, and five-type vocabulary reference.

W/W/H gate: clear. Phase tag matches execution.

## Locked Frame (Stage 1)

Scenario 1: The markdown skeleton preserves the locked shape.
- Check: exactly 8 H2 sections.
- Check: Constraints remains a body block, not H2 number 9.
- Check: section order matches the locked spec.

Scenario 2: Internal decomposition follows the intended operational sequence.
- Check: invocation patterns come before subagent tool-surface explanation.
- Check: sandbox/CWD and timeout disciplines are separate, not conflated.
- Check: use cases contain executable-enough examples for future agents.

Scenario 3: The dual-system evaluation example has the same file granularity as Gobbi evaluation.
- Check: expected outputs are per-perspective files, not only one summary file.
- Check: validation checks all contracted files before DONE.
- Check: validation includes required content greps for verdicts and Type vocabulary.

Scenario 4 (adversarial): A concise example looks usable but validates too little.
- Check: the example cannot produce verified DONE when only one output file exists.
- Check: the example cannot miss malformed or absent perspective files.

Coverage declarations: supply-chain is not applicable; no dependency changes. Observability applies as operator diagnosability of the example.

## Stage 2 Results

Scenario 1: PASS. The file has H2 headings only at lines 13, 26, 95, 126, 187, 241, 316, and 350. The Constraints marker is bold body text at line 370, so it does not violate the 8-H2 contract.

Scenario 2: PASS with caveat. The major operational sections are in a sensible sequence: load triggers, invocation patterns, subagent limitation, sandbox/CWD, timeout, use cases, cost, anti-patterns. The shape is maintainable.

Scenario 3: FAIL. The assistant-wrapper decision requires the Section 6 worked example to verify all expected output files and grep content including verdict line, perspective files, and 5-Type vocabulary. The implemented example validates only `/execution/<task-id>/staging/codex-perspective.md` plus `grep -q "VERDICT:"`.

Scenario 4: FAIL. Because the example validates a single file, a Codex-side assistant could report DONE even if the actual Gobbi evaluation contract requires 8 files under `evaluation/iter1/codex/{project,structure,performance,aesthetics,usage,consistency,risk,overall}.md`.

## Findings

### T6-STRUCT-001 - Worked example validates one output file instead of the per-perspective evaluation contract

Type: design_flaw
Domain: process
Confidence: 75
Severity: High
Disposition: open

Evidence: The decision record says the Section 6 worked example must show that the assistant "verifies all expected output files exist" and "grep-validates output content (verdict line, perspective files, 5-Type vocab)" at lines 55-60. The implemented worked example at `codex/SKILL.md:272-274` checks only one `codex-perspective.md` file and one `VERDICT:` grep.

Why it matters: The assistant-wrapper pattern was created specifically to avoid false DONE notifications. A one-file check is structurally weaker than the Gobbi evaluation contract and can silently miss missing perspective artifacts.

FP-check: Not a false positive. Section 2(d) has a broader sentence at line 77, but the required Section 6 worked example does not operationalize it.

## Low-confidence Appendix

No suppressed structure findings.
