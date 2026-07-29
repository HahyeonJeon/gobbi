---
name: multi-edit-script-cites-uncreated-item
description: A multi-edit script that asserts an earlier stage wrote nothing new can still have a later stage cite that earlier stage's output as if it existed — only a post-edit rescan of the actual tree catches it.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-26
session: bae334bf-c3df-4155-bbd0-92d5a36f3feb
tags: [verification]
keywords: [multi-edit-script, coverage-map, sequencing-assumption, post-edit-rescan]
author: claude
priority: high
domain: verification
related: [execution-bundle-source-before-trim, reharden-edit-blast-radius-miss, cited-process-mistake-not-applied-to-own-artifact]
---

# A multi-edit script that asserts "late writes nothing early" can still cite a never-created item

## What happened

A script running several edits in sequence carried an explicit assumption that its later stages
write nothing the earlier stages depend on — an ordering guarantee meant to make the whole run
safe to reason about one stage at a time. A follow-up script, run afterward under that same
assumption, then updated a coverage map to cite a specific item as covered. The cited item was
never actually created by any stage of either script — the citation was added on the belief that
an earlier stage's output existed, when in fact no stage had produced it. Every individual stage's
own local check passed, because each stage verified only what it itself wrote. The gap was found
only when a later, independent rescan of the actual on-disk tree was compared against the coverage
map's claims and found a citation with no corresponding file.

## Why it happens

"Late writes nothing early" is a claim about ORDER (no stage undoes or overwrites an earlier
stage's work) and gets conflated with a much stronger, unstated claim that everything a later
stage might want to cite was actually produced by some earlier stage. The ordering guarantee is
real and worth stating, but it says nothing about EXISTENCE — a later stage can still assume an
item exists because the plan called for it, without checking that the item's own creation stage
actually ran, actually succeeded, or actually produced that specific item under that specific
name. Re-reading the diff of the follow-up script does not catch this, because the diff shows a
correctly-formatted new coverage-map line; the diff cannot show that the line's SUBJECT does not
exist, since that fact lives outside the diff entirely, in the state of the rest of the tree.

## Correct approach

Treat "a later stage cites an earlier stage's output" as a claim requiring its own check,
independent of the ordering guarantee: after all stages run, rescan the actual tree for every item
a later stage's output claims exists, and fail closed if any citation has no corresponding file or
artifact. Do this as a POST-EDIT step over the real filesystem, not as a design-time review of the
scripts' own logic or their diffs — the scripts' diffs are individually correct and will not
reveal the gap. When a plan has one stage create an item and a later stage cite it, make the
citation's existence an explicit dependency the later stage checks at runtime (a file-exists test,
not an assumption from the plan), so a stage that silently failed to create its item cannot be
cited as if it had.

## How to detect

A multi-stage edit or generation pipeline where a later stage's output references, counts, or
cites something an earlier stage was supposed to produce, and the only evidence that the earlier
stage succeeded is that its own script ran without error — not that the specific cited item is
present on disk. The tell: reviewing each stage's diff individually looks clean, because each diff
is locally correct; only a full post-run rescan comparing every citation against the actual tree
surfaces the gap. Any coverage map, index, or manifest updated by a script that did not itself
verify the thing it is indexing is a candidate for this trap.

## Related

- [[execution-bundle-source-before-trim]] — the sibling ordering trap: a plan's ordering guarantee
  (source available before trim) can be violated the opposite way, deleting something a later stage
  needs; this trap is a later stage citing something that was never created in the first place
- [[reharden-edit-blast-radius-miss]] — the sibling consumer-sweep trap: a set-membership edit must
  be checked against every consumer register, not assumed complete from the edit's own diff
- [[cited-process-mistake-not-applied-to-own-artifact]] — the general family: a discipline named in
  a script or plan is not the same as that discipline being applied to the script's own output
