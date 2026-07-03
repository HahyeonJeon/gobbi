---
name: d7-002-transcript-audit-mechanism-decision
description: Branch RECORD's transcript-copy Critical rule on the existing session.json.system field rather than adding a new explicit audit-status schema field
type: discussions
scope: feature
feature: workflow
status: active
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [process, codex, evaluation]
keywords: [transcript-path, audit-coverage, system-branch]
author: claude
outcome: Recommended = system-branch (no schema change); alternative = explicit audit.transcript field, kept as a documented user gate at FIX time — the one genuine cross-system divergence in this loop
---

# GEN-D7-002 remediation mechanism

## Context

GEN-D7-002 found that a Codex-permitted `transcriptPath=null` (rollout lookup failure) is treated by
RECORD as a runtime-neutral Critical `general`/`unevaluable` finding, and also false-fails the
unconditional "transcript copied" assertion at multiple contract surfaces, including every per-loop
RECORD exit checklist.

## Question

Should RECORD branch its transcript-copy behavior on the EXISTING `session.json.system` field (no
schema change), or should the project add an explicit `audit.transcript.{status,reason}` field that
distinguishes a deliberately-null Codex path from a broken one?

## Options considered

- **Recommended — `system`-branch, no schema change**: `claude-code` + absent transcriptPath stays
  Critical (unchanged; Claude Code guarantees transcripts); `codex` + null transcriptPath → skip raw
  copy, write a lower-severity `general`/`process` audit-degraded note, continue.
- **Alternative — explicit `audit.transcript.{status,reason}` field** (the Codex proposer's
  independent design): a 3-status enum (`available` / `degraded-codex-rollout-missing` /
  `missing-critical`) stamped at Configuration row 5; RECORD branches on the stamped status. Larger
  blast radius (new template field + row-5 stamp + field-reference), but makes audit coverage a
  first-class queryable property and distinguishes broken-vs-expected Codex null.

## User decision

The `system`-branch (recommended, no schema change) was self-decided toward minimal blast radius per
the brief; the explicit `audit.transcript` alternative is preserved and documented as the genuine
either/or so the user can weigh it again at the FIX-phase gate — this is the one real cross-system
divergence in the loop's dual-system production (the Claude producer and the Codex proposer converged
on direction but diverged on mechanism).

## Implication

At FIX time, `record/SKILL.md:191` gets the `system`-keyed branch as the primary edit; the alternative
stays documented in the design package for the user to re-weigh before FIX locks it in. Either choice
keeps Claude-null = Critical + VERIFY-fail everywhere.

## Related

- [[d7-002-runtime-aware-transcript-audit-branch]] — the design this decision shaped
- [[d7-002-per-loop-exit-checklist-transcript-gates]] — the completeness finding resolved at iter3 under the recommended mechanism
