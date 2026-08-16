# Stop reminder backlog

## Silence expected duplicate-lock stderr

**Backlogged at:** 2026-08-16T02:02:00Z

**What:** Keep the atomic `mkdir` lock, but do not write `mkdir: File exists` to stderr on the expected
duplicate registration for the same session and prompt pair.

**Why backlogged:** Named-subject evaluation passed without this change. The second lock already exits 0 with
empty stdout. The stderr line is an optional host-noise fix, not a locked outcome.

**Context:** The hook runs `mkdir "$lock_root/${lock_id}" || exit 0`. Grok treats hook stderr as feedback and
can show the first line in scrollback. A blanket stderr redirect would also hide unexpected filesystem
failures. Current design:
[stop reminder](../design/feature/stop-reminder.md).

## Live Grok two-prompt reinjection

**Backlogged at:** 2026-08-16T02:02:00Z

**What:** Confirm one live Grok session with two user prompts injects once per prompt and does not inject
twice inside either prompt.

**Why backlogged:** Isolated lock tests already pass for a new prompt id. Named-subject evaluation passed
without a second live Grok user prompt. Live once-per-later-turn behavior on Grok was not reobserved.

**Context:** The accepted lock is `sha256(session + NUL + prompt)`. Grok documents a new `promptId` per turn.
Current design: [stop reminder](../design/feature/stop-reminder.md).
