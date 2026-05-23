## Artifact Summary + Memory reads

Same target and memory reads as `project.md`. Risk lens: blast radius, reversibility, write-surface safety, security, and rollback.

W/W/H gate: present; phase matches ideation.

## Locked Frame (Stage 1)

Scenario R1: Codex invocation risk is bounded.
- Check: sandbox modes and `--cd`/absolute-path discipline are included.
- Check: user-only slash command boundary is preserved.
- Check: high-risk sandbox bypass is constrained.

Scenario R2: Wrap-up Step 2.5 auto-backfill does not create new silent data-loss or overwrite risks.
- Check: auto-written staging files follow stable finding-id / slug collision policy.
- Check: audit trail is named.
- Check: judgment-required gaps escalate instead of improvising.

Scenario R3 (adversarial): a detective control hides a deeper upstream failure.
- Check: Step 2.5 detects missing staging without assuming evaluations are complete.

## Per-scenario per-check results

R1: Passes on the ideation draft. Draft lines 342-365 cover sandbox, CWD, timeout, and user-only slash command boundaries.

R2: Partially fails. Draft lines 427-430 say Step 2.5 writes staging files and logs a gap report, but the auto-backfill spec does not name the stable finding-id pre-write / slug collision policy from `evaluation/SKILL.md`.

R3: Fails by inheritance from COD-PROJ-001: the draft assumes complete evaluation output existed.

## Typed findings

### COD-RISK-001 - Auto-backfill write path lacks collision/idempotency guard in the design text

- Type: `assumption_risk`
- Domain: `process`
- Disposition: `open`
- Confidence: 75
- Severity: High
- Evidence: Draft lines 427-430 state that Step 2.5 reads an evaluation file, applies Type+Domain routing, writes the staging file, and logs the gap report. `evaluation/SKILL.md` lines 385-393 require stable `finding-id` handling, same-id overwrite, different-id slug disambiguation, and a pre-write check before writing `staging/{type}/{slug}.md`. The Step 2.5 design does not mention this guard even though it introduces a new writer for prior-loop staging.
- Observation vs hypothesis: Observation for omission; hypothesis for overwrite outcome.
- Why-it-matters: Auto-backfill is intentionally autonomous. Without a stated collision/idempotency guard, a mechanical recovery feature could overwrite distinct staging artifacts or produce non-repeatable gap reports.
- Suggested-direction: Treat write-safety as a required risk check before accepting Step 2.5; no implementation fix proposed here.

## Low-confidence appendix

No suppressed Risk findings.

Verdict: REVISE
