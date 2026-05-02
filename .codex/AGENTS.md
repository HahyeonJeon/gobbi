# Codex Agent Redirect

For this repository, Codex-specific guidance is intentionally delegated to the Claude docs.

 ## Subagent Usage

  For broad codebase analysis, adversarial review, feature-sliced test planning,
  or independent implementation/verification work, Codex may autonomously spawn
  subagents when parallel work would materially improve the result.

  Use subagents only for concrete, bounded, parallelizable tasks. Do not spawn
  subagents for simple questions, narrow single-file edits, or urgent blocking
  work that should be handled directly in the main thread.

  Subagents should inherit the parent session model and reasoning settings unless
  the user explicitly requests a different model.

Canonical instructions:

1. [`../.claude/CLAUDE.md`](../.claude/CLAUDE.md)
2. [`../.claude/README.md`](../.claude/README.md)
3. Relevant files in [`../.claude/rules/`](../.claude/rules) and [`../.claude/agents/`](../.claude/agents)

Use `.claude` as the single maintained documentation tree. Keep this file as a redirect only.
