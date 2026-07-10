---
name: session-header-dual-writer
description: Session-record routing headers are parsed by two independent writers; extending one without the other silently drops the field.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-08
session: 14fbc122-d84c-4a16-af52-3a6dc3b1894b
tags: [process, verification]
keywords: [session-json, post-tool-use-hook, reconstruct-agents, routing-headers]
author: claude
priority: high
domain: hooks
supersedes: null
superseded_by: null
---

# A Session-Record Routing Field Has Two Independent Writers

## What happened

Ideation discovery on the `delegation` skill found that structured header fields on `session.json`'s
`agents[]` entries (`phase`, `sub_step`, and the proposed `system` field) are parsed by TWO separate
scripts: `hooks/post-tool-use-agents.sh` (a best-effort seed that runs during the session) and
`.claude/scripts/reconstruct-agents.sh` (the authoritative SessionEnd reconciler that rebuilds the
`agents[]` entries from the full transcript). Adding a new header (e.g. `Your system:`) to the hook's
extraction logic without also adding it to the reconciler's builder means the hook seeds the field
during the session, but the reconciler silently drops it when it rebuilds `agents[]` at session end —
because the reconciler is authoritative, the seeded value never survives.

## Why it happens

The hook and the reconciler look like a single "parse headers into session.json" concern from the
outside, but they are two independently maintained code paths that both re-implement the same header
extraction. An agent editing one (because it is the file open in front of them, or the one that seems to
"do the parsing") has no structural signal that a second file does the same job at a different point in
the session lifecycle. Nothing fails loudly — the field is simply absent from the final `session.json`,
which looks like "the field was never populated" rather than "the field was populated then dropped."

## Correct approach

Treat the hook's header-extraction set and the reconciler's header-extraction set as one coupled pair,
not two independent implementations. Any new routing header added to `hooks/post-tool-use-agents.sh`'s
`extract_header` set MUST be added to `.claude/scripts/reconstruct-agents.sh`'s equivalent builder in the
same change, and vice versa. Verify with a behavioral test, not a docs read: feed a sample payload
carrying the new header through both scripts against a fixture `session.json` / fixture transcript and
confirm the field survives to the final reconciled state, not just the hook's intermediate seed.

## How to detect

Any change that adds a new structured header (a `Your <field>:` convention) to ONE of
`hooks/post-tool-use-agents.sh` or `.claude/scripts/reconstruct-agents.sh` without a matching change to
the other. Grep both files for the header-extraction field lists and diff them — a field present in one
list and absent from the other is this exact drift. A `session.json.agents[]` entry missing a field that
a hook clearly seeded (visible mid-session) but that is absent after SessionEnd is the runtime symptom.

## Related

- [`skills/delegation/mistakes.md#skill-prose-template-drift`](../../skills/delegation/mistakes.md#skill-prose-template-drift) — the general drift pattern this coupled-writer gap is a variant of
