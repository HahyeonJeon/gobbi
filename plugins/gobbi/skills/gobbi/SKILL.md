---
name: gobbi
description: "MUST load at session start and at every boundary that may discard session context. Loads Principles, then obtains and routes the user's General, Cowork, or Workflow mode selection."
allowed-tools: Read, Grep, Glob, Bash, AskUserQuestion
skill-type: operation
---

# Gobbi

Gobbi is the read-only entry operation for a Gobbi manager. It loads Principles, reports any configuration the
session is missing, obtains one session mode — General, Cowork, or Workflow — and one partner answer from the
user, then hands the session to that mode's owner.

Gobbi owns the load, the selection, the routing, and the session-wide authority and evaluation commitments
every mode inherits. General continues from the Principles foundation, Cowork uses
[`cowork`](../cowork/SKILL.md), and Workflow uses [`workflow`](../workflow/SKILL.md); those owners hold all
mode-specific creation, state, routing, execution, evaluation, and closure.

The entry writes nothing: reading configuration and asking the user are both reads. It runs again at every
boundary that may discard manager context and keeps an established mode whenever that mode's evidence still
validates.

## Principles

### Load the entry foundation from its durable source

A cold manager reads Principles, applicable project rules, and its role from the repository before acting.
Runtime memory, a task view, or a stale entry document cannot replace those sources.

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

- **MUST load Principles before any governed action and defer every other skill to its owner or trigger.**
  Gobbi may load Discussion just before it asks its own questions; selected mode owners and phases load their
  shared and phase-specific skills.

- **MUST preserve the system's dependency direction.** `gobbi`, `cowork`, `workflow`, `partner`, and
  `agent-teams` may reference any skill; `delegation`, `discussion`, `evaluation`, `git`, `ideation`,
  `planning`, and `memory` may reference nothing outside themselves; `wrap-up` may reference only `memory`,
  and nothing in that isolated set may reference `wrap-up`.

- **MUST hold the session to its selected mode's evaluation commitment.** Never apply an evaluator finding
  before the user approves its disposition, and pause with the exact failure when a required evaluation system
  is unavailable or invalid unless the user waives that named system for the round.

- **MUST keep the manager the session's only authority for assignment, scope, user decisions, acceptance, and
  destructive or external action.** Build every specialist brief through
  [`delegation`](../delegation/SKILL.md), keep all worktree writes in one ordered writer chain, and
  parallelize only independent read-only analysis and fresh independent evaluation.

Rule 4 names five linking skills, seven isolated skills, and `wrap-up`. Every skill it does not name is
unclassified: the rule constrains it in no direction, and it may reference anything. The isolated seven are
constrained on every outbound reference, not only on the skills Rule 4 names, so they may not reference an
unclassified skill either. Runtime and project nouns — `Claude`, `Codex`, `Gobbi`, and `git` as a program —
are not skill references.

## Procedure

### Phase 1 — Load Principles and Route the Selected Mode

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
  and no marker file under `memory/`. An empty directory asserts memory that does not exist.
  `rules/` is not bootstrapped, because every agent contract already
  reads an absent or empty `rules/` as `NO_PROJECT_RULES`.
- The entry defines this shape and creates none of it. The selected mode's owner creates each path when its
  first record needs it, so a missing directory is not a broken view and is not the failure below.
- Check the four configuration items below and report only the ones that are absent. A clean session should
  read no report at all, so every line the user does see names a real missing prerequisite. Check all four
  before reporting, so one report names every gap instead of exposing them one at a time.

| Item | How to check it | What its absence costs |
|---|---|---|
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` | `printenv CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` in the live session environment | No team is set up and no teammate is spawned |
| An `Agent(...)` permission for each role the session may spawn — `manager`, `leader`, `executor`, `evaluator`, and `assistant` | Read `permissions.allow` in the settings sources that apply, local before project before user | A role without its permission cannot be spawned |
| A `Skill(...)` permission for each Gobbi skill the session loads | The same `permissions.allow` sources | Skill use stays gated |
| The `.gobbi/` layout above, in its required tracked-or-ignored state | `git check-ignore --no-index -v <path>` for each path | The project memory root and its ignore posture are missing |

- Check the first three items in Claude Code only. They are Claude Code settings, and native Codex has neither
  the Agent Teams environment variable nor these permission gates, so reporting them there would name an
  absence that cannot exist. The `.gobbi/` layout item applies in both runtimes.
- Check and recommend the namespaced permission form — `Skill(gobbi:principles)` and `Agent(gobbi:leader)` —
  because the plugin namespaces every component it contributes. A live probe in a fresh consumer project with
  the plugin installed offered `gobbi:principles` and `gobbi:leader` only, and the bare `Skill(principles)`
  and `Agent(leader)` were absent. The bare form is correct in one case: a repository that resolves the skill
  from its own `.claude/skills` rather than from the plugin. This repository resolves them that way, which is
  why its own settings file lists `Skill(gobbi)` and not the namespaced form.
- Expect the first three items to be absent in a project that installed Gobbi as a plugin, because a plugin
  distributes skills and agents but contributes no `env` block and no `permissions` block. Name each absence
  with the exact setting that supplies it and continue; this check reports a prerequisite and stops nothing.
- Check no partner binary here. [`partner`](partner/SKILL.md) Step 1.1 owns that check, and a second copy of it
  would drift from the one that actually runs.
- Reading configuration is a read, so this check leaves the entry's no-mutation rule intact. Writing the
  environment variable would not help in any case: the runtime reads `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` at
  process start, so a mid-session write could not take effect.
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

#### 1.2 Load the entry foundation

- Read [`../principles/SKILL.md`](../principles/SKILL.md). Load no other skill in this step.
- Read applicable project rules, governing repository instructions, and the canonical
  [`manager` role](../../agents/manager.md). Record the repository's declared empty-rules state when no
  project rules exist.
- Confirm the load register holds Principles before any governed action, and return to it when it does not.
- Defer the complete Delegation, Discussion, Git, and Memory register to the selected Cowork or
  Workflow owner; defer Ideation, Planning, and Wrap-up to their named phases. General loads each
  task-specific skill only when its trigger applies.

#### 1.3 Obtain or preserve the session mode and the partner answer

- Start from the loaded Principles foundation and the recorded entry trigger.
- Load [Discussion](../discussion/SKILL.md) immediately before Gobbi writes a mode or partner question. At
  every fresh entry, use its structure and the active runtime's
  structured user-input request to ask the user to select exactly one mode. Set no automatic resolution:

| Mode | Select when | Evaluation commitment |
|---|---|---|
| **General** | The user wants ordinary assistance without a Gobbi orchestration lifecycle. | Only the evaluation its task owner requires. |
| **Cowork** | The user wants fast, stepwise implementation topics with optional Ideation and Planning. | No automatic partner creation round, and one fresh partner evaluation round for each explicit user `evaluate` call over the frozen requested subject. |
| **Workflow** | The user wants the durable five-step, partner-round, recorded workflow. | Retained independent partner drafts before every EVALUATION, and two fresh isolated evaluators for each EVALUATION. |

- Present the commitment column with the selection so the user chooses a known quality bar. State what each
  mode guarantees, not how it produces that guarantee.
- Name the commitment only. [`cowork`](../cowork/SKILL.md) and [`workflow`](../workflow/SKILL.md) own the
  mechanism behind their own commitment, and the entry never runs, schedules, or repeats an evaluation.
- A request may support a recommendation, but even explicit words such as "use Cowork" do not replace the
  selection control on a fresh entry.
- At a context boundary, keep the established selection while its mode evidence and identity still validate.
  Ask the three-way question again when no reliable selection survives or two modes appear active.
- After the mode is recorded, ask one further question through the same [Discussion](../discussion/SKILL.md)
  structure and control: whether this session uses the partner system for its Ideation and its evaluation
  rounds.
- Ask whether to use a partner, never which one. The active runtime fixes the direction — in Claude Code the
  partner is Codex, and in native Codex the partner is Claude Code — so the runtime leaves no second choice to
  make.
- Record the answer beside the mode and hand both to the selected owner. That owner holds the answer against
  its own evaluation commitment and returns to the user when the two conflict. The entry decides no gate,
  coverage rule, or waiver and runs no round itself; [`partner`](partner/SKILL.md) owns every round.
- Keep an established partner answer across a context boundary on the same terms as the mode, and ask again
  when its evidence is missing, ambiguous, or conflicting.

#### 1.4 Load the selected owner and hand off without mutation

- **General:** continue the user's task from Principles and load each task-specific skill when its trigger
  applies. Load neither orchestration owner — `cowork` and `workflow` — and create no Gobbi session state.
- **Cowork:** load [`../cowork/SKILL.md`](../cowork/SKILL.md). That owner creates or recovers its isolated
  worktree before editing and runs its user-topic loop.
- **Workflow:** load [`../workflow/SKILL.md`](../workflow/SKILL.md). That owner performs fresh and resume
  classification, Configuration, durable routing, productive steps, evaluation, RECORD, and Wrap-up.
- Before building a specialist brief, ensure [Delegation](../delegation/SKILL.md) is loaded. Cowork and
  Workflow load it in their shared owner register; General loads it from this trigger. Let the selected mode
  add its own brief fields. After a specialist reports, reread its artifact or commit and reproduce its
  verification before assigning further work.
- Use the [skill map](#references) to find a further task-specific skill, then load that skill from its own
  trigger. The map indexes what exists for routing; it loads nothing itself and gives no skill a second entry
  point.
- On missing or invalid mode evidence, owner artifacts, identity, or authority, preserve the prior state and
  report the exact blocker. Never invent a fallback mode, cursor, worktree, or direct specialist route.

## References

This is the complete map of the canonical Gobbi skill roots, plus the two children `gobbi` owns. Step 1.2
loads only Principles; selected owners, phases, and task triggers load every other skill. The map shows what
exists rather than what is loaded. Every other root that has children routes to them from its own document.

### Entry and shared operations

| Skill | Owns |
|---|---|
| [`principles`](../principles/SKILL.md) | The ten behavioral principles every agent applies. |
| [`ideation`](../ideation/SKILL.md) | Exploring a problem with the user and locking what and why. |
| [`planning`](../planning/SKILL.md) | Decomposing accepted work into an ordered executable plan. |
| [`wrap-up`](../wrap-up/SKILL.md) | Closing accepted work with durable memory and an exact handoff. |
| [`delegation`](../delegation/SKILL.md) | The brief shape every specialist assignment uses. |
| [`discussion`](../discussion/SKILL.md) | The shape of a question put to the user. |
| [`memory`](../memory/SKILL.md) | Temporary session records and durable project memory. |
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
| [`gobbi/partner`](partner/SKILL.md) | One partner round: its preparation, launch, validation, and returned frozen content. |
| [`gobbi/agent-teams`](agent-teams/SKILL.md) | Claude Code Agent Teams setup, use, limits, and cleanup. |
| [`study`](../study/SKILL.md) | Bounded internal or external study that answers one question from sources. |
| [`startup`](../startup/SKILL.md) | The delegated project-design interview that produces four accepted phase documents and one confirmed synthesis. |
| [`execution`](../execution/SKILL.md) | Implementing one task and committing the verified result. |
| [`evaluation`](../evaluation/SKILL.md) | Independent evidence-based judgment of finished work. |

### Authoring the system

| Skill | Owns |
|---|---|
| [`skill-writing`](../skill-writing/SKILL.md) | Authoring or substantively revising one project skill. |
| [`agent-writing`](../agent-writing/SKILL.md) | Authoring a Gobbi agent's canonical Markdown and TOML pair. |
| [`claude-plugin`](../claude-plugin/SKILL.md) | The shared Claude Code and Codex plugin package and its manifests. |
| [`codex`](../codex/SKILL.md) | The Codex CLI and native Codex entry surfaces. |

### Languages and platforms

Each of these roots covers work in its language or platform and routes the task to its applicable children.

| Skill | Covers |
|---|---|
| [`web`](../web/SKILL.md) | The web platform |
| [`html-css`](../html-css/SKILL.md) | HTML markup and CSS presentation |
| [`typescript`](../typescript/SKILL.md) | TypeScript |
| [`react`](../react/SKILL.md) | React |
| [`go`](../go/SKILL.md) | Go |
| [`electron`](../electron/SKILL.md) | Electron |
| [`desktop`](../desktop/SKILL.md) | Installable desktop applications |
