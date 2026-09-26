# Role model pins

## Intent

Each runtime role contract names one current model and effort `high`.

## Pins

| Runtime | Roles | Model | Effort |
|---|---|---|---|
| Grok | manager, assistant, developer, designer, author | `grok-4.7` | `effort: high` |
| Cursor | manager, assistant | `grok-4.7` | `[effort=high]` |
| Cursor | developer, designer, author | `gpt-5.6-sol` | `[effort=high]` |
| Codex | manager, assistant, developer, designer, author | `gpt-6-astra` | `model_reasoning_effort = "high"` |
| Claude | manager, assistant, developer, designer, author | `claude-opus-5-5` | `effort: high` |

`gpt-6-astra` is the Codex id for Astra. The Cursor parent session starts as `grok-4.7[effort=high]`.

Claude contracts use the full id `claude-opus-5-5`, not the `opus` alias, because the alias moves to newer
models.

## References

- Canonical contracts under `.gobbi/projects/gobbi/agents/{grok,cursor,codex,claude}/`
- [Identity-and-load role contracts](identity-and-load-role-contracts.md)
- [Full model id in Claude agent frontmatter](../../learnings/claude/tips.md#a-full-model-id-works-in-claude-agent-frontmatter)
