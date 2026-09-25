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
| Claude | manager, assistant, developer, designer, author | existing Claude model ids | `effort: high` |

`gpt-6-astra` is the Codex id for Astra. The Cursor parent session starts as `grok-4.7[effort=high]`.

## References

- Canonical contracts under `.gobbi/projects/gobbi/agents/{grok,cursor,codex,claude}/`
- [Identity-and-load role contracts](identity-and-load-role-contracts.md)
