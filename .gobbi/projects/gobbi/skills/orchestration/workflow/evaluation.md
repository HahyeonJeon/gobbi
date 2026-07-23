# EVALUATION Manager Adapter

[`evaluation/SKILL.md`](../../evaluation/SKILL.md) owns the general evaluator method, seven perspectives plus
Overall, causal finding content, checklist completion, and declared verdict derivation. This adapter applies
Gobbi's fresh dual-system dispatch, identity and independence constraints, exact finding metadata, confidence
and severity scales, dispositions, Record-owned JSON schema, report rendering and validation, aggregation, user
disposition gate, storage, and transition evidence.

## Entry

Enter only after the current WORK package validates and every material open decision is resolved. Freeze the complete evaluator bundle:

- canonical synthesis and, for Execution or Wrap-up, the actual changed tree;
- both independent drafts and both cross-reviews;
- resolved decisions and applicable waiver;
- locked scope, relevant upstream artifacts, process evidence, scenarios, checklist source, plan, and verification evidence;
- exact step, iteration, task, and evaluator assignment identity.

Both evaluators receive equivalent complete bundles. Neither receives the other evaluator's report, a prior evaluator session, or an unfinished creator artifact.

## Fresh dual-system dispatch

Dispatch exactly one fresh Claude evaluator and one fresh Codex evaluator. Neither may be a persistent teammate or a creator from the current WORK stage. Each independently reviews all seven required perspectives plus Overall, produces one complete finding ledger and completed checklist, and returns `VERDICT: PASS | REVISE | FAIL`.

Opposite-system invocation is read-only and ephemeral. Store its structured response only through the record command's `write-artifact` operation. Validate each report independently with the evaluation-owned schema and report validator before revealing either report to the other system or aggregating them.

## Aggregation

Aggregate verdict by severity: FAIL outranks REVISE, which outranks PASS. PASS requires PASS from both systems unless the user already approved a waiver limited to the missing system, current step, and current iteration.

Deduplicate only findings with the same symptom and root cause. Preserve both systems' provenance, evidence, confidence, and severity. When root-cause hypotheses differ, keep distinct findings. The manager does not decide which finding is correct.

## User disposition gate

Present one complete batch after both valid reports. For each deduplicated finding, recommend exactly one disposition:

- `open` when accepted for correction;
- `disputed` when evidence does not establish the finding; or
- `deferred` when accepted but outside the current correction authority or scope.

Show provenance and evidence sufficient for the user to edit the recommendation. Do not transition to RECORD until the user approves or changes the entire batch. Do not begin revision before this decision.

On a later iteration, mark an accepted finding `addressed` or `superseded` only when fresh creation and evaluation evidence supports that status. A material revision always receives two complete new evaluator reports; earlier reports remain evidence, never substitutes.

## Failure and waiver

If a system is unavailable, times out, returns malformed data, violates independence, or fails the report validator, pause and show the exact failure. Retry only the failed bounded operation with the same contract when safe. Continuing without that system requires the user's explicit narrow waiver and durable decision record. No other missing-system condition can aggregate to PASS.

## Completion proof

EVALUATION completes when both required fresh reports validate, every report contains the seven perspectives plus Overall, verdict aggregation is reproducible, deduplicated findings retain provenance, and the user-approved disposition batch is durable. Set `lastVerdict` and transition to RECORD through [`state-machine.md`](state-machine.md).
