---
name: verify-dont-assert-taught-facts
description: An agent labels a mechanism / count / worked-example claim "verified" by observing the output instead of reading the source that produces it, then ships it as an instruction.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-24
session: 2026-06-24-bb4eb896-bed0-42d6-9a3c-f74547df2611
tags: [verification, process]
keywords: [wiring, taught-facts, verify-command, embedded-count, worked-example]
author: claude
priority: high
domain: process
layer: 2
layer2-source: .gobbi/projects/gobbi/mistakes/verification/verify-dont-assert-taught-facts.md
layer2-rationale: Generalizable across all projects. Whenever any agent authors or reviews a doc, standard, plan, or briefing that makes a mechanism claim, an "exactly N" count, or a worked-example command, each such claim must be verified against its owner — read the source that produces the behavior, run the command once as written, count the live tree — not inferred from observed output. Not gobbi-specific.
supersedes: null
superseded_by: null
---

# Verify the source, not the output — "verified" requires reading the owner

## Layer-2 note

This is a Layer-2 copy of `mistakes/verification/verify-dont-assert-taught-facts.md`. It lives in `skills/mistake/` so it persists and loads across all projects and future sessions. The canonical record is at the project mistakes path above; this copy exists only for cross-project recall.

---

## What happened

In one session, the same trap surfaced twice. An Ideation leader stamped two wiring claims "VERIFIED" that re-running the check disproved (a script's ownership of a mirror dir; which control governs skill discoverability). Then, during Execution, the authored skills themselves shipped ~4-6 un-reproduced or non-running taught facts: a command taught arg-less that the real script rejects, an "exactly three keys" claim that contradicted the doc's own other section, a hard-coded count that was already stale, and a role described read-only that has write tools.

## Why it happens

Two distinct failure modes, same root:

1. **Mechanism by correlation.** The agent infers a mechanism from the observed end-state ("the mirror dirs exist, so the script must not create them") instead of reading the script body or primary doc that defines it. End-state correlation is mistaken for mechanism proof.
2. **Small facts asserted, not checked.** The agent verifies the big load-bearing mechanisms but asserts the fine-grained details — "exactly N keys", an embedded count, a worked-example command — from memory. Those small assertions become wrong instructions in the shipped artifact. Acute for a doc/standard whose own credibility IS the discipline it teaches.

## Correct approach

"Verified" requires reading the SOURCE OF TRUTH, not observing its output:

- To claim what a script/tool manages: read its body.
- To claim a runtime-behavior semantic: read the primary doc, not a local side-effect or drift.
- Any command a doc tells the reader to run: execute it once as written and confirm the output.
- Any "exactly N keys / items / files" claim: count the live tree, do not assert from memory.
- Any worked example: execute or trace it against the live source before writing it as an instruction.
- A claim that contradicts another section of the same artifact is always a sign the mechanism was inferred, not verified — reconcile by reading the owner.

## How to detect

- A claim is stamped "verified" but the check was an `ls` / `readlink` of the result, not a read of the source that produces it.
- A taught fact includes "exactly N" or an embedded count with no matching live count in the notes.
- A worked-example command appears without evidence it was run.
- A mechanism claim self-contradicts elsewhere in the same artifact.
- The artifact being written IS a doc/standard about the very domain whose facts are being asserted — the domain match is the highest-risk signal.

## Related

- [[planning-asserted-skill-without-verifying]] — earlier instance of the same path/existence-claim trap.
