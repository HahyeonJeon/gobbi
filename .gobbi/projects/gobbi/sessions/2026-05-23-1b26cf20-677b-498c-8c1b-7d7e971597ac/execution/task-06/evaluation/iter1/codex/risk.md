# Risk Perspective - Task 06 iter1 Codex

## Artifact Summary (Stage 0)

The risk surface is workflow correctness for future sessions: an operator may choose direct mode, a manager may run row 5.5, and a post-merge reviewer may rely on the smoke-test section to catch branch-stamping regressions.

## Memory reads

Same Stage 0 register as `project.md`, plus command checks around branch regex behavior and whole-tree grep for whether the smoke-test is wired outside the new prose.

## Locked Frame (Stage 1)

Scenario R1 - Bad direct-mode documentation must not cause wrong session topology.
- Check R1.a: direct mode cannot silently look like worktree-pr or vice versa.
- Check R1.b: opt-out guidance points to a real, configurable value.

Scenario R2 - Smoke test must catch regressions after merge.
- Check R2.a: branch regex is compatible with git/conventions.md.
- Check R2.b: smoke-test instructions produce a pass/fail signal.
- Check R2.c: the gate is either wired into a workflow/hook or clearly marked as manual.

Scenario R3 (adversarial) - Failure modes should be easy to recover from.
- Check R3.a: a null worktreePath in worktree-pr sessions is called out.
- Check R3.b: a bad branch value is caught before later tasks depend on it.

Coverage: privacy/licensing/dependency supply chain not applicable. Error-budget impact is limited to workflow-session failure/rework.

## Results (Stage 2)

- R1.a: no. The setting docs are inconsistent with the settings template, so future manager logic can diverge depending on where it reads the mode.
- R1.b: no. No workflow-mode key exists in settings.default.json.
- R2.a: yes. The regex matches the documented branch convention and a sample valid branch.
- R2.b: no. The documented command is not a failing assertion and prints quoted JSON.
- R2.c: manual only. Whole-tree grep found the smoke-test text in orchestration/SKILL.md but no hook, memorization step, or executable workflow wiring that enforces it. Because Task 06 asked for documentation, this is a Medium process risk, not by itself a scope violation.
- R3.a: yes. The docs explicitly say null worktreePath in worktree-pr indicates row 5.5 skipped or P2 failed.
- R3.b: no unless a human manually interprets the output.

## Findings

### COD-RISK-T06-001 - Smoke-test gate is manual prose only

- Type: `assumption_risk`
- Domain: `process`
- Disposition: `open`
- Confidence: 100
- Severity: Medium
- Evidence: whole-tree grep in the worktree finds the smoke-test section in orchestration/SKILL.md lines 118-128, but no hook, memorization workflow step, or script that runs the check. The prose says to run it at the first post-merge session's Memorization phase.
- Why it matters: if the team expects "gate" to mean enforced, this will be missed. If "manual smoke-test instruction" was intended, the prose should say manual and provide an executable command.
- FP check: not High because Task 06 acceptance requested documentation, not automation.

### COD-RISK-T06-002 - Branch smoke test can false-fail or false-pass

- Type: `design_flaw`
- Domain: `test`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: same as COD-USAGE-T06-002. The command only prints `.git.branch`; it does not assert the regex, and the non-raw jq output does not match the anchored regex if piped literally.
- Why it matters: T1.h is a post-merge regression check. A bad gate either lets wrong branch values through or trains operators to ignore failures.
- FP check: not speculative; reproduced with jq and grep.

## Verdict

REVISE

## Low-confidence appendix

None.
