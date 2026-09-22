# Gobbi role contracts

The session roles are manager and assistant. The specialists are developer, designer, and author.
Pipeline work (ideate, plan, implement, review) is not a role. The Delegation prompt and loaded skills
define that job.

Each role file is intro, Responsibility, In scope, and Out of scope. Responsibility is the quality bar
the role owns. In scope is CRUD and specialist subjects. Out of scope is Never.

| Role | Kind | Subject |
|---|---|---|
| Manager | Authority | User, mode, routing, acceptance |
| Assistant | Support | Lookup and authorized Memory or record work |
| Developer | Specialist | Software source, tests, and run/build config |
| Designer | Specialist | Visual work: UI, images, video, presentations, reports, and other visual artifacts |
| Author | Specialist | Durable writing: docs, skills, and changelog |

Each role has one full copy per runtime, and all four runtimes live together in this directory.

| Runtime | Directory | Model field | Effort field |
|---|---|---|---|
| Claude Code | [`claude/`](claude/) | `model` (opus / sonnet / haiku) | `effort` |
| Grok | [`grok/`](grok/) | `model` (grok-4.7) | `effort` |
| Codex | [`codex/`](codex/) | `model` (gpt-6-astra) and `model_reasoning_effort` in `.toml` | same `.toml` |
| Cursor | [`cursor/`](cursor/) | `model` (`id[effort=...]`) | same `model` bracket |

Codex uses only `{role}.toml`. The role body lives in that file's `developer_instructions`.

Cursor uses official bracket syntax on `model`. It has no separate `effort` key. The Cursor parent starts as Grok 4.7 high.

Runtime mirrors (repository-local, not plugin components):

- `.claude/agents/{role}.md` → `claude/{role}.md`
- `.grok/agents/{role}.md` → `grok/{role}.md`
- `.agents/agents/{role}.md` → `grok/{role}.md`
- `.codex/agents/{role}.toml` → `codex/{role}.toml`
- `.cursor/agents/{role}.md` → **real files, not symlinks**, byte-identical to `cursor/{role}.md`

The first four are symlinks into this tree. `.cursor/agents/` is a hand-maintained copy and therefore the one
mirror that can drift silently; converting it is deferred because Cursor's symlink handling has no offline
observable to verify against.

## The published package has a different shape, and must

`plugins/gobbi/` cannot mirror this directory. A plugin's `agents/` directory is scanned **recursively** at
unlimited depth, and a subfolder becomes part of the agent's scoped identifier — a file at
`agents/review/security.md` in plugin `p` registers as `p:review:security`. Documented for Claude Code at
`docs/en/sub-agents`, and measured: same-basename files in different subdirectories do **not** collide, so
shipping `agents/claude/manager.md` would register `gobbi:claude:manager` instead of `gobbi:manager`, and the
cursor and grok copies would add ten more live agents with identical leaf names. `claude plugin validate
--strict` reports no warning about any of it.

So the package flattens Claude's contracts into `agents/` and ships the other three in a `runtimes/` sibling,
which that scan never reads:

| Canonical | Package |
|---|---|
| `agents/claude/{role}.md` | `agents/{role}.md` |
| `agents/codex/{role}.toml` | `runtimes/codex/{role}.toml` |
| `agents/cursor/{role}.md` | `runtimes/cursor/{role}.md` |
| `agents/grok/{role}.md` | `runtimes/grok/{role}.md` |

`scripts/sync-plugin-package.sh` owns that projection. `--check` exits non-zero on any divergence;
`--materialize` rebuilds it. Bytes are copied verbatim — the shape difference is directory mapping only.

This README is not mapped anywhere, so it never ships and cannot become live agent surface.

The Grok and Cursor plugin manifests declare `"agents": "./runtimes/grok"` and `"./runtimes/cursor"`; a declared
path replaces default discovery, measured on Grok in both directions. Codex custom agents are not a plugin
component — `gobbi-setup` writes them into a consumer's `.codex/agents/{role}.toml`, reading
`{gobbi-agents-root}/codex/` in a checkout or `<plugin>/runtimes/codex/` in an install.

## The one file whose content differs

`skills/gobbi/SKILL.md` links to role contracts by relative path, and those paths differ between the two trees.
The generator rewrites those links from the canonical prefix to the package prefix using the same mapping table
above, and changes nothing else. The rewrite is **derived, not stored**: there is no second copy of the file, so
it cannot fall out of sync when canonical changes.

One file is excluded rather than mapped: `skills/gobbi-skill/scripts/link-project-skills.sh`, a
repository-local development script. Because nothing else is transformed, a link *pointing at* an excluded file
cannot be rewritten, so it dangles in the package — `skills/gobbi-skill/SKILL.md` references it and resolves
only in canonical. That predates the generator and is accepted. Before adding an exclusion, check what links to
the file.
