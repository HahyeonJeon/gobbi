# `reviews/`

> The output of a review work activity — adversarial review, ultrareview, code review, retrospective, security / license / dep audit. Captures what was reviewed, by whom, against what criteria, with what verdict.

## Core principles

> **Record what was reviewed, by whom, against what criteria, with what verdict.**

A verdict is only trustworthy when its scope and bar are on the page; a bare PASS/FAIL forces the reader to re-review to learn what it covered.

> **Record each finding with its evidence and proposed remediation.**

A review is the substrate other memory types are extracted from; a finding without evidence or remediation gives the extractor nothing to pull and the disputer nothing to argue against.

## Write it

| Field | Value |
|---|---|
| When | A productive step's RECORD when an accepted review, audit, or evaluation is durable. Bar = activity-shaped + durability, not curated highlights. |
| Source cursor | Gobbi-owned session UUID plus the current `state.json` `step`, `stage: RECORD`, `iteration`, and `task`; `task` is `null` outside Execution. |
| Stage to | `sessions/{date}-{gobbi-session-id}/{N}-{step}/staging/reviews/{slug}.md`; Execution task candidates use the task's own staging root |
| Promotes to | `features/{f}/reviews/{area}/` (default) · `reviews/{area}/` (project, cross-feature) — `{area}` is the **kind axis**: it resolves directly from the REQUIRED `review_kind` value (the area set == the kind enum), per the [§1.5 selection rule](../rules.md#15-area-namespace-the-second-category-axis-under-each-type) step 1 (date-prefixed: `{area}/{YYYY-MM-DD}-{slug}.md`) |
| Filename | `{YYYY-MM-DD}-{slug}.md` — date-prefixed (review activity date); slug names the subject + kind (`2026-05-11-ultrareview-orchestration-redesign.md`, `2026-05-11-code-review-pr-257.md`) |

RECORD writes only the typed staging source. Wrap-up WORK is the only stage that promotes it to durable memory ([routing](../../wrap-up/promotion.md#staging--memory-routing)).

## Frontmatter + body

Base frontmatter + reviews extensions (`verdict`, `review_kind`, `subject`) — `review_kind` and `verdict` are closed enums ([rules §2.2](../rules.md#22-per-type-extension-fields--the-status-model)). **`review_kind` is REQUIRED** (L16): it is the kind axis, so the area resolves directly from it (`reviews/{review_kind}/`) — it is never optional and never tag-derived. Reviews carry **base + `verdict` / `review_kind` / `subject` only**; the reviewer identity, perspective set, and cross-references live in the **body** sections, not frontmatter, so Wrap-up WORK's allowlist strip cannot drop them.

```markdown
---
name: {slug — review subject + kind}
description: {one-line what was reviewed and the outcome}
type: reviews
scope: feature
feature: {feature-name}
status: active
created: YYYY-MM-DD
session: {Gobbi-owned session UUID}
tags: [evaluation, security]         # this type's controlled pool (§2.5)
keywords: []                         # freeform escape-hatch tags (required; may be [])
author: claude                       # claude | codex | user — the runtime that authored it
review_kind: adversarial-review | ultrareview | code-review | retrospective | security-audit | license-audit | dep-audit | other   # REQUIRED — the kind axis; resolves the area
subject: {path / branch / PR / system being reviewed}
verdict: pass | revise | fail | needs-attention | n/a
---

# {Review title}

## Subject
{What was reviewed — design doc / plan / changelog / code branch / PR / dependency tree / etc., with path.}

## Reviewer + scope
{Who performed the review (which agent / system / human / tool name) and what scope they covered. For adversarial-review: dual-system breakdown + the perspective set covered. For ultrareview: the full agent panel. For code review: file / line ranges. For audits: the audit checklist applied.}

## Method
{How the review was performed. The procedure followed, the criteria applied, the tools used. This is what makes the review reproducible — a future reader should be able to re-run the review and get comparable output.}

## Findings
{The review's output — the substantive findings. Each finding with severity / confidence / evidence / proposed remediation. For evaluator-driven reviews, this section mirrors the structure of evaluation/SKILL.md's finding metadata. For human-authored reviews, the same fields apply but the form is narrative.}

### {Finding title}
- **Severity**: Critical / High / Medium / Low
- **Confidence**: 0 / 25 / 50 / 75 / 100
- **Description**: {finding body}
- **Evidence**: {specific citation — quote, path, command output}
- **Proposed remediation**: {what the review recommends}
- **Disposition**: open / addressed / disputed / deferred / superseded

(Repeat per finding.)

## Cross-system divergence (if applicable)
{For dual-system reviews (Claude + Codex): where they disagreed, how the divergence was resolved, the user's call in major-divergence cases.}

## Outcome
{What changed because of this review — which designs, decisions, plans, or implementations shifted as a result. Concrete cause-and-effect linkage between findings and project changes.}

## Open items
{Findings still unresolved at time of writing. Pointers to backlog entries or future sessions where they will be addressed.}

## Related
{Navigable `[[slug]]` links — the report slugs that cite or were cited by this review and the decision slugs this review drove ([rules §2.4](../rules.md#24-cross-references-and-the-doc-graph)). Body content, not frontmatter.}

- [[2026-05-11-weekly-status]] — a report citing this review
```

The example shows the **default-feature** case. A cross-feature review uses `scope: project` + `feature: null` and promotes to the project `reviews/` tier.

## Notes

- **Vs other types.** A review is the **activity substrate**; the records below are extracted from it.

  | vs | This is a review when… | Else it goes to |
  |---|---|---|
  | `reports/` | a review / evaluation / audit activity took place (a security audit, an ultrareview) | `reports/` — a `status` / `post-mortem` / `analytics` output, even one that cites review findings |
  | `decisions/` | it is the assessment activity that may inform a choice | `decisions/` — the conclusion "we chose X" |
  | `mistakes/` | it surfaces a mistake-worthy finding (recorded separately, cross-referenced) | `mistakes/` — the rule "don't do X" |
  | `learnings/` | it surfaces a transferable insight (recorded separately, cross-referenced) | `learnings/` — the actionable "do this" |

- **Append-only.** A review's `status` stays `active` — never mutated. A later review of the same artifact is a separate dated file referencing the earlier in its `## Related` body links; the earlier review's body is preserved. Outcome resolution lives in the per-finding `Disposition` line and `## Outcome`, never as a `status` value.
