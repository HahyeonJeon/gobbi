---
name: gobbi
description: "MUST load at session start and at every boundary that may discard session context. Loads the nine-skill Gobbi system, then obtains and routes the user's General, Cowork, or Workflow mode selection."
allowed-tools: Read, Grep, Glob, Bash, AskUserQuestion
skill-type: operation
---

# Gobbi

Gobbi is the read-only entry operation for a Gobbi manager. It loads the nine-skill Gobbi system, obtains one
session mode from the user — General, Cowork, or Workflow — and hands the session to that mode's owner.

Gobbi owns the load, the selection, the routing, and the session-wide authority and evaluation commitments
every mode inherits. General continues from the loaded system, Cowork uses [`cowork`](../cowork/SKILL.md), and
Workflow uses [`workflow`](../workflow/SKILL.md); those owners hold all mode-specific creation, state,
routing, execution, evaluation, and closure.

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

- **MUST hold the session to its selected mode's evaluation commitment.** Never apply an evaluator finding
  before the user approves its disposition, and pause with the exact failure when a required evaluation system
  is unavailable or invalid unless the user waives that named system for the round.

- **MUST keep the manager the session's only authority for assignment, scope, user decisions, acceptance, and
  destructive or external action.** Build every specialist brief through
  [`delegation`](../delegation/SKILL.md), keep all worktree writes in one ordered writer chain, and
  parallelize only independent read-only analysis and fresh independent evaluation.

Rule 4 names three linking skills, eight isolated skills, and `wrap-up`. Every skill it does not name is
unclassified: the rule constrains it in no direction, and it may reference anything. The isolated eight are
constrained on every outbound reference, not only on the skills Rule 4 names, so they may not reference an
unclassified skill either. Runtime and project nouns — `Claude`, `Codex`, `Gobbi`, and `git` as a program —
are not skill references.

## Procedure

### Phase 1 — Load the System and Route the Selected Mode

#### 1.1 Establish the entry context, runtime, and canonical layout

- Take the entry trigger — session start, resume, `/clear`, rewind, or runtime compaction — and the
  repository's governance source as the input.
- Confirm the governance source, the active runtime, and the trigger. Then take the location the active
  entrypoint reports for the Gobbi skill it loaded. Every supported entrypoint reports that location as part
  of loading a skill, so the entry needs no environment variable, configuration file, or filesystem search,
  and none exists to supply one. That reported path is the only input to the derivation below.
- The reported path names one of two things: the loaded skill's own directory, or the skills root that
  contains it. Never decide which from its spelling. The derivation below builds one candidate for each
  shape, and the sentinels select the true one.
- Derive two roots from the reported path and name them `{gobbi-skills-root}` and `{gobbi-agents-root}`. The
  `{gobbi-skills-root}` candidates are the reported path itself and its parent directory.
  `{gobbi-agents-root}` is the `agents/` directory beside whichever candidate the sentinels confirm. Expand
  every candidate to an absolute path; a relative or unexpanded value is not a resolved root.
- Validate the candidates against the sentinels `gobbi/SKILL.md`, `principles/SKILL.md`, and
  `agents/manager.md`. Each sentinel must exist and be readable at the path its root produces. Exactly one
  candidate satisfies both skills sentinels; that candidate is `{gobbi-skills-root}`, and its `agents/`
  sibling must then satisfy the third:

| Sentinel path | Root | Proves |
|---|---|---|
| `{gobbi-skills-root}/gobbi/SKILL.md` | `{gobbi-skills-root}` | The entry document itself resolves from the root |
| `{gobbi-skills-root}/principles/SKILL.md` | `{gobbi-skills-root}` | A sibling skill resolves from that same root |
| `{gobbi-agents-root}/manager.md` | `{gobbi-agents-root}` | Agent contracts resolve independently of skills |

- A runtime may report the loaded skill through a generated view or through its canonical location. Either is
  a valid root when its sentinels validate; the sentinels decide, not the spelling.
- Record `{gobbi-skills-root}` and `{gobbi-agents-root}` with the canonical source, runtime, trigger, and
  unchanged repository preimage. Gobbi has written nothing.
- Treat both validated roots as fixed for the whole session: one session runs against exactly one pair. The
  entry persists neither value; the selected mode's owner records them with its own session facts and carries
  them into every brief it builds. Re-derive and revalidate both at every entry instead of recovering a
  remembered value, then compare the result with the pair the session already recorded whenever that record
  exists. A difference means the package moved under a running session: neither pair governs, so stop below
  and report both, because the entry cannot rewrite the records and briefs that already carry the earlier
  pair.
- Resolve the project key `<project>` with:

```text
basename(dirname(git rev-parse --path-format=absolute --git-common-dir))
```

- Use `--git-common-dir` because it names the shared repository directory. Every Cowork and Workflow session
  runs inside a session worktree whose own top level is the session branch name, so any form that reads the
  current worktree's root yields the branch instead of the project. Validate the key against
  `^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$` at up to 64 characters, and ask the user before deriving any path when
  it does not match.
- Gobbi defines these paths:

```text
.gobbi/                          tracked
├── .gitignore                   tracked
└── projects/<project>/          tracked
    ├── memory/                  tracked   the project memory root
    ├── sessions/                ignored
    └── worktrees/               ignored
```

- `tracked` means git must not ignore the path. `ignored` means git must ignore the directory and every
  descendant. Git stores no empty directory, so a tracked directory holds nothing until its first real record.
- `.gobbi/.gitignore` is the only file that carries Gobbi's ignore rules, and Gobbi never writes a repository's
  root `.gitignore`. Its canonical content is one comment line plus `projects/*/sessions/` and
  `projects/*/worktrees/`. The middle slash anchors each pattern; a slashless pattern such as `sessions/`
  matches at any depth and would ignore durable memory under `memory/design/sessions/`.
- Bootstrap creates the namespace roots only: never a `memory/` category directory, never a session directory,
  and no marker file under `memory/`. An empty directory asserts a record that does not exist
  ([`record`](../record/SKILL.md) Step 2.2). `rules/` is not bootstrapped, because every agent contract already
  reads an absent or empty `rules/` as `NO_PROJECT_RULES`.
- The entry defines this shape and creates none of it. The selected mode's owner creates each path when its
  first record needs it, so a missing directory is not a broken view and is not the failure below.
- Stop here when no candidate resolves a root, when both candidates satisfy the same sentinels, when a
  sentinel is missing or unreadable, when a re-derived root differs from the pair this session already
  recorded, or when the resolved view is otherwise partial or inconsistent. Name the exact broken element:
  for a sentinel failure, the affected root, the exact sentinel path, and whether that path was absent or
  unreadable; for an ambiguous or a diverged pair, both candidate roots. Repair a sentinel failure by
  restoring the runtime's Gobbi package or entrypoint from its canonical source; an ambiguous or a diverged
  pair needs the user's decision instead. The repository's governing instructions own any repository-local
  repair command, and no step continues against a partial view.
- This stop fires before the Step 1.3 mode selection, because every later step and every brief depends on the
  two validated roots. Never select a mode, load an owner, or build a brief without them.

#### 1.2 Load the nine-skill Gobbi system

- Read [`../principles/SKILL.md`](../principles/SKILL.md) first, then
  [`../ideation/SKILL.md`](../ideation/SKILL.md), [`../planning/SKILL.md`](../planning/SKILL.md),
  [`../wrap-up/SKILL.md`](../wrap-up/SKILL.md), [`../delegation/SKILL.md`](../delegation/SKILL.md),
  [`../discussion/SKILL.md`](../discussion/SKILL.md), [`../record/SKILL.md`](../record/SKILL.md),
  [`../memory/SKILL.md`](../memory/SKILL.md), and [`../git/SKILL.md`](../git/SKILL.md), in that order.
- Load all nine here even though five of them — `ideation`, `planning`, `wrap-up`, `record`, and `memory` —
  also declare their own load triggers. The nine are the shared vocabulary every mode needs before the mode is
  known, so they load before the selection that would otherwise determine them; every other skill still loads
  from its own trigger.
- Read applicable project rules, governing repository instructions, and the canonical
  [`manager` role](../../agents/manager.md). Record the repository's declared empty-rules state when no
  project rules exist.
- Confirm the load register holds all nine skills before any governed action, and return to the first unread
  skill when it does not.

#### 1.3 Obtain or preserve the session mode

- Start from the loaded system and the recorded entry trigger.
- At every fresh entry, use the [Discussion](../discussion/SKILL.md) structure and the active runtime's
  structured user-input request to ask the user to select exactly one mode. Set no automatic resolution:

| Mode | Select when | Evaluation commitment |
|---|---|---|
| **General** | The user wants ordinary assistance without a Gobbi orchestration lifecycle. | Only the evaluation its task owner requires. |
| **Cowork** | The user wants fast, stepwise implementation topics with optional Ideation and Planning. | No automatic dual-system creation, and one fresh Claude-and-Codex round for each explicit user `evaluate` call over the frozen requested subject. |
| **Workflow** | The user wants the durable five-step, dual-system, recorded workflow. | Retained independent Claude and Codex drafts before every EVALUATION, and two fresh isolated evaluators for each EVALUATION. |

- Present the commitment column with the selection so the user chooses a known quality bar. State what each
  mode guarantees, not how it produces that guarantee.
- Name the commitment only. [`cowork`](../cowork/SKILL.md) and [`workflow`](../workflow/SKILL.md) own the
  mechanism behind their own commitment, and the entry never runs, schedules, or repeats an evaluation.
- A request may support a recommendation, but even explicit words such as "use Cowork" do not replace the
  selection control on a fresh entry.
- At a context boundary, keep the established selection while its mode evidence and identity still validate.
  Ask the three-way question again when no reliable selection survives or two modes appear active.

#### 1.4 Load the selected owner and hand off without mutation

- **General:** continue the user's task from the loaded nine skills and the task-specific skills the work
  triggers. Load neither orchestration owner — `cowork` and `workflow` — and create no Gobbi session state;
  the nine-skill floor stays loaded.
- **Cowork:** load [`../cowork/SKILL.md`](../cowork/SKILL.md). That owner creates or recovers its isolated
  worktree before editing and runs its user-topic loop.
- **Workflow:** load [`../workflow/SKILL.md`](../workflow/SKILL.md). That owner performs fresh and resume
  classification, Configuration, durable routing, productive steps, evaluation, RECORD, and Wrap-up.
- Build every specialist brief through the loaded [Delegation](../delegation/SKILL.md) skill, and let the
  selected mode add its own brief fields. After a specialist reports, reread its artifact or commit and
  reproduce its verification before assigning further work.
- Use the [skill map](#references) to find a further task-specific skill, then load that skill from its own
  trigger. The map indexes what exists for routing; it loads nothing beyond the nine and gives no skill a
  second entry point.
- On missing or invalid mode evidence, owner artifacts, identity, or authority, preserve the prior state and
  report the exact blocker. Never invent a fallback mode, cursor, worktree, or direct specialist route.

## References

This is the complete map of the canonical Gobbi skill roots. Step 1.2 loads the entry floor; every other
skill loads from its own trigger, so this map shows what exists rather than what is loaded. A root that has
children routes to them from its own document.

### Entry floor

| Skill | Owns |
|---|---|
| [`principles`](../principles/SKILL.md) | The ten behavioral principles every agent applies. |
| [`ideation`](../ideation/SKILL.md) | Exploring a problem with the user and locking what and why. |
| [`planning`](../planning/SKILL.md) | Decomposing accepted work into an ordered executable plan. |
| [`wrap-up`](../wrap-up/SKILL.md) | Closing accepted work with durable memory and an exact handoff. |
| [`delegation`](../delegation/SKILL.md) | The brief shape every specialist assignment uses. |
| [`discussion`](../discussion/SKILL.md) | The shape of a question put to the user. |
| [`record`](../record/SKILL.md) | Session evidence and the session memory tree. |
| [`memory`](../memory/SKILL.md) | Durable project memory. |
| [`git`](../git/SKILL.md) | Branch, worktree, commit, publication, merge, and recovery. |

### Entry and mode owners

| Skill | Owns |
|---|---|
| [`gobbi`](SKILL.md) | This entry: the system load, the mode selection, and the handoff. |
| [`cowork`](../cowork/SKILL.md) | Cowork, with its own Git contract, evaluation policy, and session locations. |
| [`workflow`](../workflow/SKILL.md) | Workflow, with its checkpointed phases, evaluation policy, and evidence layout. |

### Work operations

| Skill | Owns |
|---|---|
| [`study`](../study/SKILL.md) | Bounded internal or external study that answers one question from sources. |
| [`startup`](../startup/SKILL.md) | The project interview that produces confirmed design briefs. |
| [`execution`](../execution/SKILL.md) | Implementing one task and committing the verified result. |
| [`evaluation`](../evaluation/SKILL.md) | Independent evidence-based judgment of finished work. |

### Authoring the system

| Skill | Owns |
|---|---|
| [`skill-writing`](../skill-writing/SKILL.md) | Authoring or substantively revising one project skill. |
| [`agent-writing`](../agent-writing/SKILL.md) | Authoring a Gobbi agent's canonical Markdown and TOML pair. |
| [`claude-plugin`](../claude-plugin/SKILL.md) | The shared Claude Code and Codex plugin package and its manifests. |
| [`codex`](../codex/SKILL.md) | Native Codex entry surfaces and the read-only peer process. |

### Languages and platforms

Each of these roots covers work in its language or platform and routes the task to its applicable children.

| Skill | Covers |
|---|---|
| [`web`](../web/SKILL.md) | The web platform |
| [`html`](../html/SKILL.md) | HTML markup |
| [`css`](../css/SKILL.md) | CSS styling |
| [`typescript`](../typescript/SKILL.md) | TypeScript |
| [`react`](../react/SKILL.md) | React |
| [`go`](../go/SKILL.md) | Go |
| [`electron`](../electron/SKILL.md) | Electron |
| [`desktop`](../desktop/SKILL.md) | Installable desktop applications |
