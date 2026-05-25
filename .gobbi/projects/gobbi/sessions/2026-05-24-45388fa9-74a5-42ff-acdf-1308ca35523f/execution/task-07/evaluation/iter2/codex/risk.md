# Risk Evaluation - Task 07 Iter 2 - Codex

## Artifact Summary + Memory reads

Artifact: documentation remediation commit `6bf792a4639eac04e2fdcb19d817544304b925d5`.

Memory reads:
- `.codex/AGENTS.md`
- `.claude/CLAUDE.md`
- `.gobbi/projects/gobbi/skills/gobbi/SKILL.md`
- `.gobbi/projects/gobbi/skills/mistake/SKILL.md`
- `.gobbi/projects/gobbi/skills/wrap-up/SKILL.md`
- `.gobbi/projects/gobbi/mistakes/claude-evaluator-step4-only-vs-codex-whole-file-grep.md`
- `.gobbi/projects/gobbi/mistakes/evaluator-returned-verdict-inline-no-per-perspective-files.md`
- `.gobbi/projects/gobbi/mistakes/codex-wrapper-relative-path-wrong-session-write.md`

## Locked Frame (Stage 1)

Scenario: the fix does not widen process risk.
- No CLI command is reintroduced in `.codex/AGENTS.md`.
- No direct project-memory write instruction is reintroduced for working-loop agents.
- The Wrap-up assistant remains the only promotion mechanism.

Scenario: stale docs do not direct agents toward absent tools or wrong write surfaces.
- Entry/skill docs should not direct agents toward a nonexistent CLI surface.
- Workflow source-of-truth should remain the orchestration skill and markdown workflow docs.

Scenario: no destructive or irreversible operations.
- Commit is docs-only.
- No scripts, package files, hooks, or runtime code are changed.

## Per-scenario per-check results

- `.codex/AGENTS.md` process risk: PASS. The current text says mistake-candidate staging, Wrap-up assistant promotion, and "No CLI command."
- Direct write risk: PASS for `.codex/AGENTS.md`. The previous "record it as a mistake in `.gobbi/.../mistakes/`" instruction is gone.
- Destructive-operation risk: PASS. Commit changed only `.codex/AGENTS.md`.
- Stale-tool risk: REVISE, inherited from CONS-002. `gobbi/SKILL.md` still points at absent `packages/cli` internals and labels Configuration as CLI init / workflow init.

## Typed findings

### RISK-001 - Stale `gobbi/SKILL.md` CLI framing can steer future agents toward the wrong source of truth

Type: assumption_risk

Severity: High

Confidence: 85

Evidence:
- `.gobbi/projects/gobbi/skills/gobbi/SKILL.md:74` references `packages/cli/src/lib/config/settings-io.ts`.
- `.gobbi/projects/gobbi/skills/gobbi/SKILL.md:129` says `Configuration | CLI init | ... | workflow init`.
- `ls packages/cli` returned `absent`.
- `.codex/AGENTS.md:45` now says workflow is "markdown-driven, no CLI."

Why:
A future manager loading `gobbi/SKILL.md` as the session-bootstrap front door can still infer that Configuration is CLI-owned, even though the fixed entrypoints say the workflow is markdown/orchestration-skill driven. That keeps the original class of defect alive outside `.codex/AGENTS.md`.

Suggested-direction:
Remove the CLI-init wording and replace the absent package-path validation claim with the current validation responsibility. Then rerun the exact and conceptual tree-wide searches for `packages/cli`, `CLI init`, `workflow init`, `gobbi workflow init`, and `gobbi mistake promote`.

## Low-confidence appendix

None.
