# Gobbi role contracts

Each role has one full copy per runtime. Model and effort stay in that copy.

| Runtime | Directory | Model field | Effort field |
|---|---|---|---|
| Claude Code | [claude/](claude/) | `model` (opus / sonnet / haiku) | `effort` |
| Grok | [grok/](grok/) | `model` (grok-4.6) | `effort` |
| Codex | [codex/](codex/) | `model` and `model_reasoning_effort` in `.toml` | same `.toml` |

Codex uses only `{role}.toml`. The role body lives in that file's `developer_instructions`.

Runtime mirrors (repository-local, not plugin components):

- `.claude/agents/{role}.md` → `claude/{role}.md`
- `.grok/agents/{role}.md` → `grok/{role}.md`
- `.codex/agents/{role}.toml` → `codex/{role}.toml`

The published plugin is a flat projection: `plugins/gobbi/agents/{role}.md` only, for Claude Code and Grok plugin discovery. Nested `claude/`, `grok/`, and `codex/` folders stay in this canonical tree. Codex custom agents are not a plugin component; they load from `.codex/agents/{role}.toml`.
