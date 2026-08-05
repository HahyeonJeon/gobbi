---
name: gobbi
description: "MUST load at session start and at every boundary that may discard session context. Loads Principles, then obtains and routes the user's General, Cowork, or Workflow mode selection."
allowed-tools: Read, Grep, Glob, Bash, AskUserQuestion
skill-type: operation
---

# Gobbi

Gobbi is the read-only entry operation for a Gobbi manager. It loads Principles, reports any configuration the
session is missing, obtains one session mode — General, Cowork, or Workflow — an applicable session slug, and
one session-wide `partner: enabled|disabled` policy, then hands the complete entry state to that mode's owner.

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

- **MUST hold the session to its selected mode's participant and finding commitments.** Automatically correct
  a finding only when its severity is High, Medium, or Low; `blocking: no`; it is inside the locked contract;
  and the correction is reversible, authority-neutral, non-destructive, and non-external. Send every other
  finding to the user, require fresh evaluation after every correction, and continue automatically only from
  PASS. A disabled partner policy invokes no external runtime.

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

- Take the entry trigger — session start, resume, `/clear`, rewind, or runtime compaction — plus the governance
  source, runtime, unchanged repository preimage, and loaded Gobbi skill path. The runtime-reported path is the
  only root input; use no search, environment variable, or configuration fallback.
- Treat the reported path and its parent as the two possible `{gobbi-skills-root}` values. For each candidate,
  derive `{gobbi-agents-root}` as its sibling `agents/` directory. Expand both roots to absolute paths and let
  the sentinels decide which candidate is valid; never decide from path spelling.
- Validate the candidates against the sentinels `gobbi/SKILL.md`, `principles/SKILL.md`, and
  `agents/manager.md`. Each sentinel must exist and be readable at the path its root produces. Exactly one
  candidate satisfies both skills sentinels; that candidate is `{gobbi-skills-root}`, and its `agents/`
  sibling must then satisfy the third:

| Sentinel path | Root | Proves |
|---|---|---|
| `{gobbi-skills-root}/gobbi/SKILL.md` | `{gobbi-skills-root}` | The entry document itself resolves from the root |
| `{gobbi-skills-root}/principles/SKILL.md` | `{gobbi-skills-root}` | A sibling skill resolves from that same root |
| `{gobbi-agents-root}/manager.md` | `{gobbi-agents-root}` | Agent contracts resolve independently of skills |

- A canonical or generated view is valid when exactly one candidate satisfies all sentinels. Record that fixed
  root pair with the source, runtime, trigger, and preimage. At every later entry, re-derive it and compare it
  with the owner's recorded pair. Stop and report both pairs if they differ; Gobbi cannot rewrite existing
  session facts or briefs.
- Resolve the project key `<project>` with:

```text
basename(dirname(git rev-parse --path-format=absolute --git-common-dir))
```

- `--git-common-dir` resolves the shared repository even from a session worktree. Validate the key against
  `^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$` at up to 64 characters; ask before deriving paths when it fails.
- Gobbi defines these paths:

```text
.gobbi/                          tracked
├── .gitignore                   tracked
└── projects/<project>/          tracked
    ├── memory/                  tracked   the project memory root
    ├── sessions/                ignored
    └── worktrees/               ignored
```

- `tracked` means not ignored; `ignored` covers the directory and every descendant. `.gobbi/.gitignore` is the
  only owner of these exact bytes:

```text
# Gobbi runtime state. Session evidence and linked worktrees are never tracked.
projects/*/sessions/
projects/*/worktrees/
```

  The middle slash prevents accidental matches inside durable memory. Never write the repository root
  `.gitignore`.
- Bootstrap only the namespace roots and ignore file. Create no category, session, marker, or `rules/` path.
  Gobbi defines this layout but writes none of it; the selected owner creates a path when its first record
  needs it.
- Check the four configuration items below and report only the ones that are absent. A clean session should
  read no report at all, so every line the user does see names a real missing prerequisite. Check all four
  before reporting, so one report names every gap instead of exposing them one at a time.

| Item | How to check it | What its absence costs |
|---|---|---|
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` | `printenv CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` in the live session environment | No team is set up and no teammate is spawned |
| An `Agent(...)` permission for each role the session may spawn — `manager`, `leader`, `executor`, `evaluator`, and `assistant` | Read `permissions.allow` in the settings sources that apply, local before project before user | A role without its permission cannot be spawned |
| A `Skill(...)` permission for each Gobbi skill the session loads | The same `permissions.allow` sources | Skill use stays gated |
| The `.gobbi/` layout above, in its required tracked-or-ignored state | `git check-ignore --no-index -v <path>` for each path | The project memory root and its ignore posture are missing |

- Check the first three items only in Claude Code and the layout in both runtimes. For plugin consumers,
  recommend namespaced permissions such as `Skill(gobbi:principles)` and `Agent(gobbi:leader)`; use bare names
  only for repository-local `.claude/skills`. Report all missing items together without stopping. Do not write
  configuration or probe the partner binary; [`partner`](partner/SKILL.md) Step 1.1 owns that probe.
- Stop here when no candidate resolves a root, when both candidates satisfy the same sentinels, when a
  sentinel is missing or unreadable, when a re-derived root differs from the pair this session already
  recorded, or when the resolved view is otherwise partial or inconsistent. Name the exact broken element:
  for a sentinel failure, the affected root, the exact sentinel path, and whether that path was absent or
  unreadable; for an ambiguous or a diverged pair, both candidate roots. Repair a sentinel failure by
  restoring the runtime's Gobbi package or entrypoint from its canonical source; an ambiguous or a diverged
  pair needs the user's decision instead. The repository's governing instructions own any repository-local
  repair command, and no step continues against a partial view.
- This stop fires before Step 1.3. Never select a mode, load an owner, or build a brief without the validated
  pair.

#### 1.2 Load the entry foundation

- Read [`../principles/SKILL.md`](../principles/SKILL.md). Load no other skill in this step.
- Read applicable project rules, governing repository instructions, and the canonical
  [`manager` role](../../agents/manager.md). Record the repository's declared empty-rules state when no
  project rules exist.
- Confirm Principles before governed action. Defer every other skill to the selected owner or its task trigger.

#### 1.3 Obtain or preserve mode, applicable slug, and partner policy

- Load [Discussion](../discussion/SKILL.md) immediately before a mode, slug, or partner question. At every fresh
  entry, use the active runtime's structured user-input request with no automatic resolution:

| Mode | Select when | Participant and evaluation commitment |
|---|---|---|
| **General** | The user wants ordinary assistance without a Gobbi orchestration lifecycle. | Local participants and evaluation come only from the task owner; the partner policy applies only when that owner requires an external run. |
| **Cowork** | The user wants fast, stepwise implementation topics with optional Ideation and Planning. | Every selected stage self-reviews; explicit evaluation always uses one fresh isolated active-runtime evaluator and adds one external evaluator only when partner is enabled. |
| **Workflow** | The user wants the durable five-step recorded workflow. | Every WORK uses one assigned active-runtime draft with self-review and adds the applicable external draft or review only when partner is enabled; every EVALUATION always uses one fresh isolated active-runtime evaluator and adds one external evaluator only when enabled. |

- Present the commitment column. A request may support a recommendation but never records a fresh selection.
  On a boundary, preserve a validated selection and ask again only when its evidence is missing, ambiguous, or
  conflicting. The selected owner, not Gobbi, supplies each commitment's mechanism.
- After recording fresh Cowork or Workflow, warn that the session slug enters branch names and paths and must
  not contain sensitive information. Ask for the slug through the same [Discussion](../discussion/SKILL.md)
  structure and control. Normalize it by taking each maximal ASCII alphanumeric sequence as one word,
  lowercasing it, joining the words with one hyphen, and trimming separators. Do not transliterate, truncate,
  or add a suffix. Accept only 1–20 characters matching `^[a-z0-9]+(?:-[a-z0-9]+)*$` and reject `con`, `prn`,
  `aux`, `nul`, `com1` through `com9`, and `lpt1` through `lpt9`, case-insensitively. Re-ask with the failed
  condition when normalization is empty, longer than 20 characters, or reserved. General skips this question
  and records `slug: not-applicable`; it creates no Gobbi identity. A recovered new session preserves its
  recorded normalized slug. A recovered legacy session preserves `slug: not-applicable` and receives no slug
  question.
- After the applicable slug is recorded, ask whether the session-wide partner policy is `enabled` or
  `disabled`. Ask whether to use a partner, never which runtime; the active runtime fixes the direction.
- Record mode, applicable normalized slug, and partner policy together. Cowork and Workflow consume all three;
  General consumes mode and policy without creating session state. Enabled authorizes the owner to call
  [`partner`](partner/SKILL.md) whenever its mode requires; disabled authorizes none.
- At a boundary, preserve every validated value and ask only for missing, ambiguous, or conflicting evidence,
  in mode → applicable slug → partner order. Never rename a slug used by an existing session object.

#### 1.4 Apply the session-wide finding gate

- Automatically correct a finding only when its severity is High, Medium, or Low; `blocking: no`; it remains
  inside the locked contract; and the correction is reversible, authority-neutral, non-destructive, and
  non-external.
- Send every other finding to the user for accept, reject, or defer disposition. Every correction requires
  fresh evaluation, and only a verified PASS continues automatically.

#### 1.5 Load the selected owner and hand off without mutation

- **General:** hand `mode: General`, `slug: not-applicable`, and the partner policy to the task owner. Continue
  from Principles and load each task-specific skill when its trigger applies. Load neither orchestration owner
  — `cowork` and `workflow` — and create no Gobbi identity or session state.
- **Cowork:** hand mode, the applicable normalized slug or legacy `not-applicable`, and partner policy to
  [`../cowork/SKILL.md`](../cowork/SKILL.md). That owner generates or recovers its identity, creates or
  recovers its isolated worktree before editing, and runs its user-topic loop.
- **Workflow:** hand mode, the applicable normalized slug or legacy `not-applicable`, and partner policy to
  [`../workflow/SKILL.md`](../workflow/SKILL.md). Configuration generates or recovers the identity and records
  the complete entry state before durable routing, productive steps, evaluation, RECORD, and Wrap-up.
- Before a specialist brief, load [Delegation](../delegation/SKILL.md), add the selected mode's fields, and
  resolve every required skill and role from the validated root pair. After the report, reread the result and
  reproduce its verification before another assignment.
- Use the [skill map](#references) to find a further task-specific skill, then load that skill from its own
  trigger. The map indexes what exists for routing; it loads nothing itself and gives no skill a second entry
  point.
- On missing or invalid mode evidence, owner artifacts, identity, or authority, preserve state and report the
  exact blocker. Never invent a fallback mode, cursor, worktree, or specialist route.

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
| [`gobbi/partner`](partner/SKILL.md) | One external invocation: its preparation, launch, validation, and returned frozen content. |
| [`gobbi/agent-teams`](agent-teams/SKILL.md) | Claude Code Agent Teams setup, use, limits, and cleanup. |
| [`study`](../study/SKILL.md) | Bounded internal or external study that answers one question from sources. |
| [`startup`](../startup/SKILL.md) | The delegated project-design interview that produces five accepted phase documents and one confirmed synthesis. |
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
