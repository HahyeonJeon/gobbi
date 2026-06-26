---
name: sleep-consolidation-push-pull
description: Sleep consolidation is a push-pull (replay potentiates, downscaling weakens) and lossless-by-transfer, never deletion.
type: references
scope: feature
feature: memory
status: active
created: 2026-06-25
session: 463a1c96-f75c-4a14-80b4-f4d6815679cd
tags: [memory, design]
keywords: [sleep, consolidation, hippocampus, schema, downscaling, replay]
author: claude
title: Sleep — a brain-state serving systems memory consolidation
source: https://www.cell.com/neuron/fulltext/S0896-6273(23)00201-5
accessed: 2026-06-25
ref_type: paper
---

# Sleep — a brain-state serving systems memory consolidation

## Insight
Sleep consolidates memory by a "push–pull": replay potentiates important traces while synaptic downscaling weakens irrelevant ones, and the whole process is LOSSLESS-by-transfer — episodic detail moves from the hippocampus into a schema-like neocortical representation, it is never deleted.

## Reason
Directly models gobbi's locked compaction design: merge-primary = the replay/schema force (fold related records into one consolidated note), terminal archival = the downscaling force (move done records out), and both are lossless (`git mv` to `archive/`, never hard-delete). Invoke when justifying the two-force model and the never-delete invariant.

## Source
- https://www.cell.com/neuron/fulltext/S0896-6273(23)00201-5
- Supporting: https://www.frontiersin.org/journals/molecular-neuroscience/articles/10.3389/fnmol.2021.767384/full (molecular mechanisms during sleep)

## Related

- [[zettelkasten-map-of-content-atomicity]] — the note-taking analog of schema formation (consolidate via a structure note, preserve atomicity)
