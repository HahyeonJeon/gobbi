# AGENTS.md

Gobbi is an open-source ClaudeX system for Claude Code and Codex. In this repository, Codex uses these
repo-local entry points:

- Skills: `.agents/skills/<skill-name>/SKILL.md`
- Custom agents: `.codex/agents/<role>.toml`
- Shared plugin package: `plugins/gobbi/`
- Codex plugin manifest: `plugins/gobbi/.codex-plugin/plugin.json`
- Claude Code plugin manifest: `plugins/gobbi/.claude-plugin/plugin.json`
- Canonical sources: `.gobbi/projects/gobbi/skills/` and `.gobbi/projects/gobbi/agents/`

Read this file at session start and every context boundary. Load Gobbi skills from the repo-local canonical
source, never a user-level copy. Before agent work, load `principles`, applicable project rules, and `mistake`;
then load `gobbi` and the skills for the selected mode and current task.

## Session mode contract

Gobbi offers three modes:

`General | Cowork | Workflow`

At every fresh Gobbi entry, present all three through the structured user-input control with no automatic
resolution. Task wording may support a recommendation but never records the selection. At a valid resume,
`/clear`, rewind, or runtime compaction, preserve the established mode; ask again only when mode evidence is
missing, ambiguous, or conflicting.

| Mode | Contract |
|---|---|
| **General** | Ordinary assistance from the Gobbi floor and task-specific skills. No orchestration owner or Gobbi session state. |
| **Cowork** | User-led fast implementation topics through optional Ideation, optional Planning, and verified Execution. Cowork creates or recovers one isolated worktree before editing, permits canonical shaping artifacts, and runs independent evaluation or memory-updating Wrap-up only on the user's call. |
| **Workflow** | Durable `Configuration → Ideation → Planning → Execution → Wrap-up` orchestration. Every productive step uses `DISCUSSION → WORK → EVALUATION → RECORD`. |

`cowork` owns Cowork. It is manifest-free and never creates Workflow `session.json`, `state.json`, RECORD,
typed staging, promotion manifests, or full Workflow Wrap-up output. Its explicit Wrap-up applies `memory`
directly, commits durable updates or proves none are needed, then checks evaluation freshness.

`workflow` owns Workflow. `state.json` is its active router and `session.json` its lifecycle manifest;
runtime task lists are projections. Configuration creates the isolated branch and worktree and initializes
records. Ideation locks what and why, Planning orders tasks, Execution verifies and commits one task at a
time, and Wrap-up promotes and hands off the durable result.

## Dual-system quality contract

Workflow retains its full dual-system protocol: independent Claude and Codex drafts, frozen inputs,
reciprocal cross-reviews, active-runtime synthesis, and user resolution before EVALUATION. Each EVALUATION
uses two fresh isolated evaluators covering Project, Structure, Performance, Aesthetics, Usage, Consistency,
Risk, and Overall. A material revision repeats the complete round.

Cowork does not run dual-system creation automatically. When the user calls `evaluate`, Cowork runs one fresh
Claude-and-Codex evaluation round over the frozen requested subject. If either required system is unavailable
or invalid, pause with the exact failure unless the user explicitly waives that named system for the round.

Never apply an evaluator finding before the user approves its disposition. General uses only the evaluation
explicitly required by its task owner.

## Delegation contract

The manager alone changes scope, makes user decisions, assigns specialists, accepts work, and authorizes
destructive or external actions. Cowork and Workflow both use
`.gobbi/projects/gobbi/skills/workflow/delegation.md` as the sole Gobbi specialist assignment shape.

Keep all worktree writes in one ordered writer chain. Parallel work is limited to independent read-only
analysis and fresh independent evaluation. After a specialist report, reread the promised artifact or commit,
reproduce verification, and confirm idle/addressable state before another assignment.

When Codex subagents are explicitly authorized, use the repo-local custom agents by role. Fresh briefs include
exact load directives because specialists do not inherit manager context.

| Role | Codex wrapper | Canonical prompt |
|---|---|---|
| `manager` | `.codex/agents/manager.toml` | `.gobbi/projects/gobbi/agents/manager.md` |
| `leader` | `.codex/agents/leader.toml` | `.gobbi/projects/gobbi/agents/leader.md` |
| `executor` | `.codex/agents/executor.toml` | `.gobbi/projects/gobbi/agents/executor.md` |
| `evaluator` | `.codex/agents/evaluator.toml` | `.gobbi/projects/gobbi/agents/evaluator.md` |
| `assistant` | `.codex/agents/assistant.toml` | `.gobbi/projects/gobbi/agents/assistant.md` |

## Plugin topology

The bounded package at `plugins/gobbi/` distributes canonical `skills` and `agents` through symlinks and
carries both runtime manifests. `.agents/plugins/marketplace.json` and
`.claude-plugin/marketplace.json` point to `./plugins/gobbi`. Native Codex custom-agent wrappers remain
repo-local and are not installed as plugin components.

Run `scripts/sync-plugin-package.sh --check` for read-only source-topology validation,
`scripts/test-sync-plugin-package.sh` for fixtures, and `scripts/check-codex-plugin-smoke.sh` for isolated
installed-cache behavior. The package has no lifecycle-hook component. If an installed cache omits a symlinked
component, report that limitation instead of materializing the source package.

## Principles

The full authority is `.gobbi/projects/gobbi/skills/principles/SKILL.md`:

1. Think and study before acting.
2. Build foundations before dependent work.
3. Design with the user and prior art.
4. Refine what, why, and how with the user.
5. Treat scope as a contract.
6. Start and finish with current documents.
7. Write plainly, briefly, and literally.
8. Fix root causes.
9. Check CRUD and 5W1H before editing.
10. Finish all agreed in-scope work.

## Navigate deeper

| Document | Owns |
|---|---|
| `.gobbi/projects/gobbi/skills/gobbi/SKILL.md` | Entry, three-mode selection, and skill routing |
| `.gobbi/projects/gobbi/skills/cowork/SKILL.md` | Manifest-free Cowork orchestration |
| `.gobbi/projects/gobbi/skills/workflow/SKILL.md` | Durable Workflow orchestration |
| `.gobbi/projects/gobbi/skills/workflow/delegation.md` | Shared Gobbi specialist assignment contract |
| `.gobbi/projects/gobbi/skills/evaluation/SKILL.md` | Independent evaluation method |
| `.gobbi/projects/gobbi/skills/git/SKILL.md` | Worktree, branch, commit, publication, and recovery |
| `.gobbi/projects/gobbi/skills/memory/SKILL.md` | Cowork direct memory updates and Workflow durable-memory method |
| `.gobbi/projects/gobbi/skills/record/SKILL.md` | Workflow session-record mechanics |
| `.gobbi/projects/gobbi/skills/wrap-up/SKILL.md` | Workflow promotion, handoff, and finalization |
