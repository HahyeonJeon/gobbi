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

The `.md` is the role's behavioral contract; the delegation TEMPLATE
([`delegation/templates/{role}.md`](../delegation/templates/)) is how the manager briefs that
role per task. They are different files with different jobs — the role spec does not duplicate
the template, and a new role's template is authored in `delegation/templates/`, not inlined
here. Cite the owner; do not copy it.

> **Verify every wiring claim by reading the owner — never assert it.**

A claim about a mirror symlink, a permission, or which tool manages a surface MUST come from
reading the owner directly — `readlink` the symlink, read `.claude/settings.json`, read the
sync script's source. Do not assume the agent wiring parallels the skill wiring: it does NOT
(P5). The recorded trap [`skill-writing/mistakes.md#planning-asserted-skill-without-verifying`](../skill-writing/mistakes.md#planning-asserted-skill-without-verifying)
is exactly an asserted-not-verified path reaching a briefing. Verify a MECHANISM by reading
its owner, not by guessing from the end-state.

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
| `plugins/gobbi/agents` | ONE whole-dir symlink for ALL roles → `../../.gobbi/projects/gobbi/agents` | **SCRIPT-OWNED** |

The canonical `.md` is the single source of truth; the metadata note at the top of every
`.md` states this in its own words ("In Codex, `.codex/agents/{role}.toml` controls runtime
settings; this Markdown body is still the canonical role contract").

### P2 — Agent `.md` frontmatter + section contract

An agent `.md` carries exactly four frontmatter keys, in this order (verified — all 5 role
`.md` heads):

```yaml
---
name: {role}
description: {one line — what the role does and its defining constraint}
tools: {tool list, or "*" for the manager}
model: opus | sonnet
---
```

**`tools`, NOT `allowed-tools` — this is the key difference from a skill.** A SKILL uses
`allowed-tools` ([`skill-writing/SKILL.md` § P1](../skill-writing/SKILL.md)); an AGENT uses
`tools`. They name the same idea (the role's tool surface) but the key differs by file kind.
Using `allowed-tools` in an agent `.md`, or `tools` in a `SKILL.md`, is a frontmatter error.

- **`name`** — MUST equal the role name (and the `{role}` in both filenames).
- **`description`** — one line; states the role and its defining constraint (e.g. executor:
  "Never expands scope.").
- **`tools`** — the role's tool surface, sized to the role's job. A genuinely read-only role
  (evaluator: `Read, Grep, Glob, Bash`) lists no write tools; an implementer (executor) adds
  `Write, Edit`; the manager uses `"*"`. Size it from the owner — e.g. the assistant carries
  the widest non-manager surface (`Read, Grep, Glob, Bash, Write, Edit, WebSearch, WebFetch`)
  because it writes session-staging during RECORD / Wrap-up, not because it is read-only.
- **`model`** — `opus` for manager / leader / executor / evaluator; `sonnet` for the
  lightweight assistant (verified against the Agent Taxonomy table in `gobbi/SKILL.md`).

Codex model and effort are NOT agent `.md` frontmatter keys. The `.md` frontmatter stays
exactly four keys; the role's `.toml` wrapper carries `model` and
`model_reasoning_effort`.

**Section contract** (the order in `executor.md`; role-shaped — a role adds or varies a
section where its work demands, e.g. evaluator's lifecycle is Study/Assess/Report and it omits
Continuation discipline):

1. **`# Title`** — `{Role} — {one-line role tagline}`.
2. **Metadata note** — the shared one-liner: the YAML is Claude Code metadata; in Codex the
   `.toml` controls runtime; the Markdown body is still the canonical contract.
3. **Persona** — who the role is and how it thinks; what the manager hands it.
4. **`**Out of scope:**`** — a bullet list of what the role MUST NOT do.
5. **`## Before You Start`** — mandatory loads (skills / rules / mistakes), in order.
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
model = "gpt-5.6-sol"
model_reasoning_effort = "xhigh"
developer_instructions = '''
You are the Gobbi {role} role for this repository.

Before doing work, read `AGENTS.md`, then read the canonical role prompt at
`.gobbi/projects/gobbi/agents/{role}.md` and follow it as your role contract.

Load Gobbi skills from `.gobbi/projects/gobbi/skills`, not from user-level skill locations.
At minimum, load `.gobbi/projects/gobbi/skills/principles/SKILL.md`,
`.gobbi/projects/gobbi/skills/mistake/SKILL.md`, {the role's other min skills} before work.

{The role's git/scope guardrail — e.g. for an implementer: stay inside the
delegated scope, do not evaluate your own work, provide fresh verification
evidence, commit in-boundary but NEVER push.}
'''
```

The `model` and `model_reasoning_effort` values follow Gobbi's current Codex role policy:
every role uses `gpt-5.6-sol` with `xhigh`. The
`developer_instructions` triple-quoted block always (a) sends Codex to read `AGENTS.md`
then the canonical `.md`, (b) lists the role's MINIMUM `.gobbi/projects/gobbi/skills/...`
loads (Codex wrappers load from the repo-local canonical skill root, not user-level), and
(c) states the role's git / scope guardrail. Keep
the `.toml` thin — substance belongs in the `.md`, so the two never drift.

### P4 — The five-role taxonomy + new-role wiring

The role taxonomy is a **closed set of five**: `manager` / `leader` / `executor` / `evaluator`
/ `assistant` (verified — the Agent Taxonomy table in `gobbi/SKILL.md` and the 5 `.md` files).
Each role has a `delegation/templates/{role}.md` EXCEPT `manager` (verified — `templates/`
holds leader / executor / evaluator / assistant only; the manager is the root session agent,
not a Task-spawned specialist, so it needs no delegation template).

**The common case is editing an existing role**, not adding one. To refine a role, edit its
`agents/{role}.md` (and the `.toml` only if a min-load or guardrail changed). No new wiring.

**Adding a SIXTH role is a heavyweight, user-ratified taxonomy change** — never do it without
the user's explicit decision. Its FULL wiring set is:

1. The canonical pair: `agents/{role}.md` + `agents/{role}.toml` (P1 / P2 / P3).
2. Both mirror symlinks: `.claude/agents/{role}.md` and `.codex/agents/{role}.toml` (P5).
3. An `Agent({role})` permission in `.claude/settings.json` (the existing 5 entries are at
   `:25-29`; verify the exact lines at edit time).
4. An Agent Taxonomy table row in `gobbi/SKILL.md` (Role / Model / Effort / Owns / When spawned).
5. A `delegation/templates/{role}.md` (authored in the `delegation` skill's `templates/`).

Any one of these missing leaves the role half-wired. A new role without an `Agent()` perm
cannot be spawned in Claude Code; without a delegation template the manager has no brief shape.

### P5 — Wiring a role (HAND-OWNED mirrors; verify each)

**The agent mirrors are HAND-CREATED — the sync script does NOT manage them.** Read
`scripts/sync-plugin-package.sh` to confirm: it manages `.agents/skills/{name}`, the three
`plugins/gobbi/{skills,agents,hooks}` whole-dir symlinks, and `.claude/hooks/*.sh` — it has
NO line for `.claude/agents/` or `.codex/agents/`. So running the sync script refreshes only
the plugin's whole-dir `agents` symlink; the two per-role runtime mirrors are yours to create
by hand. (This is the OPPOSITE of the skill case, where `.agents/skills/{name}` IS
script-owned — do not assume the agent wiring parallels it.)

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
4. **Refresh the plugin whole-dir `agents` symlink** (no per-role action; the new file is
   picked up through the existing whole-dir symlink):
   ```bash
   bash scripts/sync-plugin-package.sh && bash scripts/sync-plugin-package.sh --check; echo "exit=$?"
   ```
   The `--check` must exit 0.
5. **For a NEW role only** — add the four taxonomy surfaces from P4 (steps 3-5): the
   `Agent({role})` perm in `.claude/settings.json`, the Agent Taxonomy row in `gobbi/SKILL.md`,
   and the `delegation/templates/{role}.md`. Verify each:
   `grep -n 'Agent({role})' .claude/settings.json` ; `grep -n '{role}' .gobbi/projects/gobbi/skills/gobbi/SKILL.md` ;
   `test -f .gobbi/projects/gobbi/skills/delegation/templates/{role}.md`.

Final verify across the wiring — run the markdown-link guard for zero new broken links. The
guard REQUIRES at least one path argument (no-arg exits 2) — pass the role's `.md`:
```bash
bash .gobbi/projects/gobbi/skills/orchestration/scripts/check-markdown-links.sh \
  .gobbi/projects/gobbi/agents/{role}.md
```
A clean run prints `ALL LINKS RESOLVE (...)` and exits 0.

---

## Constraints

- **MUST author the canonical PAIR** — `agents/{role}.md` + `agents/{role}.toml`, co-located,
  with `name: {role}` matching both filenames.
- **MUST use `tools` in the agent `.md`, NOT `allowed-tools`** — `allowed-tools` is the skill
  key; `tools` is the agent key. Mixing them is a frontmatter error.
- **MUST carry exactly the four `.md` frontmatter keys** — `name`, `description`, `tools`,
  `model` — and no others.
- **MUST follow the section contract** (P2), varying a section only where the role's work
  demands it; include `## Continuation discipline` only for continuable roles.
- **MUST keep the `.toml` thin** — it points to the canonical `.md` and lists min skill loads;
  behavioral substance lives in the `.md`, never duplicated in the `.toml`.
- **MUST set the Codex wrapper policy exactly** — every role uses
  `model = "gpt-5.6-sol"` and `model_reasoning_effort = "xhigh"`.
- **MUST point to the one canonical owner, not restate it** — the role spec cites the
  delegation template; it does not copy it.
- **MUST verify every wiring claim by reading the owner** — `readlink` the mirrors, read
  `.claude/settings.json`, read the sync script — never assert a mirror or permission exists.
- **MUST verify loadability empirically** before declaring a role done — both `readlink`
  mirrors resolve AND `sync-plugin-package.sh --check` exits 0; for a new role, the `Agent()`
  perm is present.
- **MUST get the user's explicit decision before adding a sixth role** — the taxonomy is a
  closed five-role set; a new role is a heavyweight, user-ratified change.
- **NEVER expect the sync script to create the agent mirrors** — `.claude/agents/{role}.md`
  and `.codex/agents/{role}.toml` are hand-created; the script touches neither.

## Anti-patterns

- **Using `allowed-tools` in an agent `.md`.** Copying the skill frontmatter key into a role
  spec. Agents use `tools`; only skills use `allowed-tools`. Check the key against the file
  kind before saving.

- **Assuming the agent wiring parallels the skill wiring.** Expecting `sync-plugin-package.sh`
  to create `.codex/agents/{role}.toml` because it creates `.agents/skills/{name}`. It does
  NOT — read the script: it has no `.claude/agents` / `.codex/agents` line. Hand-create both
  agent mirrors.

- **Asserting a mirror or permission without verifying.** Writing "the role is mirrored to
  Codex" without `readlink`, or "the Agent() perm is at line 28" without reading
  `.claude/settings.json`. The recorded trap
  [`skill-writing/mistakes.md#planning-asserted-skill-without-verifying`](../skill-writing/mistakes.md#planning-asserted-skill-without-verifying)
  is exactly this. Verify a MECHANISM by reading its owner, not the end-state.

- **Duplicating the delegation template inside the role spec.** Inlining the per-task brief
  shape into `agents/{role}.md`. The `.md` is the behavioral contract; the per-task brief lives
  in `delegation/templates/{role}.md`. Keep them separate and cross-link.

- **Adding a role when an edit would do.** Creating a sixth role for work an existing role
  already covers. The taxonomy is closed at five; most "new agent" work edits an existing
  `.md`. A new role needs the full P4 wiring set AND the user's explicit decision.

- **Half-wiring a new role.** Creating the `.md`/`.toml` pair but skipping the `Agent()` perm,
  the taxonomy row, or the delegation template. A new role is loadable only when ALL of P4 is
  in place; a missing piece leaves it unspawnable or un-briefable.

## Cross-references

- The sibling skill — shared mirror + verify discipline, the skill side → [`skill-writing/SKILL.md`](../skill-writing/SKILL.md)
- Per-role delegation templates + the brief scaffold → [`delegation/SKILL.md`](../delegation/SKILL.md)
- The Agent Taxonomy table (Role / Model / Owns / When spawned) → [`gobbi/SKILL.md`](../gobbi/SKILL.md)
- Plugin package layout + the whole-dir `agents` symlink → [`claude-plugin/SKILL.md`](../claude-plugin/SKILL.md)
- The verify-before-asserting trap → [`skill-writing/mistakes.md#planning-asserted-skill-without-verifying`](../skill-writing/mistakes.md#planning-asserted-skill-without-verifying)
