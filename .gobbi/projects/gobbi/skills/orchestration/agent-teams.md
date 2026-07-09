# Agent Teams

Sub-document of the `orchestration` skill. The **operator guide** for Claude Code Agent Teams in gobbi:
setup, delegating to teammates, and managing the team's lifecycle. Native Codex does not use this surface; it fresh-spawns specialists per `delegation/SKILL.md`. Agent Teams is the mechanism
behind subagent CONTINUATION — a teammate is a persistent Claude Code session re-addressed by name
via `SendMessage`, with its own context preserved across turns. Continuing a teammate is what lets
the manager send a small delta-brief instead of re-pasting the full brief on every dispatch.

**Roster.** Teammates (continuation-capable, in the Agent Team) are **leader**, **executor**, and
**assistant**. The **manager is the team lead**. The **evaluator is the SOLE fresh, never-teammate,
report-back subagent** — kept OUT of the team (producer/evaluator separation + dual-system
independence; non-negotiable).

The continue-vs-fresh **decision rule** (when to continue a teammate vs spawn fresh) and the
**delta-brief** contents are owned by [`delegation/SKILL.md` § Continue vs Fresh](../delegation/SKILL.md#continue-vs-fresh).
This doc does NOT re-derive that rule — it points to it. This doc covers the operator surface:
turning Agent Teams on, handing work to a teammate, and running the team.

For the workflow governor and the global 6-step state machine, see
[`orchestration/SKILL.md`](SKILL.md). For the summary that points here, see
[`orchestration/SKILL.md` § Agent Teams](SKILL.md#agent-teams).

---

## Setup (operator pre-check)

Agent Teams is **experimental and disabled by default**. Enable it before a session whose features
need teammate continuation. Requires Claude Code **v2.1.32+** (check `claude --version`).

**Enable via the `env` block** in `settings.json`:

```json
{
  "env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" }
}
```

**Teammate display mode** — set `teammateMode` in `settings.json`:

| Value | Behavior |
|---|---|
| `"auto"` (default) | Uses tmux split panes if already running inside tmux; otherwise in-process. |
| `"in-process"` | Runs teammates in the same terminal — needs no tmux or iTerm2. |
| `"tmux"` | Forces split panes — needs tmux, or iTerm2 with the `it2` helper. |

Per-session override without editing settings: `claude --teammate-mode in-process`.

**Settings scope + precedence** (lowest to highest):

1. User — `~/.claude/settings.json`
2. Project — `.claude/settings.json`
3. Project-local — `.claude/settings.local.json`
4. CLI flag (e.g. `--teammate-mode`)
5. Managed settings

Recommend the **project file** (`.claude/settings.json`) for a repo whose features need Agent Teams,
so the setting travels with the repo.

**Restart required.** Env vars are read at session start. Enabling
`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` mid-session has no effect until a fresh session.

**Default teammate model.** Teammates do NOT inherit the lead's `/model`. Set "Default teammate
model" in `/config` (or pick "leader's model") so teammates run on the intended model.

**gobbi ships this already.** gobbi's project `.claude/settings.json` (committed this session)
sets `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS: "1"` and `teammateMode: "in-process"`. A gobbi session
in this repo has Agent Teams on without further setup.

---

## Delegating to teammates

How the manager hands work to a teammate.

**First spawn loads the full stack; continuation turns carry a delta-brief.** A teammate loads
CLAUDE.md + skills + MCP fresh on its first turn — it does NOT inherit the lead's conversation. So
the **first** spawn carries the full Load Directives stack plus the full brief. Each **continuation**
turn carries a **delta-brief** (next-step goal + new inputs + re-anchor on changed
rules/mistakes/scope + re-stated scope + status enum) — never a full re-paste. The decision rule and
the exact delta-brief fields live in
[`delegation/SKILL.md` § Continue vs Fresh](../delegation/SKILL.md#continue-vs-fresh).

**Address a teammate by name via `SendMessage`.** The manager assigns predictable names at spawn so
each continuation turn re-addresses the right teammate.

**Two sanctioned use-modes.**

| Mode | Shape | Cost | When |
|---|---|---|---|
| **1 — Sequential single long-lived teammate** | One persistent teammate per role-chain, continued turn by turn | The token-saving default | The default for the leader chain (Ideation sub-steps), the executor chain (shared subsystem, under cap), and the assistant chain (e.g. RECORD across loops). The token win holds ONLY here. |
| **2 — Bounded parallel teammate fan-out (3–5)** | Several teammates exploring in parallel | Explicitly higher — cost scales linearly with teammate count | Only where parallel adversarial value is real (e.g. research breadth). Not the default; the higher cost is accepted knowingly. |

Mode 1 is the default; Mode 2 is opted into for real parallel value, knowing the cost.

**Referencing a subagent definition.** A teammate may reference a subagent definition by name. The
definition's `tools` + `model` are honored, and the definition body is appended to the teammate's
system prompt. **Caveat:** a subagent definition's `skills` / `mcpServers` frontmatter is NOT applied
when it runs as a teammate — load those via the Load Directives block in the first-spawn brief
instead.

**Continuation write-discipline.** The absolute-worktree-path + `git -C <worktree-abs>` + re-anchor
discipline for a continued turn is owned by
`agents/{leader,executor,assistant}.md § Continuation discipline` — see that section, not here. A
continued teammate's `cd` does not persist across tool boundaries, so every Write and git op uses
absolute worktree paths.

---

## Managing teammates

Lifecycle, coordination policy, and hard limits.

**Lifecycle.** The manager creates the team → assigns work via a **manager-owned** shared task list
→ messages teammates by name → requests graceful shutdown → cleans up the team.

**No teammate cross-talk.** All coordination flows through the manager. Teammates do NOT message each
other — this preserves gobbi's manager-centralized judgment (the manager owns judgment, scope, and
verification). This is a **gobbi policy** layered on top of Agent Teams' native any-to-any messaging;
the native capability exists, gobbi disables it by discipline.

**Hard limits** (from the Agent Teams docs):

- **One team at a time** — clean up the current team before starting a new one.
- **No nested teams** — only the manager spawns teammates; a teammate cannot spawn teammates.
- **Lead is fixed** — the team lead does not change for the team's lifetime.
- **Teammates do NOT survive `/resume`, `/compact`, or `/rewind`.** After any of those, the manager
  treats continuation as broken: it **fresh-spawns and re-primes from durable session record** —
  it never messages a dead teammate.
- **Lag** — task status can lag the real state, and graceful shutdown can be slow.

**Quality-gate hooks** (`settings.json` `hooks`) are the enforcement surface for teammate work:

| Hook | Fires when | Exit code 2 effect |
|---|---|---|
| `TeammateIdle` | A teammate goes idle | Sends feedback + keeps the teammate working |
| `TaskCreated` | A task is created | Blocks creation + sends feedback |
| `TaskCompleted` | A task is marked complete | Blocks completion + sends feedback |

(These are the available hooks; authoring a specific hook is out of this doc's scope.)

**Display modes.** In-process (default; works in any terminal; `Shift+Down` cycles teammates) vs
split-pane (needs tmux or iTerm2). Set via `teammateMode` — see § Setup.

**Cost.** Agent Teams use significantly more tokens than a single session — each teammate is a full
instance. The token WIN only holds in the **sequential single-teammate** mode (Mode 1). That is why
fresh stays the default and continuation is bounded (the executor saturation cap, the no-survival
rule). Teammate token accounting is recorded per
[`orchestration/SKILL.md` § Teammate-aware metadata](workflow/metadata.md#teammate-aware-metadata-agent-teams).

---

## Constraints

- **The evaluator is NEVER a teammate.** It is the sole fresh, report-back subagent — kept out of the
  team mailbox. Producer/evaluator separation + dual-system independence is non-negotiable.
- **One team at a time.** MUST clean up the current team before starting a new one.
- **No nested teams.** Only the manager spawns teammates; a teammate MUST NOT spawn teammates.
- **Lead is fixed** for the team's lifetime.
- **After `/compact`, `/clear`, `/resume`, or `/rewind`, teammates are gone.** The manager MUST
  fresh-spawn and re-prime from durable session record — NEVER message a dead teammate.
- **Manager-owned coordination, no teammate cross-talk.** All coordination flows through the
  manager; teammate-to-teammate messaging is disabled by gobbi policy.
- **Restart required after enabling.** `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` is read at session
  start; enabling it mid-session does nothing until a fresh session.
- **First spawn = full Load Directives; continuation turn = delta-brief.** Never re-paste the full
  brief on a continuation turn; never skip the full stack on a first spawn.
- **Continuation write-safety.** Every Write and git op on a continued turn uses absolute worktree
  paths + `git -C <worktree-abs>` (see `agents/{leader,executor,assistant}.md § Continuation
  discipline`).

---

## Cross-references

- [`delegation/SKILL.md` § Continue vs Fresh](../delegation/SKILL.md#continue-vs-fresh) — the
  continue-vs-fresh DECISION RULE (role × transition), the F1 executor predicate, and the delta-brief
  fields. This doc points to it; it does not re-derive the rule.
- `agents/leader.md § Continuation discipline`, `agents/executor.md § Continuation discipline`,
  `agents/assistant.md § Continuation discipline` — the per-role write-safety discipline for a
  continued turn (absolute worktree paths, `git -C <worktree-abs>`, re-anchor).
- [`orchestration/SKILL.md` § Agent Teams](SKILL.md#agent-teams) — the summary roster + policy that
  links here; this doc is the single source of truth for the detail.
- [`orchestration/SKILL.md` § Recording workflow metadata](workflow/metadata.md#recording-workflow-metadata) and
  [§ Teammate-aware metadata](workflow/metadata.md#teammate-aware-metadata-agent-teams) — teammate token
  accounting (a teammate session is read from its OWN transcript, not the parent's `subagents/`
  directory).
- `mistakes/skills-mirror-symlinks-not-copies.md` — editing the canonical file at
  `.gobbi/projects/gobbi/skills/orchestration/agent-teams.md` reflects automatically via the
  `.claude/skills/orchestration/agent-teams.md` mirror symlink; do not double-edit.
