# Startup Evaluation Extension

This companion adds Startup-specific questions to the ordinary productive-step evaluation owned by
[`../evaluation/SKILL.md`](../evaluation/SKILL.md). It applies when a Startup classifier or input packet
materially informed the current Ideation candidate. It creates no separate evaluator, report, verdict,
iteration, output path, or finding workflow.

Both fresh independent evaluators receive the same complete Ideation evidence package: canonical
candidate, both drafts, both cross-reviews, resolved decisions, Startup classifier and packet when
applicable, Study reports, scenario/checklist evidence, and relevant process proof. Neither evaluator
sees the other's report.

## Selection

Evaluate at least these cases:

- the exact classifier result and cited baseline inventory;
- the user accept/decline disposition when classification was insufficient;
- every load-bearing problem, user, scope, feasibility, authority, or direction claim imported into the
  Ideation candidate;
- all open or contradictory Startup evidence;
- all research-backed design directions and rejected alternatives; and
- the absence of Startup-owned session, storage, promotion, or evaluation behavior.

Use [`scenarios.md`](scenarios.md) to select fail-able cases and copy applicable items from
[`checklists.md`](checklists.md) into the ordinary evaluation checklist. Record checklist dispositions in
each evaluator's single ordinary report.

| Checklist group | Primary perspectives |
|---|---|
| ST-CHK-CLS-01..03 | Project, Consistency, Risk |
| ST-CHK-AUTH-01..03 | Project, Usage, Risk |
| ST-CHK-EVD-01..04 | Project, Usage, Consistency, Risk |
| ST-CHK-DIR-01..04 | Project, Structure, Performance, Aesthetics, Usage, Consistency, Risk |
| ST-CHK-HO-01..05 | Structure, Usage, Consistency, Risk |
| ST-CHK-EVAL-01..02 | Risk, Overall |

## Perspective extensions

### Project

Ask whether the candidate starts from a real problem event and behavioral evidence, identifies one first
user and job, separates user roles, and states why the work matters now. Challenge praise, forecasts,
feature requests, and assumed demand. Verify that scope and direction remain user-owned and that a
declined Startup choice has not been replaced with invented facts.

**Adversarial cases:** ST-SCN-02-B, ST-SCN-03-A, ST-SCN-04-B.

### Structure

Ask whether evidence, assumptions, decisions, alternatives, contradictions, and open questions are
traceable without a hidden Startup record. Confirm all eleven topic groups are accounted for, product
shape precedes system shape, and the resulting Ideation artifact stands alone for a reader who did not
observe the questioning.

**Adversarial cases:** ST-SCN-03-C, ST-SCN-06-A, ST-SCN-07-A.

### Performance

Interpret performance broadly as feasibility and sustainable operation at this altitude. Check build
capacity, dependencies, runtime constraints, ownership, observability, recovery, upkeep, and stop
conditions. Reject precise performance claims without applicable evidence; do not demand mechanism that
belongs to Planning or Execution.

**Adversarial cases:** ST-SCN-05-A, ST-SCN-06-B.

### Aesthetics

Ask whether the rough experience direction is coherent, comprehensible, accessible, trustworthy, and
consistent with cited references. Evaluate the macro interaction and content shape without inventing a
detailed visual system or implementation design.

**Adversarial cases:** ST-SCN-05-A, ST-SCN-05-B.

### Usage

Walk the first user's critical journey from trigger to outcome, including waiting, handoffs, edge states,
failure, recovery, and the current alternative. Check switching push/pull, anxiety, and habit against
behavioral evidence. Ensure smart-skipped questions were actually answered by verified evidence.

**Adversarial cases:** ST-SCN-03-A, ST-SCN-03-C, ST-SCN-04-A.

### Consistency

Cross-check the problem, user, boundary, features, journeys, architecture direction, stack constraints,
quality bar, roadmap, idioms, rules, and risks. Later solution language must not silently redefine an
earlier premise. Verify license, governance, authority, and sensitive-data statements agree with the
current project reference and repository facts.

**Adversarial cases:** ST-SCN-01-C, ST-SCN-04-B, ST-SCN-07-B.

### Risk

Attack the most uncertain, irreversible, and consequential assumptions first. Look for unsupported
problem reality, safety or feasibility gaps, hidden one-way doors, governance ambiguity, stale evidence,
secret exposure, and a branch marked closed despite a load-bearing unknown. Confirm the evidence that
would change each binding direction is explicit.

**Adversarial cases:** ST-SCN-01-C, ST-SCN-06-B, ST-SCN-07-B.

### Overall

Judge whether the Startup evidence makes the ordinary Ideation candidate more grounded and usable
without creating another lifecycle or source of truth. Coverage is necessary but not acceptance. A
materially unsupported problem, user, feasibility, safety, authority, or scope claim cannot receive
PASS merely because every topic branch has a disposition.

## Verdict guidance

- **PASS:** the Startup evidence is complete enough for the current scope, load-bearing claims are
  supported or safely bounded, contradictions and owned unknowns are explicit, and all operation
  boundaries hold.
- **REVISE:** the direction remains viable but important evidence, traceability, boundary, viability, or
  handoff quality needs material revision.
- **FAIL:** the candidate rests on a false or unowned load-bearing premise, violates user authority,
  exposes sensitive material, is infeasible or unsafe at the agreed scope, or reintroduces a separate
  Startup writer/lifecycle.

The ordinary aggregator uses the most severe of the two independent verdicts. The manager deduplicates
findings while preserving provenance and presents one batch disposition gate to the user. No finding is
applied before that disposition is approved or edited. A material revision starts a complete new
dual-system WORK and EVALUATION iteration under the ordinary cap; this extension never creates a private
retry.

## Completion proof

The ordinary evaluation report is complete only when it contains all seven perspectives plus Overall,
the full finding ledger, the completed applicable Startup checklist items, and its verdict. Verify that
no additional Startup evaluation output or per-perspective file was created.
