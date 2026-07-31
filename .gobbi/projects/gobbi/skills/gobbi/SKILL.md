---
name: gobbi
description: MUST load at session start, resume, /clear, and runtime compaction. Rebuilds the five-skill manager floor and routes the user's General, Cowork, or Workflow orchestration-mode selection.
allowed-tools: Read, Grep, Glob, Bash, AskUserQuestion
skill-type: operation
---

# Gobbi

Gobbi is the read-only entry operation for a Gobbi manager. It rebuilds the five-skill manager floor, presents
the skill map, and resolves one user-selected session mode: General, Cowork, or Workflow.

Gobbi owns only bootstrap, mode selection, and owner routing. General has no orchestration owner, Cowork uses
[`cowork`](../cowork/SKILL.md), and Workflow uses [`workflow`](../workflow/SKILL.md); those owners hold all
mode-specific creation, state, routing, execution, evaluation, and closure.

## Principles

### Bootstrap from durable owners

A cold manager reads the always-load floor, applicable project rules, and manager role before acting. Runtime
memory, a task view, or a stale entry document cannot replace those sources.

### Let the user select the session mode

General, Cowork, and Workflow make materially different commitments. A fresh entry always shows those three
choices and lets the user select one.

### Preserve a proved mode across context boundaries

A valid resume, `/clear`, rewind, or runtime compaction keeps its established mode and identity. Missing,
ambiguous, or conflicting mode evidence returns to user selection instead of guessing.

### Keep the entry read-only and owners distinct

Gobbi writes no branch, worktree, session record, artifact, or implementation. It hands the selected mode to
its owner without copying that owner's procedure or creating a second router.

## Rules

- **MUST run at every entry boundary.** Run at session start, resume, `/clear`, rewind, runtime compaction, and
  any other boundary that may discard or stale manager context.
- **MUST rebuild the floor of exactly five.** Read `principles`, `delegation`, `discussion`, `ideation`, and
  `git` in order, then applicable project rules and the canonical manager role; no sixth skill joins the floor.
- **MUST obtain an explicit General, Cowork, or Workflow selection for every fresh entry.** Use the active
  runtime's structured user-input request with no automatic resolution; prompt wording may recommend a mode
  but never selects it.
- **MUST preserve a valid established mode and reselect when its evidence is unreliable.** A context boundary
  does not re-prompt when mode and identity validate, while absent, ambiguous, or conflicting evidence does.
- **MUST load each conditional owner before its governed action.** General loads no orchestration owner,
  Cowork loads `cowork`, Workflow loads `workflow`, and specialist briefs use the shared delegation owner.
- **NEVER mutate from Gobbi entry or revive retired machinery.** Keep mode creation and work inside their
  owners, load other indexed skills only on demand, and route generated-view repair to the sync owner.

## Skill map

Every skill outside the floor is indexed here once. The index identifies owners; it is not an eager-load list.

| Skill | Description | Relevance note |
|---|---|---|
| [`cowork`](../cowork/SKILL.md) | User-led Gobbi orchestration for fast topic-by-topic implementation with optional shaping, user-called evaluation, and memory-updating Wrap-up. | Load only after the user selects Cowork. |
| [`workflow`](../workflow/SKILL.md) | Durable Configuration→Ideation→Planning→Execution→Wrap-up orchestration with DISCUSSION→WORK→EVALUATION→RECORD loops. | Load only after the user selects Workflow or a valid Workflow resume is proved. |
| [`memory`](../memory/SKILL.md) | Durable typed-memory schema, areas, and templates. | Used directly by Cowork Wrap-up and by other durable-memory work. |
| [`startup`](../startup/SKILL.md) | Read-only project-baseline classifier and optional Ideation elicitation. | Relevant to a new, sparse-baseline, or explicitly reset project. |
| [`planning`](../planning/SKILL.md) | Ordered, dependency-aware task decomposition. | Used by Workflow Planning or optional Cowork Planning. |
| [`execution`](../execution/SKILL.md) | One defined task through study, bounded change, verification, and a focused commit. | Used by Workflow Execution or a Cowork implementation unit. |
| [`wrap-up`](../wrap-up/SKILL.md) | Durable Workflow promotion, evaluated handoff, and configured Git finalization. | Used only by Workflow Wrap-up; Cowork closure stays with `cowork`. |
| [`coding`](../coding/SKILL.md) | Language-agnostic construction quality. | Relevant whenever the task writes or changes code. |
| [`desktop`](../desktop/SKILL.md) | Desktop domain family for complete Electron and TypeScript delivery, observable installed-platform behavior, and release judgment. | Relevant when any of those concerns enters scope; load every applicable Desktop child and route Electron mechanics through the Electron family. |
| [`html`](../html/SKILL.md) | HTML language operation for browser and Electron renderer documents. | Relevant when work writes or reviews HTML; independently selectable. |
| [`css`](../css/SKILL.md) | CSS language operation for browser and Electron renderer styles. | Relevant when work writes or reviews CSS; independently selectable. |
| [`python`](../python/SKILL.md) / [`typescript`](../typescript/SKILL.md) | Language method skills. | Relevant when the task enters that language. |
| [`react`](../react/SKILL.md) | Library method skill: the React-idiom layer, under `coding` and beside `typescript`. | Relevant when work writes or reviews React, in TypeScript or in plain JavaScript. |
| [`electron`](../electron/SKILL.md) | Electron domain family for platform development, runtime lookup, conventions, Electron-specific testing, and release work. | Relevant when developing, testing, reviewing, packaging, or releasing an Electron application; load every applicable child routed by the domain root. |
| [`codex`](../codex/SKILL.md) | Native Codex and Codex-peer invocation surfaces. | Relevant when the active runtime is Codex or an operation uses a Codex peer. |

## Procedure

### Phase 1 — Rebuild Context and Route the Selected Mode

#### 1.1 Establish the canonical entry context

- Confirm the governance source, active runtime, and entry trigger. Resolve this canonical skill directory
  through the active entrypoint and stop for sync-owner repair when the view is broken.
- Record the canonical source, runtime, trigger, and unchanged repository preimage. Gobbi has written nothing.

#### 1.2 Rebuild the five-skill floor

- Read [`../principles/SKILL.md`](../principles/SKILL.md),
  [`../delegation/SKILL.md`](../delegation/SKILL.md),
  [`../discussion/SKILL.md`](../discussion/SKILL.md),
  [`../ideation/SKILL.md`](../ideation/SKILL.md), and [`../git/SKILL.md`](../git/SKILL.md), in that order.
- Read applicable project rules, governing repository instructions, and the canonical
  [`manager` role](../../agents/manager.md). Record the repository's declared empty-rules state when no project
  rules exist.
- Confirm the load register contains exactly the five floor skills before any governed action.

#### 1.3 Select or preserve the session mode

- At every fresh entry, use the [Discussion](../discussion/SKILL.md) structure and the active runtime's
  structured user-input request to ask the user to select exactly one mode. Do not set an auto-resolution:

| Mode | Use when | Owner |
|---|---|---|
| **General** | The user wants ordinary assistance without a Gobbi orchestration lifecycle. | No orchestration owner |
| **Cowork** | The user wants fast, stepwise implementation topics with optional Ideation and Planning. | [`cowork`](../cowork/SKILL.md) |
| **Workflow** | The user wants the durable five-step, dual-system, recorded workflow. | [`workflow`](../workflow/SKILL.md) |

- A request may support a recommendation, but even explicit words such as “use Cowork” do not replace the
  selection control on a fresh entry.
- At a context boundary, preserve the established selection when its mode evidence and identity still
  validate. If no reliable selection survives, or two modes appear active, ask the three-way question again.

#### 1.4 Load conditional owners

- Load [`../codex/SKILL.md`](../codex/SKILL.md) when the active runtime or a peer operation requires it.
- Before any Cowork or Workflow specialist brief, read the shared
  [assignment owner](../workflow/delegation.md). Load task-specific indexed skills only when their triggers
  apply.

#### 1.5 Hand off without mutation

- **General:** continue from the floor and task-specific indexed skills. Do not load an orchestration owner or
  create Gobbi session state.
- **Cowork:** load [`../cowork/SKILL.md`](../cowork/SKILL.md). That owner creates or recovers its isolated
  manifest-free worktree before editing and runs its user-topic loop.
- **Workflow:** load [`../workflow/SKILL.md`](../workflow/SKILL.md). That owner performs fresh/resume
  classification, Configuration, durable routing, productive steps, evaluation, RECORD, and Wrap-up.
- On missing or invalid mode evidence, owner artifacts, identity, or authority, preserve the prior state and
  report the exact blocker. Never invent a fallback mode, cursor, worktree, or direct specialist route.

## References

- [`../principles/SKILL.md`](../principles/SKILL.md) owns the ten behavioral principles.
- [`../discussion/SKILL.md`](../discussion/SKILL.md) owns user-question structure and decisions.
- [`../cowork/SKILL.md`](../cowork/SKILL.md) owns Cowork orchestration.
- [`../workflow/SKILL.md`](../workflow/SKILL.md) owns durable Workflow orchestration.
- [`../workflow/delegation.md`](../workflow/delegation.md) owns Gobbi specialist assignment construction.
- [`../git/SKILL.md`](../git/SKILL.md) owns mode-specific branch, worktree, commit, and recovery mechanics.
- [`../../agents/manager.md`](../../agents/manager.md) owns manager behavior.
- [`../../../../../scripts/sync-plugin-package.sh`](../../../../../scripts/sync-plugin-package.sh) owns runtime
  entrypoint and plugin-source topology checks.
- [`scenarios.md`](scenarios.md), [`checklists.md`](checklists.md), and [`evaluation.md`](evaluation.md) exercise
  this operation without adding policy.
