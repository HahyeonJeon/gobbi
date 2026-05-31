---
name: prior-gobbi-core-plugin-package-history
title: "Prior gobbi Claude Code plugin package (gobbi-core → gobbi) — git history & proven solutions"
source: "git history: 62b95a0, ba8aa42, c79d28e (#251/#252), #253-#256, e083fad^ (last-live), e083fad (#264 wipe)"
type: references
scope: feature
feature: install-runtime
status: active
created: 2026-05-30
session: 0fd65721-c39f-4305-b296-9961aee8e1c1
tags: [claude-plugin, prior-art, gobbi-core, materialize-symlinks, agents-field, hooks-saga, marketplace]
accessed: 2026-05-30
ref_type: codebase-history
---

# Prior gobbi Claude Code plugin package — history & proven solutions

## Insight

gobbi DID ship a full Claude Code plugin + marketplace through v0.4.x, wiped in the v0.5 reset. This is
prior art, not first-attempt territory. The proven lessons (each verified against the actual commit):

- **62b95a0 (PR #6)** introduced `.claude-plugin/marketplace.json` (`name: gobbi`, plugins[]→`gobbi-core`,
  `source: "./plugins/gobbi-core"`) + `plugins/gobbi-core/.claude-plugin/plugin.json`. The plugin lived in
  a **dedicated bounded subtree** (`plugins/gobbi-core/`), with the manifest INSIDE that subtree — exactly
  the bounded-package model re-chosen in iter-2. The initial manifest used directory pointers:
  `"skills": "./skills/"`, `"agents": "./agents/"`, `"hooks": "./hooks/"`.
- **ba8aa42** (`fix(marketplace): remove invalid hooks and agents fields from plugin.json`) PROVED the old
  schema REJECTED directory-valued `agents` and `hooks`: "Claude Code plugin schema requires hooks to point
  to a hooks.json file, not a directory. Agents field also failed validation." It dropped both, keeping only
  `"skills": "./skills/"`. (Lesson now refined: the CURRENT schema accepts `agents` as an array of file
  paths — see the manifest-schema reference — so the v0.5 fix is the 5-file array, not omission.)
- **c79d28e (#251/#252)** (`materialize agent + skill symlinks for marketplace fetch`) is the load-bearing
  proven solution: the plugin's `agents/*.md` and `skills/*` were SYMLINKS pointing outside the plugin
  subtree (`../../../.claude/agents/...`); the marketplace fetch (which takes only `plugins/gobbi/`) dropped
  them → "every published v0.4.x install had empty `agents/` and `skills/` directories." Fix: replace the
  escaping symlinks with REAL FILE CONTENT inside the package (7 agent files + 49 skill dirs / 170 files).
  Explicit trade-off recorded: "Editing on main now requires editing in two places" (the drift/sync surface).
- **#253-#256 hooks saga**: ed8d2a4 (#253) dropped the load-env hook + added a `clear` matcher; 17e695d
  (#254) dropped the session-metadata hook; d61036d (#255) restored it with a 15s timeout; f28b319 (#256)
  `metadata hook matcher missed sdk-cli source — drop matcher entirely`. Lesson: a too-narrow hook `matcher`
  silently misses event sources; the safe end-state was NO matcher (fire on all) + an explicit timeout.
- **Last-live state (e083fad^)** had already migrated `plugin.json` to `"agents": [5 .md file paths]` and a
  full `hooks/hooks.json`, plus `README.md` + `settings.json` inside the package. This is the closest direct
  template for the fresh build — though the v0.5 markdown-driven structure differs (no `gobbi-dev` CLI).
- **e083fad (#264)** wiped `plugins/` (and code/sessions/codex/.agents) in the pre-rebuild sweep (refs #263).

## Why it applies

Corrects the iter-1 false claim "No prior `.claude-plugin/` attempt on record." Planning starts from the
proven base, not a blank slate: bounded-package subtree (62b95a0), materialize-real-files over escaping
symlinks (#251), agents-as-file-array + hooks-as-hooks.json-file (ba8aa42 + current schema), and the
matcher-too-narrow hook footgun (#256). The v0.5 build mined this history for proven solutions.

## Source

`git show 62b95a0:.claude-plugin/marketplace.json`, `git show 62b95a0:plugins/gobbi-core/.claude-plugin/plugin.json`,
`git show ba8aa42 -- '*plugin.json'`, `git show c79d28e --stat`, `git show e083fad^:plugins/gobbi/.claude-plugin/plugin.json`,
`git show e083fad^:plugins/gobbi/hooks/hooks.json`, `git log --all --grep 254|255|256`.

## Excerpt

ba8aa42 message: "Claude Code plugin schema requires hooks to point to a hooks.json file, not a directory.
Agents field also failed validation. Removed both."
c79d28e message: "The previous symlinks pointed outside the plugin subtree … the Claude Code marketplace
fetch — which only takes `plugins/gobbi/` — dropped them entirely. … Now `plugins/gobbi/agents/` ships 7
real agent files and `plugins/gobbi/skills/` ships 49 real skill directories. … Trade-off: dev-tree
edit-once convenience is lost on `main` … Editing on main now requires editing in two places."
e083fad^ plugin.json: `"agents": ["./agents/manager.md","./agents/leader.md","./agents/executor.md","./agents/evaluator.md","./agents/assistant.md"]`.
