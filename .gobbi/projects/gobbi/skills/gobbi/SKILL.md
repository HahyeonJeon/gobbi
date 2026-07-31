---
name: gobbi
description: "MUST load at session start and at every boundary that may discard session context. Loads the nine-skill Gobbi system, then obtains and routes the user's General, Cowork, or Workflow mode selection."
allowed-tools: Read, Grep, Glob, Bash, AskUserQuestion
skill-type: operation
---

# Gobbi

Gobbi is the read-only entry operation for a Gobbi manager. It loads the nine-skill Gobbi system, obtains one
session mode from the user — General, Cowork, or Workflow — and hands the session to that mode's owner.

Gobbi owns only the load, the selection, and the routing. General continues from the loaded system, Cowork
uses [`cowork`](../cowork/SKILL.md), and Workflow uses [`workflow`](../workflow/SKILL.md); those owners hold
all mode-specific creation, state, routing, execution, evaluation, and closure.

The entry writes nothing. It runs again at every boundary that may discard manager context and keeps an
established mode whenever that mode's evidence still validates.

## Principles

### Load the system from its durable sources

A cold manager reads the nine skills, applicable project rules, and its role from the repository before
acting. Runtime memory, a task view, or a stale entry document cannot replace those sources.

### Let the user select the session mode

General, Cowork, and Workflow make materially different commitments. A fresh entry shows all three and lets
the user select one.

### Preserve a proved mode across a context boundary

A valid resume, `/clear`, rewind, or runtime compaction keeps its established mode and identity. Missing,
ambiguous, or conflicting mode evidence returns to user selection instead of guessing.

### Keep the entry read-only and owners distinct

Gobbi writes no branch, worktree, session record, artifact, or implementation. It hands the selected mode to
its owner without copying that owner's procedure or creating a second router.

## Rules

- **NEVER mutate anything from the entry operation.** Create no branch, worktree, session record, artifact, or
  implementation; every mutation belongs to the selected mode's owner.

- **MUST obtain an explicit General, Cowork, or Workflow selection at every fresh entry.** Use the active
  runtime's structured user-input request with no automatic resolution; wording may recommend a mode but
  never selects it.

- **MUST load all nine skills before any governed action.** Read `principles` first, then `ideation`,
  `planning`, `wrap-up`, `delegation`, `discussion`, `record`, `memory`, and `git`.

- **MUST preserve the system's dependency direction.** `gobbi`, `cowork`, and `workflow` may reference any
  skill; `delegation`, `discussion`, `evaluation`, `git`, `ideation`, `planning`, `record`, and `memory` may
  reference nothing outside themselves; `wrap-up` may reference only `record` and `memory`, and nothing in
  that isolated set may reference `wrap-up`.

## Procedure

### Phase 1 — Load the System and Route the Selected Mode

#### 1.1 Establish the entry context and active runtime

- Take the entry trigger — session start, resume, `/clear`, rewind, or runtime compaction — and the
  repository's governance source as the input.
- Confirm the governance source, the active runtime, and the trigger, then resolve this canonical skill
  directory through the active entrypoint.
- Record the canonical source, runtime, trigger, and unchanged repository preimage. Gobbi has written nothing.
- Stop and route the repair to
  [`scripts/sync-plugin-package.sh`](../../../../../scripts/sync-plugin-package.sh) when the resolved view is
  broken.

#### 1.2 Load the nine-skill Gobbi system

- Read [`../principles/SKILL.md`](../principles/SKILL.md) first, then
  [`../ideation/SKILL.md`](../ideation/SKILL.md), [`../planning/SKILL.md`](../planning/SKILL.md),
  [`../wrap-up/SKILL.md`](../wrap-up/SKILL.md), [`../delegation/SKILL.md`](../delegation/SKILL.md),
  [`../discussion/SKILL.md`](../discussion/SKILL.md), [`../record/SKILL.md`](../record/SKILL.md),
  [`../memory/SKILL.md`](../memory/SKILL.md), and [`../git/SKILL.md`](../git/SKILL.md), in that order.
- Read applicable project rules, governing repository instructions, and the canonical
  [`manager` role](../../agents/manager.md). Record the repository's declared empty-rules state when no
  project rules exist.
- Confirm the load register holds all nine skills before any governed action, and return to the first unread
  skill when it does not.

#### 1.3 Obtain or preserve the session mode

- Start from the loaded system and the recorded entry trigger.
- At every fresh entry, use the [Discussion](../discussion/SKILL.md) structure and the active runtime's
  structured user-input request to ask the user to select exactly one mode. Set no automatic resolution:

| Mode | Select when |
|---|---|
| **General** | The user wants ordinary assistance without a Gobbi orchestration lifecycle. |
| **Cowork** | The user wants fast, stepwise implementation topics with optional Ideation and Planning. |
| **Workflow** | The user wants the durable five-step, dual-system, recorded workflow. |

- A request may support a recommendation, but even explicit words such as "use Cowork" do not replace the
  selection control on a fresh entry.
- At a context boundary, keep the established selection while its mode evidence and identity still validate.
  Ask the three-way question again when no reliable selection survives or two modes appear active.

#### 1.4 Load the selected owner and hand off without mutation

- **General:** continue the user's task from the loaded nine skills and the task-specific skills the work
  triggers. Load no orchestration owner and create no Gobbi session state.
- **Cowork:** load [`../cowork/SKILL.md`](../cowork/SKILL.md). That owner creates or recovers its isolated
  manifest-free worktree before editing and runs its user-topic loop.
- **Workflow:** load [`../workflow/SKILL.md`](../workflow/SKILL.md). That owner performs fresh and resume
  classification, Configuration, durable routing, productive steps, evaluation, RECORD, and Wrap-up.
- Build every specialist brief through the loaded [Delegation](../delegation/SKILL.md) skill, and let the
  selected mode add its own brief fields. Load any further task-specific skill from that skill's own trigger,
  because the entry keeps no skill index.
- On missing or invalid mode evidence, owner artifacts, identity, or authority, preserve the prior state and
  report the exact blocker. Never invent a fallback mode, cursor, worktree, or direct specialist route.

## References
