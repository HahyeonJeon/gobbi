# Project Evaluation - Task 07 Iter 2 - Codex

## Artifact Summary + Memory reads

Artifact: commit `6bf792a4639eac04e2fdcb19d817544304b925d5`, claimed to mirror the CLAUDE.md mistake-promotion fix into `.codex/AGENTS.md`.

Scope contract used for this pass:
- Confirm `.codex/AGENTS.md` no longer contains `gobbi mistake promote`, `packages/cli`, `gobbi workflow init`, direct-write-to-mistakes framing, or related stale entrypoint text.
- Confirm the two-layer Wrap-up assistant model remains.
- Confirm only `.codex/AGENTS.md` changed in `6bf792a`.
- Regression-check real, non-symlink entry/skill docs for the same stale defect.

Memory reads:
- `.agents/skills/principles/SKILL.md`
- `.agents/skills/mistake/SKILL.md`
- `.agents/skills/evaluation/SKILL.md`
- `.agents/skills/execution/evaluation.md`
- `.gobbi/projects/gobbi/mistakes/*.md`
- `.gobbi/projects/gobbi/rules/*.md`
- `.codex/AGENTS.md`
- `.claude/CLAUDE.md`
- `.gobbi/projects/gobbi/skills/gobbi/SKILL.md`
- `.gobbi/projects/gobbi/skills/mistake/SKILL.md`
- `.gobbi/projects/gobbi/skills/wrap-up/SKILL.md`

## Locked Frame (Stage 1)

Scenario: the commit matches the task scope.
- `git diff --name-only 6bf792a~1 6bf792a` returns exactly `.codex/AGENTS.md`.
- `git show --stat 6bf792a` shows one file changed.

Scenario: the original Codex entrypoint defect is fixed.
- `.codex/AGENTS.md` lacks the stale CLI command/package refs.
- `.codex/AGENTS.md` keeps the Codex-specific `.agents/skills/mistake/SKILL.md` load path.
- `.codex/AGENTS.md` says working corrections become mistake-candidates in session staging.

Scenario: no unrelated file was changed in the remediation commit.
- Commit stats and name-only diff show no collateral.

## Per-scenario per-check results

- Commit scope: PASS. `git show --stat 6bf792a` reports `.codex/AGENTS.md | 6 +++---`; `git diff --name-only 6bf792a~1 6bf792a` returns only `.codex/AGENTS.md`.
- Original Codex entrypoint fix: PASS. The direct grep over `.codex/AGENTS.md` for `gobbi mistake promote|packages/cli|gobbi workflow init|record it as a mistake in|directly to .*mistakes` returned no matches.
- Load-path preservation: PASS. `.codex/AGENTS.md:82` retains `.agents/skills/mistake/SKILL.md`.
- No collateral in commit: PASS.

## Typed findings

No Project-perspective findings.

## Low-confidence appendix

None.
