---
name: agent-memory-consolidation-governed
description: Agent-memory consolidation is an async background pass, carries governance risk, and best practice preserves ground truth.
type: references
scope: feature
feature: memory
status: active
created: 2026-06-25
session: 463a1c96-f75c-4a14-80b4-f4d6815679cd
tags: [memory, design]
keywords: [agent-memory, consolidation, governance, ground-truth, SSGM, MemMachine]
author: claude
title: Memory for Autonomous LLM Agents — consolidation, governance, ground-truth preservation
source: https://arxiv.org/html/2603.07670v1
accessed: 2026-06-25
ref_type: paper
---

# Memory for Autonomous LLM Agents — consolidation, governance, ground-truth preservation

## Insight
In agent-memory systems, consolidation runs as an asynchronous background pass decoupled from the primary inference path; evolving/merging stored memory carries governance risk (the SSGM framework), and a strong design preserves ground truth rather than overwriting it (MemMachine).

## Reason
Validates two gobbi choices: run compaction at Wrap-up (the "sleep" pass, not mid-session) and behind the non-skippable Stage-3 dual-system validation gate (governance), and keep it lossless via `archive/` (ground-truth preservation). Invoke when justifying the Stage-2c placement inside the Stage-3 gate.

## Source
- https://arxiv.org/html/2603.07670v1 (survey)
- Supporting: https://arxiv.org/html/2603.11768v1 (SSGM governed memory); https://arxiv.org/pdf/2604.04853 (MemMachine ground-truth-preserving)

## Related

- [[lsm-compaction-threshold-merge-similar]] — the systems-engineering view of the same bounded-merge problem
