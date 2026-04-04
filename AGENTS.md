# AGENTS.md

This repository keeps its canonical agent guidance in [`./.claude/CLAUDE.md`](./.claude/CLAUDE.md).

Codex agents must treat `.claude` as the source of truth and load these files in this order:

1. [`./.claude/CLAUDE.md`](./.claude/CLAUDE.md)
2. Any referenced documents under [`./.claude/`](./.claude), especially [`./.claude/README.md`](./.claude/README.md) and [`./.claude/rules/`](./.claude/rules)
3. Task-specific agent docs under [`./.claude/agents/`](./.claude/agents)

Do not duplicate or fork instructions into separate Codex-only docs unless the repository owner explicitly asks for that split. If guidance appears to conflict, prefer the `.claude` version and update the redirect docs rather than copying content.
