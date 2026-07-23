# AGENTS.md

Gobbi is an open-source ClaudeX workflow for Claude Code and Codex. In this repository, Codex uses these repo-local entry points:

- Skills: `.agents/skills/<skill-name>/SKILL.md`
- Custom agents: `.codex/agents/<role>.toml`
- Shared plugin package: `plugins/gobbi/`
- Codex plugin manifest: `plugins/gobbi/.codex-plugin/plugin.json`
- Claude Code plugin manifest: `plugins/gobbi/.claude-plugin/plugin.json`
- Canonical sources: `.gobbi/projects/gobbi/skills/` and `.gobbi/projects/gobbi/agents/`

Read this file at session start and every context boundary. Load Gobbi skills from the repo-local canonical source, never from a user-level copy. Before agent work, load `principles`, the applicable project rules, and `mistake`; then load the skills for the current workflow step.

## Workflow contract

Every Gobbi session follows one mandatory workflow:

`Configuration → Ideation → Planning → Execution → Wrap-up`

Each productive step follows one loop:

`DISCUSSION → WORK → EVALUATION → RECORD`

`state.json` is the active router. `session.json` is the low-frequency lifecycle manifest. Runtime todo and task lists are projections, not another source of truth. Use `step`, `stage`, and `iteration` as the canonical routing vocabulary.

Configuration performs read-only preflight, resolves settings with the user, creates one session worktree and branch, and initializes the session record. Resume only from an explicit session in the current worktree. A resumed session reuses its resolved settings unless the user requests a change.

Ideation locks what and why. Planning turns that scope into ordered tasks. Execution completes, verifies, and commits one task at a time in the isolated worktree. Wrap-up evaluates promotion and handoff work, records the durable outcome, and performs only the configured Git finalization.

## Dual-system quality contract

Every WORK stage uses the same dual-system protocol:

1. Claude and Codex independently create system-labeled drafts from the same neutral contract.
2. Freeze and validate both drafts before either system sees the other.
3. Claude reviews the Codex draft and Codex reviews the Claude draft.
4. The active runtime specialist synthesizes the canonical candidate.
5. Record and resolve every material open decision with the user before EVALUATION.

Every EVALUATION uses two fresh independent evaluators, one Claude and one Codex. Each report covers Project, Structure, Performance, Aesthetics, Usage, Consistency, Risk, and Overall, with a complete finding ledger, checklist, and `PASS`, `REVISE`, or `FAIL` verdict. The aggregate uses the more severe verdict. Never apply a finding before the user approves its disposition. A material revision receives another complete dual-system WORK and EVALUATION iteration. Never reduce dual-system creation, Ideation, or evaluation rigor to save tokens.

If either system is unavailable or returns invalid output, pause and show the exact failure. A single-system continuation requires the user's explicit waiver for that named step and iteration.

## Delegation contract

The manager alone changes scope, makes user decisions, assigns runtime tasks, accepts work, and authorizes destructive actions. Use the shared assignment skeleton in `orchestration/delegation.md` as the sole assignment shape.

Claude Code may keep stable leader, executor, and assistant teammates when identity, assignment, dependency chain, and addressability remain coherent. Evaluators are always fresh and outside the team. Codex uses its native specialist mechanism. All worktree writes stay in one ordered writer chain; parallel work is limited to independent read-only analysis.

After a teammate report, reread the promised artifact or commit and confirm the teammate is idle and addressable before sending another assignment. Do not infer completion from an idle notice or a lagging runtime task status.

When Codex subagents are explicitly authorized, use the repo-local custom agents by role. Every fresh brief must include explicit load directives because fresh agents do not inherit loaded skills.

| Role | Codex wrapper | Canonical prompt |
|---|---|---|
| `manager` | `.codex/agents/manager.toml` | `.gobbi/projects/gobbi/agents/manager.md` |
| `leader` | `.codex/agents/leader.toml` | `.gobbi/projects/gobbi/agents/leader.md` |
| `executor` | `.codex/agents/executor.toml` | `.gobbi/projects/gobbi/agents/executor.md` |
| `evaluator` | `.codex/agents/evaluator.toml` | `.gobbi/projects/gobbi/agents/evaluator.md` |
| `assistant` | `.codex/agents/assistant.toml` | `.gobbi/projects/gobbi/agents/assistant.md` |

## Plugin topology

The bounded package at `plugins/gobbi/` distributes canonical `skills` and `agents` through symlinks. It carries both runtime manifests. `.agents/plugins/marketplace.json` and `.claude-plugin/marketplace.json` point to `./plugins/gobbi` using their runtime-specific schemas. Native Codex custom-agent wrappers remain repo-local and are not installed as plugin components.

Run `scripts/sync-plugin-package.sh --check` to validate canonical topology without mutation. Run `scripts/sync-plugin-package.sh` only when intentionally repairing discovery mirrors. Run `scripts/test-sync-plugin-package.sh` for fixture coverage and `scripts/check-codex-plugin-smoke.sh` for isolated installed-cache behavior. The package has no lifecycle-hook component.

Codex source-package behavior and installed-cache behavior are separate. If the installed cache omits a symlinked component directory, report the Codex installation limitation; do not materialize the source package to work around it.

## Principles

The full authority is `.gobbi/projects/gobbi/skills/principles/SKILL.md`. Its enforceable summary is:

1. Think and study before acting.
2. Build foundations before dependent work.
3. Design with the user and prior art.
4. Refine the task until what, why, and how are concrete.
5. Treat scope as a contract with the user.
6. Start with documents and finish with current documents.
7. Write plainly, briefly, and literally.
8. Fix root causes, not symptoms.
9. Check CRUD and 5W1H before editing.
10. Finish all agreed in-scope work.

## Navigate deeper

| Document | Owns |
|---|---|
| `.gobbi/projects/gobbi/skills/gobbi/SKILL.md` | Entry, glossary, and skill routing |
| `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` | Manager authority, Configuration, and global invariants |
| `.gobbi/projects/gobbi/skills/orchestration/workflow/` | Thin step adapters and dual-system WORK mechanics |
| `.gobbi/projects/gobbi/skills/evaluation/SKILL.md` | General independent evaluation method and evidence-derived verdict |
| `.gobbi/projects/gobbi/skills/record/SKILL.md` | Session-record mechanics and PASS-only artifacts |
| `.gobbi/projects/gobbi/skills/memory/SKILL.md` | Typed staging and durable promotion |
| `.gobbi/projects/gobbi/skills/wrap-up/SKILL.md` | Promotion, handoff, and finalization |
