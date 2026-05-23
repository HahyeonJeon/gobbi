## Artifact Summary + Memory reads

Artifact: Ideation draft for `gobbi-orchestration-workflow-improvements`, iter1, at `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/rawdata/draft-iter1.md`. What: a 7-item scope contract A-G covering codex invocation, memorization discipline, wrap-up compliance, naming enforcement, and two `gobbi/SKILL.md` polish items. Why: prior-session orchestration failures lost staging output and exposed Codex path mistakes. How: documentation/skill edits plus evaluator coverage changes; no runtime CLI edits.

Memory reads: draft file above; user redirects at `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/staging/decisions/iter1-user-redirects.md`; discussion log at `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/rawdata/discussion-log.md`; prior idea at `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/artifacts/idea.md`; `AGENTS.md`; `.gobbi/projects/gobbi/rules/stub-redirect-format.md`; both named project mistakes; `evaluation/SKILL.md`; `ideation/evaluation.md`; referenced skill/plugin files; command checks for `codex --version`, `codex exec --help`, symlinks, missing `packages/cli/src`, missing `configuration*`, and prior-session staging/evaluation inventories.

W/W/H gate: What, Why, and How are present and specific enough to evaluate. Phase matches ideation.

## Locked Frame (Stage 1)

Scenario P1: Root-cause and witness claims are accurate enough to justify the scoped bundle.
- Check: each claimed empirical witness exists and says what the draft claims.
- Check: the root cause is not narrowed to one pathology if evidence shows multiple pathologies.
- Check: prior-session evidence is cited with enough precision for Planning to trust it.

Scenario P2: The Scope Contract remains inside the user-locked A-G scope.
- Check: all seven items A-G are represented.
- Check: out-of-scope 1-2 / 1-3 / 2-1 / 2-2 / 4-1 remain excluded.
- Check: post-WORK user redirects are applied faithfully.

Scenario P3 (adversarial): A required repository-facing surface is silently omitted because the draft evaluates only Claude-facing paths.
- Check: Codex-facing repo-local entry points in `AGENTS.md` are accounted for when creating a new skill.
- Check: source-of-truth and all expected mirrors/symlinks are either included or explicitly declared not applicable.

## Per-scenario per-check results

P1: Fails. The T2-T7 staging gap exists, but the draft overstates the prior-session evidence as "full" evaluation coverage. Tool check counted `T1/claude 8`, `T1/codex 0`, `T2/claude 5`, `T2/codex 8`, `T3/claude 2`, `T3/codex 1`, `T4/claude 1`, `T4/codex 1`, `T5/claude 1`, `T5/codex 8`, `T6/claude 1`, `T6/codex 1`, `T7/claude 1`, `T7/codex 1`.

P2: Passes. The draft reflects A-G and the explicit deferrals. User redirects are applied in the locked decisions at draft lines 61-65 and Design A/D lines 340-355 and 416-432, matching redirect lines 19-29 and 33-53.

P3: Fails. The draft includes `.gobbi/projects/gobbi/skills/codex/SKILL.md` and `.claude/skills/codex/SKILL.md`, but no `.agents/skills/codex` surface.

## Typed findings

### COD-PROJ-001 - Prior-session evaluation witness is overstated

- Type: `assumption_risk`
- Domain: `process`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: Draft lines 97, 169, 193, and 504 claim T2-T7 had "full `evaluation/iter1/{claude,codex}/` content" or ">=7 per-perspective + overall files each." Tool verification found only 39 execution evaluation files total across T1-T7, with T3-T7 mostly one or two files per task/system. The same command also confirmed T2-T7 staging had zero files, so the staging gap is real but the "full evaluation existed" premise is false.
- Observation vs hypothesis: Observation. The file counts came from `find .../execution -path '*/evaluation/iter1/*/*.md'` and per-task/system counts.
- Why-it-matters: The draft's root-cause frame says evaluations ran fully and only MEMORIZATION failed. Actual evidence also shows incomplete or irregular evaluation output, so the scoped fixes may leave part of the prior-session failure mode unexplained.
- Suggested-direction: Re-check the provenance claim before Planning consumes it; no implementation fix proposed here.

### COD-PROJ-002 - Codex-facing `.agents/skills` exposure is missing from the new skill contract

- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: Draft lines 36, 69, 308-310, 334, and 386 specify source `.gobbi/projects/gobbi/skills/codex/SKILL.md` plus `.claude/skills/codex/SKILL.md`. `AGENTS.md` lines 3-13 and 17-25 define Codex repo-local entry points, including `.agents/skills/<skill-name>/SKILL.md`, and say Gobbi skills must be loaded from `.agents/skills`. Existing `.agents/skills/*` entries are symlink folders to `.gobbi/projects/gobbi/skills/*`; no `.agents/skills/codex` exists yet.
- Observation vs hypothesis: Observation for path omission and current symlink layout; hypothesis only for downstream breakage mode.
- Why-it-matters: The work is explicitly about Codex best practices, but the Scope Contract only creates the Claude-facing `.claude` mirror. A future Codex agent following repo-local instructions may not see or load the new skill through the expected `.agents/skills` path.
- Suggested-direction: Resolve the exposure contract before accepting the idea as complete; no implementation fix proposed here.

## Low-confidence appendix

No suppressed Project findings.

Verdict: REVISE
