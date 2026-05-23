## Artifact Summary + Memory reads

Same target and memory reads as `project.md`. Structure lens: decomposition, dependencies, routing model, and whether the design can be planned and implemented without inventing missing abstractions.

W/W/H gate: present; phase matches ideation.

## Locked Frame (Stage 1)

Scenario S1: Each design item maps to a coherent edit surface.
- Check: A-G each name specific files or validated absence of files.
- Check: dependencies between B/C/D/E are explicit.

Scenario S2: Routing and classification structures reuse the canonical evaluation/memorization taxonomy.
- Check: Step 2.5 mechanical routing names valid `evaluation/SKILL.md` Type and Domain fields.
- Check: examples do not invent finding categories outside the canonical schema.
- Check: auto-backfill inputs are structurally sufficient for deterministic staging.

Scenario S3 (adversarial): a seemingly small doc edit encodes an impossible implementation contract.
- Check: validation methods can actually be run.
- Check: cited line targets exist or are intentionally approximate.

## Per-scenario per-check results

S1: Mostly passes. A-G have file-level surfaces and B/C/D/E coupling is stated at draft lines 127-129 and 448.

S2: Fails. Step 2.5's classification examples use `correction` and `decision-record` as if they are finding Types, but `evaluation/SKILL.md` defines only `scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, and `general`.

S3: Partially fails. Most validation methods are runnable. The Step 2.5 classification contract is the main structural impossibility.

## Typed findings

### COD-STRUCT-001 - Step 2.5 classification uses non-existent finding types

- Type: `design_flaw`
- Domain: `process`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: Draft lines 425-426 define `mechanical` using examples "a `correction` finding" and "a `decision-record` finding"; line 426 also uses "BOTH a decision-record AND a mistake-candidate." `evaluation/SKILL.md` lines 329-342 define the complete Type set and do not include `correction` or `decision-record`; lines 372-383 route valid Domain/Type combinations.
- Observation vs hypothesis: Observation. The taxonomy mismatch is direct text-to-text conflict.
- Why-it-matters: Planning and Execution cannot implement deterministic Type+Domain routing from categories that the evaluator schema never emits. This undermines the user-selected hybrid Step 2.5 design.
- Suggested-direction: Reconcile the classification vocabulary with the canonical finding schema before Planning; no implementation fix proposed here.

## Low-confidence appendix

No suppressed Structure findings.

Verdict: REVISE
