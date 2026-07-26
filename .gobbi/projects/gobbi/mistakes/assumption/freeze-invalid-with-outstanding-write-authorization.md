---
name: freeze-invalid-with-outstanding-write-authorization
description: A bundle is not frozen while a write instruction issued to its author is still outstanding, even if its content looks complete when read.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-25
session: bae334bf-c3df-4155-bbd0-92d5a36f3feb
tags: [process]
keywords: [freeze, dispatch, protocol-state, digest, evaluator-handoff]
author: claude
priority: high
domain: process
---

# A freeze is not a freeze while any write authorization is outstanding

## What happened

A bundle was declared frozen and dispatched to two fresh evaluators while a write instruction to
its author was still outstanding. The manager authorized an addition and, in the same exchange,
signalled the artifact was heading to evaluation; then read the file, took its digest, and
dispatched. The authorized write landed afterwards. Evaluators were pointed at a digest that no
longer described the file they would actually read — one evaluator's report reflected a version
of the artifact that included the late addition, and its absence from the other evaluator's
findings was not, by itself, evidence that the addition was sound; it only showed that evaluator's
input predated the addition.

## Why it happens

Freezing is naturally checked against CONTENT (file read, looks complete, digest taken). But an
outstanding write authorization is a property of the PROTOCOL STATE between manager and author,
not of the content. Nothing in the file reveals its author is still under instruction to add to
it, so a content-based check cannot detect the condition however carefully performed. This is made
easier when a write instruction and a freeze signal are issued in the same message — the second
reads as superseding the first when it does not.

## Correct approach

Before declaring a bundle frozen, enumerate every write instruction issued to every author since
the previous freeze and confirm each one landed or was explicitly revoked. THEN take the digest.
THEN dispatch. In that order, not interleaved. The enumeration is the manager's own outbound
record, so it is always available — a checkable precondition, not a matter of vigilance. If a
write lands after dispatch anyway, re-dispatch against the new digest rather than let evaluation
proceed against a stale subject.

## How to detect

1. A freeze declared in the same message that issues, reaffirms, or answers a question about a
   write instruction. That shape is a structural contradiction — treat the bundle as unfrozen
   until the author confirms the write landed.
2. An outstanding instruction with no landing confirmation. For every write instruction issued
   since the last freeze there must be an author report that it landed, with a consistent digest
   change, or an explicit revocation. "It looked complete when I read it" satisfies neither claim;
   a digest alone cannot distinguish "no write pending" from "a pending write has not landed yet."
3. When adjudicating evaluator findings after a late-landing write: a finding about the added
   content proves that evaluator's input included it; the absence of such a finding from a peer
   report proves only that the addition was out of that peer's scope, not that it is sound.

## Related

- [[iteration-artifact-edited-in-place-destroys-snapshot]] — the sibling trap, not a duplicate:
  that trap is about an AUTHOR editing a prior iteration's frozen evidence in place; this one is
  about a MANAGER declaring a freeze while a write it authorized is still outstanding. Different
  actor, different fix — never-edit-in-place there, pre-freeze enumeration here.
- [[teammate-finalize-read-crosses-in-progress-write]] — a related timing trap: a manager's read
  can cross a teammate's in-progress write and must be re-verified after the teammate's own report.
- [[agent-teams-idle-notification-is-not-completion]] — a related trap: an availability or idle
  signal is not the same as the author's own explicit completion report.
