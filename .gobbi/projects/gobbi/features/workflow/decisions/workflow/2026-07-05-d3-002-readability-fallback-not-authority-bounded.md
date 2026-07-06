---
name: d3-002-readability-fallback-not-authority-bounded
description: iter1 Codex finding F-CODEX-USAGE-001 — D3-002's readability fallback lacked authority bounds after Option S was locked; resolved at iter2
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-05
session: 1fecddb4-255e-4829-9912-42deb9c36fc8
tags: [ideation, process]
keywords: [f-codex-usage-001, d3-002, readability-fallback, option-s, option-l]
author: claude
related: [d3-002-manager-refs-specialist-phase-loads-column-split]
---

# D3-002 readability fallback was not authority-bounded after Option S was locked (F-CODEX-USAGE-001)

## Context

The user locked D3-002's Option S (the two-column structural split) over the advisory legend (Option L). The
iter1 draft's readability fallback ("if 6 columns are unreadable, keep one Refs column but label both parts
inline") gave no objective trigger threshold and did not say who could invoke it. Codex's iter1 Usage
evaluator (F-CODEX-USAGE-001, Type `assumption_risk`, Domain `process`, Severity Medium, Confidence 75)
flagged that an executor could read this as license to autonomously replace the user-locked structural
decision with a narrower, effectively Option-L-shaped fallback.

## Decision

Bound the fallback explicitly: it is an Execution-time PRESENTATION choice within the locked Option S,
invoked by "the executor MAY (with manager awareness)," carrying the exact same two-part content in a
narrower rendering. It is NOT a re-decision of L vs S — that fork is closed; no agent may re-open it via the
fallback.

## Rationale

The fallback's purpose (accommodate Markdown rendering width) is legitimate and was already part of the
locked design's cost-benefit; what was missing was WHO decides to invoke it and WHETHER invoking it weakens
the user's actual decision. Naming the executor as the invoking authority, "with manager awareness," and
stating explicitly that only rendering — not content or decision — changes, closes both gaps without
touching the substance of the locked S choice.

## Alternatives considered

- **Remove the fallback entirely, forcing the 6-column table regardless of rendering quality.** Rejected —
  the fallback is a legitimate, low-risk escape hatch for a real Markdown-rendering concern; removing it
  trades a bounded convenience for no benefit.
- **Require a full manager/user re-confirmation before every fallback invocation.** Rejected as
  disproportionate — the fallback changes only presentation, not the locked decision's content; a full
  re-ask would treat a rendering choice as if it were a design fork.

## Consequences

The Claude iter2 Usage evaluator confirmed: "Disposition: addressed. Fallback is now authority-bounded and
presentation-only within the locked S." One residual, non-blocking gap remained — the "renders poorly"
trigger still has no objective threshold — tracked separately, Low severity, as
`d3-002-readability-fallback-threshold-not-objective`.

## Related

- [[d3-002-manager-refs-specialist-phase-loads-column-split]] — the design this finding shaped
- [[d3-002-readability-fallback-threshold-not-objective]] — the residual non-blocking gap (no objective
  trigger threshold)
