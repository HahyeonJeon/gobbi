# Gobbi role contracts

Gobbi has seven roles. Manager and assistant are session roles. Leader, developer, designer, author, and
reviewer are phase roles. Manager is session authority. Assistant is support. Neither is a phase role.

The named phase role matches the assignment phase. Ideate is leader. Plan is leader. Implement is developer,
designer, or author, by the subject of the result. Review is reviewer.

Leader owns Ideation and Planning in every domain. Leader writes the ideation result and the plan result and
does not change the product. Developer, designer, and author own Execution and change the product, each in one
subject: the developer changes code with no visual surface, the designer changes work with a visual element,
including HTML and web UI and UX, and may use the coding skills for it, and the author changes durable docs,
skills, and the changelog. Reviewer owns Review. Reviewer reads another agent's work, does not change it, and
never reviews its own.

Leader and reviewer hold no domain, and the brief's Role names the domain expert the work needs. The coding,
authoring, and design skills hold the domain standards, and the brief's Materials index the ones the work
needs.

Each role file is intro, Responsibility, In scope, and Out of scope. The intro is a persona: the experience,
abilities, and character the role needs, shown as working habits. Responsibility is the quality bar the role
owns. In scope is CRUD and the role's subjects. Out of scope is Never.

| Role | Phase | Result |
|---|---|---|
| manager | session authority | User, mode, routing, acceptance |
| assistant | support | Lookup and authorized Memory or record work |
| leader | ideation and planning | The ideation result and the plan result |
| developer | execution | Changes to code with no visual surface |
| designer | execution | Changes to work with a visual element, including HTML and web UI |
| author | execution | Changes to durable docs, skills, and the changelog |
| reviewer | review | A review report on another agent's work |

Each role has one full copy per runtime, and all four runtimes live together in this directory.

| Runtime | Directory | Model field | Effort field |
|---|---|---|---|
| Claude Code | [`claude/`](claude/) | `model` | `effort` |
| Grok | [`grok/`](grok/) | `model` | `effort` |
| Codex | [`codex/`](codex/) | `model` and `model_reasoning_effort` in `.toml` | same `.toml` |
| Cursor | [`cursor/`](cursor/) | `model: <id>[effort=<effort>]` | no separate effort key |

Claude and Grok use `model` and `effort`. Codex uses `model` and `model_reasoning_effort` in the `.toml`.
Cursor uses `model: <id>[effort=<effort>]` and no separate effort key.

Claude and Codex pins differ by role. Read that role's file for the id and effort. Do not treat one
Claude id, or one Codex id, as the pin for every role. Grok is `grok-4.7` at `xhigh` for every role,
including manager and assistant.

Codex uses only `{role}.toml`. The role body lives in that file's `developer_instructions`.

Cursor role pins differ by role. Read that role's file. On Cursor, manager and assistant are
`grok-4.7[effort=xhigh]`. Every other Cursor role uses that role's Claude model and effort in the same
bracket. The Cursor parent starts as `grok-4.7[effort=high]`.

Checkout load paths. Each runtime reads the package, or the one local adapter this product still requires.
It does not read both.

- Claude Code reads `plugins/gobbi`. This checkout enables `gobbi@gobbi` and does not register
  `.claude/agents`, `.claude/skills`, or a settings `hooks` object.
- Grok reads `plugins/gobbi` through `.grok/plugins/gobbi`. This checkout does not register `.grok/agents`,
  `.grok/skills`, or `.grok/hooks`. The entry is `/gobbi:gobbi`.
- Codex skills read `plugins/gobbi`. Codex roles stay at `.codex/agents/{role}.toml` →
  `codex/{role}.toml`, because Codex does not load plugin agents. This checkout does not register
  `.codex/hooks.json`.
- Cursor stays a project adapter until a Cursor plugin load is proven. `.cursor/agents/{role}.md` →
  `cursor/{role}.md`. `.cursor/skills/` links canonical skills. This checkout has no Cursor marketplace.

`.codex/agents/` and `.cursor/agents/` are symlinks into this tree.

## The published package has a different shape, and must

`plugins/gobbi/` cannot mirror this directory. A plugin's `agents/` directory is scanned **recursively** at
unlimited depth, and a subfolder becomes part of the agent's scoped identifier — a file at
`agents/review/security.md` in plugin `p` registers as `p:review:security`. Documented for Claude Code at
`docs/en/sub-agents`, and measured: same-basename files in different subdirectories do **not** collide, so
shipping `agents/claude/manager.md` would register `gobbi:claude:manager` instead of `gobbi:manager`, and the
cursor and grok copies would add fourteen more live agents with identical leaf names. `claude plugin validate
--strict` reports no warning about any of it.

So the package flattens Claude's contracts into `agents/` and ships the other three in a `runtimes/` sibling,
which that scan never reads:

| Canonical | Package |
|---|---|
| `agents/claude/{role}.md` | `agents/{role}.md` |
| `agents/codex/{role}.toml` | `runtimes/codex/{role}.toml` |
| `agents/cursor/{role}.md` | `runtimes/cursor/{role}.md` |
| `agents/grok/{role}.md` | `runtimes/grok/{role}.md` |

`python3 scripts/guard/guard.py sync` builds that projection from the repository root, and
`python3 scripts/guard/guard.py check` reports any drift. Bytes are copied verbatim — the shape difference is
directory mapping only.

This README is not mapped anywhere, so it never ships and cannot become live agent surface.

The Grok and Cursor plugin manifests declare `"agents": "./runtimes/grok"` and `"./runtimes/cursor"`; a declared
path replaces default discovery, measured on Grok in both directions. Codex custom agents are not a plugin
component, so a consumer copies them into `.codex/agents/{role}.toml` from `{gobbi-agents-root}/codex/` in a
checkout or `<plugin>/runtimes/codex/` in an install.

## The one file whose content differs

`skills/gobbi/SKILL.md` links to role contracts by relative path, and those paths differ between the two trees.
Its package copy rewrites those links from the canonical prefix to the package prefix using the mapping table
above, and changes nothing else. `guard.py sync` applies that rewrite.
