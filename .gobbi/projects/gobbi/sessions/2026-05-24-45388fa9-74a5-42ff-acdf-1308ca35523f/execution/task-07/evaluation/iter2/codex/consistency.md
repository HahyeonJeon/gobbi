# Consistency Evaluation - Task 07 Iter 2 - Codex

## Artifact Summary + Memory reads

Artifact: commit `6bf792a4639eac04e2fdcb19d817544304b925d5`, evaluated as a documentation consistency remediation for stale Gobbi mistake-promotion and workflow-init references.

Memory reads:
- `.codex/AGENTS.md`
- `.claude/CLAUDE.md`
- `.gobbi/projects/gobbi/skills/gobbi/SKILL.md`
- `.gobbi/projects/gobbi/skills/mistake/SKILL.md`
- `.gobbi/projects/gobbi/skills/wrap-up/SKILL.md`
- real non-symlink files under `.claude`, `.codex`, `.gobbi/projects/gobbi/skills`, and `.agents`

## Locked Frame (Stage 1)

Scenario: `.codex/AGENTS.md` mirrors the fixed CLAUDE-side model.
- Line 45 uses the orchestration skill and `workflow/` sub-documents, not CLI/package-driven state.
- Line 82 uses mistake-candidates in session staging, Wrap-up assistant Layer 1 and Layer 2 promotion, no CLI command, and no context reload.
- Line 82 preserves the Codex-specific `.agents/skills/mistake/SKILL.md` load path.

Scenario: tree-wide stale command/package references are eradicated across real entry/skill docs.
- Exact `gobbi mistake promote` has no remaining hits.
- Exact `gobbi workflow init` and `packages/cli/src/specs` have no remaining hits.
- No real entry/skill doc should still assert that Configuration is a CLI init phase or that Gobbi depends on absent `packages/cli` internals for this workflow.

Scenario: write-directly-to-mistakes framing is removed.
- Positive instructions say stage mistake-candidates during working loops.
- Any remaining "write directly" language must be prohibitive or exception-scoped to Wrap-up, not an instruction for working-loop agents.

## Per-scenario per-check results

- `.codex/AGENTS.md` mirror: PASS. `.codex/AGENTS.md:45` mirrors `.claude/CLAUDE.md:13` on "Configuration plus the 5 productive steps", orchestration skill governance, workflow sub-documents, and "markdown-driven, no CLI". `.codex/AGENTS.md:82` mirrors `.claude/CLAUDE.md:50` on mistake-candidate staging plus Wrap-up assistant Layer 1/Layer 2 promotion, with the Codex-specific skill path preserved.
- Exact command eradication: PASS. `grep -rlE 'gobbi mistake promote' .claude/ .gobbi/projects/gobbi/skills/ .codex/ .agents/` returned `NONE REMAIN`. Exact `gobbi workflow init`, `packages/cli/src/specs`, and `Configuration as the CLI init phase` searches returned `NONE REMAIN`.
- Write-directly framing in `.codex/AGENTS.md`: PASS. The direct grep against `.codex/AGENTS.md` found no direct-write instruction.
- Tree-wide real-doc consistency: REVISE. Real non-symlink skill docs still contain adjacent stale CLI/package framing in `gobbi/SKILL.md`.

## Typed findings

### CONS-002 - Tree-wide stale CLI/package framing remains in `gobbi/SKILL.md`

Type: design_flaw

Severity: High

Confidence: 90

Evidence:
- `.gobbi/projects/gobbi/skills/gobbi/SKILL.md:74` asserts sanitization is pre-validated by a CLI settings-IO path at `packages/cli/src/lib/config/settings-io.ts`.
- `.gobbi/projects/gobbi/skills/gobbi/SKILL.md:129` labels Configuration as `CLI init` and describes the purpose as `workflow init`.
- `ls packages/cli` returned `absent`.
- `.codex/AGENTS.md:45` and `.claude/CLAUDE.md:13` both say the state machine is governed by the `orchestration` skill and its `workflow/` sub-documents, "markdown-driven, no CLI".

Why:
The requested remediation includes "tree-wide eradication" across real entry/skill docs. Even though the exact command `gobbi workflow init` is gone, `gobbi/SKILL.md` still carries the same stale concept: Configuration is a CLI-init phase and the skill depends on absent `packages/cli` internals. That contradicts the fixed entrypoint contract and leaves a real skill doc able to reintroduce the old model.

Suggested-direction:
Update `gobbi/SKILL.md` so Configuration is described as manager/orchestration-skill driven, not CLI-init driven. Remove or replace the `packages/cli/src/lib/config/settings-io.ts` assertion with the current settings validation source, or state the actual manual/session-settings validation boundary if there is no CLI package.

## Low-confidence appendix

The `packages/cli/src/` example in `.gobbi/projects/gobbi/skills/delegation/templates/assistant.md:14` may be a harmless illustrative question, but because `packages/cli` is absent it is still worth replacing in the same cleanup. I did not score it as a finding because it does not assert live workflow architecture.
