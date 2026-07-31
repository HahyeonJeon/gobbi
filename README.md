<h1 align="center">gobbi</h1>
<p align="center">Open-source orchestration for Claude Code and Codex</p>
<p align="center"><sub>고삐 (gobbi) — Korean for reins, the essential equipment for handling a horse</sub></p>

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/HahyeonJeon/gobbi" alt="License: MIT"></a>
</p>

---

Gobbi lets the user choose how much orchestration a task needs. General stays lightweight, Cowork delivers
fast implementation cycles one topic at a time, and Workflow provides a durable, recorded, dual-system
lifecycle.

## Three modes

Every fresh Gobbi entry asks the user to select:

`General | Cowork | Workflow`

The prompt has no automatic selection. Gobbi may recommend a mode from the request, but the user chooses.
A valid resume or context boundary preserves its established mode; missing or conflicting evidence reopens
the three-way choice.

| Mode | Best for | Operating model |
|---|---|---|
| **General** | Ordinary questions and bounded tasks that do not need Gobbi orchestration. | Use the Gobbi behavioral floor and task-specific skills without an orchestration owner or Gobbi session state. |
| **Cowork** | Fast, collaborative implementation where the user supplies topics step by step. | Repeat user topic → optional Ideation → optional Planning → verified Execution. Evaluate or run memory-updating Wrap-up only when the user calls for it. |
| **Workflow** | Large or durable work that needs complete recorded evidence and independent dual-system quality gates. | Run `Configuration → Ideation → Planning → Execution → Wrap-up`; every productive step runs `DISCUSSION → WORK → EVALUATION → RECORD`. |

## Cowork

Cowork is a user-led Gobbi orchestration mode for short implementation cycles. The manager selects Direct,
Light, or Structured delivery from the topic's uncertainty, dependencies, breadth, risk, and reversibility:

- Direct skips Ideation and Planning when one clear, low-risk implementation unit is ready.
- Light runs only the optional shaping stage the topic needs.
- Structured normally runs Ideation, Planning, then ordered Execution.

Selected Ideation and Planning stages use the canonical skills and may create their canonical artifacts.
Leaders commit shaping artifacts; executors commit implementation units. Every stage self-reviews or
self-verifies, and one ordered writer chain keeps dependent work on verified commits.

Cowork creates or recovers one isolated branch and worktree before the first edit. It is manifest-free: it
does not create Workflow `session.json`, `state.json`, RECORD, typed staging, promotion manifests, or full
Workflow Wrap-up output. A user `evaluate` call runs one fresh Claude-and-Codex review round over the frozen
subject.

A user `wrap up` call applies the canonical Memory operation directly. An assistant reviews durable future
value, loads the applicable Memory category skills, commits verified memory updates or proves that no update
is needed, and then checks whether evaluation covers the resulting head. Cowork returns the retained local
handoff only after the user chooses evaluation or self-verified closure for any uncovered commits.

## Workflow

Workflow preserves Gobbi's full durable contract:

`Configuration → Ideation → Planning → Execution → Wrap-up`

Each productive step follows:

`DISCUSSION → WORK → EVALUATION → RECORD`

Configuration performs a read-only preflight, resolves settings, and then creates the UUID, branch, worktree,
and session record. Ideation locks what and why. Planning creates ordered tasks. Execution produces focused
verified commits. Wrap-up evaluates promotion and handoff work and performs only the configured Git
finalization.

### Dual-system quality

Every Workflow WORK stage uses Claude and Codex independently:

1. Both systems receive the same neutral contract and create separate drafts.
2. Both drafts freeze before either system sees the other.
3. Claude reviews the Codex draft, and Codex reviews the Claude draft.
4. The active runtime specialist synthesizes the canonical candidate.
5. The user resolves every material open decision before evaluation.

Every Workflow EVALUATION uses two fresh independent evaluators. Each report covers Project, Structure,
Performance, Aesthetics, Usage, Consistency, Risk, and Overall, with a complete finding ledger, checklist,
and `PASS`, `REVISE`, or `FAIL` verdict. The aggregate takes the more severe result.

Gobbi never applies a finding before the user approves its disposition. A material revision repeats the
complete Workflow round. If either system fails, Gobbi pauses with the exact failure; a single-system
continuation requires an explicit waiver for the named system, step, and iteration.

### Durable session records

Workflow uses two versioned JSON contracts:

- `session.json` version 5 is the lifecycle manifest. It stores the Gobbi UUID, runtime identities, Git
  identity, durable outcome, and resolved settings.
- `state.json` version 3 is the active router. Its cursor is `step`, `stage`, `iteration`, and the current
  Execution task when applicable.

Drafts, cross-reviews, synthesis, decisions, evaluations, typed staging, and PASS-only outputs have
owner-defined locations. The complete schema and tree contract lives in the
[Record map](.gobbi/projects/gobbi/skills/record/record-map.md).

## Worktrees, commits, and handoff

Cowork and Workflow each use one isolated branch, one linked worktree, and one ordered writer history.
Shaping artifacts and implementation tasks produce focused verified local commits. Publication, merge,
cleanup, branch deletion, and worktree removal are separate actions controlled by the selected mode and the
user's current authority.

Local delivery does not depend on a remote or pull request. Unmerged work remains available at its exact
branch and worktree path.

## Use Gobbi

Use Gobbi in a trusted repository through its repo-local entry contracts, or enable the shared package for
Claude Code or Codex. Start a new runtime context after enabling or updating the package, ask Gobbi to handle
a concrete objective, and select General, Cowork, or Workflow from the fresh-entry prompt.

This repository supplies runtime entry contracts at [AGENTS.md](AGENTS.md) for Codex and
[.claude/CLAUDE.md](.claude/CLAUDE.md) for Claude Code. Canonical skills and agents live under
`.gobbi/projects/gobbi/`; discovery and package views are not independent sources.

The package at `plugins/gobbi/` carries both runtime manifests and symlinked views of canonical skills and
agents. It is intentionally hookless. Native Codex role wrappers remain repo-local under `.codex/agents/`.
If an installed Codex cache omits a symlinked component, report the installer limitation and keep the source
package symlinked.

The new-session contract is intentionally strict, but the plugin manifests remain at version `0.5.3`. Read
the [migration guide](MIGRATION.md) before resuming work created by an earlier Gobbi revision.

## Verify this checkout

```bash
bash scripts/sync-plugin-package.sh --check
bash scripts/test-sync-plugin-package.sh
bash scripts/check-codex-plugin-smoke.sh
```

When Claude Code is installed, also run:

```bash
claude plugin validate --strict plugins/gobbi
```

## Contract owners

- [Gobbi entry](.gobbi/projects/gobbi/skills/gobbi/SKILL.md) owns bootstrap, mode selection, and handoff.
- [Cowork](.gobbi/projects/gobbi/skills/cowork/SKILL.md) owns fast manifest-free user-topic orchestration.
- [Workflow](.gobbi/projects/gobbi/skills/workflow/SKILL.md) owns durable five-step orchestration.
- [Delegation](.gobbi/projects/gobbi/skills/workflow/delegation.md) owns the shared Gobbi assignment shape.
- [Evaluation](.gobbi/projects/gobbi/skills/evaluation/SKILL.md) owns independent review and verdicts.
- [Memory](.gobbi/projects/gobbi/skills/memory/SKILL.md) owns Cowork direct memory updates and Workflow
  durable-memory structure.
- [Record](.gobbi/projects/gobbi/skills/record/SKILL.md) owns Workflow session evidence and PASS-only outputs.
- [Git](.gobbi/projects/gobbi/skills/git/SKILL.md) owns worktree, commit, publication, merge, cleanup, and
  recovery.

## License

[MIT](./LICENSE)
