# CLAUDE.md

Gobbi is an open-source ClaudeX workflow for Claude Code and Codex.

Read this file at session start and every context boundary. Load the canonical Gobbi skills from `.gobbi/projects/gobbi/skills/`. Before agent work, load `principles`, the applicable project rules, and `mistake`; then load the skills for the current workflow step.

## Workflow contract

Every Gobbi session follows one mandatory workflow:

`Configuration → Ideation → Planning → Execution → Wrap-up`

Each productive step follows one loop:

`DISCUSSION → WORK → EVALUATION → RECORD`

`state.json` is the active workflow router. `session.json` is the low-frequency lifecycle manifest. Runtime tasks are scheduling projections only. Use `step`, `stage`, and `iteration` as the canonical routing vocabulary.

Configuration performs read-only preflight, resolves settings with the user, creates one isolated worktree and branch, and initializes the session record. Ideation locks what and why. Planning creates ordered tasks. Execution completes, verifies, and commits those tasks through one writer chain. Wrap-up evaluates the actual post-promotion tree and handoff, records the durable outcome, and performs only the configured Git finalization.

## Dual-system quality contract

Every WORK stage requires independent Claude and Codex drafts from the same neutral contract, frozen drafts, reciprocal cross-reviews, active-runtime synthesis, and user resolution of every material open decision before EVALUATION.

Every EVALUATION requires two fresh independent evaluators. Each covers Project, Structure, Performance, Aesthetics, Usage, Consistency, Risk, and Overall, and returns a complete finding ledger, checklist, and verdict. Never apply a finding before the user approves its disposition. Every material revision receives another complete dual-system WORK and EVALUATION iteration. Never reduce dual-system creation, Ideation, or evaluation rigor to save tokens.

If either system is unavailable or returns invalid output, pause and show the exact failure. Continue with one system only after the user explicitly waives the named system for that step and iteration.

## Agent Teams

Claude Code may lazily retain stable leader, executor, and assistant teammates while their identity, assignment, dependency chain, and addressability remain coherent. Evaluators are always fresh and outside the team. The manager alone assigns tasks, changes scope, makes user decisions, accepts work, and authorizes destructive actions. Parallelize independent read-only analysis; keep all worktree writes in one ordered writer chain.

Use the shared assignment skeleton in `workflow/delegation.md`. After a teammate reports, reread its promised artifact or commit and confirm it is idle and addressable before assigning more work. At a context boundary, verify durable state and teammate identity; replace and reprime any teammate that cannot be confirmed.

## Plugin topology

`plugins/gobbi/` is the bounded Claude Code and Codex package. It distributes canonical `skills` and `agents` and carries both runtime manifests. The package has no lifecycle-hook component. Keep Agent Teams enabled in `.claude/settings.json`.

Use `scripts/sync-plugin-package.sh --check` for read-only source-topology validation, `scripts/test-sync-plugin-package.sh` for fixture tests, and `scripts/check-codex-plugin-smoke.sh` for isolated Codex installed-cache behavior. Do not materialize the symlinked source package to compensate for an installed-cache limitation.

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
| `.gobbi/projects/gobbi/skills/gobbi/SKILL.md` | Entry, glossary, and skill routing |
| `.gobbi/projects/gobbi/skills/workflow/SKILL.md` | Manager authority, Configuration, and global invariants |
| `.gobbi/projects/gobbi/skills/workflow/steps/` | Thin step adapters and dual-system WORK mechanics |
| `.gobbi/projects/gobbi/skills/evaluation/SKILL.md` | Independent evaluation and finding disposition |
| `.gobbi/projects/gobbi/skills/record/SKILL.md` | Session-record mechanics and PASS-only artifacts |
| `.gobbi/projects/gobbi/skills/wrap-up/SKILL.md` | Promotion, evaluated handoff, and Git finalization |
