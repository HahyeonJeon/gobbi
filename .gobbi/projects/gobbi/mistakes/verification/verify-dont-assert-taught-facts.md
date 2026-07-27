---
name: verify-dont-assert-taught-facts
description: Agents label a wiring/mechanism claim "VERIFIED" by observing the output instead of reading the source that produces it.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-24
session: 2026-06-24-bb4eb896-bed0-42d6-9a3c-f74547df2611
tags: [verification]
keywords: [wiring, taught-facts, verify-command, embedded-count, worked-example]
author: claude
priority: high
domain: process
related: []
---

# Verify the source, not the output — "VERIFIED" requires reading the owner

## What happened

In the same session that authored `skill-writing` and `agent-writing` skills, the Ideation leader labeled two wiring claims "VERIFIED" that both dual-system evaluators disproved by re-running the checks:

1. "`scripts/sync-plugin-package.sh` does NOT manage `.agents/skills/`" — it DOES (`scripts/sync-plugin-package.sh:67-94`; `--check` confirms). The leader then wrote a manual `.agents/skills/` symlink CREATE op into the canonical Scope Contract (wrong CRUD op).
2. DD-1 attributed "reference-only / not slash-invocable" to the ABSENCE of a `Skill()` permission entry. Per the official Claude Code skills doc, discoverability/invocation is governed by frontmatter `user-invocable` / `disable-model-invocation`; `Skill()` is a tool-permission gate, not a discoverability gate. The artifact's own E-1 named the right knobs, so DD-1 contradicted its own research.

The same verify-dont-assert mistake recurred a second time in the same session — this time during Execution, inside `skill-writing`/`agent-writing` themselves. Both dual-system evaluators caught approximately 4–6 un-reproduced or non-running taught facts:

- `check-markdown-links.sh` taught as arg-less (the real script requires a path arg → exits 2 if omitted).
- "exactly three keys, no others" for skill frontmatter contradicts teaching `user-invocable` / `disable-model-invocation`; same error for the `.toml` wrapper (real evaluator.toml has `sandbox_mode`).
- A hard-coded "20" skill-count proof (worktree has 22).
- `assistant` described as read-only (real tools: Read, Grep, Glob, Bash, Write, Edit, WebSearch, WebFetch).
- `claude-plugin` claimed to appear in value-feature prose (appears 0 times in `gobbi/SKILL.md`).

## Why it happens

The agent infers a mechanism from the observed end-state — "the mirror dirs exist, so the script must not touch them" / "these skills lack a `Skill()` perm AND are reference-only, so the perm must be the gate" — instead of reading the script body or the primary doc that defines the mechanism. End-state correlation is mistaken for mechanism proof.

For the small taught facts: agents verify the big load-bearing mechanisms (which script owns a surface, which frontmatter key controls a behavior) but ASSERT the fine-grained "exactly N keys" / embedded-count / worked-example details without per-item checking. These small assertions then become wrong instructions in the shipped skill.

## Correct approach

"VERIFIED" requires reading the SOURCE OF TRUTH for the mechanism, not just observing its output:

- To claim what a script manages: read the script body.
- To claim a runtime-behavior semantic: read the primary doc (not local drift or an observed side-effect).
- Any COMMAND a doc tells the reader to run must itself be executed once as written and the output confirmed.
- "Exactly N keys / items / files" claims require counting the live tree, not asserting from memory.
- Worked examples must be executed or traced against the live source before they are written as instructions.

The `skill-writing` skill must carry a hard rule: verify every wiring mechanism by reading its owner (script / doc), then state the required END STATE and the owner that produces it — do not prescribe a hand-mechanism where an owner script or runtime already handles it.

## How to detect

- A claim is stamped "VERIFIED" but the check was an `ls` / `readlink` of the result, not a read of the script body or the primary doc.
- A taught fact includes "exactly N" (files, keys, lines) without a matching live count in the research notes.
- A worked example command is written without being run first.
- A mechanism claim contradicts another section of the same artifact (a self-contradiction is always a sign the mechanism was inferred, not verified).
- The session is writing a skill that teaches other skills; the domain match is the highest-risk signal.
