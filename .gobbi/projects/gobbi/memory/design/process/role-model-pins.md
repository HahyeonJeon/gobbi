# Role model pins

## Intent

Fourteen roles. Manager and assistant stay. Coding, authoring, and design each have a leader, a planner, an executor, and a reviewer. Leader is ideation. Planner is planning. Executor is execution. Reviewer is review.

## Pins

Claude and Codex use effort `high`. The model id differs by role.

| Role | Claude model | Codex model |
|---|---|---|
| manager, assistant | `claude-sonnet-5-5` | `gpt-6-sol` |
| coding-leader, design-leader | `claude-opus-5-5` | `gpt-6-astra` |
| authoring-leader | `claude-sonnet-5-5` | `gpt-6-sol` |
| coding-planner, authoring-planner, design-planner | `claude-sonnet-5-5` | `gpt-6-sol` |
| coding-executor | `claude-sonnet-5-5` | `gpt-6-sol` |
| design-executor | `claude-opus-5-5` | `gpt-6-astra` |
| authoring-executor | `claude-sonnet-5-5` | `gpt-6-sol` |
| coding-reviewer, authoring-reviewer, design-reviewer | `claude-sonnet-5-5` | `gpt-6-sol` |

Grok is `grok-4.7` at `xhigh` for every role, including manager and assistant.

Cursor manager and assistant are `grok-4.7[effort=xhigh]`. Every other Cursor role uses that role's Claude model and effort in `model: <id>[effort=<effort>]`. The Cursor parent session starts as `grok-4.7[effort=high]`.

Claude and Grok files use `model` and `effort`. Codex uses `model` and `model_reasoning_effort`. Cursor has no separate effort key.

`gpt-6-astra` is the Codex id for Astra. `gpt-6-sol` is the Codex id where Claude uses `claude-sonnet-5-5`. Claude contracts use the full id, not an alias, because the alias moves to newer models.

Developer, designer, author, code-reviewer, and docs-reviewer are not live roles. `design-reviewer` is the design-domain review role.

Setup writes missing role files. It does not delete old role files from a project that already has them, and it does not rewrite a settings file that already exists.

## References

- Canonical contracts under `.gobbi/projects/gobbi/agents/{grok,cursor,codex,claude}/`
- [Identity-and-load role contracts](identity-and-load-role-contracts.md)
- [Full model id in Claude agent frontmatter](../../learnings/claude/tips.md#a-full-model-id-works-in-claude-agent-frontmatter)
