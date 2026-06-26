---
name: lsm-compaction-threshold-merge-similar
description: LSM compaction fires on a size threshold, merges only similar runs, and tombstones rather than deletes; over-compaction amplifies writes.
type: references
scope: feature
feature: memory
status: active
created: 2026-06-25
session: 463a1c96-f75c-4a14-80b4-f4d6815679cd
tags: [memory, design]
keywords: [lsm-tree, compaction, tombstone, write-amplification, size-tiered, threshold]
author: claude
title: RocksDB / LSM-tree compaction
source: https://github.com/facebook/rocksdb/wiki/Compaction
accessed: 2026-06-25
ref_type: docs
---

# RocksDB / LSM-tree compaction

## Insight
Storage compaction triggers when a level reaches a size/run threshold T, merges groups of SIMILAR runs (not everything), removes data via tombstones rather than hard delete, and — the footgun — over-aggressive compaction causes write amplification (re-writing the same data many times).

## Reason
The engineering anchor for gobbi's cap + merge design: per-`{type}/{area}/` softCap/hardCap = the threshold T; merge-by-relatedness = "merge similar runs"; archive (never delete) = the tombstone; and a cap set too low that forces destructive merges every session is the write-amplification analog the relatedness gate (never force-merge unrelated) exists to prevent. Invoke for the threshold + the no-junk-merge guardrail.

## Source
- https://github.com/facebook/rocksdb/wiki/Compaction
- Supporting: https://vldb.org/pvldb/vol14/p2216-sarkar.pdf (LSM compaction design space)

## Related

- [[sleep-consolidation-push-pull]] — the biological analog of bounded-size-by-merge
