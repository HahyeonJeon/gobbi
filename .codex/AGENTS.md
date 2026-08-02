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
source, never a user-level copy. Before agent work, load `principles`, applicable project rules, then `gobbi`
and the skills for the selected mode and current task.

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

`cowork` owns Cowork, including its own Git contract, evaluation policy, and session locations. It never
creates Workflow TODOs, phase receipts, RECORD-stage evidence, or a Workflow Hand-off. Its explicit Wrap-up
applies `memory` directly, commits durable updates or proves none are needed, then checks evaluation
freshness.

`workflow` owns Workflow. The native TODO list is its active route; phase receipts and committed evidence
rebuild that route after a context boundary. Configuration creates the isolated branch and worktree.
Ideation locks what and why, Planning orders tasks, Execution verifies and commits one task at a time, and
Wrap-up closes and hands off the durable result.

## Partner quality contract

`.gobbi/projects/gobbi/skills/gobbi/partner/SKILL.md` owns the whole partner system: both launch directions
and each round's preparation, launch, validation, and returned frozen content. In native Codex the partner is
Claude Code. Each mode owns its own evaluation commitment.

`.gobbi/projects/gobbi/skills/gobbi/SKILL.md` owns no partner mechanism itself. It holds the session to the
selected mode's commitment, pauses on an unavailable or invalid system, and requires the user's approval of
every finding's disposition.

## Delegation contract

`.gobbi/projects/gobbi/skills/gobbi/SKILL.md` owns manager authority, the `delegation`-built brief, the single
ordered writer chain, and the read-only limit on parallel work. Cowork adds its brief fields in the topic-loop
procedure; Workflow adds them in `.gobbi/projects/gobbi/skills/workflow/SKILL.md` Step 1.3. Confirm a
specialist's idle and addressable state before another assignment.

`.gobbi/projects/gobbi/skills/gobbi/agent-teams/SKILL.md` is the compact tool manual for enabling and using
Agent Teams in Claude Code. Cowork and Workflow own their assignment, reuse, acceptance, recovery, and writer
policies. Native Codex has no Agent Teams mechanism and uses the repo-local custom-agent roles below instead.

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
installed-cache behavior. The package has no lifecycle-hook component.

A Codex plugin install of Gobbi receives both manifests and no skills, because the Codex plugin installer
copies a plugin into its cache without following symlinks. This is an open Codex defect —
[openai/codex#24770](https://github.com/openai/codex/issues/24770), "Plugin install: support symlinks per the
cross-agent marketplace contract" — not a packaging error here, and `check-codex-plugin-smoke.sh` reports it
as a warning. Keep the single canonical source, and materialize it into the package only as the one generated
copy a guard proves byte-equal to that source. Any further duplication, and any hand edit of a generated file,
stays forbidden. Codex skill discovery does follow symlinks, so in this repository `.agents/skills/` resolves
and needs no install.

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

`.gobbi/projects/gobbi/skills/gobbi/SKILL.md` is the entry and the skill map. It owns the nine-skill system
load, the three-mode selection, the session-wide authority and evaluation commitments, and the index of every
canonical skill with what that skill owns.
