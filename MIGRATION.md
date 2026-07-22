# Migration guide

The current Gobbi redesign is a breaking, new-session-only contract. The plugin
manifest version deliberately remains `0.5.3`; an unchanged package version
does not make session records from different Gobbi revisions compatible.

Use the live [session schema](.gobbi/projects/gobbi/skills/record/schemas/session.schema.json),
[state schema](.gobbi/projects/gobbi/skills/record/schemas/state.schema.json),
and [Record map](.gobbi/projects/gobbi/skills/record/record-map.md) as the
authorities for sessions created from this source tree.

## Compatibility boundary

- New sessions created by the current source use `session.json` version 5 and
  `state.json` version 3.
- Existing unfinished sessions remain owned by the exact Gobbi revision that
  created them. The current source does not rewrite or adopt them.
- Completed historical sessions and archived records remain unchanged.
- There is no converter, dual-write path, or open-ended legacy reader.

Do not edit version fields or reshape an existing session by hand. Matching the
current numbers would not recreate the invariants, directory shape, frozen
artifacts, or transition history required by the current schemas.

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

| File | Current responsibility |
|---|---|
| `session.json` version 5 | Gobbi identity, ordered runtime identities, Git identity, resolved settings, and durable final outcome |
| `state.json` version 3 | Active status, the `step`/`stage`/`iteration`/task cursor, completed work, last verdict, and active dispatches |

Resolved workflow, model, and Git settings now live only under
`session.json.settings`. State does not duplicate those settings or lifecycle
metadata. State transitions and manifest checkpoints validate complete
candidate files before atomic replacement.

Configuration eagerly creates the predictable session tree and every
authorized iteration directory. Planning later scaffolds the locked Execution
tasks. Output directories may exist in advance, but canonical output files are
written only after PASS. Empty typed staging is valid when there is nothing
durable to promote.

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
advances through explicit manager decisions and validated record transitions.

Local worktree isolation and verified commits are mandatory. Issues, pushes,
and pull requests remain optional settings. Merge always requires explicit
user authority and current green checks, completed tasks, and a clean worktree.

Both plugin manifests and the Claude marketplace entry remain at version
`0.5.3` by deliberate user decision:

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

Do not point current record tooling at the unfinished session, rename its
directories, or copy current schemas into it. If the creating revision cannot
be proven, stop and preserve the session for explicit recovery instead of
attempting an in-place conversion.

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
