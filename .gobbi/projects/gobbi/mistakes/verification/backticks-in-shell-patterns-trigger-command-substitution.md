---
name: backticks-in-shell-patterns-trigger-command-substitution
description: Backticks in shell search patterns can execute as command substitution instead of remaining literal text.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-01
session: 019f1f53-6ae2-7853-953e-4ee246cbef0b
tags: [process, verification]
keywords: [shell, quoting, backticks, command-substitution, rg, codex-exec]
author: codex
priority: high
domain: verification
supersedes: null
superseded_by: null
---

# Backticks In Shell Patterns Trigger Command Substitution

## What happened

During Codex reference research, an `rg` pattern included Markdown-style backticks around `codex exec` inside a double-quoted shell command. The shell evaluated the backticks as command substitution and invoked `codex exec` with no prompt. The same trap recurred during Planning with a double-quoted `rg` pattern.

## User feedback

No direct user wording. The session itself caught the first failure, then recorded the recurrence during Planning.

## Why it happens

The mistaken assumption is that quoting a shell command string makes backticks literal. In `zsh` and POSIX-style shells, raw backticks remain command-substitution syntax inside double quotes.

## Correct approach

Do not put raw backticks in shell patterns. Use single-quoted shell strings, escape each backtick, remove the backticks from the search pattern, or use `rg -F` with a safely quoted literal. For complex literal patterns, place the pattern in a file or build a small checked loop that avoids shell metacharacters.

## How to detect

Any command that searches Markdown inline code, command examples, or text containing backticks is a trigger. If a shell snippet contains a raw backtick and is not enclosed in single quotes at the shell level, stop and rewrite the command before running it.

## Related

- [[grep-absence-claim-needs-exact-pattern]] — another verification trap involving claims made from fragile search commands.
- [[rg-l-is-not-files-without-match]] — a related ripgrep flag trap from the same session.
