# Record Map

This document owns the filesystem and JSON mechanics for one Gobbi session
record. The record lives at:

```text
{worktree}/.gobbi/projects/{project}/sessions/{date}-{gobbi-session-id}/
```

The Gobbi session ID is a Gobbi-owned UUID. It does not change when a runtime
context changes. The worktree, project, start date, and UUID together determine
the only valid session-root path.

[`session-record.sh`](scripts/session-record.sh) creates and verifies the tree.
The command uses the versioned schemas in [`schemas/`](schemas/) and the seed
documents in [`templates/`](templates/). New sessions use session schema version
5 and state schema version 3. There is no migration, compatibility reader, or
dual-write path for older session records.

Peer results use three artifact-specific schemas: [`draft.schema.json`](schemas/draft.schema.json),
[`cross-review.schema.json`](schemas/cross-review.schema.json), and
[`evaluation-report.schema.json`](schemas/evaluation-report.schema.json). The
schemas are closed contracts; an unknown field is invalid.

## Canonical session tree

Configuration eagerly creates every predictable directory authorized by the
resolved iteration caps:

```text
sessions/{date}-{gobbi-session-id}/
├── README.md
├── session.json
├── state.json
├── 1-ideation/
├── 2-planning/
├── 3-execution/
└── 4-wrap-up/
```

The root contains no `settings.json`, `session.json.lock`, `transcripts/`, or
Chat-task tree. A `working/discussion-log.md` file is also forbidden anywhere in
the record.

Every non-Execution step has this shape:

```text
{N}-{step}/
├── working/
│   └── iteration-{n}/
│       ├── drafts/
│       ├── cross-reviews/
│       └── research/
├── evaluation/
│   └── iteration-{n}/
├── staging/
│   └── {typed-memory-directories}/
└── outputs/
```

Files created during WORK and EVALUATION use these fixed locations inside an
iteration:

```text
working/iteration-{n}/drafts/claude.md
working/iteration-{n}/drafts/codex.md
working/iteration-{n}/cross-reviews/claude-on-codex.md
working/iteration-{n}/cross-reviews/codex-on-claude.md
working/iteration-{n}/synthesis.md
working/iteration-{n}/open-decisions.md
working/iteration-{n}/research/{slug}.md
evaluation/iteration-{n}/claude.md
evaluation/iteration-{n}/codex.md
```

Execution has step-level `staging/` and `outputs/` directories. After Planning
locks task numbers and names, every task receives the same four-slot interior:

```text
3-execution/
├── staging/{typed-memory-directories}/
├── outputs/
└── task-{NN}-{slug}/
    ├── working/iteration-{n}/{drafts,cross-reviews,research}/
    ├── evaluation/iteration-{n}/
    ├── staging/{typed-memory-directories}/
    └── outputs/
```

The fixed step mapping is:

| Step | Directory | Iteration-cap key |
|---|---|---|
| Ideation | `1-ideation` | `settings.workflow.ideation.maxIterations` |
| Planning | `2-planning` | `settings.workflow.planning.maxIterations` |
| Execution | `3-execution` | `settings.workflow.execution.maxIterations` |
| Wrap-up | `4-wrap-up` | `settings.workflow["wrap-up"].maxIterations` |

The directory ordinal is a filesystem ordering aid. JSON always uses the bare
step names `ideation`, `planning`, `execution`, and `wrap-up`.

## Eager scaffolding

Iteration 1 is the first complete pass. A cap of 3 creates
`iteration-1` through `iteration-3`; it does not authorize three retries after
the initial pass.

Configuration creates every non-Execution iteration directory, all step-level
staging type directories, and every outputs directory. It cannot create task
interiors because task identities are not known yet. `scaffold-tasks` creates all
planned task interiors after Planning locks those identities. A later,
user-approved cap extension creates only the newly authorized iteration
directories. Repeating either scaffold operation is idempotent.

The base staging vocabulary is:

```text
scenarios/
checklists/
decisions/
references/
design/
discussions/
reviews/
reports/
changelogs/
learnings/
notes/
backlogs/feature/
backlogs/project/
```

Planning alone also has `staging/plans/`. A valid clean PASS may leave every
staging directory empty. Do not create a placeholder finding.

Scaffolding creates output directories early, but output files are PASS-only.
An Ideation, Planning, Execution, or Wrap-up output is invalid until its step is
listed in `state.json.completedSteps`. A task output is invalid until its
`{NN}-{slug}` identity is listed in `state.json.completedTasks`.

## `session.json` version 5

[`session.schema.json`](schemas/session.schema.json) is the executable contract.
`session.json` is a low-frequency lifecycle manifest, not a workflow event log.
It owns:

- the stable session, project, scope, and runtime identities;
- start and finish timestamps;
- worktree, branch, and optional publication identities;
- resolved workflow, model, and Git settings; and
- the final durable outcome summary.

The `runtime.system` value records the active runtime. `runtime.ids` is an
ordered, unique list. A context boundary may append one newly observed runtime
ID. It may not reorder, remove, or duplicate prior IDs.

The manifest is written only at Configuration, scope lock, runtime attachment,
an explicit settings change, and the Wrap-up outcome. It never stores routing,
agents, teammate turns, usage, token or cache counts, integration counters,
iteration telemetry, transcripts, Chat history, or other operational events.

The final `outcome` contains only durable summaries: final status, each
productive step's verdict and canonical artifact, the durable handoff path,
user-approved dual-system waivers, and any halted or aborted reason.

## `state.json` version 3

[`state.schema.json`](schemas/state.schema.json) is the executable contract.
`state.json` is the sole active workflow router. The manager updates it before
each visible transition through the `transition` command.

It owns only:

- overall status;
- the current step, stage, iteration, and optional Execution task;
- completed steps and tasks;
- the last aggregate verdict; and
- active dispatch identity and scheduling status.

The canonical stages are `DISCUSSION`, `WORK`, `EVALUATION`, and `RECORD`.
Configuration has no stage. A runtime-native task or todo list is a projection
of this state and cannot write back to it.

State never duplicates settings, model choices, Git settings, manifest metadata,
or iteration caps. The command validates the active iteration against the cap in
`session.json` and validates each current or completed task against a scaffolded
task directory.

## Command contract

Run the record command from its canonical skill-owned location:

```text
.gobbi/projects/gobbi/skills/record/scripts/session-record.sh
```

Every path argument is explicit. Commands do not discover a global active
session and do not scan other worktrees.

### 1. `init`

```text
session-record.sh init --root ABS --session-id UUID --project SLUG
  --runtime-system claude-code|codex --runtime-id ID
  --started-at TIMESTAMP --branch BRANCH --worktree ABS
  [--base-branch BRANCH] [--repo OWNER/REPO] [--settings FILE]
```

`init` validates all inputs and both complete JSON candidates before it creates
the session root. The root must exactly match the worktree, project, date, and
Gobbi UUID supplied. `--settings` contains the complete `settings` object only;
when omitted, the shipped defaults are used. Existing v5/v3 records are
preserved. A conflicting identity, retired surface, invalid document, or old
schema is rejected before record mutation. Repeating a valid initialization is
idempotent.

### 2. `scaffold-tasks`

```text
session-record.sh scaffold-tasks --root ABS --tasks FILE
```

The task file has one exact shape:

```json
{
  "tasks": [
    { "number": 1, "slug": "record-foundation" }
  ]
}
```

Numbers and slugs must each be unique. Numbers are integers from 1 through 99.
Slugs are lower-case kebab-case strings. The command validates the whole task
set before creating any task directory, then creates every configured Execution
iteration for each task.

### 3. `transition`

```text
session-record.sh transition --root ABS --patch FILE
```

The patch may change only `status`, `current`, `completedSteps`,
`completedTasks`, `lastVerdict`, or `activeDispatches`. It cannot change
`schemaVersion` and cannot write manifest or settings data.

### 4. `checkpoint`

```text
session-record.sh checkpoint --root ABS --patch FILE
```

The patch may change only `feature`, `task`, `runtime`, `finishedAt`, `git`,
`settings`, or `outcome`. It cannot write workflow routing. Stable session
identity, project, start timestamp, base branch, session branch, and worktree
path are immutable. Iteration caps cannot decrease. A cap increase scaffolds
only the new iterations after the manifest candidate is accepted.

### 5. `write-artifact`

```text
session-record.sh write-artifact --root ABS
  --kind draft|cross-review|evaluation-report --input FILE --target REL
  --expected-system claude|codex
  --expected-step ideation|planning|execution|wrap-up
  --expected-iteration N --expected-assignment ID
```

The command accepts only a regular, non-symbolic-link JSON input. It validates
the kind-specific schema, semantic invariants, and every expected metadata
field. The target must be the canonical system-labeled location for that kind,
step, and iteration. Execution targets must also identify a scaffolded canonical
task directory.

After validation, the command renders deterministic Markdown with strict
frontmatter and one canonical, sorted JSON block delimited by
`gobbi-machine-json:v1` markers. The JSON block is the machine-readable copy of
the exact validated input. The human frontmatter repeats routing and digest
fields so validators can reject a visible header that contradicts the embedded
record. Draft and cross-review frontmatter carries the neutral-contract digest;
cross-review frontmatter also carries the opposite subject system and the
SHA-256 digest of the frozen rendered draft. Evaluation frontmatter carries the
evaluated subject digest and derived verdict.

Rendering occurs in a temporary candidate. The command revalidates the rendered
kind, headers, and embedded JSON before a same-directory atomic replacement.
Malformed JSON, schema failure, wrong kind, system, step, iteration, assignment,
path escape, symbolic link, or render failure leaves an existing target
byte-for-byte unchanged.

### 6. `verify`

```text
session-record.sh verify --root ABS [--tasks FILE]
```

`verify` checks both schemas, cross-document invariants, exact root ownership,
retired surfaces, exact directory shape, optional complete task coverage, and
artifact placement. Empty staging is valid. Unknown root entries, extra
directories, unscaffolded tasks, and pre-PASS output files fail verification.

The embedded `self-test` command exercises positive and negative foundation
paths without installing another shell implementation.

## Patch and atomic-write semantics

`transition` and `checkpoint` accept patch files, never shell-interpolated JSON.
Their merge is a Gobbi object merge implemented by `jq`'s object multiplication:

- object members merge recursively;
- arrays replace the prior array;
- scalars replace the prior scalar; and
- `null` is a value and replaces the prior value.

This is deliberately not JSON Merge Patch: `null` never means delete. The full
merged candidate must pass JSON parsing, its versioned schema, command-specific
field authorization, and cross-document invariants.

After validation, replacement uses a temporary file in the target file's own
directory and a same-filesystem rename. Parse, schema, authorization,
containment, and rendering failures leave the prior target bytes unchanged. A
cap-scaffold failure restores the prior manifest bytes.

## Containment and lifecycle

All session paths are absolute and root-contained. A symbolic-link parent that
would redirect the session path is rejected before initialization. Symbolic
links are forbidden inside the session record. Task slugs reject separators,
traversal components, and malformed names. The verifier rejects files outside
the declared record locations.

The entire `sessions/` tree is worktree-local and gitignored. Working,
evaluation, and output artifacts remain session evidence. Durable memory is
created only by Wrap-up promotion from typed `staging/` directories. Wrap-up
must reject any promotion source outside staging.
