# Role model pins

## Intent

Seven roles: manager, assistant, leader, developer, designer, author, and reviewer. Each role has one contract
per runtime, and each runtime pins its own model and effort per role. Read the role's file for the exact value.

## Pins

| Role | Claude model | Claude effort | Codex model |
|---|---|---|---|
| manager | `claude-sonnet-5-5` | `high` | `gpt-6.1-sol` |
| assistant | `claude-haiku-5-5` | `high` | `gpt-6.1-sol` |
| leader | `claude-opus-5-5` | `high` | `gpt-6.1-sol` |
| developer | `claude-sonnet-5-5` | `high` | `gpt-6-astra` |
| designer | `claude-opus-5-5` | `xhigh` | `gpt-6-astra` |
| author | `claude-sonnet-5-5` | `medium` | `gpt-6-astra` |
| reviewer | `claude-sonnet-5-5` | `xhigh` | `gpt-6.1-sol` |

Codex effort is `high` for every role. Grok is `grok-4.7` at `xhigh` for every role, including manager and
assistant.

Cursor manager and assistant are `grok-4.7[effort=xhigh]`. Every other Cursor role uses that role's Claude model
and effort in `model: <id>[effort=<effort>]`. The Cursor parent session starts as `grok-4.7[effort=high]`.

Claude and Grok files use `model` and `effort`. Codex uses `model` and `model_reasoning_effort`. Cursor has no
separate effort key.

Claude contracts use the full model id, not an alias, because the alias moves to newer models.

Setup writes missing role files. It does not delete old role files from a project that already has them, and it
does not rewrite a settings file that already exists. The removed `coding-*`, `authoring-*`, and `design-*` role
files are removed by the project after it migrates their callers.

## References

- Canonical contracts under `.gobbi/projects/gobbi/agents/{grok,cursor,codex,claude}/`
- [Identity-and-load role contracts](identity-and-load-role-contracts.md)
- [Full model id in Claude agent frontmatter](../../learnings/claude/tips.md#a-full-model-id-works-in-claude-agent-frontmatter)
