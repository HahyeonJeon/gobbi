# Cursor Tips

## Bare `agent` is Grok on this host

**Context:** Cursor help and errors name the program `agent`.

**Tip:** On this host `command -v agent` is `/home/jeonhh0061/.grok/bin/agent`, a Grok binary. Invoke
`cursor-agent` only. Do not run `agent sandbox disable` or any other bare `agent` command.

## `--sandbox enabled` failed to start under AppArmor

**Context:** Proving a Cursor Partner write-bound on this host.

**Tip:** `cursor-agent` `2026.08.11-e8db854` with `--sandbox enabled` exited 1. Stderr reported AppArmor.
The write target was not created. `--sandbox disabled` is a different bound and was not run. Partner launch
stays Unavailable until a write-test passes.

**Application:** Do not invent a Partner command row from help text alone.

## The skill linker must skip existing `.claude/skills` directories

**Context:** Adding a Cursor discovery root beside Claude, Codex, and Grok.

**Tip:** This repository already has real directories under `.claude/skills`, including `checklist`. The
linker must skip an existing directory and continue. Failing or replacing that directory would migrate
Claude discovery.

**Application:** Keep the skip on both validation and create. Do not add a plugin copy of the linker.
