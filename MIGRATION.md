# Migration guide

The current Gobbi redesign is a breaking, new-session-only contract. The package
version does not describe it; two revisions sharing a version number still do
not share compatible session records.

Use the [Workflow skill](.gobbi/projects/gobbi/skills/workflow/SKILL.md) for the
session route and evidence layout, and the
[Record skill](.gobbi/projects/gobbi/skills/record/SKILL.md) for the session
memory tree, as the authorities for sessions created from this source tree.

## Compatibility boundary

- New sessions created by the current source carry no session manifest. Their
  live route is the native runtime TODO list, and their durable evidence is the
  tree under `sessions/{date}-{gobbi-session-id}/`.
- Existing unfinished sessions remain owned by the exact Gobbi revision that
  created them. The current source does not rewrite or adopt them.
- Completed historical sessions and archived records remain unchanged.
- There is no converter, dual-write path, or open-ended legacy reader.

Do not reshape an existing session by hand. Copying the current directory names
would not recreate the frozen packages, gates, receipts, and commits the current
contract requires as evidence.

## Current workflow contract

All new sessions follow one workflow:

`Configuration → Ideation → Planning → Execution → Wrap-up`

Every productive step follows one complete loop:

`DISCUSSION → WORK → EVALUATION → RECORD`

Every task uses this workflow. A `REVISE` verdict starts another complete WORK
and EVALUATION iteration. A `FAIL` verdict halts for a user decision.
Iteration-cap changes are explicit settings decisions recorded before an
additional iteration is scaffolded.

## Record changes for new sessions

| Location | Current responsibility |
|---|---|
| the native runtime TODO list | The only live route: current phase, productive step, stage, task, and iteration |
| `configuration.md` | Gobbi UUID, resolved settings, repository, base revision, branch, absolute worktree, runtime system, and creation checks |
| `1-ideation/`, `2-planning/`, `3-execution/task-NN-slug/`, `4-wrap-up/` | Each productive step's working package, both evaluation reports, `gate.md`, the RECORD receipt, and PASS-only canonical output |
| `memory/` | The session memory tree that Wrap-up memorizes into project memory |
| `work/` | Session-only plans, scenarios, checklists, and every other kind no evidence owner holds |

Resolved workflow, model, and Git settings live only in `configuration.md`. No
manifest duplicates them. No script validates the tree: the manager reads each
package, gate, and receipt directly and refuses the stage when a required part
is missing or unlabeled.

Configuration creates the evidence root and its `configuration.md`. Every other
directory is created when its first record needs it, never scaffolded in
advance, because an empty directory asserts a record that does not exist.
Canonical output files are written only after PASS.

## Quality changes for new sessions

Every WORK stage requires independent Claude and Codex drafts, reciprocal
cross-reviews, active-runtime synthesis, and user resolution of material open
decisions. Every EVALUATION requires fresh Claude and Codex reports covering
all seven perspectives plus Overall.

The most severe evaluator verdict controls the loop. Findings are presented as
one disposition batch and are not applied before user approval. Every material
revision receives another complete dual-system creation and evaluation pass.
Token cost is never a reason to narrow Ideation, creation, or evaluation.

An unavailable or invalid system pauses the workflow with its exact failure.
Single-system continuation is valid only after the user grants a waiver for
the named system, step, and iteration; the final outcome links that decision.

## Runtime and package changes

Gobbi owns a stable session UUID independently of Claude Code or Codex runtime
identity. A context boundary appends a newly observed runtime identity while
preserving the session, branch, worktree, settings, and persisted cursor.

The shared package is hookless. Claude Code uses the package's conventional
skill and agent surfaces. The Codex plugin declares skills, while native Codex
role wrappers remain repo-local under `.codex/agents/`. The current lifecycle
advances only through explicit manager decisions taken on reread evidence.

Local worktree isolation and verified commits are mandatory. Issues, pushes,
and pull requests remain optional settings. Merge always requires explicit
user authority and current green checks, completed tasks, and a clean worktree.

Both plugin manifests and the Claude marketplace entry declare the package
version. Read them directly instead of inferring session compatibility from a
version number:

- [Claude Code manifest](plugins/gobbi/.claude-plugin/plugin.json)
- [Codex manifest](plugins/gobbi/.codex-plugin/plugin.json)
- [Claude marketplace](.claude-plugin/marketplace.json)

Start a new Claude Code or Codex context after enabling or updating the package
so runtime discovery reads the current contract.

## Finish an existing unfinished session

1. Preserve the session directory, branch, and working tree exactly as they
   are.
2. Identify the exact Gobbi revision that created the session from its existing
   repository and worktree evidence. Do not guess when that evidence is
   missing.
3. Open a separate worktree pinned to that revision and resume the unfinished
   session only with its matching Gobbi sources.
4. Finish and verify that session in the pinned worktree.
5. Start the next session in a new runtime context with the current Gobbi
   source.

Do not rename the unfinished session's directories or copy the current session
shape into it. If the creating revision cannot be proven, stop and preserve the
session for explicit recovery instead of attempting an in-place conversion.

## Verify the current package

Run the repository-owned source, fixture, installed-cache, and documentation
checks from the repository root:

```bash
bash scripts/sync-plugin-package.sh --check
bash scripts/test-sync-plugin-package.sh
bash scripts/check-codex-plugin-smoke.sh
bash scripts/check-markdown-links.sh README.md MIGRATION.md
```

When Claude Code is installed, also run:

```bash
claude plugin validate --strict plugins/gobbi
```
