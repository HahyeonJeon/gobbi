---
name: gobbi
description: "Gobbi is the read-only entry operation that establishes and routes General, Cowork, or Workflow session state."
allowed-tools: Read, Grep, Glob, Bash, AskUserQuestion
skill-type: operation
---

# Gobbi

Gobbi establishes the manager's durable entry state and routes it without mutation. Use it at session start
and after any boundary that may discard manager context.

## Principles

### Load the durable foundation

Read the canonical principles, project rules, role, and entry owners before governed action. Runtime memory
and a surviving task list do not replace these sources.

### Let the user select the mode

General, Cowork, and Workflow make different commitments. Present all three at fresh entry and let the user
choose.

### Preserve proved entry state

Keep a validated mode, slug, partner policy, and root pair across a context boundary. Ask again only when
evidence is missing, ambiguous, or conflicting.

### Leave work to its owner

Gobbi owns entry and routing only. The selected mode owns session state, and task skills own their work.

## Rules

- **NEVER mutate from Gobbi entry.** Create no branch, worktree, session record, artifact, configuration, or
  implementation.
- **MUST obtain an explicit mode selection at every fresh entry.** Use `AskUserQuestion` in Claude Code,
  `request_user_input` in Codex, the official Ask questions tool in Cursor (identifier pending), or
  `ask_user_question` in Grok; a recommendation cannot select the mode.
- **MUST validate one Gobbi root pair and load the entry foundation before routing.** Hold the pair unchanged
  for the session, carry it into every specialist brief, and include a skills index and a docs index of name,
  absolute path, and description.
- **MUST preserve skill ownership.** References expose owners but do not load them, and task triggers still
  decide which task skill applies.
- **MUST apply the session-wide finding gate.** Every correction receives fresh evaluation, and only a verified
  PASS continues automatically.
- **MUST keep the manager as the only authority for assignment, scope, user decisions, acceptance, and
  external or destructive action.** Build specialist prompts through Delegation and keep writes in one ordered
  chain.

## Procedure

### Phase 1 — Establish the Entry

#### 1.1 Resolve the Gobbi roots

- Take the loaded Gobbi skill path reported by the runtime. Treat that path and its parent as the only two
  candidate `{gobbi-skills-root}` values, and derive each candidate's sibling `agents/` directory.
- Accept exactly one candidate pair that resolves all three readable sentinels:

  | Sentinel | Proves |
  |---|---|
  | `{gobbi-skills-root}/gobbi/SKILL.md` | The entry skill resolves from the skills root. |
  | `{gobbi-skills-root}/principles/SKILL.md` | A sibling skill resolves from the same root. |
  | `{gobbi-agents-root}/manager.md` or `{gobbi-agents-root}/claude/manager.md` | Role contracts resolve from a runtime-flat or runtime-folder agents root. |

- Expand and record the accepted pair with the runtime and entry trigger. Re-derive it after every context
  boundary; stop with both observations when no pair, two pairs, a partial pair, or a changed pair appears.

#### 1.1.1 Specialist root pair

- The two roots are one pair. A brief supplies both as absolute expanded paths, or supplies neither.
- A specialist that holds neither derives `{gobbi-agents-root}` from its own contract location and
  `{gobbi-skills-root}` from the sibling `skills/` directory.
- Never guess a root. Never substitute a hardcoded repository path.
- Validate whichever pair the specialist holds before resolving any `{gobbi-skills-root}` path against the
  three sentinels above.
- Each held value must be an absolute expanded path. The three sentinels must exist and be readable.
- Report the exact token and stop:
  - exactly one root → `NO_GOBBI_ROOT: <missing-root> partial-pair`
  - relative, unexpanded, or placeholder value → `NO_GOBBI_ROOT: <root> <value> not-an-absolute-path`
  - missing or unreadable sentinel → `NO_GOBBI_ROOT: <root> <sentinel-path> absent-or-unreadable`
  - neither root and location underivable → `NO_GOBBI_ROOT: both-roots location-underivable`
- A brief that carries one root, a relative value, an unexpanded value, or a placeholder is a defect.
  The manager repairs it before reassigning.

#### 1.2 Resolve the project layout

- Derive the project key with
  `basename(dirname(git rev-parse --path-format=absolute --git-common-dir))`. Accept at most 64 lowercase
  alphanumeric or hyphen characters matching `^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$`; ask before deriving paths
  when it fails.
- Use this layout:

  ```text
  .gobbi/                          tracked
  ├── .gitignore                   tracked
  └── projects/<project>/          tracked
      ├── agents/                  tracked, 0-byte README.md
      ├── skills/                  tracked, 0-byte README.md
      ├── memory/                  tracked
      │   ├── design/
      │   │   ├── README.md         tracked, 0-byte
      │   │   ├── architecture/
      │   │   ├── feature/
      │   │   ├── process/
      │   │   └── roadmap/
      │   ├── learnings/
      │   ├── reports/
      │   │   ├── README.md         tracked, 0-byte
      │   │   ├── note/
      │   │   ├── review/
      │   │   └── analysis/
      │   ├── history/README.md     tracked, 0-byte
      │   ├── materials/
      │   │   ├── README.md         tracked, 0-byte
      │   │   ├── references/
      │   │   ├── assets/
      │   │   ├── docs/
      │   │   └── data/
      │   └── backlogs/README.md    tracked, 0-byte
      ├── sessions/                ignored, not created by setup
      └── worktrees/               ignored, not created by setup
  ```

  `.gobbi/.gitignore` owns these exact runtime-state entries:

  ```text
  # Gobbi runtime state. Session evidence and linked worktrees are never tracked.
  projects/*/sessions/
  projects/*/worktrees/
  ```

- Gobbi writes none of this layout. [Gobbi Setup](../gobbi-setup/SKILL.md) is its write owner and creates the
  namespace, Memory tree, placeholders, settings, and Codex roles when the user invokes it; it creates no
  `sessions/`, `worktrees/`, marker, or `rules/` path.

#### 1.3 Stop on an unsafe layout

- Probe local layout paths and ignore ownership with `test` and `git check-ignore`. Do not invoke setup or
  a prerequisite script.
- Stop before routing when those probes show a partial, contradictory, unreadable, or unsafe layout, and
  point the user at [Gobbi Setup](../gobbi-setup/SKILL.md).
- For plugin consumers, recommend namespaced permissions such as `Agent(gobbi:programmer)` and
  `Skill(gobbi:principles)`; repository-local Claude skills use bare names. Partner availability belongs to
  the [Partner Manual](partner/SKILL.md#availability).

#### 1.4 Load the entry foundation

- Read [Principles](../principles/SKILL.md), [Discussion](../discussion/SKILL.md), and
  [Delegation](../delegation/SKILL.md), in that order.
- Read applicable repository instructions, every applicable project rule, and the canonical
  [manager role](../../agents/manager.md) for Claude, [grok/manager.md](../../runtimes/grok/manager.md) for Grok, [codex/manager.toml](../../runtimes/codex/manager.toml) for Codex, and [cursor/manager.md](../../runtimes/cursor/manager.md) for Cursor. Record `NO_PROJECT_RULES: rules/ absent-or-empty` when the rules
  directory is absent or empty.
- Confirm the foundation and fixed root pair. Defer every other skill to the selected mode or its own trigger.

### Phase 2 — Select and Route the Mode

#### 2.1 Obtain or preserve the mode

- At fresh entry, use Discussion and the active structured input control to present all three choices:

  | Mode | Use when | Commitment |
  |---|---|---|
  | **General** | Ordinary assistance needs no Gobbi lifecycle. | Task owners decide participants and evaluation. |
  | **Cowork** | The user wants bounded topics with Fast or Light delivery. | The user controls topic decisions, evaluation calls, and closure. |
  | **Workflow** | Work needs durable phase checkpoints and autonomous delivery. | After Configuration, wait for delivered work; Phase 1 Ideation still includes user design decisions; later phases run until each User Review TODO, then wait for explicit continue. |

- After selection, publish the selected owner's complete native TODO template before asking for a slug or
  partner policy. General publishes no Gobbi TODO; Cowork and Workflow supply their own fixed templates.
- Across a boundary, preserve a validated selection. Ask again only when mode evidence is missing, ambiguous,
  or conflicting.

#### 2.2 Resolve the slug and partner policy

- For Cowork or Workflow, warn that the slug enters paths and branch names. Ask for the slug and session-wide
  partner policy together through one structured request; General records `slug: not-applicable` and asks only
  for the policy.
- Normalize the slug by lowercasing each maximal ASCII alphanumeric sequence, joining sequences with one
  hyphen, and trimming separators. Do not transliterate, truncate, or append a suffix; accept 1–20 characters
  matching `^[a-z0-9]+(?:-[a-z0-9]+)*$` and reject Windows device names from `con`, `prn`, `aux`, and `nul`
  through `com1`–`com9` and `lpt1`–`lpt9`.
- Ask one Partner policy with that slug: `disabled`, or a multi-select of `{claude-code, codex, cursor, grok}`
  limited to one or two names. Record `disabled` as that word, or the distinct names in lexicographic order
  joined by one comma and no spaces. Valid values are `disabled`, `claude-code`, `codex`, `cursor`, `grok`,
  `claude-code,codex`, `claude-code,cursor`, `claude-code,grok`, `codex,cursor`, `codex,grok`, and
  `cursor,grok`.
- Record mode, normalized slug when applicable, and that one Partner field together. A named set authorizes
  launch of the selected names minus the active runtime; `disabled` authorizes no launch. A value outside the
  grammar, including recovered `enabled`, is invalid and a stop; recovered `disabled` stays valid. Do not add
  a second policy field or rewrite an empty launch set to `disabled`.

#### 2.3 Apply the session-wide finding gate

- Correct a finding automatically only when its severity is High, Medium, or Low; `blocking: no`; it stays
  inside the locked contract; and it is reversible, authority-neutral, non-destructive, and non-external.
- Send every other finding to the user in General, Cowork, and Workflow Phase 1. After completed
  `P1 · User Review`, the manager decides from the accepted design, authority, available subagents or
  teammates, and remaining Partner runtimes, or writes a stopped `handoff.md` without asking the user.
- Run fresh evaluation after every correction. Continue automatically only from a verified PASS.

#### 2.4 Hand off the selected route

- Hand the complete entry state to one owner:

  | Mode | Handoff |
  |---|---|
  | **General** | Mode, `slug: not-applicable`, and partner policy; no orchestration owner or session state. |
  | **Cowork** | Mode, normalized slug, partner policy, runtime, and validated root pair to [Cowork](../cowork/SKILL.md). |
  | **Workflow** | Mode, normalized slug, partner policy, runtime, and validated root pair to [Workflow](../workflow/SKILL.md). |

- Before specialist work, load Delegation, add the selected owner's fields, and put a skills index and a docs
  index of name, absolute path, and description in the brief. Resolve those paths from the validated root pair.
  The specialist loads an index row only when the assignment cannot proceed without it.
- Stop with the exact blocker when mode evidence, owner evidence, identity, path, or authority is invalid.
  Never invent a fallback mode, cursor, worktree, session directory, or participant route.

## References

| Name | Description |
|---|---|
| [Principles](../principles/SKILL.md) | Defines the behavioral foundation loaded at entry. |
| [Discussion](../discussion/SKILL.md) | Defines structured questions, evidence-backed options, and user decisions. |
| [Delegation](../delegation/SKILL.md) | Defines every specialist prompt, skills and docs indexes, and final Handoff. |
| [Manager role](../../agents/manager.md) | Defines session authority, routing, assignment, and acceptance. Runtime copies: [Grok](../../runtimes/grok/manager.md), [Codex](../../runtimes/codex/manager.toml), [Cursor](../../runtimes/cursor/manager.md). |
| [Cowork](../cowork/SKILL.md) | Owns user-led bounded topics, explicit evaluation, and explicit closure. |
| [Workflow](../workflow/SKILL.md) | Owns checkpointed phases and User Review waits. |
| [Partner](partner/SKILL.md) | Defines each write-bounded opposite-runtime invocation. |
| [Agent Teams](agent-teams/SKILL.md) | Defines Claude Code teammate coordination and context-aware re-delegation. |
| [Gobbi Setup](../gobbi-setup/SKILL.md) | Owns the separately invoked operation that writes a consumer project's missing layout, placeholders, settings, and Codex role contracts, and reports the rest. |
