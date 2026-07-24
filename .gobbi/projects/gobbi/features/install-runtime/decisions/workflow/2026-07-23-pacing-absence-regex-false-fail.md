---
name: pacing-absence-regex-false-fail
description: T9's pacing-absence regex rejected compliant cadence-neutral rules; replaced with classification-coverage instead of a polarity filter, which fails open on negated pacing rules
type: decisions
scope: feature
feature: install-runtime
status: accepted
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, verification]
keywords: [cod-plan-cons-001, pacing-absence-regex, classification-coverage, polarity-filter, live-pacing]
author: claude
supersedes: null
superseded_by: null
related: [pacing-regex-reaches-locked-site, pacing-regex-residual-formulation-gaps]
---

# The pacing sweep proves classification coverage, not absence by polarity regex

## Context

At iter1, T9's pacing check was an absence regex that rejected COMPLIANT cadence-neutral rules — e.g. it exited
1 on the legitimate phrase "use NO turn/question/probe-count proxy", because the regex could not distinguish a
rule STATING no-pacing from a rule IMPOSING pacing (`COD-PLAN-CONS-001`, High/100). A polarity filter (exclude
lines containing "no"/"not") was considered as the fix, but it fails OPEN on "ask no more than three questions
per turn" — a genuinely live pacing rule that also contains "no".

## Decision

Replaced the absence/polarity regex with CLASSIFICATION COVERAGE: every candidate pacing-shaped hit gets a
justified row from a closed enum (recorded as `PACING_HIT` rows), and the gate proves the SET is exhaustively
classified — exactly decidable — while a human sweep judges POLARITY (which a regex cannot read in either
direction).

## Rationale

A regex proving "no pacing rule present" by absence is unsound in both directions (false-fails a compliant
negative statement, false-passes a disguised positive one). Coverage — "every candidate was classified,
zero stale rows, zero unjustified" — is a property a regex CAN prove soundly; polarity cannot. Fixture-verified
against six cases: compliant → 0; omitted row → 1; out-of-enum token → 1; empty justification → 1; stale row →
1; a live pacing rule mis-tagged `LIVE-PACING` → 1.

## Alternatives considered

- **A polarity filter excluding `no`/`not`/`never`** (Codex's original alternative) — rejected: proven fail-open
  on "ask no more than three questions per turn" by adversarial fixture.

## Consequences

The candidate-set-widening work at iter2/iter3 (see [[pacing-regex-reaches-locked-site]]) operates on TOP of this
classification-coverage shape, never by reverting to a polarity filter — the gate's shape is now locked;
[[pacing-regex-residual-formulation-gaps]] documents the residual candidate-set incompleteness this design
knowingly defers to the manual `MC-T9` sweep.

## Related

- [[pacing-regex-reaches-locked-site]] — the iter3 candidate-set widening built on this classification-coverage shape
- [[pacing-regex-residual-formulation-gaps]] — the residual candidate-set gap this design defers to manual sweep
