# Codex Evaluation Iter2 - Performance

## Artifact Summary + Memory reads

Artifact: `ideation/rawdata/draft-iter2.md`, Bundle A Ideation draft. Performance lens focuses on cost/budget impact of codex invocations and resource-control commitments in the design. Memory reads included the required Gobbi skill docs, iter1 Codex Performance finding, and the target draft.

## Locked Frame (Stage 1)

Scenario PERF1: Codex cost and budget impact is explicit.
- Check: The codex skill outline includes cost guidance.
- Check: Token/model/effort choices are not left implicit.
- Check: Cost control is tied to sandbox and task-selection guidance.

Scenario PERF2 (adversarial): The design encourages unbounded codex runs.
- Check: Timeout/foreground/background guidance exists.
- Check: The design avoids unnecessary model/effort overrides.

## Per-scenario per-check results

PERF1: PASS. Iter2 lines 35, 431-436, and 580 add "Cost + sandbox budget awareness", token-cost awareness, codex-versus-claude selection, default read-only guidance, no `--effort` override, and no `--model` override unless user-requested.

PERF2: PASS. Iter2 lines 431-436 and 370 cover bounded foreground use, background/polling for wider scopes, and no user-unrequested model/effort overrides.

## Typed findings

### COD-PERF-001 - Codex cost budget is not acknowledged
- Type: `checklist_gap`
- Domain: `cost`
- Disposition: `addressed`
- Confidence: 100
- Severity: Medium
- Evidence: Iter2 lines 431-436 define the cost/budget subsection with token-cost, effort, model, sandbox, and bounded-run guidance.
- Resolution status: RESOLVED.

Counts: Critical 0 / High 0 / Medium 0 / Low 0 / Nit 0.

Verdict: PASS

## Low-confidence appendix

None.
