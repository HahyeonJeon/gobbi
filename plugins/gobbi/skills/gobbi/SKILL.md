---
name: gobbi
description: "Gobbi is the read-only entry that sets up and routes a Cowork or Workflow session. Use it when the user starts or resumes a Gobbi session."
allowed-tools: Read, Grep, Glob, Bash, AskUserQuestion
disable-model-invocation: true
skill-type: operation
---

# Gobbi

Gobbi establishes the manager's durable entry state and routes it without mutation. Only the user starts it.
After a boundary that may discard manager context, the manager rereads this file by path.

## Principles

### Load the durable foundation

Read the canonical principles, project rules, and role before governed action. Runtime memory does not
replace these sources.

### Let the user select the mode

Cowork and Workflow make different commitments. Present both at fresh entry and let the user choose.

### Preserve proved entry state

Keep a validated mode, slug, partner policy, and root pair across a context boundary. Ask again only when
evidence is missing, ambiguous, or conflicting.

### Leave work to its owner

Gobbi owns entry and routing only. The selected mode owns session state, and task skills own their work.

## Rules

- **NEVER mutate from Gobbi entry.** Entry runs before the user picks a mode, and the selected mode owns every
  branch, worktree, session record, artifact, configuration, and implementation.
- **MUST obtain an explicit mode selection at every fresh entry.** The modes make commitments only the user can
  accept, so a recommendation cannot select one.
- **Validate one Gobbi root pair and load the entry foundation before routing.** Every specialist path
  resolves from that pair, so a wrong pair sends every later read to the wrong files.
- **MUST apply the session-wide finding gate in Step 2.3.** A correction can break what it fixed, so each one
  gets fresh review and only a verified PASS continues automatically.
- **MUST keep the manager as the only authority for assignment, scope, user decisions, acceptance, and
  external or destructive action.** One authority keeps writes in one ordered chain and every user decision
  with the agent that talks to the user.

## Procedure

### Phase 1 — Establish the Entry

Prove where Gobbi lives and read what governs the session. Done when one validated root pair and the project
key are recorded and the entry foundation is read.

#### 1.1 Resolve the Gobbi roots

- Take the loaded Gobbi skill path reported by the runtime. Treat that path and its parent as the only two
  candidate `{gobbi-skills-root}` values, and derive each candidate's sibling `agents/` directory.
- Accept exactly one candidate pair that resolves all three readable sentinels:

  | Sentinel | Proves |
  |---|---|
  | `{gobbi-skills-root}/gobbi/SKILL.md` | The entry skill resolves from the skills root. |
  | `{gobbi-skills-root}/principles/SKILL.md` | A sibling skill resolves from the same root. |
  | `{gobbi-agents-root}/manager.md` or `{gobbi-agents-root}/claude/manager.md` | Role contracts resolve from a runtime-flat or runtime-folder agents root. |

- Record the accepted pair as absolute expanded paths with the runtime and entry trigger. Re-derive it after
  every context boundary; stop with both observations when no pair, two pairs, a partial pair, or a changed
  pair appears.

#### 1.2 Hand specialists the same pair

- A brief supplies both roots as absolute expanded paths, or neither. A specialist that holds neither derives
  `{gobbi-agents-root}` from its own contract location and `{gobbi-skills-root}` from the sibling `skills/`.
- A specialist checks the pair it holds against the three sentinels before resolving any path from it, and
  reports a missing, relative, or unresolvable root as Blocked with the observed value.

#### 1.3 Resolve the project key

- Derive the key with `basename(dirname(git rev-parse --path-format=absolute --git-common-dir))`. Accept at
  most 64 lowercase ASCII letters, digits, and inner hyphens, and ask before deriving paths when it fails.
- Project paths live under `.gobbi/projects/<project>/`, laid out in
  [Claude Code setup](setup/claude.md#project-layout). Entry neither creates nor checks that layout.

#### 1.4 Load the entry foundation

- Read [Principles](../principles/SKILL.md), applicable repository instructions, every applicable project rule,
  and the manager role: [claude/manager.md](../../agents/manager.md) for Claude,
  [grok/manager.md](../../runtimes/grok/manager.md) for Grok, [codex/manager.toml](../../runtimes/codex/manager.toml)
  for Codex, or [cursor/manager.md](../../runtimes/cursor/manager.md) for Cursor.
- Record `NO_PROJECT_RULES: rules/ absent-or-empty` when the rules directory is absent or empty.
- Load [Discussion](../discussion/SKILL.md), [Delegation](../delegation/SKILL.md), and every other skill on
  first use, through the selected mode or its own trigger.

### Phase 2 — Select and Route the Mode

Route the session to one owner under one finding gate. Done when the mode, normalized slug, partner policy,
runtime, and validated root pair are handed to one owner, or entry stops with the exact blocker.

#### 2.1 Obtain or preserve the mode

- At fresh entry, use Discussion and the active structured input control to present both choices:

  | Mode | Use when | Commitment |
  |---|---|---|
  | **Cowork** | The user leads the work request by request, and related requests stay in one topic. | The user controls new topics, decisions, review calls, and closure. |
  | **Workflow** | Work needs durable phase checkpoints and autonomous delivery. | After Configuration, wait for delivered work; Phase 1 Ideation still includes user design decisions; later phases run until each User Review, then wait for explicit continue. |

- Across a boundary, preserve a validated selection. Ask again only when mode evidence is missing, ambiguous,
  or conflicting.

#### 2.2 Resolve the slug and partner policy

- Warn that the slug enters paths and branch names, then ask for the slug and the session-wide Partner policy
  together in one structured request.
- Normalize the slug to 1–20 lowercase ASCII letters, digits, and single inner hyphens, without
  transliterating, truncating, or appending a suffix, because it becomes part of every session path.
- Record the Partner policy as one of `disabled`, `claude-code`, `codex`, `grok`, `claude-code,codex`,
  `claude-code,grok`, or `codex,grok`; any other recovered value, including `enabled`, is a stop. A named set
  authorizes launching those runtimes except the active one, and `disabled` authorizes none.

#### 2.3 Apply the session-wide finding gate

- Correct a blocking finding automatically only when its fix stays inside the accepted Goal and design and is
  reversible, authority-neutral, non-destructive, and non-external.
- Send every other blocking finding to the user in Cowork and in Workflow Phase 1, and record follow-ups as
  [Review](../review/SKILL.md) Step 3.1 says. After completed
  `P1 · User Review`, the manager decides from the accepted design, authority, available subagents or
  teammates, and remaining Partner runtimes, or writes a stopped `handoff.md` without asking the user.
- Run fresh review after every correction. Continue automatically only from a verified PASS.

#### 2.4 Hand off the selected route

- Hand the complete entry state to one owner:

  | Mode | Handoff |
  |---|---|
  | **Cowork** | Mode, normalized slug, partner policy, runtime, and validated root pair to [Cowork](../cowork/SKILL.md). |
  | **Workflow** | Mode, normalized slug, partner policy, runtime, and validated root pair to [Workflow](../workflow/SKILL.md). |

- Build each specialist brief through Delegation: a Role for the named specialist, its phase in Context, the
  selected owner's fields, the root pair, and in Materials a skills index and a docs index of name, absolute
  path, and description resolved from that pair. The specialist loads an index row when it bears on the Goal.
- Stop with the exact blocker when mode evidence, owner evidence, identity, path, or authority is invalid.
  Never invent a fallback mode, cursor, worktree, session directory, or participant route.

#### 2.5 Spawn each specialist as its role

- Spawn every specialist as the Gobbi role that owns its work, never as a general-purpose agent, because the
  role file carries the model, tools, and limits that work was set up for:

  | Work | Role |
  |---|---|
  | Lookup, and the Memory or record work a brief names | `assistant` |
  | Ideation and Planning, in any domain | `leader` |
  | Execution that changes code with no visual surface: logic, tests, and run and build config | `developer` |
  | Execution with a visual element: UI and UX, HTML and web pages, images, video, presentations, reports; it may use the coding skills | `designer` |
  | Execution that changes durable docs, skills, or the changelog | `author` |
  | Review of a result another agent produced | `reviewer` |

- Use the runtime's own subagent mechanism with that role: the Agent tool with `subagent_type` `gobbi:<role>` in
  Claude Code, the custom agent `<role>` from `.codex/agents/` in Codex, and the subagent `<role>` that the
  Gobbi plugin or adapter provides in Cursor and Grok.
- Give a task that spans domains to the role of its main result, which also updates what the change makes
  stale, and split it when each domain needs its own result. When the role's agent is unavailable, stop and
  tell the user instead of substituting another agent.

#### 2.6 Pass recorded lessons into each brief

- Before the first brief of a Goal, scan the `##` headings of the project's `memory/learnings/*/*.md` and check
  each matching entry against its current owner, because a lesson can describe superseded work.
- Copy each matching mistake's Correction into Constraints and each matching tip into Context, citing its path
  and heading.
- Follow the entries that match your own actions.

## References

| Name | Description |
|---|---|
| [Principles](../principles/SKILL.md) | Defines the behavioral foundation loaded at entry. |
| [Discussion](../discussion/SKILL.md) | Owns the SOP for understanding the task, studying options with participants, and deciding with the user. |
| [Delegation](../delegation/SKILL.md) | Defines the brief template and the final Handoff for work handed to another agent. |
| [Manager role](../../agents/manager.md) | Defines session authority, routing, assignment, and acceptance. Runtime copies: [Grok](../../runtimes/grok/manager.md), [Codex](../../runtimes/codex/manager.toml), [Cursor](../../runtimes/cursor/manager.md). |
| [Cowork](../cowork/SKILL.md) | Owns user-led topics, explicit review, and explicit closure. |
| [Workflow](../workflow/SKILL.md) | Owns checkpointed phases and User Review waits. |
| [Partner](../partner/SKILL.md) | Defines how the manager launches a partner CLI in the background, reads its output, and follows up. |
| [Claude Code setup](setup/claude.md) | How to install Gobbi and create missing layout for Claude Code. |
| [Codex setup](setup/codex.md) | How to install Gobbi and create missing layout for Codex. |
| [Cursor setup](setup/cursor.md) | How to load Gobbi and create missing layout for Cursor. |
| [Grok setup](setup/grok.md) | How to install Gobbi and create missing layout for Grok. |
