# Overall Evaluation - Task 07 Iter 2 - Codex

## Artifact Summary + Memory reads

Artifact: commit `6bf792a4639eac04e2fdcb19d817544304b925d5`, which claims to mirror the mistake-promotion fix onto `.codex/AGENTS.md` and eradicate the stale CLI/package references tree-wide.

Fresh verification performed:
- `git show --stat 6bf792a`
- `git diff --name-only 6bf792a~1 6bf792a`
- direct stale-pattern grep over `.codex/AGENTS.md`
- direct Layer/Wrap-up/path grep over `.codex/AGENTS.md`
- exact `gobbi mistake promote` grep over `.claude/`, `.gobbi/projects/gobbi/skills/`, `.codex/`, `.agents/`
- `ls packages/cli`
- real non-symlink entry/skill doc grep under `.claude`, `.codex`, `.gobbi/projects/gobbi/skills`, `.agents`
- comparison of `.codex/AGENTS.md` against `.claude/CLAUDE.md:13`, `.claude/CLAUDE.md:48`, and `.claude/CLAUDE.md:50`

## Locked Frame (Stage 1)

Overall pass criteria:
- Original `.codex/AGENTS.md` CONS-001 is fixed.
- No collateral changes in `6bf792a`.
- Tree-wide real entry/skill docs do not retain stale command/package/workflow-init guidance.
- Mistake promotion remains the two-layer Wrap-up assistant model with no CLI.

## Per-scenario per-check results

- Original `.codex/AGENTS.md` defect: PASS. No `gobbi mistake promote`, `packages/cli`, `gobbi workflow init`, direct-write wording, or old session-end CLI instruction remains in `.codex/AGENTS.md`.
- Two-layer model: PASS in `.codex/AGENTS.md`. Line 82 keeps mistake-candidates in session staging, Wrap-up assistant Layer 1 project-memory promotion, Wrap-up assistant Layer-2 workspace-level promotion, and "No CLI command."
- Codex-specific path: PASS. `.codex/AGENTS.md:82` retains `.agents/skills/mistake/SKILL.md`.
- Commit collateral: PASS. `6bf792a` changes exactly `.codex/AGENTS.md`.
- Tree-wide exact command eradication: PASS for `gobbi mistake promote` and exact `gobbi workflow init`.
- Tree-wide conceptual eradication: REVISE. `gobbi/SKILL.md` still contains stale CLI/package framing.

## Typed findings

### OVERALL-001 - Tree-wide eradication is incomplete despite `.codex/AGENTS.md` being fixed

Type: design_flaw

Severity: High

Confidence: 90

Evidence:
- `.codex/AGENTS.md:45` and `.codex/AGENTS.md:82` are fixed and mirror the CLAUDE-side model.
- `git diff --name-only 6bf792a~1 6bf792a` returns exactly `.codex/AGENTS.md`.
- Real skill doc `.gobbi/projects/gobbi/skills/gobbi/SKILL.md:74` still references `packages/cli/src/lib/config/settings-io.ts`, while `ls packages/cli` returned `absent`.
- Real skill doc `.gobbi/projects/gobbi/skills/gobbi/SKILL.md:129` still labels Configuration as `CLI init` and describes it as `workflow init`.

Why:
The commit successfully remediates the Codex-side entrypoint, but the requested acceptance scope also includes tree-wide eradication across real entry/skill docs. A session-bootstrap skill that still points at absent CLI internals and labels Configuration as CLI init can continue teaching the stale model.

Suggested-direction:
Revise `gobbi/SKILL.md` line 74 and line 129 to match the orchestration-skill, markdown-driven model already present in `.claude/CLAUDE.md` and `.codex/AGENTS.md`. Optionally replace the illustrative `packages/cli/src/` example in `delegation/templates/assistant.md` to avoid retaining a dead path in examples.

## Low-confidence appendix

None.

VERDICT: REVISE
CONS-001: resolved for `.codex/AGENTS.md`; not fully resolved tree-wide because `gobbi/SKILL.md` still retains stale CLI/package workflow framing.
