# Grok system integration completed

**Completed at:** 2026-08-15T14:49:00Z

## Changes

- Added the third Grok discovery and install stack: a linked `.grok/skills` mirror of the same canonical
  skills, Grok-native marketplace copy, and a project `.grok/plugins` pointer to `./plugins/gobbi`.
- Replaced the boolean Partner selector with `disabled` or one or two of `{claude-code,codex,grok}`, skip-self
  at launch, and a valid empty launch set after skip.
- Added a measured Grok Partner launch using `--sandbox workspace`, with session and project writes limited to
  the contracted writing path, and routed each launch through a local wrapper subagent.
- Left Claude Code and Codex install paths and Partner command rows unchanged. Agent Teams stayed Claude-only.
