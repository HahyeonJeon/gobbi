# CLAUDE.md

Gobbi is an open-source ClaudeX system for Claude Code and Codex.

Read this file at session start and every context boundary. Load canonical skills from
`.gobbi/projects/gobbi/skills/`. Before agent work, load `principles`, applicable project rules, and
then load `gobbi` and the skills for the selected mode and current task.

## Session mode contract

Gobbi offers three modes:

`General | Cowork | Workflow`

At every fresh Gobbi entry, present all three through `AskUserQuestion` with no automatic resolution. Task
wording may support a recommendation but never records the selection. At a valid resume, `/clear`, rewind, or
runtime compaction, preserve the established mode; ask again only when mode evidence is missing, ambiguous, or
conflicting.

| Mode | Contract |
|---|---|
| **General** | Ordinary assistance from the Principles foundation and task-specific skills. No orchestration owner or Gobbi session state. |
| **Cowork** | User-led fast implementation topics through optional Ideation, optional Planning, and verified Execution. Cowork creates or recovers one isolated worktree before editing, permits canonical shaping artifacts, and runs independent evaluation or memory-updating Wrap-up only on the user's call. |
| **Workflow** | Durable `Configuration → Ideation → Planning → Execution → Wrap-up` orchestration. Every productive step uses `DISCUSSION → WORK → EVALUATION → RECORD`. |

Cowork owns its own native TODO route, Git contract, evaluation policy, and session locations, and never
creates Workflow-formatted TODOs, phase receipts, RECORD-stage evidence, or a Workflow Hand-off. Its explicit
Wrap-up applies `memory` directly, commits durable updates or proves none are needed, then checks evaluation
freshness. Workflow uses the native TODO list as its active route; phase receipts and committed evidence
rebuild that route after a context boundary.

Gobbi entry loads Principles first and Discussion only when it must write its mode or partner question.
Cowork and Workflow then load Delegation, Discussion, Git, Record, and Memory at owner entry; their phase
owners load Ideation, Planning, and Wrap-up when those phases start.

## Partner quality contract

`.gobbi/projects/gobbi/skills/gobbi/partner/SKILL.md` owns the whole partner system: both launch directions
and each round's preparation, launch, validation, and returned frozen content. In Claude Code the partner is
Codex. Each mode owns its own evaluation commitment.

`.gobbi/projects/gobbi/skills/gobbi/SKILL.md` owns no partner mechanism itself. It holds the session to the
selected mode's commitment, pauses on an unavailable or invalid system, and requires the user's approval of
every finding's disposition.

## Agent Teams

`.gobbi/projects/gobbi/skills/gobbi/SKILL.md` owns manager authority, the `delegation`-built brief, the single
ordered writer chain, and the read-only limit on parallel work. Cowork adds its brief fields in the topic-loop
procedure; Workflow adds them in Workflow Step 1.3.

`.gobbi/projects/gobbi/skills/gobbi/agent-teams/SKILL.md` owns the persistent-teammate lifecycle — preflight,
spawn, assignment, reuse, replacement, and close — and each mode supplies the adapter inputs it consumes.
Claude Code may retain stable leader, executor, and assistant teammates while identity, assignment,
dependency chain, and addressability remain coherent. Evaluators are always fresh and outside the team.
Confirm a teammate's idle and addressable state before assigning more work.

## Plugin topology

`plugins/gobbi/` is the bounded Claude Code and Codex package. It distributes canonical `skills` and `agents`,
carries both runtime manifests, and has no lifecycle-hook component. Keep Agent Teams enabled in
`.claude/settings.json`.

Use `scripts/sync-plugin-package.sh --check` for read-only source-topology validation,
`scripts/test-sync-plugin-package.sh` for fixtures, and `scripts/check-codex-plugin-smoke.sh` for isolated
Codex installed-cache behavior. Materialize the source into the package only as the one generated copy a guard
proves byte-equal to its canonical owner. Any further duplication, and any hand edit of a generated file,
stays forbidden.

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

`.gobbi/projects/gobbi/skills/gobbi/SKILL.md` is the entry and the skill map. It owns the Principles-first
entry load, the three-mode selection, the session-wide authority and evaluation commitments, and the index of
every canonical skill with what that skill owns.
