# Risk Perspective

Verdict: REVISE

## Artifact Summary + Memory reads

Stage 0 W/W/H: present and evaluable. This perspective checks privacy, shell/env-file safety, failure visibility, reversibility, and whether the iter2 privacy remediation creates a new leak.

Memory reads:
- `.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/artifacts/idea.md`
- `.agents/skills/evaluation/SKILL.md`
- `.agents/skills/ideation/evaluation.md`
- `.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/evaluation/iter1/codex/risk.md`
- `.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/evaluation/iter1/codex/overall.md`
- `.gitignore`
- `.gobbi/projects/gobbi/mistakes/README.md`
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md`

Tool checks:
- `rg -n '/home/|/Users/|/var/folders|C:\\Users' idea.md` returned one hit at `idea.md:293`.
- `git status --short idea.md` reported the artifact as untracked now.
- `git ls-files '.gobbi/projects/gobbi/sessions/**' | head -20` returned tracked historical session artifacts.
- `.gitignore:8-20` ignores `.gobbi/*` but re-includes `.gobbi/projects/`, with only `.gobbi/projects/*/rawdata/`, settings, worktrees, and tmp ignored.

## Locked Frame (Stage 1)

Scenario: The privacy remediation removes machine/user-specific path disclosure from persisted session data.
- Check: `session.json.transcriptPath` is specified in tilde form.
- Check: The artifact itself does not introduce an equivalent absolute path disclosure.

Scenario: Hook env-file writes do not create shell injection or env corruption risk.
- Check: JSON-derived values are shell-safe or verified with round-trip tests.

Scenario: Hook failure and runtime failure are distinguishable.
- Check: CCSI absence and transcript-path absence produce different warnings.

Scenario (adversarial): A privacy fix is documented using a real local path and becomes the new leak.
- Check: Examples use generic placeholders where the purpose is to avoid `$HOME` disclosure.

Coverage declarations:
- Privacy/data retention: applicable because transcript paths include local user and project path details.
- License/IP: no copied code appears in the artifact.
- Cost: no paid service is introduced.

## Per-scenario per-check results

Privacy:
- Yes: P6 stores the actual field in tilde form and tells consumers to tilde-expand on read (`idea.md:293`).
- Yes: Exit criteria and success criteria also require tilde-form storage (`idea.md:124`, `idea.md:327`).
- No: The explanatory P6 text includes a literal `/home/jeonhh0061/...` path in the artifact body (`idea.md:293`).

Shell/env-file safety:
- No: The hook writes `export VAR=value` rows from JSON fields (`idea.md:210-218`) without a shell-escaping or round-trip verification criterion.

Failure visibility:
- Yes: Gate 1 and Gate 2 are separate, and Gate 2 checks both env presence and file existence (`idea.md:239-247`).

## Typed findings

### COD-RISK-ITER2-001

Type: assumption_risk
Domain: privacy
Disposition: open
Confidence: 75
Severity: High
Evidence: The privacy remediation says absolute `$HOME` paths must not leak into git-tracked `session.json`, but the P6 explanation contains a literal local path example `/home/jeonhh0061/.claude/projects/-playinganalytics-git-gobbi/{session-id}.jsonl` (`idea.md:293`). `rg` confirmed this is the artifact's only absolute-home hit. The current file is untracked, but `.gitignore:8-20` re-includes `.gobbi/projects/`, and `git ls-files '.gobbi/projects/gobbi/sessions/**' | head -20` shows historical session artifacts are tracked.
FP-check: Not style; not speculative about the literal path; confidence is 75 rather than 100 because the current artifact is not yet tracked.

### COD-RISK-ITER2-002

Type: design_flaw
Domain: security
Disposition: open
Confidence: 75
Severity: High
Evidence: The hook appends `export VAR=value` lines for stdin-derived values (`idea.md:210-218`), and the success criteria verify names/presence but not shell-safe encoding or value round-trip (`idea.md:323-325`). This carries forward the iter1 `COD-RISK-001` shell/env-file corruption risk.
FP-check: Not out-of-scope because `.claude/hooks/session-start.sh` is in scope (`idea.md:178`, `idea.md:190`); not style; not linter-catchable without a targeted hook-value fixture.

## Low-confidence appendix

None.
