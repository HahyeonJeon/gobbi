# `reports/`

**Long-form report documents** the project keeps as durable evidence — status summaries aggregating across sessions, incident post-mortems and investigations, and analytics / measurement outputs. Reports preserve the **full content and reasoning trail** of their respective genre. They are the long-form companion to `decisions/` (which captures the conclusion) and `notes/` (which captures short-form ad-hoc observations).

## Lifecycle (staging → promotion)

This template covers a file with **two write paths**:

1. **Loop MEMORIZATION** (`ideation` / `planning` / `execution`): stage at `sessions/{date}-{session-id}/{loop}/staging/reports/{slug}.md`. Loop MEMORIZATION **never** writes directly to project memory.
2. **Wrap-up's MEMORIZATION**: promotes the staged file to the destination listed under § Location below. Wrap-up is the sole writer to project memory; this template's Location section shows what the *promoted* file looks like.

For the canonical authority on staging → destination routing, see [`wrap-up/SKILL.md` § Staging → Project-memory routing](../../wrap-up/SKILL.md#staging--project-memory-routing).

---

Review / audit / evaluation activity documents do **not** live here — those go to [`reviews/`](reviews.md). The two directories partition the long-form-document space: review activity → `reviews/`; everything else long-form → `reports/`.

## Three report kinds (all live here)

A single `reports/` directory holds three different report kinds, differentiated by the `report_type` frontmatter field. The directory is unified because all three share the same lifecycle (generated at a specific moment, preserved indefinitely, cited by other artifacts) — splitting them into separate directories would fragment the audit surface without value.

| `report_type` | What goes here | Examples |
|---|---|---|
| **`status`** | Periodic or event-driven status summary aggregating across sessions | Weekly status, sprint summary, release report, milestone report, monthly project health |
| **`post-mortem`** | Incident post-mortem, deep-dive investigation, root-cause analysis | Production incident write-up, "why did iter cap exhaust without convergence?" investigation, design-decision retrospective |
| **`analytics`** | Numerical / measurement output for trend tracking | Session-count statistics, iteration-distribution analysis, cost / token tracking, performance benchmark results, dashboard data exports |

A single report belongs to **exactly one** `report_type`. If an artifact spans multiple types (e.g., a post-mortem that includes performance benchmark results), it picks the dominant type and links to companion reports for the other facets via `related_reports` frontmatter.

## When to write

- **During any loop's MEMORIZATION**: when the loop produced an in-session deep-dive worth preserving (`post-mortem`) — stage at `sessions/{date}-{session-id}/{loop}/staging/reports/{slug}.md`; Wrap-up promotes.
- **During Wrap-up MEMORIZATION**: when the session's close coincides with a periodic boundary (week, sprint, milestone, release) — Wrap-up produces the `status` report and writes it directly to project memory.
- **Out-of-band, by CLI**: when an analytics / measurement command runs outside a session — the resulting `analytics` report drops into a session's `staging/reports/` for the next Wrap-up, OR (for fully session-independent runs) is staged via a synthetic "ops" session — exact mechanism TBD.

Reports are **not** a place for routine artifacts. A short observation belongs in `notes/`. A single decision belongs in `decisions/`. A review activity result belongs in `reviews/`. The bar for `reports/` is **scale + durability**: enough content to merit a standalone date-prefixed document, and enough lasting value to keep beyond the originating session.

## Location

- Project-level only: `.gobbi/projects/{project-name}/reports/`

Reports are cross-cutting by definition. Feature-specific deep-dives belong in that feature's `design/` or `decisions/`, not here.

## File naming

`{YYYY-MM-DD}-{slug}.md` — date prefix; slug describes the report subject.

Examples:
- `2026-05-11-weekly-status.md` (status)
- `2026-05-11-iter-cap-exhaustion-investigation.md` (post-mortem)
- `2026-05-11-session-cost-q2.md` (analytics)

Date is the **generation date**, not the date of events reported on. A weekly-status report for the week ending 2026-05-11 generated 2026-05-12 uses `2026-05-12-` as prefix; the reporting period is named in the body's `Inputs` section.

## Item template

```markdown
---
date: YYYY-MM-DD
session: {session-id}
report_type: status | post-mortem | analytics
generated_by: {tool name / agent identity / human author}
subject: {one-line subject of the report}
status: open | acted-on | superseded | archived
related_reports: [{report slugs that this builds on or supersedes}]
related_reviews: [{review slugs derived from or feeding into this report}]
related_decisions: [{decision slugs this report drove}]
---

# {Report title}

## Subject
{What this report is about, in 1–2 sentences.}

## Inputs
{The sources / data / runs that fed this report. For `status`: the period covered and sessions scanned. For `post-mortem`: the incident timeline and artifacts examined. For `analytics`: the metric definitions and data window.}

## Body
{The full content. This is what makes a report a report — long-form, complete reasoning, not just bullets. Subsections appropriate to `report_type`:

- **`status`**: What shipped / What's in flight / What's blocked / What's deferred. Per-feature breakdown.
- **`post-mortem`**: Timeline → Root cause → Contributing factors → What worked → What didn't → Action items.
- **`analytics`**: Metric definitions → Numbers → Trends → Anomalies → Interpretation.}

## Findings
{The interpretive layer atop the raw body. For `status`: risks and asks. For `post-mortem`: the 3-5 most important takeaways. For `analytics`: what the numbers actually mean.}

## Action items
{Concrete follow-ups. Each item should link to a backlog entry, a decision, or a future session task. Reports without action items are evidence-only; explicit `(none — evidence preserved for future reference)` is acceptable.}

## Cross-references
{Links to reviews / learnings / mistakes / decisions / sessions that this report builds on or feeds into.}
```

## Distinguishing reports from neighbors

- **`reports/` vs `reviews/`**: A review document captures a **review / evaluation / audit activity** — what was reviewed, by whom, against which criteria, and the activity's outcome. A report captures **status, post-mortem, or analytics** — content that is not itself a review activity, even if it may cite review findings. Rule of thumb: did the artifact come from a review/evaluation/audit task? → `reviews/`. Otherwise → `reports/`.
- **`reports/` vs `learnings/`**: A learning is an actionable transferable insight ("do this"). A report is the source material — the analytics that revealed the insight, the post-mortem that named the failure mode. The learning is extracted from the report.
- **`reports/` vs `mistakes/`**: A mistake is the rule ("don't do X"). A post-mortem report is the case study that produced the rule. The mistake is the takeaway; the report is the evidence chain.
- **`reports/` vs `notes/`**: Notes are short-form ad-hoc observations. Reports are long-form structured documents generated at an explicit trigger point (period close / incident / measurement window).
- **`reports/` vs `decisions/`**: Decisions capture the conclusion ("we chose X because Y"). Reports capture the supporting body — the investigation that led to the choice. One report can drive multiple decisions; one decision typically cites the report it grew from.

When a single observation could be either a note or a report, default to a **note**. Reports require enough substance to merit a date-prefixed durable file.

## Promotion source

- **Loop MEMORIZATION → staging**: assistant stages at `sessions/{date}-{session-id}/{loop}/staging/reports/{slug}.md` per the [`reports.md`](reports.md) template. Type is encoded in frontmatter `report_type`. Wrap-up promotes to `.gobbi/projects/{project-name}/reports/{YYYY-MM-DD}-{slug}.md` (rewriting filename to date-prefixed form during promotion).
- **Wrap-up MEMORIZATION → direct write**: Wrap-up may produce its own reports (typically `status` at session close) and write directly to the project-memory destination without going through staging — Wrap-up is the project-memory sole writer and is not constrained by the staging boundary.

## Linking back

A report cites its inputs by path (sessions, evaluation files, prior reports). Reviews and learnings derived from a report cite the report's slug in their `related_reports` frontmatter. This produces a navigable evidence graph: review / learning → report → source artifacts.

## Lifecycle

Reports are **append-only history**. Supersession via frontmatter `status: superseded` + `related_reports: [{newer-slug}]`; do not delete or rewrite historical reports. Status updates from `open` → `acted-on` / `archived` are routine — they reflect outcome resolution, not content edits.
