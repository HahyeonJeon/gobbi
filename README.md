<h1 align="center">gobbi</h1>
<p align="center">An open-source dual-system workflow for Claude Code and Codex</p>
<p align="center"><sub>고삐 (gobbi) — Korean for reins, the essential equipment for handling a horse</sub></p>

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/HahyeonJeon/gobbi" alt="License: MIT"></a>
</p>

---

Gobbi gives Claude Code and Codex one durable way to take work from an initial
conversation to a verified local result. The workflow keeps decisions with the
user, isolates implementation in a session worktree, and uses both systems at
every creation and review boundary.

## One workflow

Every Gobbi session follows the same five steps:

`Configuration → Ideation → Planning → Execution → Wrap-up`

Each productive step follows the same four stages:

`DISCUSSION → WORK → EVALUATION → RECORD`

Configuration performs a read-only preflight, shows the default settings once,
and asks whether to use them or customize them. Only after that decision does
Gobbi create its UUID, branch, worktree, and session record. Ideation locks what
and why, Planning creates ordered tasks, Execution produces focused verified
commits, and Wrap-up evaluates the promoted project tree and handoff before Git
finalization.

Every task uses this workflow. Runtime todo and task lists may reflect the
current cursor, but they do not replace the persisted record.

## Dual-system quality

Every WORK stage uses Claude and Codex independently:

1. Both systems receive the same neutral contract and create separate drafts.
2. Both drafts freeze before either system sees the other.
3. Claude reviews the Codex draft, and Codex reviews the Claude draft.
4. The active runtime specialist synthesizes the canonical candidate.
5. The user resolves every material open decision before evaluation begins.

Every EVALUATION uses two fresh independent evaluators, one from each system.
Each report covers Project, Structure, Performance, Aesthetics, Usage,
Consistency, Risk, and Overall, with a complete finding ledger, checklist, and
`PASS`, `REVISE`, or `FAIL` verdict. The aggregate takes the more severe result.

Gobbi never applies a finding before the user approves its disposition. A
material revision repeats complete dual-system WORK and EVALUATION. Cost does
not narrow dual-system Ideation, creation, or evaluation rigor. If either
system fails, Gobbi pauses with the exact failure; continuing without that
system requires an explicit waiver for the named step and iteration.

## Durable session records

New sessions use two versioned JSON contracts:

- `session.json` version 5 is the low-frequency lifecycle manifest. It stores
  the Gobbi UUID, runtime identities, Git identity, durable outcome, and all
  resolved settings under `session.json.settings`.
- `state.json` version 3 is the only active router. Its canonical cursor is
  `step`, `stage`, `iteration`, and the current Execution task when applicable.

The record tree is scaffolded inside the isolated worktree. Drafts,
cross-reviews, synthesis, decisions, evaluations, typed staging, and PASS-only
outputs have fixed owner-defined locations. The complete schema and tree
contract lives in the [Record map](.gobbi/projects/gobbi/skills/record/record-map.md).

Gobbi keeps its own UUID stable across runtime context boundaries and appends
newly observed runtime identities without renaming the session. Resume without
an explicit path is limited to exactly one unfinished session in the current
worktree; otherwise Gobbi asks for a session path or starts fresh.

## Worktrees, commits, and handoff

Each session owns one branch and one worktree. All ordered Execution tasks use
that worktree and produce focused verified local commits. Pushes and pull
requests depend on the resolved settings; merge always needs explicit user
authority. Unmerged work remains available at its exact branch and worktree
path.

Wrap-up promotes only typed staging entries. It writes one evaluated handoff
body to the session output and durable project notes, displays that body to the
user, and then appends a factual receipt for the Git actions that actually
happened.

## Use Gobbi

Use Gobbi in a trusted repository through its repo-local entry contracts, or
with the shared package enabled for Claude Code or Codex. Start a new runtime
context after enabling or updating the package, then ask Gobbi to handle a
concrete objective. On a fresh session, answer the defaults-or-customize
question; Gobbi owns record initialization after that decision.

This repository supplies runtime entry contracts at [AGENTS.md](AGENTS.md) for
Codex and [.claude/CLAUDE.md](.claude/CLAUDE.md) for Claude Code. Canonical
skills and agents live under `.gobbi/projects/gobbi/`; generated discovery and
package views are not independent sources.

The shared package at `plugins/gobbi/` carries both runtime manifests and
symlinked views of the canonical skills and agents. It is intentionally
hookless. Native Codex role wrappers remain repo-local under `.codex/agents/`.

Source-package topology and installed-cache behavior are separate checks. If
Codex omits a symlinked component while installing into its cache, report that
installer limitation and keep the source package symlinked; do not create a
second materialized copy.

The redesign is a breaking new-session contract, but the plugin manifests
deliberately remain at version `0.5.3`. Read the [migration guide](MIGRATION.md)
before resuming work created by an earlier Gobbi revision.

## Verify this checkout

These repository-owned checks validate the package without changing its source
topology:

```bash
bash scripts/sync-plugin-package.sh --check
bash scripts/test-sync-plugin-package.sh
bash scripts/check-codex-plugin-smoke.sh
```

When Claude Code is installed, its strict package validator is an additional
read-only gate:

```bash
claude plugin validate --strict plugins/gobbi
```

## Contract owners

- [Gobbi entry](.gobbi/projects/gobbi/skills/gobbi/SKILL.md) owns cold start
  and context-boundary bootstrap.
- [Workflow](.gobbi/projects/gobbi/skills/workflow/SKILL.md) owns
  Configuration, manager authority, and routing.
- [Dual-system WORK](.gobbi/projects/gobbi/skills/workflow/steps/dual-system-work.md)
  owns independent drafts, reciprocal review, synthesis, and open decisions.
- [Evaluation](.gobbi/projects/gobbi/skills/evaluation/SKILL.md) owns the two
  independent reviews and finding disposition gate.
- [Record](.gobbi/projects/gobbi/skills/record/SKILL.md) owns schemas, session
  evidence, typed staging, and PASS-only outputs.
- [Git](.gobbi/projects/gobbi/skills/git/SKILL.md) owns worktree isolation,
  local commits, publication, merge, cleanup, and recovery.

## License

[MIT](./LICENSE)
