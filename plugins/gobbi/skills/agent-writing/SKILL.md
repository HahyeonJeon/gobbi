---
name: agent-writing
description: "Use when authoring a new gobbi agent — the .md/.toml canonical pair, agent frontmatter, the role taxonomy, and the hand-owned mirror wiring."
allowed-tools: Read, Grep, Glob, Bash
---

# Agent Writing

Reference skill for authoring a NEW gobbi agent, or — far more often — editing an existing
role. Load it when a task touches `.gobbi/projects/{project-name}/agents/`, asks how a role
is specified, or proposes a new role. It teaches the agent's two-file canonical pair, the
`.md` frontmatter and section contract, the `.toml` wrapper shape, the closed five-role
taxonomy, and the wiring that makes a role loadable in both runtimes.

This skill is self-contained — it does not depend on any `.claude/` doc-authoring standard.
Every fact below has one owning file; this skill POINTS to the owner instead of copying it.
It shares its mirror-and-verify discipline with [`skill-writing/SKILL.md`](../skill-writing/SKILL.md)
— read that skill first if you have not; the two are siblings.

The best reference is the existing agents. Before authoring, read the five canonical specs
under `agents/` — `executor.md` is the cleanest non-manager exemplar of the section contract,
`manager.md` shows the root-session variant. Read one `.toml` (`executor.toml`) for the
wrapper shape. The codebase is the style guide. **Most "new agent" work is not a new role —
it edits one of the five existing role specs.** A genuinely new role is rare and heavyweight
(P4).

---

## Core Principles

> **A role spec is a behavioral contract — write it for the agent who runs it cold.**

An agent `.md` is loaded fresh by a spawned subagent with no prior context. It states who the
role is, what is out of scope, the lifecycle it runs, and the status it must report. A reader
running the role must act correctly from the spec alone — not from the session that wrote it.

> **Point to the one canonical owner; never restate it.**

The `.md` is the role's behavioral contract. The [Delegation skill](../delegation/SKILL.md) owns the generic
brief shape, and [`Workflow` Step 1.3](../workflow/SKILL.md#13-build-and-accept-specialist-assignments) adds
workflow fields. They have different jobs. The role spec does not duplicate either assignment contract, and
agent-writing does not create a second assignment surface. Cite the owners; do not copy them.

> **Verify every wiring claim by reading the owner — never assert it.**

A claim about a mirror symlink, a permission, or which tool manages a surface MUST come from
reading the owner directly — `readlink` the symlink, read `.claude/settings.json`, read the
sync script's source. Do not assume the agent wiring parallels the skill wiring: it does NOT
(P5). Verify a mechanism by reading its owner, not by guessing from the end-state.

> **A new role is not done until both mirrors resolve, verified empirically.**

A role is loadable only when its `.md` mirror (Claude) AND its `.toml` mirror (Codex) both
resolve under `readlink`, and — for a new role — its `Agent()` permission is present. A spec
on disk that neither runtime maps to a role is unfinished.

---

## Procedures

### P1 — The two-file canonical pair + three surfaces

Each role is a co-located PAIR of canonical files under `.gobbi/projects/{project-name}/agents/`:

- **`agents/{role}.md`** — the behavioral spec (the role contract; the substance).
- **`agents/{role}.toml`** — the Codex wrapper (a thin pointer back to the `.md`; P3).

The pair is mirrored to the two runtimes at DIFFERENT file granularity — Claude takes the
`.md`, Codex takes the `.toml` (verified by `readlink`):

| Surface | Shape | Owner |
|---|---|---|
| `.claude/agents/{role}.md` | per-role symlink → `../../.gobbi/projects/gobbi/agents/{role}.md` (`.md` only) | **HAND-CREATED** |
| `.codex/agents/{role}.toml` | per-role symlink → `../../.gobbi/projects/gobbi/agents/{role}.toml` (`.toml` only) | **HAND-CREATED** |
| `plugins/gobbi/agents/` | generated real directory for ALL roles, byte-equal to canonical agents | **SCRIPT-OWNED** |

The canonical `.md` is the single source of truth; the metadata note at the top of every
`.md` states this in its own words ("In Codex, `.codex/agents/{role}.toml` controls runtime
settings; this Markdown body is still the canonical role contract").

### P2 — Agent `.md` frontmatter + section contract

An agent `.md` carries four required frontmatter keys in this order. It may add Claude Code's optional
`effort` key after `model` when the role must override the session effort:

```yaml
---
name: {role}
description: {one line — what the role does and its defining constraint}
tools: {explicit role-sized tool list}
model: opus | sonnet | haiku | inherit
effort: low | medium | high | xhigh | max  # optional; model-dependent
---
```

**`tools`, NOT `allowed-tools` — this is the key difference from a skill.** A SKILL uses
`allowed-tools` ([`skill-writing/SKILL.md` § P1](../skill-writing/SKILL.md)); an AGENT uses
`tools`. They name the same idea (the role's tool surface) but the key differs by file kind.
Using `allowed-tools` in an agent `.md`, or `tools` in a `SKILL.md`, is a frontmatter error.

- **`name`** — MUST equal the role name (and the `{role}` in both filenames).
- **`description`** — one line; states the role and its defining constraint (e.g. executor:
  "Never expands scope.").
- **`tools`** — an explicit allowlist sized to the role's job. Every Gobbi role lists `Skill` because every
  role contract loads skills. Research and implementation roles list the current discovery, web, shell, and
  code-navigation tools their work needs; only roles that write list file-write tools; only the manager lists
  assignment and user-question tools. Claude Code removes tools that the active context cannot use, and an
  explicit list does not grant unknown consumer-specific MCP tools. Read each role head for its exact list
  and verify the behavior against the current
  [Claude Code subagent reference](https://code.claude.com/docs/en/sub-agents).
- **`model`** — the Claude Code model or inheritance policy for this role. Each role's own `.md` frontmatter
  is the owner; read the five heads to verify. No document holds a combined role table.
- **`effort`** — optional Claude Code reasoning effort. When omitted, the role inherits the session effort.
  When present, the selected model must support the value. Read the role head rather than inferring it from
  another role or from the Codex wrapper.

Claude Code's `model` and optional `effort` metadata do not configure Codex. The role's `.toml` wrapper
separately carries Codex `model` and `model_reasoning_effort`.

**Section contract** (the order in `executor.md`; role-shaped — a role adds or varies a
section where its work demands, e.g. evaluator's lifecycle is Study/Assess/Report and it omits
Continuation discipline):

1. **`# Title`** — `{Role} — {one-line role tagline}`.
2. **Metadata note** — the shared one-liner: the YAML is Claude Code metadata; in Codex the
   `.toml` controls runtime; the Markdown body is still the canonical contract.
3. **Persona** — who the role is and how it thinks; what the manager hands it.
4. **`**Out of scope:**`** — a bullet list of what the role MUST NOT do.
5. **`## Before You Start`** — mandatory skills and rules, in order.
6. **`## Lifecycle`** — the role's phases as `### {Phase}` subsections (executor:
   Study → Plan → Execute → Verify → Memorize; evaluator: Study → Assess → Report).
7. **`## Continuation discipline`** — *optional;* only for roles a continued teammate may run
   across turns (executor, leader). The write-safety rules for cwd-reset turns live here.
8. **`## Status Contract`** — the 4-state enum (`DONE` / `DONE_WITH_CONCERNS` /
   `NEEDS_CONTEXT` / `BLOCKED`) and what each means for this role.
9. **Domain constraints** — *optional;* role-specific rules (e.g. executor's
   `## TypeScript / Codebase Constraints`).
10. **`## Red Flags / Anti-Patterns`** — the named rationalizations this role must refuse.
11. **`## Quality Expectations`** — what good output from this role looks like.

### P3 — The `.toml` Codex wrapper shape

The `.toml` is a thin Codex wrapper — it carries no behavioral substance of its own; it points
Codex back to the canonical `.md`. Five STANDARD keys are present in every wrapper:
`name`, `description`, `model`, `model_reasoning_effort`, and `developer_instructions`. A role MAY add a
role-specific runtime field on top, e.g. `evaluator.toml` carries
`sandbox_mode = "read-only"` to lock the evaluator's Codex sandbox. So the five below are the
baseline, not a closed set:

```toml
name = "{role}"
description = "{one line — same role summary as the .md}"
model = "{role-owned Codex model}"
model_reasoning_effort = "{role-owned supported effort}"
developer_instructions = '''
You are the Gobbi {role} role for this repository.

Before doing work, read `AGENTS.md`, then read the canonical role prompt at
`.gobbi/projects/gobbi/agents/{role}.md` and follow it as your role contract.

That contract's "Before You Start" section owns the Gobbi root pair and every skill this role
loads. Obtain and validate the pair exactly as that section directs, load the skills it names,
and resolve every Gobbi skill and agent reference through the validated roots. Never substitute
a hardcoded path or a user-level skill location.

{The role's git/scope guardrail — e.g. for an implementer: stay inside the
delegated scope, do not evaluate your own work, provide fresh verification
evidence, commit in-boundary but NEVER push.}
'''
```

The role wrapper owns its current `model` and `model_reasoning_effort`; read it and verify both values against
the current [Codex subagent reference](https://developers.openai.com/codex/multi-agent) and
[configuration reference](https://developers.openai.com/codex/config-reference) instead of copying another
role. The
`developer_instructions` triple-quoted block always (a) sends Codex to read `AGENTS.md`
then the canonical `.md`, (b) hands the Gobbi root pair and every skill load to that `.md`'s
`## Before You Start` section instead of naming a skill path itself, and
(c) states the role's git / scope guardrail. Keep
the `.toml` thin — substance belongs in the `.md`, so the two never drift.

### P4 — The five-role taxonomy + new-role wiring

The role taxonomy is a **closed set of five**: `manager` / `leader` / `executor` / `evaluator`
/ `assistant` (verified — the five canonical `.md`/`.toml` pairs under `agents/` and the five
`Agent({role})` entries in `.claude/settings.json`).
All specialist assignments use the generic Delegation template. The role document supplies role behavior,
and Workflow Step 1.3 supplies session-specific assignment fields.

**The common case is editing an existing role**, not adding one. To refine a role, edit its
`agents/{role}.md` (and the `.toml` only if its description or guardrail changed — a skill-load
change touches the `.md` alone). No new wiring.

**Adding a SIXTH role is a heavyweight, user-ratified taxonomy change** — never do it without
the user's explicit decision. Its FULL wiring set is:

1. The canonical pair: `agents/{role}.md` + `agents/{role}.toml` (P1 / P2 / P3).
2. Both mirror symlinks: `.claude/agents/{role}.md` and `.codex/agents/{role}.toml` (P5).
3. An `Agent({role})` permission in `.claude/settings.json` (verify the live allowlist at edit
   time; do not rely on a stored line number).
Any one of these missing leaves the role half-wired. A new role without an `Agent()` perm
cannot be spawned in Claude Code. Its canonical role document must remain complete enough for the generic
Delegation template and Workflow Step 1.3 to load it without a separate role overlay.

**No central role registry exists.** Role name, Claude tools, model, and optional effort live in the `.md`
frontmatter; Codex model and reasoning effort live in the `.toml`; and what the role owns and when it is
spawned live in the `.md` description and body. Do not look for a taxonomy table; no document holds one.

### P5 — Wiring a role (HAND-OWNED mirrors; verify each)

**The agent runtime mirrors are HAND-CREATED — the sync script does NOT manage them.** Read
`scripts/sync-plugin-package.sh` to confirm: normal sync manages `.agents/skills/{name}` and the per-file
`.claude/skills` mirror, while `--materialize-package` owns the generated real
`plugins/gobbi/{skills,agents}` directories. The script verifies but does not create `.claude/agents/` or
`.codex/agents/`, so the two per-role runtime mirrors are yours to create by hand. (This is the OPPOSITE of
the skill case, where `.agents/skills/{name}` IS script-owned — do not assume the agent wiring parallels it.)

Wire a role in this order, each step with its verify command. From the worktree root:

1. **Create the canonical pair** — `agents/{role}.md` + `agents/{role}.toml`.
   Verify: `test -f .gobbi/projects/gobbi/agents/{role}.md .gobbi/projects/gobbi/agents/{role}.toml`.
2. **Hand-create the Claude `.md` mirror:**
   ```bash
   ln -s ../../.gobbi/projects/gobbi/agents/{role}.md .claude/agents/{role}.md
   ```
   Verify: `readlink -e .claude/agents/{role}.md` resolves to the canonical `.md`.
3. **Hand-create the Codex `.toml` mirror:**
   ```bash
   ln -s ../../.gobbi/projects/gobbi/agents/{role}.toml .codex/agents/{role}.toml
   ```
   Verify: `readlink -e .codex/agents/{role}.toml` resolves to the canonical `.toml`.
4. **Regenerate the package components** (no per-role package action; the generator copies the complete
   canonical agent tree into the generated real `plugins/gobbi/agents/` directory):
   ```bash
   bash scripts/sync-plugin-package.sh --materialize-package
   bash scripts/sync-plugin-package.sh --check
   ```
   Both commands must exit 0. A missing installed path is a package failure, never an expected warning or
   limitation.
5. **For a NEW role only** — add the `Agent({role})` permission in `.claude/settings.json`. Agent Teams can
   use a permitted subagent definition as a teammate type; the active mode decides whether that role may be
   reused. Verify the permission and run the source-topology check.

Final verify across the wiring — run the markdown-link guard for zero new broken links. The
guard REQUIRES at least one path argument (no-arg exits 2) — pass the role's `.md`:
```bash
bash scripts/check-markdown-links.sh \
  .gobbi/projects/gobbi/agents/{role}.md
```
A clean run prints `ALL LINKS RESOLVE (...)` and exits 0.

---

## Constraints

- **MUST author the canonical PAIR** — `agents/{role}.md` + `agents/{role}.toml`, co-located,
  with `name: {role}` matching both filenames.
- **MUST use `tools` in the agent `.md`, NOT `allowed-tools`** — `allowed-tools` is the skill
  key; `tools` is the agent key. Mixing them is a frontmatter error.
- **MUST carry the four required `.md` frontmatter keys** — `name`, `description`, `tools`, and `model` — in
  that order. Add only the optional `effort` key after `model` when the role overrides session effort.
- **MUST list `Skill` in every role's explicit Claude tool allowlist.** Add only tools the role contract can
  use, keep assignment and user-question tools manager-only, and verify every name against current Claude
  Code references and the installed runtime.
- **MUST follow the section contract** (P2), varying a section only where the role's work
  demands it; include `## Continuation discipline` only for continuable roles.
- **MUST keep the `.toml` thin** — it points to the canonical `.md` and defers every skill load to
  that `.md`; behavioral substance lives in the `.md`, never duplicated in the `.toml`.
- **MUST verify each Codex wrapper's role-owned model and reasoning effort.** Do not replace them with a
  repository-wide default; confirm the values are supported and appropriate for the role's work.
- **MUST point to each canonical owner, not restate it** — the role spec cites Delegation for the generic
  brief shape and Workflow Step 1.3 for Gobbi fields and acceptance; the canonical role prompt itself owns
  role behavior and status meanings. Do not create or copy a separate role overlay.
- **MUST verify every wiring claim by reading the owner** — `readlink` the mirrors, read
  `.claude/settings.json`, read the sync script — never assert a mirror or permission exists.
- **MUST verify loadability empirically** before declaring a role done — both `readlink` mirrors resolve,
  package materialization and `sync-plugin-package.sh --check` exit 0, and for a new role the `Agent()` perm
  is present.
- **MUST get the user's explicit decision before adding a sixth role** — the taxonomy is a
  closed five-role set; a new role is a heavyweight, user-ratified change.
- **NEVER expect the sync script to create the agent mirrors** — `.claude/agents/{role}.md`
  and `.codex/agents/{role}.toml` are hand-created; the script touches neither.

## Anti-patterns

- **Using `allowed-tools` in an agent `.md`.** Copying the skill frontmatter key into a role
  spec. Agents use `tools`; only skills use `allowed-tools`. Check the key against the file
  kind before saving.

- **Omitting `Skill` from an explicit role allowlist.** The role contract requires fresh skill loads, but
  Claude Code treats `tools` as an allowlist. The role then cannot perform its own startup contract.

- **Assuming the agent wiring parallels the skill wiring.** Expecting `sync-plugin-package.sh`
  to create `.codex/agents/{role}.toml` because it creates `.agents/skills/{name}`. It does
  NOT — read the script: it has no `.claude/agents` / `.codex/agents` line. Hand-create both
  agent mirrors.

- **Asserting a mirror or permission without verifying.** Writing "the role is mirrored to
  Codex" without `readlink`, or "the Agent() perm is at line 28" without reading
  `.claude/settings.json`. Verify a mechanism by reading its owner, not the end-state.

- **Duplicating the shared assignment skeleton inside the role spec.** Inlining the per-task brief
  shape into `agents/{role}.md`. The `.md` is the behavioral contract; the generic brief shape lives in the
  Delegation skill and the workflow additions live in Workflow Step 1.3. Keep them separate and cross-link.

- **Adding a role when an edit would do.** Creating a sixth role for work an existing role
  already covers. The taxonomy is closed at five; most "new agent" work edits an existing
  `.md`. A new role needs the full P4 wiring set AND the user's explicit decision.

- **Half-wiring a new role.** Creating the `.md`/`.toml` pair but skipping a runtime mirror or the `Agent()`
  permission. A new role is loadable only when all of P4 is in place; a missing piece leaves it unspawnable
  or un-briefable.

## Cross-references

- The sibling skill — shared mirror + verify discipline, the skill side → [`skill-writing/SKILL.md`](../skill-writing/SKILL.md)
- Generic assignment shape → [`delegation/SKILL.md`](../delegation/SKILL.md)
- Workflow assignment fields and acceptance → [`workflow/SKILL.md` Step 1.3](../workflow/SKILL.md#13-build-and-accept-specialist-assignments)
- Role name, Claude tools, model, optional effort, what the role owns, and when it is spawned → the five
  `agents/{role}.md` files themselves; no combined table exists
- Codex model and reasoning effort → the five `agents/{role}.toml` files
- How Claude Code uses a role as a teammate type → [`gobbi/agent-teams/SKILL.md`](../gobbi/agent-teams/SKILL.md)
- Plugin package layout + the generated `agents` directory → [`claude-plugin/SKILL.md`](../claude-plugin/SKILL.md)
