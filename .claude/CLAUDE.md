# CLAUDE.md

Gobbi is an open-source ClaudeX system for Claude Code and Codex.

Read this file at session start and every context boundary. Load canonical skills from
`.gobbi/projects/gobbi/skills/`. Before agent work, load `principles`, applicable project rules, and
`mistake`; then load `gobbi` and the skills for the selected mode and current task.

## Session mode contract

Gobbi offers three modes:

`General | Cowork | Workflow`

At every fresh Gobbi entry, present all three through `AskUserQuestion` with no automatic resolution. Task
wording may support a recommendation but never records the selection. At a valid resume, `/clear`, rewind, or
runtime compaction, preserve the established mode; ask again only when mode evidence is missing, ambiguous, or
conflicting.

| Mode | Contract |
|---|---|
| **General** | Ordinary assistance from the Gobbi floor and task-specific skills. No orchestration owner or Gobbi session state. |
| **Cowork** | User-led fast implementation topics through optional Ideation, optional Planning, and verified Execution. Cowork creates or recovers one isolated worktree before editing, permits canonical shaping artifacts, and runs independent evaluation or closure only on the user's call. |
| **Workflow** | Durable `Configuration → Ideation → Planning → Execution → Wrap-up` orchestration. Every productive step uses `DISCUSSION → WORK → EVALUATION → RECORD`. |

Cowork is manifest-free and never creates Workflow records or promotion output. Workflow keeps `state.json`
as its active router and `session.json` as its lifecycle manifest; runtime tasks remain scheduling
projections.

## Dual-system quality contract

Workflow retains independent Claude and Codex drafts, frozen inputs, reciprocal cross-reviews, active-runtime
synthesis, and user resolution before EVALUATION. Every Workflow EVALUATION uses two fresh isolated
evaluators covering Project, Structure, Performance, Aesthetics, Usage, Consistency, Risk, and Overall.

Cowork does not run dual-system creation automatically. An explicit user `evaluate` call authorizes one fresh
Claude-and-Codex evaluation round over the frozen requested subject. If either required system is unavailable
or invalid, pause with the exact failure unless the user explicitly waives that named system for the round.

Never apply an evaluator finding before the user approves its disposition. General uses only the evaluation
explicitly required by its task owner.

## Agent Teams

The manager alone assigns tasks, changes scope, makes user decisions, accepts work, and authorizes destructive
or external actions. Cowork and Workflow both use `workflow/delegation.md` as the sole Gobbi specialist
assignment shape.

Claude Code may retain stable leader, executor, and assistant teammates while identity, assignment,
dependency chain, and addressability remain coherent. Evaluators are always fresh and outside the team.
Parallelize independent read-only analysis; keep worktree writes in one ordered writer chain. After a
teammate reports, reread its artifact or commit, reproduce verification, and confirm idle/addressable state
before assigning more work.

## Plugin topology

`plugins/gobbi/` is the bounded Claude Code and Codex package. It distributes canonical `skills` and `agents`,
carries both runtime manifests, and has no lifecycle-hook component. Keep Agent Teams enabled in
`.claude/settings.json`.

Use `scripts/sync-plugin-package.sh --check` for read-only source-topology validation,
`scripts/test-sync-plugin-package.sh` for fixtures, and `scripts/check-codex-plugin-smoke.sh` for isolated
Codex installed-cache behavior. Do not materialize the symlinked source package to compensate for an
installed-cache limitation.

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
| `.gobbi/projects/gobbi/skills/record/SKILL.md` | Workflow session-record mechanics |
| `.gobbi/projects/gobbi/skills/wrap-up/SKILL.md` | Workflow promotion, handoff, and finalization |
