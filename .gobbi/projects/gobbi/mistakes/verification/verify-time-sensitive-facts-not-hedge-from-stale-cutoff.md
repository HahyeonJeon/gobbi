---
name: verify-time-sensitive-facts-not-hedge-from-stale-cutoff
description: A version/release-dependent claim was hedged as "unreleased/pending" from a stale knowledge cutoff, when the release had already shipped and the original concrete text was correct.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-16
session: 054f402b-a9ab-4af6-875d-078233778a0b
tags: [process, verification, docs-sync]
keywords: [time-sensitive, knowledge-cutoff, web-verify, release-dependent, hedge, ts7]
author: claude
priority: high
domain: verification
---

# Hedging a time-sensitive fact from a stale cutoff shipped a false claim

## What happened

The `typescript` skill originally named the TS 7.0 typed-lint compatibility package `@typescript/typescript6`
and its `tsc6` binary as concrete fact. A first-round evaluator flagged that as "stated as fact though TS 7.0
is unreleased" and the manager HEDGED it to "a JS-based TS compatibility API; exact package/binary name pending
7.0 GA." A later re-eval web-searched and found TypeScript 7.0 had **already GA'd on 2026-07-08** (8 days before
the review), and the GA announcement names exactly `@typescript/typescript6` + `tsc6`. So the original concrete
text was correct; the "unreleased, hedge it" reasoning — and the hedge — were both wrong, based on a knowledge
cutoff (Jan 2026) that predated the release. The hedge had to be reversed and the concrete names restored.

## Why it happens

A model reasons about a release/version/date-dependent fact from its training cutoff and treats "I don't know
this shipped" as "it hasn't shipped." Hedging then FEELS safe and rigorous ("don't assert an unreleased detail"),
but it is a positive claim too — "pending GA" asserts the thing has NOT shipped — and it is false once the
release lands. The cutoff makes both the original author (who named it) and the reviewer (who called it
unreleased) operate on stale ground; neither checked the world.

## Correct approach

When a claim depends on a release, version number, date, or other fast-moving external fact — especially one
that could have changed after the knowledge cutoff — WEB-VERIFY it against a primary source before either
asserting OR hedging it. "Pending release" / "unreleased" / "not yet available" are themselves time-sensitive
positive claims and get the same verification bar as the concrete fact. Prefer a dated, sourced statement
("as of TS 7.0, GA 2026-07-08, per the vendor announcement …") over a vague hedge — a hedge that turns out
false is worse than the concrete fact it replaced.

## How to detect

Red-flag phrases in a doc or a review finding: "unreleased", "pending GA", "not yet", "upcoming", "expected in
version N", a bare future version number, or "the exact name is TBD." Any of these on a fact that a user could
check today is a web-verify trigger. Also: a reviewer calling a concrete named artifact "speculative/unreleased"
is asserting a negative that itself needs verification — do not accept it (or hedge on it) without a source
check. Mechanical gates (compile, lint, link) never catch a stale-fact hedge; only a primary-source lookup does.

## Related

- [[weight-codex-evaluator-on-technical-accuracy]] — the re-eval that caught the stale hedge was the Codex
  evaluator, which web-verified the GA date; reinforces weighting Codex on technical/factual accuracy.
- See also `evaluation/SKILL.md` § Verification by tools — a time-sensitive claim is a segment whose strongest
  verification is a primary-source fetch, not reasoning from the cutoff.
