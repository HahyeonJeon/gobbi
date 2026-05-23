# Risk Perspective

Verdict: REVISE

## Artifact Summary + Memory reads

Stage 0 W/W/H: present and evaluable. This perspective reviews blast radius, security, privacy/data retention, idempotency, rollback, and failure behavior.

Memory reads:
- `.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/artifacts/idea.md`
- `.gobbi/projects/gobbi/skills/ideation/evaluation.md`
- `.gobbi/projects/gobbi/skills/gobbi/SKILL.md`
- `.gobbi/projects/gobbi/skills/orchestration/SKILL.md`
- `.gobbi/projects/gobbi/skills/orchestration/templates/session.template.json`
- `.claude/settings.json`
- `.gobbi/projects/gobbi/mistakes/README.md`
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md`
- Official Claude Code hooks reference, `https://code.claude.com/docs/en/hooks`, lines 846-914.

## Locked Frame (Stage 1)

Scenario: The hook does not introduce shell-injection or env-file corruption risk.
- Check: JSON values written to `$CLAUDE_ENV_FILE` are shell-safe.
- Check: Paths with whitespace or shell metacharacters round-trip.

Scenario: Persisting transcript paths has bounded privacy and retention impact.
- Check: The artifact identifies whether absolute local paths are sensitive.
- Check: Session files that may be committed are considered.

Scenario: Idempotency covers both hook re-fire and manager state.
- Check: Repeated SessionStart events are safe in `$CLAUDE_ENV_FILE`.
- Check: `session.json.transcriptPath` remains correct when startup/resume/clear/compact re-fire the hook.

Scenario (adversarial): Hook failure leaves the workflow in a partially healthy state.
- Check: Failure cannot be masked by a runtime-set variable unrelated to the hook.
- Check: Rollback/failure mode is visible to the manager and user.

Coverage declarations:
- Privacy/data retention: applicable because transcript paths include a local home path and session artifacts are tracked in this repo.
- License/IP: no borrowed code yet; hook implementation details are not present in the idea.
- Cost: no paid-service cost.

## Per-scenario per-check results

Scenario: Shell/env-file safety.
- No: `idea.md:187-198` requires appending `export VAR=value` lines from JSON fields but does not state an escaping or round-trip requirement. Official docs say variables written to `CLAUDE_ENV_FILE` become available in later Bash commands (`https://code.claude.com/docs/en/hooks`, lines 883-914), so malformed export lines can affect every subsequent command.

Scenario: Privacy/data retention.
- No: `idea.md:139`, `idea.md:250-251`, and `idea.md:282-283` persist a top-level transcript path in `session.json`; the verified actual transcript path is `/home/jeonhh0061/.claude/projects/-playinganalytics-git-gobbi/bac669ad-4fec-40b5-8387-51ac57bc0d3d.jsonl`. `git ls-files .gobbi/projects/gobbi/sessions | head -20` returned tracked session artifacts, so session memory is not purely local scratch by default.

Scenario: Idempotency covers hook and manager state.
- Partial: `idea.md:205` covers append-only env-file idempotency. It does not specify how manager-stamped `session.json.transcriptPath` behaves after resume/clear/compact re-fire the hook; `idea.md:251` only says Configuration row 6 stamps it.

Scenario (adversarial): Partial health.
- No: Same failure captured in COD-USAGE-001. `idea.md:207` routes hook failure diagnosis to a warning that `idea.md:237` changes to `$CLAUDE_CODE_SESSION_ID` absence, which does not prove the hook ran.

## Typed findings

### COD-RISK-001

Type: design_flaw
Domain: security
Disposition: open
Confidence: 75
Severity: High
Evidence: `idea.md:187-198` specifies `export VAR=value` lines for JSON-derived values but has no shell-escaping or round-trip criterion. Since `$CLAUDE_ENV_FILE` is sourced for later Bash commands per official hooks docs lines 883-914, an unsafe value from `cwd`, `transcript_path`, or another hook field can corrupt the shell file or change subsequent command behavior.
FP-check: Not speculative beyond normal shell parsing rules; not linter-catchable without a targeted fixture; not out-of-scope because the hook script is in scope.

### COD-RISK-002

Type: assumption_risk
Domain: privacy
Disposition: open
Confidence: 100
Severity: High
Evidence: `idea.md:139`, `idea.md:250-251`, and `idea.md:282-283` persist top-level `transcriptPath`; the verified path is `/home/jeonhh0061/.claude/projects/-playinganalytics-git-gobbi/bac669ad-4fec-40b5-8387-51ac57bc0d3d.jsonl`; `git ls-files .gobbi/projects/gobbi/sessions | head -20` shows session artifacts are tracked. The artifact does not assess retention/scrubbing for absolute local transcript paths that can include usernames and machine-specific directory structure.
FP-check: Not out-of-scope because `transcriptPath` persistence is in scope; not speculative because the path and tracked-session evidence were observed.

### COD-RISK-003

Type: checklist_gap
Domain: regression
Disposition: open
Confidence: 75
Severity: Medium
Evidence: `idea.md:205` addresses duplicate env-file rows on startup/resume/clear/compact; `idea.md:251` says Configuration row 6 stamps `session.json.transcriptPath`; current `orchestration/SKILL.md:103` initializes `session.json` during Configuration. The artifact does not define the expected state when SessionStart re-fires after resume/clear/compact but the manager does not rerun the same initialization path.
FP-check: Not speculative about hook re-fire; official hooks docs lines 846-856 state SessionStart runs on startup/resume/clear/compact. Impact is Medium because exact session lifecycle behavior may still keep the same transcript path in some cases.

## Low-confidence appendix

None.
