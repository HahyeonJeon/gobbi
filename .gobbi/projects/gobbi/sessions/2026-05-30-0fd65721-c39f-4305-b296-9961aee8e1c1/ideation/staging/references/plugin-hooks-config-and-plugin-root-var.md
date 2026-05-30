---
title: "Claude Code plugin hooks (hooks/hooks.json) + ${CLAUDE_PLUGIN_ROOT} command paths"
source: "https://code.claude.com/docs/en/plugins-reference#hooks"
type: reference
accessed: 2026-05-30
session: 0fd65721-c39f-4305-b296-9961aee8e1c1
tags: [claude-plugin, hooks, CLAUDE_PLUGIN_ROOT, session-start, post-tool-use]
---

# Plugin hooks ship as hooks/hooks.json; reference scripts via ${CLAUDE_PLUGIN_ROOT}

## Insight
A plugin ships hooks as `hooks/hooks.json` at the plugin root (same event/matcher/command JSON shape as
user `.claude/settings.json` hooks). Hook command scripts are referenced as
`"\"${CLAUDE_PLUGIN_ROOT}\"/scripts/foo.sh"` so they resolve from the installed (relocated) plugin dir.
`SessionStart`, `PostToolUse`, `PostToolUseFailure` are all supported plugin hook events. Hook scripts must
be `chmod +x` and have a valid shebang.

Critical portability finding for gobbi's two hooks: both `session-start.sh` and `post-tool-use-agents.sh`
resolve their WORK TARGETS from the hook payload (`$CLAUDE_ENV_FILE`, and `cwd` → `$cwd/.gobbi/projects/...`)
— NOT from their own script location. So the script BODIES need no rewrite to be portable; only the
registration path changes from `.claude/hooks/session-start.sh` to
`"\"${CLAUDE_PLUGIN_ROOT}\"/hooks/session-start.sh"` (and same for post-tool-use), moving the registration
out of `.claude/settings.json` into the plugin's `hooks/hooks.json`. The hooks keep writing into the user's
project `.gobbi/` tree because that path comes from the runtime `cwd`, which is correct.
Caveat: plugin hooks run unsandboxed at hook trust level; `jq` must be on PATH (already a gobbi assumption).

## Why it applies
Resolves the brief's central hook-portability question and makes "ship the working hooks inside the plugin"
a low-risk, body-unchanged relocation — strengthening the full-breadth plugin option.

## Source
https://code.claude.com/docs/en/plugins-reference#hooks + "#environment-variables".

## Excerpt
"Location: hooks/hooks.json in plugin root, or inline in plugin.json." … 'command:
"\"${CLAUDE_PLUGIN_ROOT}\"/scripts/format-code.sh"' … "${CLAUDE_PLUGIN_ROOT}: the absolute path to your
plugin's installation directory. Use this to reference scripts, binaries, and config files bundled with the
plugin."
