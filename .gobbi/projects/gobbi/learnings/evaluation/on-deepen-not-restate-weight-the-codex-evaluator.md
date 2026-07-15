---
name: on-deepen-not-restate-weight-the-codex-evaluator
description: On deepen-not-restate, Codex is the more sensitive evaluator; weight a Codex-flagged restatement toward a calibrated trim.
type: learnings
scope: project
feature: null
status: active
created: 2026-07-12
session: f87055a2-08b2-4605-b33b-c01c47416830
tags: [evaluation, codex, process]
keywords: [deepen-not-restate, dual-system-eval, python-skill, design-doc, calibrated-trim]
author: claude
supersedes: null
superseded_by: null
related: [dual-system-value-is-divergence-not-agreement, language-skill-procedure-must-operationalize-meta-disciplines]
---

# On Deepen-Not-Restate, Weight The Codex Evaluator

## Insight

On the deepen-not-restate axis specifically, the Claude and Codex evaluators reliably
DIVERGE, and Codex is the more sensitive detector. Twice in one session the Codex
evaluator flagged restatement that the Claude evaluator judged clean both times.

## Context

Building the `python` skill, the Codex evaluator flagged restatement twice: (1)
`design.md` reproducing `coding` skill principle bodies instead of citing them; (2) the
rewritten Python Procedure reproducing `coding` / gobbi `principles` bodies under a
citation, rather than citing and moving on. In both cases the Claude evaluator, running
the same deepen-not-restate check on the same content, judged the passage clean. Claude
tolerates fuller prose that reproduces a general principle's body as elaboration; Codex
flags "cite the principle, then reproduce its body anyway" as a violation of the axis.

## Reason

If the manager trusts a Claude-clean verdict on this axis without reading the Codex
finding, the shipped doc keeps paying the restatement cost every time it is read: a
citation is supposed to let the reader look up the general principle once and read only
the domain-specific delta here. A doc that cites AND reproduces pays token cost twice
and buries the domain-specific content the reader actually needs inside a general-
principle summary they already have elsewhere. Losing this lesson means future
deepen-not-restate reconciliation defaults to whichever verdict the manager reads first,
instead of a deliberate lean toward the system that has, twice running, caught the real
restatement the other system missed.

## How

When the two evaluators split on the deepen-not-restate axis — Codex flags a passage as
restatement-High and Claude calls the same passage clean — read the flagged lines
yourself before reconciling, and lean toward a calibrated trim rather than dismissing
the Codex finding. Keep the trim surgical: collapse the reproduced principle body down
to a terse citation, but KEEP the domain-specific act, table, or artifact the passage
was actually contributing — the trim removes the restated body, not the
operationalization Claude's own evaluation correctly valued. Both catches in this session
were confirmed correct on manager inspection, and both trims resolved the finding
without losing content.

## Counter-cases

- **A Codex restatement flag on genuinely domain-specific content** (content that only
  looks similar to a general principle's wording but is actually stating a
  language-specific or skill-specific rule) is a false positive — trimming it would
  delete real content, not a restated body. Read the flagged lines before trimming;
  do not auto-strip on a Codex flag alone.
- **This is a directional weighting from two same-session observations, not a proven
  law.** It says "read the Codex finding closely and lean toward trusting it on this
  axis," not "always defer to Codex over Claude on deepen-not-restate." A larger sample
  could shift the weighting or narrow the axis it applies to.

## Related

- [[dual-system-value-is-divergence-not-agreement]] — the general pattern this is a
  specific instance of: dual-system value comes from divergence, and this learning names
  which system to weight on one specific axis
- [[language-skill-procedure-must-operationalize-meta-disciplines]] — the second of the
  two same-session Codex-only restatement catches, on the rewritten Python Procedure
