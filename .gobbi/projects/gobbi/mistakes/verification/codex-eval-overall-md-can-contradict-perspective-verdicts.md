---
name: codex-eval-overall-md-can-contradict-perspective-verdicts
description: A report summary contradicted its own findings; derive every section and report verdict from the authoritative ledger.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-14
session: 6a9e0963-2ca1-4d07-83d3-1889aa16bcf4
tags: [verification, codex, evaluation]
keywords: [overall, perspective-verdict, finding-ledger, evaluation-report, authoritative-source]
author: claude
priority: high
domain: evaluation
supersedes: null
superseded_by: null
related: [verify-state-from-authoritative-source-not-proxy, union-diff-occurrence-vs-distinct-primitive]
---

# Derive evaluation verdicts from the complete finding ledger

## What happened

In a historical multi-file evaluation package, a Codex summary said PASS while several perspective files contained High findings and REVISE verdicts. A checklist row also referenced an undefined finding ID. Reading only the summary would have shipped a real defect.

## Why it happens

A human summary or top-level verdict is a derived view. If generation, rendering, or synthesis does not validate it against the ledger, the derived value can contradict the evidence. Checklist references have the same risk when they are not checked against defined IDs.

## Correct approach

Each system returns one complete evaluation report containing seven perspective sections, Overall, eight ledgers, one checklist, section verdicts, and a report verdict. Derive each section verdict from its open or disputed findings, then derive the report verdict as the most severe section result.

Validate the machine JSON and rendered Markdown with `validate-evaluation-report.sh`. It must reject contradictory human/machine verdicts, undefined checklist finding IDs, duplicate or missing perspectives, bad fingerprints, and provenance errors. The manager then validates the Claude/Codex pair and aggregates the two report verdicts pessimistically.

## How to detect

The rendered `VERDICT` disagrees with the machine report, a section verdict disagrees with its ledger, or a FAIL checklist row names an ID absent from all eight ledgers. Another signal is a manager recording a verdict without a passing single-report and pair validator.

## Related

- [[verify-state-from-authoritative-source-not-proxy]] — the general proxy-versus-authoritative-state trap.
- [[union-diff-occurrence-vs-distinct-primitive]] — a sibling evidence-granularity discipline.
