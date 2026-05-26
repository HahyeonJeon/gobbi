# `reviews/`

**Review / evaluation / audit activity result documents** — the artifacts that represent the *output of a review work activity*. When the project runs a review-shaped task (an adversarial review, an ultrareview campaign, a code review, a retrospective, a security audit, a license audit, a dep audit), the document that captures *what was reviewed, by whom, against what criteria, and with what outcome* lives here.

## Lifecycle (staging → promotion)

This template covers a file with **two write paths**:

1. **Loop MEMORIZATION** (`ideation` / `planning` / `execution`): stage at `sessions/{date}-{session-id}/{loop}/staging/reviews/{slug}.md`. Loop MEMORIZATION **never** writes directly to project memory.
2. **Wrap-up's MEMORIZATION**: promotes the staged file to the destination listed under § Location below. Wrap-up is the sole writer to project memory; this template's Location section shows what the *promoted* file looks like.

For the canonical authority on staging → destination routing, see [`wrap-up/SKILL.md` § Staging → Project-memory routing](../../wrap-up/SKILL.md#staging--project-memory-routing).

---

`reviews/` is **not** a place for excerpted evaluator findings or curated highlights. The bar is **activity-shaped**: a review/audit/evaluation took place, and `reviews/` holds the document representing that activity.

## When to write

- **During Wrap-up MEMORIZATION** when a review/audit/evaluation activity was performed during the session and produced a result document worth preserving long-term.
- **During a loop's MEMORIZATION** when the loop's own work *was* a review activity (e.g., the Execution loop ran a code review of an external artifact; the loop's output IS the review document). Stage at `sessions/{date}-{session-id}/{loop}/staging/reviews/{slug}.md`; Wrap-up promotes.

The bar is **activity-shaped + durability**: a review activity took place, and its result document is worth keeping beyond the originating session.

## Distinction from `reports/`

- **`reviews/`** = documents from review / evaluation / audit *activities*. Did someone do a review? → `reviews/`.
- **`reports/`** = `status` summaries / `post-mortem` investigations / `analytics` outputs that are not themselves review activities.

A security audit goes to `reviews/` (it's an audit activity). A post-mortem of a security incident goes to `reports/` (it's an investigation, not a review activity). A weekly status that *cites* review outcomes goes to `reports/` (it's a status summary). An ultrareview campaign result goes to `reviews/` (the activity was a review).

## Location

- Project-level only: `.gobbi/projects/{project-name}/reviews/`

Review activities are cross-cutting by definition. Feature-specific review outcomes can be cited from `features/{feature-name}/README.md`'s Recent activity table, but the review document itself stays at the project level.

## File naming

`{YYYY-MM-DD}-{slug}.md` — date prefix; slug describes the review subject and review kind.

Examples:
- `2026-05-11-ultrareview-orchestration-redesign.md`
- `2026-05-11-adversarial-review-evaluation-skill.md`
- `2026-05-11-code-review-pr-257.md`
- `2026-05-11-retrospective-phase-2-completion.md`
- `2026-05-11-security-audit-q2.md`
- `2026-05-11-dep-audit-bun-1.2-upgrade.md`

Date is the **review activity date**, not the date the document was written (if the two differ, prefer the activity date; record the document-written date in frontmatter).

## Item template

Carries the [shared base frontmatter](../rules.md#21-shared-base-every-memory-file) plus the reviews-type extensions (`verdict`, `review_kind`, `subject`). Reviews are project-only and append-only (base `status` stays `active`).

```markdown
---
name: {slug — review subject + kind}
description: {one-line what was reviewed and the outcome}
type: reviews
scope: project
feature: null
status: active
created: YYYY-MM-DD
session: {session-id}
tags: [{tag1}, {tag2}]
review_kind: adversarial-review | ultrareview | code-review | retrospective | security-audit | license-audit | dep-audit | other
subject: {path / branch / PR / system being reviewed}
verdict: pass | revise | fail | needs-attention | n/a
---

# {Review title}

> Reviews carry **base + `verdict` / `review_kind` / `subject` only** (design §2.11, [`rules.md` § 2.2](../rules.md#22-per-type-extension-fields--the-status-model)). The reviewer identity, perspective set, and cross-references live in the **body** sections below — not frontmatter — so Wrap-up's allowlist strip cannot drop them.

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
{Cross-references — `related_reports`: report slugs that cite or were cited by this review; `related_decisions`: decision slugs this review drove. Body content, not frontmatter.}
```

## Distinguishing reviews from neighbors

- **`reviews/` vs `reports/`**: see § Distinction from `reports/` above. Activity-shape is the test.
- **`reviews/` vs `decisions/`**: a decision is the conclusion ("we chose X"). A review is the activity that may inform a decision. One review can drive multiple decisions; each decision cites the review it derived from.
- **`reviews/` vs `mistakes/`**: a mistake is a rule extracted from experience ("don't do X"). A review may *surface* a mistake-worthy finding, which is then recorded separately in `mistakes/` with a cross-reference to the originating review.
- **`reviews/` vs `learnings/`**: a learning is a transferable insight ("do this in future"). A review may surface learnings, which are recorded separately in `learnings/` with cross-references.

The review document is the **substrate**; mistakes / learnings / decisions / reports derived from a review are the **extracted artifacts**. Both layers coexist — the review preserves the full reasoning chain, the extracted artifacts capture the actionable distillation.

## Lifecycle

Reviews are **append-only history**. Status updates from `open` → `acted-on` / `archived` / `superseded` are routine — they reflect outcome resolution, not content edits. Supersession via frontmatter `status: superseded` + a `## Related` body `related_decisions` pointer at the supersession; the original review is preserved.

When a later review of the same artifact produces different findings, both reviews stay in `reviews/` with chronological dates; the later one references the earlier in its `## Related` body `related_reports` list (and the earlier's `status` may flip to `superseded` if the new review fully replaces it).

## Linking back

Each review file points back to the originating session's full session directory so a curious reader can see the entire context. Reviews are activity result documents — they cite their evidence by path / version / commit-hash, not by inlining everything.
