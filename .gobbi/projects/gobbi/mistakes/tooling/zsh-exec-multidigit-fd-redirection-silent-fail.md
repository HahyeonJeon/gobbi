---
name: zsh-exec-multidigit-fd-redirection-silent-fail
description: "The classic bash flock recipe exec 200>file fails with 'command not found: 200' under zsh (this environment's Bash tool shell) — zsh's numeric exec N> form only accepts single-digit fds; use the dynamic-fd exec {fdvar}>file form instead."
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-17
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [tooling]
keywords: [zsh, exec-fd, flock, dynamic-fd, silent-fail]
author: claude
priority: high
domain: tooling
supersedes: null
superseded_by: null
related: []
---

# zsh `exec 200>file` fd-redirection fails silently — use the dynamic-fd form

## What happened

The iter2 RECORD assistant found that this environment's Bash tool runs zsh, where `exec 200>file` (the
classic bash flock pattern for taking an advisory lock on a numbered file descriptor) fails with "command
not found: 200" — zsh's numeric `exec N>` form only accepts a SINGLE-digit fd (0-9); a multi-digit fd like
`200` is parsed as a command name instead of a descriptor number.

## Why it happens

Flock recipes circulated for shell scripts are almost universally written for bash, where `exec 200>file`
is standard and unremarkable. The runtime shell actually executing these commands (via the Bash tool) is
zsh, which has different fd-redirection syntax rules. The failure is silent whenever the calling script
has no `set -e`: the `exec` line errors, the script continues past it, and the intended lock is simply
never taken — a caller trusting the lock now has none, with no visible signal that anything went wrong.

## Correct approach

Use the dynamic-fd form: `exec {fdvar}>file` followed by `flock -x $fdvar` (this syntax is compatible with
both zsh and bash ≥4.1). Alternatively, use a genuinely single-digit fd number if a fixed fd is required
for some other reason. Never write `exec <two-or-more-digit-N>>file` in a script destined to run under
this environment's Bash tool.

## How to detect

Any `exec <multi-digit-N>>` construct in a script authored for the Bash tool is the signal — grep for
`exec [0-9]{2,}[<>]` before running or committing such a script. At runtime, "command not found:
<number>" appearing in stderr immediately after an `exec N>file` line is the confirming symptom.

## Related

- [[zsh-special-variable-names-break-shell-checks]] — a sibling zsh shell-quirk trap (`path`/`status` as
  zsh-special variable names); this trap covers zsh's fd-redirection syntax difference specifically.
