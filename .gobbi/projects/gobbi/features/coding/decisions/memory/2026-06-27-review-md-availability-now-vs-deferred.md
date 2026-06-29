---
name: review-md-availability-now-vs-deferred
description: Qualify review.md availability — standalone use NOW, formal-EVALUATION use deferred; prevents wiring-claim confusion
type: decisions
scope: feature
feature: coding
status: accepted
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [docs-sync, design]
keywords: [availability, deferred-wiring, standalone-use, formal-evaluation, wiring-claim]
author: claude
supersedes: null
---

# Decision: qualify `review.md` availability — standalone use NOW, formal-EVALUATION use deferred

## Context

iter1 Codex findings `codex-usage-001` (assumption_risk/docs-sync, Med/75) and `codex-overall-003` (assumption_risk/docs-sync, Med/75) found that the design claimed `review.md` is usable as "the substance behind the `/code-review` built-in command" and as the basis for gobbi's formal EVALUATION sub-phase — without qualifying that the wiring for the latter is deferred.

The risk: a reader or agent picks up `review.md` and assumes it is already automatically invoked during formal gobbi EVALUATION, leading to double-review confusion or misplaced reliance on a wiring that has not shipped.

## Decision

Two-clause availability statement to be included in both the design doc and the `review.md` relationship section:

1. **Available NOW**: manual / standalone review use; executor preflight self-review; the basis for a human or agent conducting a PR or code review; the conceptual substance for the `/code-review` command (human-invoked).
2. **Deferred**: automatic use of `review.md` as part of the formal gobbi EVALUATION sub-phase (requiring Load Directives, runtime mirror sync `.claude/` / `.codex/` / `plugins/gobbi/`, and evaluation-phase integration). This wiring is tracked in `wire-review-doc-into-workflow`.

The doc MUST NOT claim it is already wired into the formal evaluation phase.

## Rationale

`R-1` (assumption_risk/docs-sync) in iter1 captured the same concern from the Claude perspective: the design implied present-tense integration that does not exist. The known mistake (`scrub-stack-idioms-when-adapting-to-general-doc`) covers exactly this pattern: a general doc leaking present-tense wiring claims from an internal one. Qualifying "now vs. deferred" explicitly guards against this while honestly communicating what the doc IS immediately useful for.

## Alternatives considered

- **Remove all mentions of formal evaluation use**: Rejected. The connection to the formal evaluation phase is real and useful to document — it just needs to be labeled as future intent, not current state.
- **Ship `review.md` with wiring already active**: Out of scope per user decision; wiring was explicitly deferred.

## Consequences

- The `review.md` relationship/boundary section must carry the two-clause now-vs-deferred note.
- The procedure's "Who runs review" subsection must note that automatic in-EVALUATION use is deferred.
- The design doc's implementation checklist item 7 (procedure availability) enforces this.
