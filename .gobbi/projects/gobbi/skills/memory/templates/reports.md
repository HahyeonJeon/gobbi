# `reports/`

> Long-form durable evidence — status summaries, post-mortems, and analytics outputs. Preserves the full content and reasoning trail, where `decisions/` keeps only the conclusion.

## Core principles

> **Preserve the full evidence chain and surface its findings.**

A report is the evidence a decision or learning is later extracted from; if the finding is buried in narrative the reader re-derives it, and if the evidence is distilled away the report collapses into a decisions entry.

> **Record the action items the evidence demands, or mark the report evidence-only.**

A report that buries its follow-ups stalls; one with no actions to track says so explicitly instead of inventing them.

## Report kinds

One `reports/` directory holds these kinds, set by the `report_type` frontmatter field. They share one lifecycle (generated at a moment, preserved indefinitely, cited by other artifacts), so one directory keeps the audit surface whole.

| `report_type` | What goes here | Examples |
|---|---|---|
| **`status`** | Periodic / event-driven summary aggregating across sessions | Weekly status, sprint summary, release report, milestone health |
| **`post-mortem`** | Incident write-up, deep-dive investigation, root-cause analysis | Production incident, "why did iter cap exhaust without convergence?", design retrospective |
| **`analytics`** | Numerical / measurement output for trend tracking | Session-count stats, iteration-distribution, cost / token tracking, benchmark results |
| **`other`** | The kind catch-all — a durable report that fits none of the above | Use sparingly; prefer a named kind when one fits |

A report is **exactly one** `report_type`. A multi-facet artifact picks the dominant type and links companions via `related_reports`.

## Write it

| Field | Value |
|---|---|
| When | A loop's RECORD on an in-session deep-dive worth preserving (`post-mortem`); or Wrap-up RECORD at a periodic boundary (`status`, direct write); or an out-of-band CLI run (`analytics`). Bar = scale + durability, not a routine observation. |
| Stage to | `sessions/{date}-{session-id}/{N}-{loop}/staging/reports/{slug}.md` |
| Promotes to | `features/{f}/reports/{area}/` (default) · `reports/{area}/` (project, cross-feature) — `{area}` is the **kind axis**: it resolves directly from the REQUIRED `report_type` value (the area set == the kind enum), per the [§1.5 selection rule](../rules.md#15-area-namespace-the-second-category-axis-under-each-type) step 1 (date-prefixed: `{area}/{YYYY-MM-DD}-{slug}.md`) |
| Filename | `{YYYY-MM-DD}-{slug}.md` — date-prefixed (generation date, not the reported-on period); slug names the subject (`2026-05-11-iter-cap-exhaustion-investigation.md`) |

Loop RECORD stages; Wrap-up promotes ([routing](../../wrap-up/promotion.md#staging--memory-routing)).

## Frontmatter + body

Base frontmatter + the **richer** reports extensions — `report_type`, `related_reports`, plus `generated_by`, `subject`, `related_reviews`, `related_decisions` ([rules §2.2](../rules.md#22-per-type-extension-fields--the-status-model)). **`report_type` is REQUIRED** (L16): it is the kind axis, so the area resolves directly from it (`reports/{report_type}/`) — it is never optional and never tag-derived; `other` is the kind catch-all (L7/L8). The `related_*` lists are **plain slugs** (no path, no `[[ ]]`); navigable `[[slug]]` links live in the `## Related` body section ([rules §2.4](../rules.md#24-cross-references-and-the-doc-graph)).

```markdown
---
name: {slug — report subject}
description: {one-line subject of the report}
type: reports
scope: feature
feature: {feature-name}
status: active
created: YYYY-MM-DD
session: {session-id}
tags: [process, evaluation]          # this type's controlled pool (§2.5)
keywords: []                         # freeform escape-hatch tags (required; may be [])
author: claude                       # claude | codex | user — the runtime that authored it
report_type: status | post-mortem | analytics | other   # REQUIRED — the kind axis; resolves the area
related_reports: [{report slugs that this builds on or supersedes}]   # plain slugs
generated_by: {tool name / agent identity / human author}
subject: {one-line subject of the report}
related_reviews: [{review slugs derived from or feeding into this report}]   # plain slugs
related_decisions: [{decision slugs this report drove}]                      # plain slugs
---

# {Report title}

## Subject
{What this report is about, in 1–2 sentences.}

## Inputs
{The sources / data / runs that fed this report. For `status`: the period covered and sessions scanned. For `post-mortem`: the incident timeline and artifacts examined. For `analytics`: the metric definitions and data window.}

## Body
{The full content — long-form, complete reasoning, not just bullets. Subsections by `report_type`:
- **`status`**: What shipped / in flight / blocked / deferred. Per-feature breakdown.
- **`post-mortem`**: Timeline → Root cause → Contributing factors → What worked → What didn't → Action items.
- **`analytics`**: Metric definitions → Numbers → Trends → Anomalies → Interpretation.}

## Findings
{The interpretive layer atop the raw body. For `status`: risks and asks. For `post-mortem`: the 3-5 most important takeaways. For `analytics`: what the numbers actually mean.}

## Action items
{Concrete follow-ups, each linking a backlog / decision / future task. Evidence-only reports use `(none — evidence preserved for future reference)`.}

## Related
{Navigable `[[slug]]` links to the reviews / decisions / reports this builds on or feeds into ([rules §2.4](../rules.md#24-cross-references-and-the-doc-graph)). Mirrors the `related_*` frontmatter in navigable form.}

- [[2026-05-11-ultrareview-orchestration-redesign]] — the review feeding this report
```

The example shows the **default-feature** case. A cross-feature report uses `scope: project` + `feature: null` and promotes to the project `reports/` tier.

## Notes

- **Vs other types.** `reports/` is the long-form evidence; the others are the distilled output extracted from it.

  | vs | This is a report when… | Else it goes to |
  |---|---|---|
  | `reviews/` | it is status / post-mortem / analytics, not a review activity | `reviews/` — any review / audit / evaluation activity |
  | `learnings/` | it is the source material that revealed an insight | `learnings/` — the actionable "do this" insight |
  | `mistakes/` | it is the case study (the post-mortem evidence chain) | `mistakes/` — the rule "don't do X" |
  | `notes/` | it is a long-form doc at an explicit trigger | `notes/` — a short-form ad-hoc observation |
  | `decisions/` | it is the investigation behind a choice | `decisions/` — the conclusion "we chose X because Y" |

- **Append-only.** A report's `status` stays `active` — never mutated. A newer report is a separate file linking back via `related_reports`; it does not flip the old one's status. Do not delete or rewrite historical reports.
