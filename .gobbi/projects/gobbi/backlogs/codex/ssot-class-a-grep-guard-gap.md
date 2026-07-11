---
name: ssot-class-a-grep-guard-gap
description: The class-A .agents/skills grep gate for the SSOT decision is T7-manual only; add a committed check so a future edit cannot silently reintroduce a class-A load-path citation.
type: backlogs
scope: project
feature: null
status: open
created: 2026-07-08
session: 14fbc122-d84c-4a16-af52-3a6dc3b1894b
tags: [codex, verification]
keywords: [ssot, class-a, grep-guard, check-codex-compatibility]
author: claude
priority: medium
project-scope: true
shipped_in: null
supersedes: null
superseded_by: null
related: []
---

# Add A Committed Grep Guard For Class-A SSOT Load-Path Citations

## Context

This session's `.gobbi` SSOT reconciliation established `.gobbi/projects/gobbi/skills/` as the single
skill-load path for both runtimes, with `.agents/skills` staying a Codex *discovery* symlink that must
never be cited as a load path (the class-A / class-B distinction). Verifying the whole repo contained no
stray class-A citation (finding F-MED-006) was done with a one-time manual grep sweep during this
session (T7), not a committed, re-runnable check.

## Why deferred

Writing and wiring a new committed guard script (extending `check-codex-compatibility.sh` or a sibling
script) was judged separate follow-up work from landing the SSOT decision and its mechanical repoint —
the manual T7 sweep was sufficient to ship this session's change cleanly, but it does not protect future
edits.

## When to pick up

No hard prerequisite — can run any time. Best picked up before the next delegation-prompt-authoring pass
that touches Load-Directives wording, since that is where a class-A citation would most likely reappear.

## Suggested approach

Extend `check-codex-compatibility.sh` (or add a sibling script) with a grep pass that scans delegation
templates, role docs, and skill docs for `.agents/skills` used as a load-path citation (as opposed to a
discovery-surface mention), flagging any hit against the class-B allowlist established by this session's
SSOT decision. Wire it into the same standing-guard set the Wrap-up post-promotion green-check already
runs, so a future edit that silently reintroduces a class-A citation fails a committed check instead of
depending on a future manual sweep.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-08-14fbc122-d84c-4a16-af52-3a6dc3b1894b/`

## Related

(none)
